const express = require('express');
const router = express.Router();
const reviewsController = require('./reviews.controller');
const { authenticate, authorize, optionalAuth } = require('../../middlewares/auth');

// Public/user routes
router.get('/products/:productId', reviewsController.getProductReviews);
router.post('/products/:productId', optionalAuth, reviewsController.createReview);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), reviewsController.getAllReviews);
router.patch('/:id/approve', authenticate, authorize('ADMIN'), reviewsController.approveReview);
router.delete('/:id', authenticate, authorize('ADMIN'), reviewsController.deleteReview);

module.exports = router;

