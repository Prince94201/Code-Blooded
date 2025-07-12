const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get user by id
router.get('/:id', userController.getUserById);

// Get user dashboard
router.get('/me/dashboard', protect, userController.getDashboard);

// Update user profile
router.patch('/me', protect, userController.updateProfile);

module.exports = router;
