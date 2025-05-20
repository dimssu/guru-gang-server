const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const QuizSchema = new mongoose.Schema({
  topic: String,
  questions: [QuestionSchema],
  createdBy: String, // teacher ID
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  summary: { type: String }, // added summary field
});

module.exports = mongoose.model('Quiz', QuizSchema);

