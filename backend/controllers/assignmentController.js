const Assignment = require('../models/Assignment');

// Create Assignment (Teacher)
const createAssignment = async (req, res) => {
  try {
    const { title, description, classroom } = req.body;

    const newAssignment = new Assignment({
      title,
      description,
      classroom,
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Assignment created', assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create assignment' });
  }
};

// Get all assignments in a classroom
const getAssignmentsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const assignments = await Assignment.find({ classroom: classroomId }).populate('classroom');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};

// Submit assignment (Student)
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { fileUrl } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    assignment.submissions.push({
      student: req.user.id,
      fileUrl,
      submittedAt: new Date()
    });

    await assignment.save();
    res.json({ message: 'Submission successful', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit assignment' });
  }
};

// Get a single assignment (with submissions)
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('classroom')
      .populate('submissions.student', 'name email');

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignment' });
  }
};

// Delete assignment (Teacher only)
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    await assignment.remove();
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete assignment' });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByClassroom,
  submitAssignment,
  getAssignmentById,
  deleteAssignment,
};
