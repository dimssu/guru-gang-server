const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  completedLevels: [{
    levelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Level'
    },
    stars: {
      type: Number,
      default: 0
    },
    highScore: {
      type: Number,
      default: 0
    },
    completedAt: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
