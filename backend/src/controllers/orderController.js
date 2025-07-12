const Swap = require('../models/Swap');
const Transaction = require('../models/Transaction');
const Item = require('../models/Item');

// @desc   Get all user orders (swaps & redemptions)
// @route  GET /api/orders/me
// @access Private
exports.getUserOrders = async (req, res, next) => {
  try {
    // Get swaps (both initiated and responded)
    const swaps = await Swap.find({
      $or: [
        { initiatorId: req.user.id },
        { responderId: req.user.id }
      ]
    }).populate('itemOfferedId itemRequestedId initiatorId responderId');
    
    // Get redemptions
    const redemptions = await Transaction.find({ 
      userId: req.user.id,
      type: 'redeem'
    }).populate('itemId');
    
    // Format swaps as orders
    const swapOrders = swaps.map(swap => ({
      id: swap._id,
      type: 'swap',
      status: swap.status,
      date: swap.createdAt,
      items: [swap.itemOfferedId, swap.itemRequestedId],
      withUser: swap.initiatorId.toString() === req.user.id 
        ? swap.responderId 
        : swap.initiatorId
    }));
    
    // Format redemptions as orders
    const redemptionOrders = redemptions.map(redemption => ({
      id: redemption._id,
      type: 'redemption',
      status: 'completed',
      date: redemption.createdAt,
      item: redemption.itemId,
      pointsUsed: redemption.pointsUsed
    }));
    
    // Combine orders
    const orders = [...swapOrders, ...redemptionOrders].sort((a, b) => 
      b.date - a.date
    );
    
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc   Get order details
// @route  GET /api/orders/:id
// @access Private
exports.getOrderById = async (req, res, next) => {
  try {
    // Try to find order as swap
    let order = await Swap.findById(req.params.id)
      .populate('itemOfferedId itemRequestedId initiatorId responderId');
    
    // If not found as swap, try as transaction
    if (!order) {
      order = await Transaction.findById(req.params.id)
        .populate('itemId userId');
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Check if user owns the transaction
      if (order.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      
      // Format redemption as order
      return res.status(200).json({
        id: order._id,
        type: 'redemption',
        status: 'completed',
        date: order.createdAt,
        item: order.itemId,
        pointsUsed: order.pointsUsed
      });
    }
    
    // Check if user is part of the swap
    if (
      order.initiatorId.toString() !== req.user.id && 
      order.responderId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    // Format swap as order
    res.status(200).json({
      id: order._id,
      type: 'swap',
      status: order.status,
      date: order.createdAt,
      items: [order.itemOfferedId, order.itemRequestedId],
      withUser: order.initiatorId.toString() === req.user.id 
        ? order.responderId 
        : order.initiatorId
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Cancel an order
// @route  PATCH /api/orders/:id/cancel
// @access Private
exports.cancelOrder = async (req, res, next) => {
  try {
    // Try to find as swap
    let order = await Swap.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is part of the swap
    if (
      order.initiatorId.toString() !== req.user.id && 
      order.responderId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Can only cancel if pending
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot cancel order with status: ${order.status}` 
      });
    }
    
    // Update swap status
    order.status = 'rejected';
    await order.save();
    
    // Return items to available status
    await Item.findByIdAndUpdate(order.itemOfferedId, { status: 'available' });
    await Item.findByIdAndUpdate(order.itemRequestedId, { status: 'available' });
    
    res.status(200).json({ 
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};
