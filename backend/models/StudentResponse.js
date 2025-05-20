const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [String], // Student's selected answers
  score: Number,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StudentResponse', ResponseSchema);
