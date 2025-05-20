const express = require('express');
const router = express.Router();
const {
  getTeacherDashboard,
  getStudentDashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');

const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// Protected routes by role
router.get('/teacher', authMiddleware, checkRoleMiddleware('teacher'), getTeacherDashboard);
router.get('/student', authMiddleware, checkRoleMiddleware('student'), getStudentDashboard);
router.get('/admin', authMiddleware, checkRoleMiddleware('admin'), getAdminDashboard);

module.exports = router;
