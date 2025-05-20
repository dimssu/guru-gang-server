const express = require('express');
const router = express.Router();
const {
  createClassroom,
  getAllClassrooms,
  getClassroomById,
  joinClassroom,
  deleteClassroom
} = require('../controllers/classroomController');

const authMiddleware = require('../middleware/authMiddleware');

// Create a new classroom (Teacher/Admin only)
router.post('/', authMiddleware, createClassroom);

// Get all classrooms
router.get('/', authMiddleware, getAllClassrooms);

// Get classroom by ID
router.get('/:id', authMiddleware, getClassroomById);

// Join a classroom
router.post('/:id/join', authMiddleware, joinClassroom);

// Delete a classroom
router.delete('/:id', authMiddleware, deleteClassroom);

module.exports = router;
