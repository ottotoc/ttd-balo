const express = require('express');
const router = express.Router();
const uploadsController = require('./uploads.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

// Admin only
router.post('/signed-url', authenticate, authorize('ADMIN'), uploadsController.getUploadUrl);
router.post('/read-url', authenticate, authorize('ADMIN'), uploadsController.getReadUrl);
router.delete('/file', authenticate, authorize('ADMIN'), uploadsController.deleteFile);

module.exports = router;

