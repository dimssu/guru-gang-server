const Classroom = require('../models/Classroom');
const User = require('../models/User');

// 1. Create Classroom
exports.createClassroom = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teachers or admins can create classrooms' });
    }

    const { title } = req.body;
    const classroom = new Classroom({
      title,
      createdBy: req.user._id,
    });

    await classroom.save();
    res.status(201).json({ message: 'Classroom created successfully', classroom });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating classroom', error: error.message });
  }
};

// 2. Get All Classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate('createdBy', 'name email');
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classrooms', error: error.message });
  }
};

// 3. Get Classroom by ID
exports.getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('students', 'name email')
      .populate('assignments')
      .populate('messages');

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.status(200).json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classroom', error: error.message });
  }
};

// 4. Join Classroom
exports.joinClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    if (classroom.students.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined this classroom' });
    }

    classroom.students.push(req.user._id);
    await classroom.save();

    res.status(200).json({ message: 'Joined classroom successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error joining classroom', error: error.message });
  }
};

// 5. Delete Classroom
exports.deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    if (req.user._id.toString() !== classroom.createdBy.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this classroom' });
    }

    await classroom.deleteOne();
    res.status(200).json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting classroom', error: error.message });
  }
};
