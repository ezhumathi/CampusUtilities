const express = require('express');
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 🔥 SIMPLE VERSION - Get timetable (No auth required for testing)
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;
    
    // Find user by email or use default student
    let user = await User.findOne({ email: userEmail || 'student@test.com' });
    if (!user) {
      user = await User.findOne({ role: 'student' });
    }

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'No user found. Please create a user first.' 
      });
    }

    const timetable = await Timetable.find({ user: user._id })
      .populate('user', 'name email')
      .sort({ day: 1, time: 1 });

    res.json({
      success: true,
      timetable
    });
  } catch (error) {
    console.error('Get timetable error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// 🔥 SIMPLE VERSION - Add class to timetable (No auth required for testing)
router.post('/', async (req, res) => {
  try {
    const { day, time, subject, room, teacher, userEmail } = req.body;

    // Find user by email or use default student
    let user = await User.findOne({ email: userEmail || 'student@test.com' });
    if (!user) {
      user = await User.findOne({ role: 'student' });
    }

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'No user found. Please create a user first.' 
      });
    }

    // Check if slot is already occupied
    const existingClass = await Timetable.findOne({
      user: user._id,
      day,
      time
    });

    if (existingClass) {
      return res.status(400).json({ 
        success: false,
        message: 'Time slot already occupied' 
      });
    }

    const classEntry = new Timetable({
      user: user._id,
      day,
      time,
      subject,
      room,
      teacher
    });

    await classEntry.save();
    await classEntry.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Class added successfully',
      class: classEntry
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Time slot already occupied' 
      });
    }
    console.error('Create timetable error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// 🔥 SIMPLE VERSION - Delete class (No auth required for testing)
router.delete('/:id', async (req, res) => {
  try {
    const classEntry = await Timetable.findByIdAndDelete(req.params.id);

    if (!classEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Class deleted successfully' 
    });
  } catch (error) {
    console.error('Delete timetable error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update class
router.put('/:id', auth, async (req, res) => {
  try {
    const { subject, room, teacher } = req.body;

    const classEntry = await Timetable.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!classEntry) {
      return res.status(404).json({ message: 'Class not found' });
    }

    classEntry.subject = subject || classEntry.subject;
    classEntry.room = room || classEntry.room;
    classEntry.teacher = teacher || classEntry.teacher;

    await classEntry.save();

    res.json({
      message: 'Class updated successfully',
      class: classEntry
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete class
router.delete('/:id', auth, async (req, res) => {
  try {
    const classEntry = await Timetable.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!classEntry) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete class by day and time
router.delete('/slot/:day/:time', auth, async (req, res) => {
  try {
    const { day, time } = req.params;

    const classEntry = await Timetable.findOneAndDelete({
      user: req.user._id,
      day,
      time
    });

    if (!classEntry) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;