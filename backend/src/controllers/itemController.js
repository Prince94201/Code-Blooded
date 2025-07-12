const Item = require('../models/Item');

// @desc   Get all items
// @route  GET /api/items
// @access Public
exports.getItems = async (req, res, next) => {
  try {
    const { category, size, condition, tags } = req.query;
    
    // Build query based on filters
    const query = { status: 'available' };
    if (category) query.category = category;
    if (size) query.size = size;
    if (condition) query.condition = condition;
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    const items = await Item.find(query)
      .populate('ownerId', 'id name profileImageUrl');
    
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

// @desc   Get item by id
// @route  GET /api/items/:id
// @access Public
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('ownerId', 'id name profileImageUrl');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Format response according to API documentation
    const formattedResponse = {
      id: item._id,
      title: item.title,
      description: item.description,
      images: item.images,
      category: item.category,
      size: item.size,
      condition: item.condition,
      tags: item.tags,
      status: item.status,
      owner: {
        id: item.ownerId._id,
        name: item.ownerId.name
      }
    };
    
    res.status(200).json(formattedResponse);
  } catch (error) {
    next(error);
  }
};

// @desc   Create a new item
// @route  POST /api/items
// @access Private
exports.createItem = async (req, res, next) => {
  try {
    const { title, description, images, category, size, condition, tags } = req.body;
    
    // Create item
    const item = await Item.create({
      title,
      description,
      images,
      category,
      size, 
      condition,
      tags,
      ownerId: req.user.id
    });
    
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc   Update item
// @route  PATCH /api/items/:id
// @access Private
exports.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns the item
    if (item.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    
    const { title, description, images, category, size, condition, tags } = req.body;
    
    // Only update fields that are provided
    const fieldsToUpdate = {};
    if (title) fieldsToUpdate.title = title;
    if (description) fieldsToUpdate.description = description;
    if (images) fieldsToUpdate.images = images;
    if (category) fieldsToUpdate.category = category;
    if (size) fieldsToUpdate.size = size;
    if (condition) fieldsToUpdate.condition = condition;
    if (tags) fieldsToUpdate.tags = tags;
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};

// @desc   Delete item
// @route  DELETE /api/items/:id
// @access Private
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns the item
    if (item.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
    
    await Item.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Item removed' });
  } catch (error) {
    next(error);
  }
};
