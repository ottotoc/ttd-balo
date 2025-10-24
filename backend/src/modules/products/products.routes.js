const express = require('express');
const router = express.Router();
const productsController = require('./products.controller');
const { authenticate, authorize } = require('../../middlewares/auth');

// Public routes
router.get('/', productsController.getProducts);
router.get('/:slug', productsController.getProduct);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), productsController.createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), productsController.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), productsController.deleteProduct);

module.exports = router;

