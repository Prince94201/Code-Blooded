const Swap = require('../models/Swap');
const Item = require('../models/Item');
const User = require('../models/User');

// @desc   Request a swap
// @route  POST /api/swaps/request
// @access Private
exports.requestSwap = async (req, res, next) => {
  try {
    const { itemOfferedId, itemRequestedId } = req.body;
    
    // Check if both items exist
    const itemOffered = await Item.findById(itemOfferedId);
    const itemRequested = await Item.findById(itemRequestedId);
    
    if (!itemOffered || !itemRequested) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns the item they're offering
    if (itemOffered.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'You can only offer items you own' 
      });
    }
    
    // Check if requested item is available
    if (itemRequested.status !== 'available') {
      return res.status(400).json({ 
        message: 'This item is not available for swap' 
      });
    }
    
    // Create swap request
    const swap = await Swap.create({
      itemOfferedId,
      itemRequestedId,
      initiatorId: req.user.id,
      responderId: itemRequested.ownerId
    });
    
    // Update items status to reserved
    await Item.findByIdAndUpdate(itemOfferedId, { status: 'reserved' });
    await Item.findByIdAndUpdate(itemRequestedId, { status: 'reserved' });
    
    res.status(201).json(swap);
  } catch (error) {
    next(error);
  }
};

// @desc   Accept a swap
// @route  PATCH /api/swaps/:id/accept
// @access Private
exports.acceptSwap = async (req, res, next) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    // Check if user is the responder
    if (swap.responderId.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to accept this swap' 
      });
    }
    
    // Check if swap is still pending
    if (swap.status !== 'pending') {
      return res.status(400).json({ 
        message: `Swap already ${swap.status}` 
      });
    }
    
    // Update swap status
    swap.status = 'accepted';
    await swap.save();
    
    res.status(200).json(swap);
  } catch (error) {
    next(error);
  }
};

// @desc   Reject a swap
// @route  PATCH /api/swaps/:id/reject
// @access Private
exports.rejectSwap = async (req, res, next) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    // Check if user is the responder
    if (swap.responderId.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to reject this swap' 
      });
    }
    
    // Check if swap is still pending
    if (swap.status !== 'pending') {
      return res.status(400).json({ 
        message: `Swap already ${swap.status}` 
      });
    }
    
    // Update swap status
    swap.status = 'rejected';
    await swap.save();
    
    // Return items to available status
    await Item.findByIdAndUpdate(swap.itemOfferedId, { status: 'available' });
    await Item.findByIdAndUpdate(swap.itemRequestedId, { status: 'available' });
    
    res.status(200).json(swap);
  } catch (error) {
    next(error);
  }
};

// @desc   Complete a swap
// @route  PATCH /api/swaps/:id/complete
// @access Private
exports.completeSwap = async (req, res, next) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    // Check if user is part of the swap
    if (
      swap.initiatorId.toString() !== req.user.id && 
      swap.responderId.toString() !== req.user.id
    ) {
      return res.status(403).json({ 
        message: 'Not authorized to complete this swap' 
      });
    }
    
    // Check if swap is accepted
    if (swap.status !== 'accepted') {
      return res.status(400).json({ 
        message: 'Swap must be accepted before completing' 
      });
    }
    
    // Exchange ownership of items
    const itemOffered = await Item.findById(swap.itemOfferedId);
    const itemRequested = await Item.findById(swap.itemRequestedId);
    
    // Update item owners
    await Item.findByIdAndUpdate(swap.itemOfferedId, { 
      ownerId: itemRequested.ownerId,
      status: 'available'
    });
    
    await Item.findByIdAndUpdate(swap.itemRequestedId, { 
      ownerId: itemOffered.ownerId,
      status: 'available'
    });
    
    // Update swap status
    swap.status = 'completed';
    await swap.save();
    
    // Award points to both users (5 points for each successful swap)
    await User.findByIdAndUpdate(swap.initiatorId, { 
      $inc: { points: 5 } 
    });
    
    await User.findByIdAndUpdate(swap.responderId, { 
      $inc: { points: 5 } 
    });
    
    res.status(200).json(swap);
  } catch (error) {
    next(error);
  }
};

// @desc   Get user's swaps
// @route  GET /api/swaps/me
// @access Private
exports.getUserSwaps = async (req, res, next) => {
  try {
    const swaps = await Swap.find({
      $or: [
        { initiatorId: req.user.id },
        { responderId: req.user.id }
      ]
    }).populate('itemOfferedId itemRequestedId initiatorId responderId');
    
    res.status(200).json(swaps);
  } catch (error) {
    next(error);
  }
};
