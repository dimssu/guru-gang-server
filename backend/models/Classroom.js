const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Classroom', classroomSchema);
