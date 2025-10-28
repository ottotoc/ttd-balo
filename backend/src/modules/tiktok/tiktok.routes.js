const express = require('express')
const {
  getTikTokVideos,
  getActiveTikTokVideos,
  getTikTokVideoById,
  createTikTokVideo,
  updateTikTokVideo,
  deleteTikTokVideo,
} = require('./tiktok.controller')
const { authenticate, authorize } = require('../../middlewares/auth')

const router = express.Router()

// Public routes
router.get('/active', getActiveTikTokVideos)

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getTikTokVideos)
router.get('/:id', authenticate, authorize('ADMIN'), getTikTokVideoById)
router.post('/', authenticate, authorize('ADMIN'), createTikTokVideo)
router.put('/:id', authenticate, authorize('ADMIN'), updateTikTokVideo)
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTikTokVideo)

module.exports = router

