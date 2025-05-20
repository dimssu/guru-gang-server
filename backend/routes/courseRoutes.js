const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const courseController = require('../controllers/courseController');

// Public Routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected Routes
router.post('/', authMiddleware, courseController.createCourse);
router.put('/:id', authMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);

// Enroll and get students (protected)
router.post('/:id/enroll', authMiddleware, courseController.enrollInCourse);
router.get('/:id/students', authMiddleware, courseController.getEnrolledStudents);

module.exports = router;
