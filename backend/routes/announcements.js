const express = require('express');
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// 🔥 SIMPLE VERSION - Get all announcements (No auth required for testing)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    
    const announcements = await Announcement.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      announcements
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// 🔥 SIMPLE VERSION - Create announcement (No auth required for testing)
router.post('/', async (req, res) => {
  try {
    const { title, content, category, authorEmail } = req.body;

    // Find author by email or create a default admin user
    let author = await User.findOne({ email: authorEmail || 'admin@test.com' });
    if (!author) {
      author = await User.findOne({ role: 'admin' });
    }

    if (!author) {
      return res.status(400).json({ 
        success: false, 
        message: 'No admin user found. Please create an admin user first.' 
      });
    }

    const announcement = new Announcement({
      title,
      content,
      category: category || 'general',
      author: author._id
    });

    await announcement.save();
    await announcement.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update announcement (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }
    ).populate('author', 'name email');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete announcement (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;