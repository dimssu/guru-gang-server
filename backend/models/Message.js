const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom'
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
