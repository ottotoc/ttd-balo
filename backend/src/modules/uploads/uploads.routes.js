const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const uploadsController = require('./uploads.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { resizeImage, resizeImages } = require('../../middlewares/imageResize');

// Cấu hình multer để lưu file vào thư mục uploads theo category
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Lấy category từ query param hoặc body (projects, blog, hoặc mặc định là 'general')
    const category = req.query.category || req.body.category || 'general';
    
    // Validate category
    const allowedCategories = ['projects', 'blog', 'banners', 'general'];
    const finalCategory = allowedCategories.includes(category) ? category : 'general';
    
    // Thư mục uploads nằm ở backend/uploads/{category}
    const uploadsDir = path.join(__dirname, '../../../uploads', finalCategory);
    
    // Đảm bảo thư mục tồn tại
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
    
    // Lưu category vào req để dùng sau
    req.uploadCategory = finalCategory;
    
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  },
});

// Filter chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

// Cấu hình multer
// Tăng limit lên 30MB để cho phép upload ảnh lớn (15MB+), sẽ được resize và optimize xuống nhỏ hơn
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB (sẽ được resize và optimize xuống ~500KB-1MB)
  },
});

// Routes
// Upload single file (Admin only)
// Flow: authenticate -> authorize -> upload -> resize -> controller
router.post('/file', authenticate, authorize('ADMIN'), upload.single('image'), resizeImage, uploadsController.uploadFile);

// Upload multiple files (Admin only)
router.post('/files', authenticate, authorize('ADMIN'), upload.array('images', 10), resizeImages, uploadsController.uploadFiles);

// Delete file (Admin only)
router.delete('/file', authenticate, authorize('ADMIN'), uploadsController.deleteFile);

module.exports = router;
