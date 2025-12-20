const path = require('path');
const fs = require('fs').promises;
const asyncHandler = require('../../common/asyncHandler');
const { success } = require('../../common/response');
const { BadRequestError } = require('../../common/errors');

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, '../../../uploads');
const ensureUploadsDir = async () => {
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
};

// Khởi tạo thư mục khi module được load
ensureUploadsDir().catch(console.error);

// Upload file trực tiếp
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }

  // Lấy category từ req (đã được set bởi multer storage)
  const category = req.uploadCategory || 'general';
  
  // Tạo public URL với category
  const publicUrl = `/uploads/${category}/${req.file.filename}`;
  
  success(res, {
    url: publicUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype || 'image/webp',
    processed: req.file.processed || false,
    category: category,
    // Các version khác nhau
    webUrl: req.file.webUrl || publicUrl, // Web version (1920px) - cho frontend
    dashboardUrl: req.file.dashboardUrl || publicUrl, // Dashboard version (800px) - cho admin
    thumbnail: req.file.thumbnail || null, // Thumbnail (300px)
  }, 201);
});

// Upload multiple files
const uploadFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new BadRequestError('No files uploaded');
  }

  // Lấy category từ req
  const category = req.uploadCategory || 'general';

  const files = req.files.map(file => ({
    url: `/uploads/${category}/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype || 'image/webp',
    processed: file.processed || false,
    category: category,
    webUrl: file.webUrl || `/uploads/${category}/${file.filename}`, // Web version (1920px)
    dashboardUrl: file.dashboardUrl || `/uploads/${category}/${file.filename}`, // Dashboard version (800px)
    thumbnail: file.thumbnail || null, // Thumbnail (300px)
  }));

  success(res, { files }, 201);
});

// Delete file
const deleteFile = asyncHandler(async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    throw new BadRequestError('Filename is required');
  }

  // Parse URL để lấy category và filename
  // URL format: /uploads/{category}/{filename}
  const urlParts = filename.replace(/^\/uploads\//, '').split('/');
  const category = urlParts.length > 1 ? urlParts[0] : 'general';
  const baseFilename = urlParts.length > 1 ? urlParts[1] : urlParts[0];
  
  // Đảm bảo category hợp lệ
  const allowedCategories = ['projects', 'blog', 'general'];
  const finalCategory = allowedCategories.includes(category) ? category : 'general';
  
  // Đường dẫn file trong thư mục category
  const categoryDir = path.join(uploadsDir, finalCategory);
  const filePath = path.join(categoryDir, baseFilename);
  
  // Kiểm tra file có trong thư mục uploads không (bảo mật)
  if (!filePath.startsWith(uploadsDir)) {
    throw new BadRequestError('Invalid file path');
  }

  try {
    // Xóa file chính (có thể là .webp hoặc format gốc)
    await fs.unlink(filePath);
    
    // Xóa tất cả các version của ảnh
    const fileExt = path.extname(baseFilename);
    const fileNameWithoutExt = path.basename(baseFilename, fileExt);
    
    // Xóa các file version trong cùng category
    const filesToDelete = [
      path.join(categoryDir, `${fileNameWithoutExt}.webp`), // Web version
      path.join(categoryDir, `${fileNameWithoutExt}_dashboard.webp`), // Dashboard version
      path.join(categoryDir, `${fileNameWithoutExt}_thumb.jpg`), // Thumbnail
    ];
    
    // Nếu không phải .webp, thử xóa file gốc và các version
    if (fileExt.toLowerCase() !== '.webp') {
      filesToDelete.push(filePath); // File gốc
    }
    
    for (const fileToDelete of filesToDelete) {
      try {
        await fs.unlink(fileToDelete);
      } catch {
        // File không tồn tại, không sao
      }
    }
    
    success(res, { message: 'File deleted successfully' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new BadRequestError('File not found');
    }
    throw error;
  }
});

module.exports = {
  uploadFile,
  uploadFiles,
  deleteFile,
};
