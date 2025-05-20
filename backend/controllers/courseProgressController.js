const CourseProgress = require('../models/CourseProgress');
const Slide = require('../models/Slide');

// Track a slide as viewed
exports.markSlideViewed = async (req, res) => {
  try {
    const { courseId, slideId } = req.body;
    const userId = req.user._id;

    // Find or create progress record
    let progress = await CourseProgress.findOne({ userId, courseId });
    
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        slidesViewed: [slideId]
      });
    } else if (!progress.slidesViewed.includes(slideId)) {
      // Only add the slide if it's not already marked as viewed
      progress.slidesViewed.push(slideId);
    }
    
    // Update last viewed timestamp
    progress.lastViewedAt = new Date();
    
    await progress.save();
    
    res.status(200).json({ 
      message: 'Progress updated successfully',
      slidesViewed: progress.slidesViewed 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

// Get course progress for a student
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    
    // Get total slides for the course
    const totalSlides = await Slide.countDocuments({ courseId });
    
    // Get user's progress
    const progress = await CourseProgress.findOne({ userId, courseId });
    
    if (!progress) {
      return res.status(200).json({ 
        progress: 0,
        viewedCount: 0,
        totalSlides,
        slidesViewed: []
      });
    }
    
    const viewedCount = progress.slidesViewed.length;
    const progressPercentage = totalSlides > 0 ? Math.round((viewedCount / totalSlides) * 100) : 0;
    
    res.status(200).json({
      progress: progressPercentage,
      viewedCount,
      totalSlides,
      slidesViewed: progress.slidesViewed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};

// Get progress for all enrolled courses
exports.getAllCoursesProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all progress records for the user
    const progressRecords = await CourseProgress.find({ userId });
    
    // Create a map of courseId -> progress record for easier lookup
    const progressMap = {};
    progressRecords.forEach(record => {
      progressMap[record.courseId.toString()] = record;
    });
    
    // Get all courses and their slide counts
    const courseSlideCounts = await Slide.aggregate([
      { $group: { _id: "$courseId", totalSlides: { $sum: 1 } } }
    ]);
    
    // Create a map of courseId -> total slides for easier lookup
    const slidesCountMap = {};
    courseSlideCounts.forEach(item => {
      slidesCountMap[item._id.toString()] = item.totalSlides;
    });
    
    // Calculate progress for each course
    const progressData = [];
    for (const courseId in slidesCountMap) {
      const totalSlides = slidesCountMap[courseId];
      const progress = progressMap[courseId];
      
      const viewedCount = progress ? progress.slidesViewed.length : 0;
      const progressPercentage = totalSlides > 0 ? Math.round((viewedCount / totalSlides) * 100) : 0;
      
      progressData.push({
        courseId,
        progress: progressPercentage,
        viewedCount,
        totalSlides,
        lastViewedAt: progress ? progress.lastViewedAt : null
      });
    }
    
    res.status(200).json(progressData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course progress', error: error.message });
  }
}; 