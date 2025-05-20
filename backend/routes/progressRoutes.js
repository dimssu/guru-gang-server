const express = require('express');
const router = express.Router();
const progressController = require('../controllers/courseProgressController');
const authMiddleware = require('../middleware/authMiddleware');

// Mark a slide as viewed
router.post('/view-slide', authMiddleware, progressController.markSlideViewed);

// Get progress for a specific course
router.get('/course/:courseId', authMiddleware, progressController.getCourseProgress);

// Get progress for all enrolled courses
router.get('/all-courses', authMiddleware, progressController.getAllCoursesProgress);

module.exports = router; 