const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Level = require('../models/Level.js');

dotenv.config();

const defaultLevels = [
  {
    name: "JavaScript Basics",
    difficulty: "Easy",
    topic: "JavaScript fundamentals",
    description: "Learn the basics of JavaScript programming",
    requiredLevel: 1,
    order: 1
  },
  {
    name: "HTML & CSS Masters",
    difficulty: "Easy",
    topic: "HTML and CSS",
    description: "Master the fundamentals of web structure and styling",
    requiredLevel: 1,
    order: 2
  },
  {
    name: "React Elements",
    difficulty: "Medium",
    topic: "React Components and JSX",
    description: "Understanding React components and JSX syntax",
    requiredLevel: 2,
    order: 3
  },
  {
    name: "State Management",
    difficulty: "Medium",
    topic: "React State and Hooks",
    description: "Learn about React state management and hooks",
    requiredLevel: 2,
    order: 4
  },
  {
    name: "API Integration",
    difficulty: "Hard",
    topic: "REST APIs and Async JavaScript",
    description: "Working with APIs and asynchronous JavaScript",
    requiredLevel: 3,
    order: 5
  },
  {
    name: "Advanced Hooks",
    difficulty: "Hard",
    topic: "Advanced React Hooks",
    description: "Master advanced React hooks and patterns",
    requiredLevel: 3,
    order: 6
  }
];

const initLevels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing levels
    await Level.deleteMany({});
    console.log('Cleared existing levels');

    // Insert new levels
    await Level.insertMany(defaultLevels);
    console.log('Default levels created successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error initializing levels:', error);
  }
};

initLevels();
