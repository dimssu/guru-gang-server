const express = require('express');
const router = express.Router();
const { createQuiz, getQuizzesByCourse,submitQuiz } = require('../controllers/quizController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Teacher creates quiz
router.post('/create', authMiddleware, checkRoleMiddleware('teacher'), createQuiz);

// Student gets quizzes of a course
router.get('/course/:courseId', authMiddleware, checkRoleMiddleware('student'), getQuizzesByCourse);

router.post(
    '/:quizId/submit',
    authMiddleware,
    checkRoleMiddleware('student'),
    submitQuiz
  );

module.exports = router;

