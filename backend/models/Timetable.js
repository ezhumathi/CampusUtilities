const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  time: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: String,
    trim: true
  },
  teacher: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure one subject per user per day-time slot
timetableSchema.index({ user: 1, day: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);