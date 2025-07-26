const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  itemType: {
    type: String,
    enum: ['book', 'bottle', 'wallet', 'phone', 'keys', 'other'],
    default: 'other'
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LostFound', lostFoundSchema);