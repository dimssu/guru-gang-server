const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  description: String,
  requiredLevel: {
    type: Number,
    default: 1
  },
  order: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Level', levelSchema);
