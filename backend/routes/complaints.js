const express = require('express');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// 🔥 SIMPLE VERSION - Get all complaints (No auth required for testing)
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }

    const complaints = await Complaint.find(filter)
      .populate('student', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      complaints
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// 🔥 SIMPLE VERSION - Create complaint (No auth required for testing)
router.post('/', async (req, res) => {
  try {
    const { title, description, category, priority, studentEmail } = req.body;

    // Find student by email or use default student
    let student = await User.findOne({ email: studentEmail || 'student@test.com' });
    if (!student) {
      student = await User.findOne({ role: 'student' });
    }

    if (!student) {
      return res.status(400).json({ 
        success: false, 
        message: 'No student user found. Please create a student user first.' 
      });
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      priority: priority || 'medium',
      student: student._id
    });

    await complaint.save();
    await complaint.populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint registered successfully',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// 🔥 SIMPLE VERSION - Update complaint status (No auth required for testing)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Complaint not found' 
      });
    }

    complaint.status = status;
    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();
    await complaint.populate('student', 'name email');

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update complaint status (Admin only)
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    if (assignedTo) {
      complaint.assignedTo = assignedTo;
    }
    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();
    await complaint.populate('student', 'name email');
    await complaint.populate('assignedTo', 'name email');

    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update complaint priority (Admin only)
router.put('/:id/priority', auth, adminAuth, async (req, res) => {
  try {
    const { priority } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    )
      .populate('student', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({
      message: 'Complaint priority updated successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete complaint
router.delete('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Students can only delete their own complaints, admins can delete any
    if (req.user.role === 'student' && complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get complaint statistics (Admin only)
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      categoryStats: categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;