const express = require('express')
const {
  getAllBlogPosts,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('./blog.controller')
const { authenticate, authorize, optionalAuth } = require('../../middlewares/auth')

const router = express.Router()

// Public routes
router.get('/published', getPublishedBlogPosts)
router.get('/:slug', optionalAuth, getBlogPostBySlug)

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getAllBlogPosts)
router.get('/id/:id', authenticate, authorize('ADMIN'), getBlogPostById)
router.post('/', authenticate, authorize('ADMIN'), createBlogPost)
router.put('/:id', authenticate, authorize('ADMIN'), updateBlogPost)
router.delete('/:id', authenticate, authorize('ADMIN'), deleteBlogPost)

module.exports = router

