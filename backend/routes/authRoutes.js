const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
