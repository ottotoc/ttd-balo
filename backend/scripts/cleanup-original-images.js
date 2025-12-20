/**
 * Script để xóa các file ảnh gốc sau khi đã optimize
 * CHỈ chạy sau khi đã chắc chắn các file WebP đã được tạo và hoạt động tốt
 */

const fs = require('fs').promises;
const path = require('path');
const { readdir } = require('fs').promises;

const uploadsDir = path.join(__dirname, '../uploads');

async function cleanup() {
  try {
    console.log('🧹 Cleaning up original image files...\n');
    console.log(`📁 Uploads directory: ${uploadsDir}\n`);

    const files = await readdir(uploadsDir);
    
    // Tìm các file gốc (.jpg, .jpeg, .png, .gif) mà đã có file .webp tương ứng
    const originalFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext) && 
             !file.includes('_thumb') && 
             !file.includes('_dashboard');
    });

    let deleted = 0;
    let totalSaved = 0;

    for (const file of originalFiles) {
      const filePath = path.join(uploadsDir, file);
      const fileName = path.basename(file, path.extname(file));
      const webpFile = `${fileName}.webp`;
      const webpPath = path.join(uploadsDir, webpFile);

      try {
        // Kiểm tra file WebP có tồn tại không
        await fs.access(webpPath);
        
        // Xóa file gốc
        const stats = await fs.stat(filePath);
        await fs.unlink(filePath);
        
        console.log(`   ✅ Deleted: ${file} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
        deleted++;
        totalSaved += stats.size;
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`   ⚠️  Skipped: ${file} (no WebP version found)`);
        } else {
          console.error(`   ❌ Error deleting ${file}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   Deleted: ${deleted} file(s)`);
    console.log(`   Space saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
    
    if (deleted === 0) {
      console.log(`\n💡 No files to delete (all already optimized or WebP not found)`);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

cleanup();

