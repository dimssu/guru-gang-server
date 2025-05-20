const Slide = require('../models/Slide');
const Course = require('../models/Course');

// Get all slides for a course
exports.getSlidesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const slides = await Slide.find({ courseId }).sort('order');
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slides', error: error.message });
  }
};

// Create a new slide
exports.createSlide = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, resourceLinks, order } = req.body;

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify the user is the teacher of this course
    if (req.user._id.toString() !== course.teacherId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add slides to this course' });
    }

    // Find the highest order value if not provided
    let slideOrder = order;
    if (!slideOrder) {
      const lastSlide = await Slide.findOne({ courseId }).sort('-order');
      slideOrder = lastSlide ? lastSlide.order + 1 : 1;
    }

    const slide = new Slide({
      courseId,
      title,
      description,
      resourceLinks: resourceLinks || [],
      order: slideOrder
    });

    await slide.save();
    
    res.status(201).json({ message: 'Slide created successfully', slide });
  } catch (error) {
    res.status(500).json({ message: 'Error creating slide', error: error.message });
  }
};

// Update a slide
exports.updateSlide = async (req, res) => {
  try {
    const { slideId } = req.params;
    const { title, description, resourceLinks, order } = req.body;

    // Find the slide
    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    // Verify the user is authorized to update this slide
    const course = await Course.findById(slide.courseId);
    if (req.user._id.toString() !== course.teacherId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this slide' });
    }

    // Update slide fields
    if (title) slide.title = title;
    if (description) slide.description = description;
    if (resourceLinks) slide.resourceLinks = resourceLinks;
    if (order) slide.order = order;

    await slide.save();
    
    res.status(200).json({ message: 'Slide updated successfully', slide });
  } catch (error) {
    res.status(500).json({ message: 'Error updating slide', error: error.message });
  }
};

// Delete a slide
exports.deleteSlide = async (req, res) => {
  try {
    const { slideId } = req.params;

    // Find the slide
    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    // Verify the user is authorized to delete this slide
    const course = await Course.findById(slide.courseId);
    if (req.user._id.toString() !== course.teacherId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this slide' });
    }

    await slide.deleteOne();
    
    // Reorder remaining slides
    const remainingSlides = await Slide.find({ courseId: slide.courseId }).sort('order');
    for (let i = 0; i < remainingSlides.length; i++) {
      remainingSlides[i].order = i + 1;
      await remainingSlides[i].save();
    }
    
    res.status(200).json({ message: 'Slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting slide', error: error.message });
  }
};

// Reorder slides
exports.reorderSlides = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { slideOrders } = req.body; // Array of {slideId, order}

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify the user is authorized
    if (req.user._id.toString() !== course.teacherId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to reorder slides' });
    }

    // Update order for each slide
    for (const item of slideOrders) {
      await Slide.findByIdAndUpdate(item.slideId, { order: item.order });
    }

    res.status(200).json({ message: 'Slides reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reordering slides', error: error.message });
  }
}; 