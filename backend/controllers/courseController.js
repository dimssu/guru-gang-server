const Course = require('../models/Course');
const User = require('../models/User');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teachers or admins can create courses' });
    }

    const course = new Course({
      title,
      description,
      category,
      teacherId: req.user._id
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating course', error: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacherId', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacherId', 'name email')
      .populate('students', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Allow only the teacher who created it or admin
    if (req.user._id.toString() !== course.teacherId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const { title, description, category } = req.body;
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;

    await course.save();
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user._id.toString() !== course.teacherId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Prevent duplicate enrollment
    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.students.push(req.user._id);
    await course.save();

    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

// Get enrolled students
exports.getEnrolledStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students', 'name email');

    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Only the course teacher or admin can view
    if (req.user._id.toString() !== course.teacherId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view enrolled students' });
    }

    res.status(200).json({ students: course.students });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};
