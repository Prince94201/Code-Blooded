const express = require('express');
const redemptionController = require('../controllers/redemptionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Redeem item with points
router.post('/', protect, redemptionController.redeemItem);

// Get user's redemption history
router.get('/history', protect, redemptionController.getRedemptionHistory);

module.exports = router;
