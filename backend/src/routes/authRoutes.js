const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Get current user
router.get('/me', protect, authController.getMe);

module.exports = router;
