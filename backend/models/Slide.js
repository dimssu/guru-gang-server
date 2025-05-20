const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  resourceLinks: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  order: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Slide', slideSchema); 