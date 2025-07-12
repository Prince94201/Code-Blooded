const express = require('express');
const itemController = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all items and get item by id
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);

// Create new item
router.post('/', protect, itemController.createItem);

// Update item
router.patch('/:id', protect, itemController.updateItem);

// Delete item
router.delete('/:id', protect, itemController.deleteItem);

module.exports = router;
