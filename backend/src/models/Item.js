const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required']
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Kids'],
    required: [true, 'Category is required']
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L', 'XL'],
    required: [true, 'Size is required']
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Used'],
    required: [true, 'Condition is required']
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'available', 'swapped', 'reserved', 'rejected'],
    default: 'pending'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for searching
itemSchema.index({ 
  title: 'text', 
  description: 'text',
  tags: 'text'
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
