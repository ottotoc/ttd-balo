const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Middleware để resize và optimize ảnh sau khi upload
 * Tạo nhiều size: web (1920px), dashboard (800px), thumbnail (300px)
 */
const resizeImage = async (req, res, next) => {
  // Chỉ xử lý nếu có file được upload
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const fileDir = path.dirname(filePath);
  const fileExt = path.extname(filePath);
  const fileName = path.basename(filePath, fileExt);

  // Lấy category từ req hoặc từ đường dẫn file
  // fileDir format: .../uploads/{category}
  let category = req.uploadCategory || 'general';
  const uploadsBaseDir = path.join(__dirname, '../../uploads');
  const relativePath = path.relative(uploadsBaseDir, fileDir);
  if (relativePath && !relativePath.startsWith('..')) {
    const categoryFromPath = relativePath.split(path.sep)[0];
    if (['projects', 'blog', 'banners', 'general'].includes(categoryFromPath)) {
      category = categoryFromPath;
    }
  }

  try {
    // Đọc metadata của ảnh
    const metadata = await sharp(filePath).metadata();
    
    // Cấu hình resize - tối ưu cho web và dashboard
    const webMaxWidth = 1920;      // Max width cho web (Full HD)
    const webMaxHeight = 1920;     // Max height cho web
    const dashboardMaxWidth = 800; // Max width cho dashboard/admin
    const dashboardMaxHeight = 800; // Max height cho dashboard
    const thumbnailWidth = 300;    // Width cho thumbnail
    const thumbnailHeight = 300;    // Height cho thumbnail
    const webpQuality = 75;         // WebP quality (giảm xuống 75 để nhẹ hơn)
    const jpegQuality = 75;         // JPEG quality cho thumbnail

    // Tính toán kích thước cho web version
    let webShouldResize = false;
    let webTargetWidth = metadata.width;
    let webTargetHeight = metadata.height;

    if (metadata.width > webMaxWidth || metadata.height > webMaxHeight) {
      webShouldResize = true;
      const ratio = Math.min(webMaxWidth / metadata.width, webMaxHeight / metadata.height);
      webTargetWidth = Math.round(metadata.width * ratio);
      webTargetHeight = Math.round(metadata.height * ratio);
    }

    // Tính toán kích thước cho dashboard version
    let dashboardShouldResize = false;
    let dashboardTargetWidth = metadata.width;
    let dashboardTargetHeight = metadata.height;

    if (metadata.width > dashboardMaxWidth || metadata.height > dashboardMaxHeight) {
      dashboardShouldResize = true;
      const ratio = Math.min(dashboardMaxWidth / metadata.width, dashboardMaxHeight / metadata.height);
      dashboardTargetWidth = Math.round(metadata.width * ratio);
      dashboardTargetHeight = Math.round(metadata.height * ratio);
    }

    // Base sharp instance - strip metadata để giảm kích thước
    const baseSharp = sharp(filePath).withMetadata({});

    // ========== 1. Web Version (1920x1920 max) ==========
    let webSharp = baseSharp.clone();
    if (webShouldResize) {
      webSharp = webSharp.resize(webTargetWidth, webTargetHeight, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      });
    }
    const webpPath = path.join(fileDir, `${fileName}.webp`);
    await webSharp
      .webp({ 
        quality: webpQuality,
        effort: 6, // Tối ưu compression
      })
      .toFile(webpPath);

    // ========== 2. Dashboard Version (800x800 max) ==========
    let dashboardSharp = baseSharp.clone();
    if (dashboardShouldResize || webShouldResize) {
      // Dashboard luôn resize nếu lớn hơn 800px
      dashboardSharp = dashboardSharp.resize(dashboardTargetWidth, dashboardTargetHeight, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      });
    }
    const dashboardPath = path.join(fileDir, `${fileName}_dashboard.webp`);
    await dashboardSharp
      .webp({ 
        quality: webpQuality,
        effort: 6,
      })
      .toFile(dashboardPath);

    // ========== 3. Thumbnail Version (300x300) ==========
    const thumbnailPath = path.join(fileDir, `${fileName}_thumb.jpg`);
    await baseSharp
      .clone()
      .resize(thumbnailWidth, thumbnailHeight, {
        fit: 'cover',
        position: 'center',
        kernel: sharp.kernel.lanczos3,
      })
      .jpeg({ 
        quality: jpegQuality,
        progressive: true, // Progressive JPEG
        mozjpeg: true, // MozJPEG encoder - nhẹ hơn
      })
      .toFile(thumbnailPath);

    // Xóa file gốc nếu đã convert sang WebP
    if (fileExt.toLowerCase() !== '.webp') {
      await fs.unlink(filePath);
    }

    // Cập nhật thông tin file trong req.file
    const webStats = await fs.stat(webpPath);
    req.file.path = webpPath;
    req.file.filename = `${fileName}.webp`;
    req.file.size = webStats.size;
    req.file.processed = true;
    
    // URLs cho các version khác nhau (với category)
    req.file.webUrl = `/uploads/${category}/${fileName}.webp`;           // Web version (1920px)
    req.file.dashboardUrl = `/uploads/${category}/${fileName}_dashboard.webp`; // Dashboard version (800px)
    req.file.thumbnail = `/uploads/${category}/${fileName}_thumb.jpg`;   // Thumbnail (300px)

    next();
  } catch (error) {
    console.error('Error resizing image:', error);
    // Nếu resize lỗi, vẫn cho phép tiếp tục với file gốc
    next();
  }
};

/**
 * Resize multiple images
 */
const resizeImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  // Lấy category từ req
  let category = req.uploadCategory || 'general';
  const uploadsBaseDir = path.join(__dirname, '../../uploads');
  
  // Resize từng file
  for (const file of req.files) {
    const filePath = file.path;
    const fileDir = path.dirname(filePath);
    const fileExt = path.extname(filePath);
    const fileName = path.basename(filePath, fileExt);

    // Lấy category từ đường dẫn file nếu chưa có
    if (!category || category === 'general') {
      const relativePath = path.relative(uploadsBaseDir, fileDir);
      if (relativePath && !relativePath.startsWith('..')) {
        const categoryFromPath = relativePath.split(path.sep)[0];
        if (['projects', 'blog', 'banners', 'general'].includes(categoryFromPath)) {
          category = categoryFromPath;
        }
      }
    }

    try {
      const metadata = await sharp(filePath).metadata();
      const webMaxWidth = 1920;
      const webMaxHeight = 1920;
      const dashboardMaxWidth = 800;
      const dashboardMaxHeight = 800;
      const thumbnailWidth = 300;
      const thumbnailHeight = 300;
      const webpQuality = 75;
      const jpegQuality = 75;

      let webShouldResize = false;
      let webTargetWidth = metadata.width;
      let webTargetHeight = metadata.height;

      if (metadata.width > webMaxWidth || metadata.height > webMaxHeight) {
        webShouldResize = true;
        const ratio = Math.min(webMaxWidth / metadata.width, webMaxHeight / metadata.height);
        webTargetWidth = Math.round(metadata.width * ratio);
        webTargetHeight = Math.round(metadata.height * ratio);
      }

      let dashboardShouldResize = false;
      let dashboardTargetWidth = metadata.width;
      let dashboardTargetHeight = metadata.height;

      if (metadata.width > dashboardMaxWidth || metadata.height > dashboardMaxHeight) {
        dashboardShouldResize = true;
        const ratio = Math.min(dashboardMaxWidth / metadata.width, dashboardMaxHeight / metadata.height);
        dashboardTargetWidth = Math.round(metadata.width * ratio);
        dashboardTargetHeight = Math.round(metadata.height * ratio);
      }

      const baseSharp = sharp(filePath).withMetadata({});

      // Web version
      let webSharp = baseSharp.clone();
      if (webShouldResize) {
        webSharp = webSharp.resize(webTargetWidth, webTargetHeight, {
          fit: 'inside',
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
        });
      }
      const webpPath = path.join(fileDir, `${fileName}.webp`);
      await webSharp
        .webp({ quality: webpQuality, effort: 6 })
        .toFile(webpPath);

      // Dashboard version
      let dashboardSharp = baseSharp.clone();
      if (dashboardShouldResize || webShouldResize) {
        dashboardSharp = dashboardSharp.resize(dashboardTargetWidth, dashboardTargetHeight, {
          fit: 'inside',
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
        });
      }
      const dashboardPath = path.join(fileDir, `${fileName}_dashboard.webp`);
      await dashboardSharp
        .webp({ quality: webpQuality, effort: 6 })
        .toFile(dashboardPath);

      // Thumbnail
      const thumbnailPath = path.join(fileDir, `${fileName}_thumb.jpg`);
      await baseSharp
        .clone()
        .resize(thumbnailWidth, thumbnailHeight, {
          fit: 'cover',
          position: 'center',
          kernel: sharp.kernel.lanczos3,
        })
        .jpeg({ quality: jpegQuality, progressive: true, mozjpeg: true })
        .toFile(thumbnailPath);

      if (fileExt.toLowerCase() !== '.webp') {
        await fs.unlink(filePath);
      }

      const webStats = await fs.stat(webpPath);
      file.path = webpPath;
      file.filename = `${fileName}.webp`;
      file.size = webStats.size;
      file.processed = true;
      file.webUrl = `/uploads/${category}/${fileName}.webp`;
      file.dashboardUrl = `/uploads/${category}/${fileName}_dashboard.webp`;
      file.thumbnail = `/uploads/${category}/${fileName}_thumb.jpg`;
    } catch (error) {
      console.error(`Error resizing image ${file.originalname}:`, error);
    }
  }

  next();
};

module.exports = {
  resizeImage,
  resizeImages,
};
