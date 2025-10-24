const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const { optionalAuth } = require('../../middlewares/auth');

// All cart routes support both guest and authenticated users
router.use(optionalAuth);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.patch('/items/:id', cartController.updateItem);
router.delete('/items/:id', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;

