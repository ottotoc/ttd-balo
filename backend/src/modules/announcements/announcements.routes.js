const express = require('express')
const {
  getAnnouncements,
  getActiveAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('./announcements.controller')
const { authenticate, authorize } = require('../../middlewares/auth')

const router = express.Router()

// Public routes
router.get('/active', getActiveAnnouncements)

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getAnnouncements)
router.get('/:id', authenticate, authorize('ADMIN'), getAnnouncementById)
router.post('/', authenticate, authorize('ADMIN'), createAnnouncement)
router.put('/:id', authenticate, authorize('ADMIN'), updateAnnouncement)
router.delete('/:id', authenticate, authorize('ADMIN'), deleteAnnouncement)

module.exports = router

