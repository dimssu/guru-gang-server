const Classroom = require('../models/Classroom');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// Teacher Dashboard
const getTeacherDashboard = async (req, res) => {
  try {
    const classrooms = await Classroom.find({ teacher: req.user.id });
    const assignments = await Assignment.find({ teacher: req.user.id });
    res.json({ classrooms, assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load teacher dashboard' });
  }
};

// Student Dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const classrooms = await Classroom.find({ students: req.user.id });
    const assignments = await Assignment.find({ students: req.user.id });
    res.json({ classrooms, assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load student dashboard' });
  }
};

// Admin Dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const classrooms = await Classroom.find();
    res.json({ users, classrooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load admin dashboard' });
  }
};

module.exports = {
  getTeacherDashboard,
  getStudentDashboard,
  getAdminDashboard,
};
