const Level = require('../models/Level.js');
const Question = require('../models/Question.js');
const UserProgress = require('../models/UserProgress.js');
const { generateQuestion, generateQuestionSet } = require('../services/openai.js');

exports.getLevels = async (req, res) => {
  try {
    let userProgress = await UserProgress.findOne({ userId: req.user._id });
    
    // Handle case when userProgress doesn't exist yet
    if (!userProgress) {
      userProgress = {
        level: 1,
        completedLevels: []
      };
    }
    
    const levels = await Level.find().sort('order');

    const levelsWithProgress = levels.map(level => {
      const completedLevel = userProgress.completedLevels.find(
        cl => cl.levelId && cl.levelId.toString() === level._id.toString()
      );

      return {
        ...level.toObject(),
        unlocked: userProgress.level >= level.requiredLevel,
        completed: !!completedLevel,
        stars: completedLevel ? completedLevel.stars : 0
      };
    });

    res.json(levelsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { levelId } = req.params;
    const level = await Level.findById(levelId);
    
    // Check if we need to generate new questions
    let questions = await Question.find({ levelId });
    
    if (questions.length < 5) {
      const generatedQuestions = await generateQuestionSet(level.topic, level.difficulty);
      
      // Save generated questions
      const savedQuestions = await Question.insertMany(
        generatedQuestions.questions.map(q => ({
          ...q,
          levelId,
          difficulty: level.difficulty,
          topic: level.topic
        }))
      );
      
      questions = savedQuestions;
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitLevelResult = async (req, res) => {
  try {
    const { levelId, score, timeBonus } = req.body;
    const totalScore = score + timeBonus;
    
    // Calculate stars based on score percentage
    const level = await Level.findById(levelId);
    const questions = await Question.find({ levelId });
    const maxPossibleScore = questions.length * (100 + 30); // 100 points + max 30 seconds bonus per question
    const percentage = (totalScore / maxPossibleScore) * 100;
    
    let stars = 0;
    if (percentage >= 80) stars = 3;
    else if (percentage >= 60) stars = 2;
    else if (percentage >= 40) stars = 1;

    // Update user progress
    let userProgress = await UserProgress.findOne({ userId: req.user._id });
    
    // Create a new UserProgress record if none exists
    if (!userProgress) {
      userProgress = new UserProgress({
        userId: req.user._id,
        level: 1,
        totalPoints: 0,
        completedLevels: []
      });
    }
    
    const levelIndex = userProgress.completedLevels.findIndex(
      cl => cl.levelId && cl.levelId.toString() === levelId
    );

    if (levelIndex === -1) {
      userProgress.completedLevels.push({
        levelId,
        stars,
        highScore: totalScore,
        completedAt: new Date()
      });
    } else {
      // Update only if new score is higher
      if (totalScore > userProgress.completedLevels[levelIndex].highScore) {
        userProgress.completedLevels[levelIndex].highScore = totalScore;
        userProgress.completedLevels[levelIndex].stars = stars;
      }
    }

    // Update total points and level
    userProgress.totalPoints += totalScore;
    userProgress.level = Math.floor(userProgress.totalPoints / 1000) + 1;

    await userProgress.save();

    res.json({
      stars,
      totalScore,
      newLevel: userProgress.level,
      totalPoints: userProgress.totalPoints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
