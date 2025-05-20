const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByClassroom,
  submitAssignment,
  getAssignmentById,
  deleteAssignment,
} = require('../controllers/assignmentController');

const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// Teacher routes
router.post('/', authMiddleware, checkRoleMiddleware('teacher'), createAssignment);
router.get('/classroom/:classroomId', authMiddleware, getAssignmentsByClassroom);
router.delete('/:id', authMiddleware, checkRoleMiddleware('teacher'), deleteAssignment);

// Student routes
router.post('/submit/:assignmentId', authMiddleware, checkRoleMiddleware('student'), submitAssignment);

// Common
router.get('/:id', authMiddleware, getAssignmentById);

module.exports = router;
