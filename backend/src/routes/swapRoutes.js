const express = require('express');
const swapController = require('../controllers/swapController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Request a swap
router.post('/request', protect, swapController.requestSwap);

// Accept a swap
router.patch('/:id/accept', protect, swapController.acceptSwap);

// Reject a swap
router.patch('/:id/reject', protect, swapController.rejectSwap);

// Complete a swap
router.patch('/:id/complete', protect, swapController.completeSwap);

// Get user's swaps
router.get('/me', protect, swapController.getUserSwaps);

module.exports = router;
