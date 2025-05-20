const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  levelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  topic: String,
  aiGenerated: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
