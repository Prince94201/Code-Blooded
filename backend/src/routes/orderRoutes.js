const express = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get user orders
router.get('/me', protect, orderController.getUserOrders);

// Get order by id
router.get('/:id', protect, orderController.getOrderById);

// Cancel order
router.patch('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router;
