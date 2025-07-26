const express = require('express');
const LostFound = require('../models/LostFound');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all lost & found items
router.get('/', auth, async (req, res) => {
  try {
    const { category, itemType } = req.query;
    const filter = { status: 'active' };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (itemType && itemType !== 'all') {
      filter.itemType = itemType;
    }

    const items = await LostFound.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create lost/found item
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, itemType, location, contact } = req.body;

    const item = new LostFound({
      title,
      description,
      category,
      itemType,
      location,
      contact,
      user: req.user._id
    });

    await item.save();
    await item.populate('user', 'name email');

    res.status(201).json({
      message: 'Item reported successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const item = await LostFound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only the owner can update the status
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    item.status = status;
    await item.save();
    await item.populate('user', 'name email');

    res.json({
      message: 'Item status updated successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only the owner can delete the item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await LostFound.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;