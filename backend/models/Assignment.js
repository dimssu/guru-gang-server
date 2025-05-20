const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom'
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fileUrl: String,
    submittedAt: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
