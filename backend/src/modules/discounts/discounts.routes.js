const express = require('express');
const router = express.Router();
const discountsController = require('./discounts.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

// Public route
router.post('/validate', discountsController.validateDiscount);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), discountsController.getDiscounts);
router.post('/', authenticate, authorize('ADMIN'), discountsController.createDiscount);
router.put('/:id', authenticate, authorize('ADMIN'), discountsController.updateDiscount);
router.delete('/:id', authenticate, authorize('ADMIN'), discountsController.deleteDiscount);

module.exports = router;

