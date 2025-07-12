const User = require('../models/User');
const Item = require('../models/Item');
const Swap = require('../models/Swap');
const Transaction = require('../models/Transaction');

// @desc   Get user by id
// @route  GET /api/users/:id
// @access Public
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc   Get logged in user dashboard
// @route  GET /api/users/me/dashboard
// @access Private
exports.getDashboard = async (req, res, next) => {
  try {
    // Get user's listings
    const items = await Item.find({ ownerId: req.user.id });
    
    // Get user's swaps
    const swaps = await Swap.find({
      $or: [
        { initiatorId: req.user.id },
        { responderId: req.user.id }
      ]
    }).populate('itemOfferedId itemRequestedId initiatorId responderId');
    
    // Get user's transactions
    const transactions = await Transaction.find({ userId: req.user.id })
      .populate('itemId');
    
    res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        profileImageUrl: req.user.profileImageUrl,
        points: req.user.points,
        createdAt: req.user.createdAt
      },
      items,
      swaps,
      transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update user profile
// @route  PATCH /api/users/me
// @access Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, profileImageUrl } = req.body;
    
    // Only allow certain fields to be updated
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (profileImageUrl) fieldsToUpdate.profileImageUrl = profileImageUrl;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
