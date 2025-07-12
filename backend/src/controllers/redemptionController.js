const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const User = require('../models/User');

// Cost to redeem an item (points)
const REDEMPTION_COST = 20;

// @desc   Redeem item with points
// @route  POST /api/redeem
// @access Private
exports.redeemItem = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    
    // Check if item exists
    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if item is available
    if (item.status !== 'available') {
      return res.status(400).json({ 
        message: 'This item is not available for redemption' 
      });
    }
    
    // Check if user has enough points
    const user = await User.findById(req.user.id);
    
    if (user.points < REDEMPTION_COST) {
      return res.status(400).json({ 
        message: `Not enough points. You need ${REDEMPTION_COST} points to redeem an item.` 
      });
    }
    
    // Create transaction
    const transaction = await Transaction.create({
      userId: req.user.id,
      itemId: itemId,
      pointsUsed: REDEMPTION_COST,
      type: 'redeem'
    });
    
    // Update item status and ownership
    await Item.findByIdAndUpdate(itemId, {
      ownerId: req.user.id,
      status: 'available'
    });
    
    // Deduct points from user
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: -REDEMPTION_COST }
    });
    
    res.status(200).json({
      message: 'Redemption successful',
      pointsDeducted: REDEMPTION_COST,
      transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get user's redemption history
// @route  GET /api/redeem/history
// @access Private
exports.getRedemptionHistory = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ 
      userId: req.user.id,
      type: 'redeem'
    }).populate('itemId');
    
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
