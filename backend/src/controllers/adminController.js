const Item = require('../models/Item');
const User = require('../models/User');
const Swap = require('../models/Swap');
const Transaction = require('../models/Transaction');

// @desc   Get pending items for approval
// @route  GET /api/admin/items/pending
// @access Private/Admin
exports.getPendingItems = async (req, res, next) => {
  try {
    const items = await Item.find({ status: 'pending' })
      .populate('ownerId', 'name email');
      
    const formattedItems = items.map(item => ({
      ...item.toObject(),
      id: item._id.toString(),
      _id: undefined  // optional: remove _id field 
      }))
    
    res.status(200).json(formattedItems);
  } catch (error) {
    next(error);
  }
};

// @desc   Approve an item
// @route  PATCH /api/admin/items/:id/approve
// @access Private/Admin
exports.approveItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    item.status = 'available';
    await item.save();
    
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc   Reject an item
// @route  PATCH /api/admin/items/:id/reject
// @access Private/Admin
exports.rejectItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    item.status = 'rejected';
    await item.save();
    
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc   Delete an item (admin)
// @route  DELETE /api/admin/items/:id
// @access Private/Admin
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await Item.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Item removed' });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all users
// @route  GET /api/admin/users
// @access Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
const users = await User.find().select('-password').lean();

const formattedUsers = users.map(user => ({
  ...user,
  id: user._id.toString(),
  _id: undefined  // optional: remove _id field
}));

    
    res.status(200).json(formattedUsers);
  } catch (error) {
    next(error);
  }
};

// @desc   Ban/unban a user
// @route  PATCH /api/admin/users/:id/ban
// @access Private/Admin
exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // We'll use the 'role' field to ban users
    // If banned, role will be set to 'banned'
    user.role = user.role === 'banned' ? 'user' : 'banned';
    await user.save();
    
    res.status(200).json({ 
      message: user.role === 'banned' ? 'User banned' : 'User unbanned',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get admin dashboard stats
// @route  GET /api/admin/dashboard
// @access Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get user count
    const userCount = await User.countDocuments();
    
    // Get item counts by status
    const itemCounts = {
      total: await Item.countDocuments(),
      available: await Item.countDocuments({ status: 'available' }),
      pending: await Item.countDocuments({ status: 'pending' }),
      swapped: await Item.countDocuments({ status: 'swapped' }),
      rejected: await Item.countDocuments({ status: 'rejected' })
    };
    
    // Get swap counts by status
    const swapCounts = {
      total: await Swap.countDocuments(),
      pending: await Swap.countDocuments({ status: 'pending' }),
      accepted: await Swap.countDocuments({ status: 'accepted' }),
      completed: await Swap.countDocuments({ status: 'completed' }),
      rejected: await Swap.countDocuments({ status: 'rejected' })
    };
    
    // Get redemption stats
    const redemptionCount = await Transaction.countDocuments({ type: 'redeem' });
    const pointsUsed = await Transaction.aggregate([
      { $match: { type: 'redeem' } },
      { $group: { _id: null, total: { $sum: '$pointsUsed' } } }
    ]);
    
    const totalPointsUsed = pointsUsed.length > 0 ? pointsUsed[0].total : 0;
    
    res.status(200).json({
      users: userCount,
      items: itemCounts,
      swaps: swapCounts,
      redemptions: {
        count: redemptionCount,
        pointsUsed: totalPointsUsed
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all swaps
// @route  GET /api/admin/swaps
// @access Private/Admin
exports.getAllSwaps = async (req, res, next) => {
  try {
    const swaps = await Swap.find()
      .populate('itemOfferedId', 'title category images')
      .populate('itemRequestedId', 'title category images')
      .populate('initiatorId', 'name email')
      .populate('responderId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(swaps);
  } catch (error) {
    next(error);
  }
};

// @desc   Get all transactions
// @route  GET /api/admin/transactions
// @access Private/Admin
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'name email')
      .populate('itemId', 'title category images')
      .sort({ createdAt: -1 });
    
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
