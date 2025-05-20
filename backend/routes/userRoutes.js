const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// Get all users (Admin only)
router.get('/', authMiddleware, checkRoleMiddleware(['admin']), getAllUsers);

// Get user by ID (Admin or the user themselves)
router.get('/:id', authMiddleware, getUserById);

// Update user role (Admin only)
router.put('/:id/role', authMiddleware, checkRoleMiddleware(['admin']), updateUserRole);

// Delete user (Admin only)
router.delete('/:id', authMiddleware, checkRoleMiddleware(['admin']), deleteUser);

module.exports = router;
