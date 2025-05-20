const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const slideController = require('../controllers/slideController');

// Get all slides for a course (accessible by both students and teachers)
router.get('/course/:courseId', authMiddleware, slideController.getSlidesByCourse);

// Create a new slide (teacher only)
router.post('/course/:courseId', authMiddleware, slideController.createSlide);

// Update a slide (teacher only)
router.put('/:slideId', authMiddleware, slideController.updateSlide);

// Delete a slide (teacher only)
router.delete('/:slideId', authMiddleware, slideController.deleteSlide);

// Reorder slides (teacher only)
router.put('/course/:courseId/reorder', authMiddleware, slideController.reorderSlides);

module.exports = router; 