const express = require('express');
const { getLevels, getQuestions, submitLevelResult } = require('../controllers/conceptBattleController.js');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected with authentication
router.use(authMiddleware);

// Get all levels with user progress
router.get('/levels', getLevels);

// Get questions for a specific level
router.get('/questions/:levelId', getQuestions);

// Submit level results
router.post('/submit-result', submitLevelResult);

module.exports = router;
