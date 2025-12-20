/**
 * Script để optimize lại các ảnh đã upload trước đó
 * Chạy script này để convert các ảnh cũ sang WebP và tạo các version
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { readdir } = require('fs').promises;

const uploadsDir = path.join(__dirname, '../uploads');

// Cấu hình
const webMaxWidth = 1920;
const webMaxHeight = 1920;
const dashboardMaxWidth = 800;
const dashboardMaxHeight = 800;
const thumbnailWidth = 300;
const thumbnailHeight = 300;
const webpQuality = 75;
const jpegQuality = 75;

async function optimizeImage(filePath) {
  const fileExt = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, fileExt);
  const fileDir = path.dirname(filePath);

  // Bỏ qua nếu đã là WebP hoặc thumbnail
  if (fileExt === '.webp' || fileName.includes('_thumb') || fileName.includes('_dashboard')) {
    return { skipped: true, file: path.basename(filePath) };
  }

  try {
    console.log(`\n🔄 Processing: ${path.basename(filePath)}`);
    
    const metadata = await sharp(filePath).metadata();
    const originalSize = (await fs.stat(filePath)).size;
    
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

    // Tính toán kích thước
    let webShouldResize = metadata.width > webMaxWidth || metadata.height > webMaxHeight;
    let webTargetWidth = metadata.width;
    let webTargetHeight = metadata.height;

    if (webShouldResize) {
      const ratio = Math.min(webMaxWidth / metadata.width, webMaxHeight / metadata.height);
      webTargetWidth = Math.round(metadata.width * ratio);
      webTargetHeight = Math.round(metadata.height * ratio);
    }

    let dashboardShouldResize = metadata.width > dashboardMaxWidth || metadata.height > dashboardMaxHeight;
    let dashboardTargetWidth = metadata.width;
    let dashboardTargetHeight = metadata.height;

    if (dashboardShouldResize) {
      const ratio = Math.min(dashboardMaxWidth / metadata.width, dashboardMaxHeight / metadata.height);
      dashboardTargetWidth = Math.round(metadata.width * ratio);
      dashboardTargetHeight = Math.round(metadata.height * ratio);
    }

    const baseSharp = sharp(filePath).withMetadata({});

    // 1. Web version
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
    
    const webSize = (await fs.stat(webpPath)).size;
    console.log(`   ✅ Web version: ${webTargetWidth}x${webTargetHeight}, ${(webSize / 1024 / 1024).toFixed(2)}MB`);

    // 2. Dashboard version
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
    
    const dashboardSize = (await fs.stat(dashboardPath)).size;
    console.log(`   ✅ Dashboard version: ${dashboardTargetWidth}x${dashboardTargetHeight}, ${(dashboardSize / 1024 / 1024).toFixed(2)}MB`);

    // 3. Thumbnail
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
    
    const thumbSize = (await fs.stat(thumbnailPath)).size;
    console.log(`   ✅ Thumbnail: 300x300, ${(thumbSize / 1024).toFixed(2)}KB`);

    // Xóa file gốc (giữ lại nếu muốn backup)
    // await fs.unlink(filePath);
    // console.log(`   🗑️  Deleted original file`);

    const totalNewSize = webSize + dashboardSize + thumbSize;
    const saved = originalSize - totalNewSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(1);
    
    console.log(`   💾 Saved: ${(saved / 1024 / 1024).toFixed(2)}MB (${savedPercent}%)`);

    return {
      success: true,
      file: path.basename(filePath),
      original: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
      optimized: `${(totalNewSize / 1024 / 1024).toFixed(2)}MB`,
      saved: `${(saved / 1024 / 1024).toFixed(2)}MB`,
      savedPercent: `${savedPercent}%`,
    };
  } catch (error) {
    console.error(`   ❌ Error processing ${path.basename(filePath)}:`, error.message);
    return { error: true, file: path.basename(filePath), message: error.message };
  }
}

async function main() {
  try {
    console.log('🚀 Starting image optimization...\n');
    console.log(`📁 Uploads directory: ${uploadsDir}\n`);

    // Kiểm tra thư mục tồn tại
    try {
      await fs.access(uploadsDir);
    } catch {
      console.error(`❌ Directory not found: ${uploadsDir}`);
      process.exit(1);
    }

    // Đọc tất cả files
    const files = await readdir(uploadsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('✅ No images to optimize');
      return;
    }

    console.log(`📸 Found ${imageFiles.length} image(s) to optimize\n`);

    const results = [];
    for (const file of imageFiles) {
      const filePath = path.join(uploadsDir, file);
      const result = await optimizeImage(filePath);
      results.push(result);
    }

    // Tổng kết
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    
    const successful = results.filter(r => r.success);
    const skipped = results.filter(r => r.skipped);
    const errors = results.filter(r => r.error);

    console.log(`✅ Optimized: ${successful.length}`);
    console.log(`⏭️  Skipped: ${skipped.length}`);
    console.log(`❌ Errors: ${errors.length}`);

    if (successful.length > 0) {
      console.log('\n📈 Results:');
      successful.forEach(r => {
        console.log(`   ${r.file}: ${r.original} → ${r.optimized} (saved ${r.savedPercent})`);
      });
    }

    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach(r => {
        console.log(`   ${r.file}: ${r.message}`);
      });
    }

    console.log('\n✅ Optimization complete!');
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();

