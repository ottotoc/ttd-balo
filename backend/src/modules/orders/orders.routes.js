const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const { authenticate, authorize, optionalAuth } = require('../../middlewares/auth');

// Create order (guest or authenticated)
router.post('/', optionalAuth, ordersController.createOrder);

// Get orders (authenticated)
router.get('/', authenticate, ordersController.getOrders);
// Get single order (public for confirmation page, but requires auth for other access)
router.get('/:id', optionalAuth, ordersController.getOrder);

// Admin routes
router.patch('/:id/status', authenticate, authorize('ADMIN'), ordersController.updateOrderStatus);
router.post('/:id/confirm-payment', authenticate, authorize('ADMIN'), ordersController.confirmPayment);

module.exports = router;

