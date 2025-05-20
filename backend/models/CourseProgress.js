const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  slidesViewed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slide'
  }],
  lastViewedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to ensure one progress record per user per course
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('CourseProgress', courseProgressSchema); 