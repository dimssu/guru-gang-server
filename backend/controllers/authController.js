const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
        name,
        email,
        password: hashedPassword,
        role: role || 'student' 
    });
    await newUser.save();
    
    // Create a new UserProgress record for the user
    const newUserProgress = new UserProgress({
      userId: newUser._id,
      level: 1,
      totalPoints: 0,
      completedLevels: []
    });
    await newUserProgress.save();
    
    res.status(201).json({ msg: "User created successfully." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id,email: user.email, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Forgot Password Route
const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User with this email does not exist' });
      }
  
      // Create a reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      // Send email with reset token using Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASS, // Your email password or app password
        },
      });
  
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER, 
        subject: 'Password Reset',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.
  
        Please click on the following link to reset your password:
        http://localhost:5001/reset-password/${resetToken}
  
        If you did not request this, please ignore this email and your password will remain unchanged.
        `,
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(500).json({ message: 'Error sending email' });
        }
        return res.status(200).json({ message: 'Password reset email sent' });
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // Reset Password Route
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // Find the user by reset token and check if token is expired
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },  // Token not expired
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password and clear the reset token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;  // Clear the reset token
      user.resetPasswordExpires = undefined; // Clear the reset expiry time
      await user.save();
  
      return res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
    

module.exports = { registerUser, loginUser, forgotPassword, resetPassword  };
