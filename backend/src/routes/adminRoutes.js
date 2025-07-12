const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(authorize('admin'));

// Items management routes
router.get('/items/pending', adminController.getPendingItems);
router.patch('/items/:id/approve', adminController.approveItem);
router.patch('/items/:id/reject', adminController.rejectItem);
router.delete('/items/:id', adminController.deleteItem);

// User management routes
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/ban', adminController.banUser);

// Swap management routes
router.get('/swaps', adminController.getAllSwaps);

// Transaction management routes
router.get('/transactions', adminController.getAllTransactions);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;
