const axios = require("axios");
const Quiz = require("../models/Quiz");
const StudentResponse = require("../models/StudentResponse");

// 1. Create Quiz
const createQuiz = async (req, res) => {
  const { topic, content, courseId } = req.body;
  const teacherId = req.user.id;

  try {
    const prompt = `
Generate ONE multiple choice question based on the content below.
Include 4 options (A-D), and clearly mark the correct answer.

Content:
"${content}"

Return only JSON in this format:
{
  "question": "Your question?",
  "options": ["A. Option1", "B. Option2", "C. Option3", "D. Option4"],
  "answer": "B. Correct Answer"
}
    `;

    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      console.error("Invalid AI JSON:", aiText);
      return res.status(500).json({ message: "AI response was not valid JSON." });
    }

    const questions = [
      {
        question: parsed.question,
        options: parsed.options,
        correctAnswer: parsed.answer,
      },
    ];

    const newQuiz = new Quiz({
      topic,
      courseId,
      createdBy: teacherId,
      questions,
      summary: content.slice(0, 100) + "...",
    });

    await newQuiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Quiz generation error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate quiz" });
  }
};

// 2. View quizzes by course
const getQuizzesByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const quizzes = await Quiz.find({ courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};

// 3. Submit quiz response
const submitQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body; // answers = [userAnswer]
  const studentId = req.user.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    if (answers[0] === quiz.questions[0].correctAnswer) {
      score = 1;
    }

    const response = new StudentResponse({
      studentId,
      quizId,
      answers,
      score,
    });

    await response.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      total: 1,
      summary: quiz.summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Submission failed" });
  }
};

module.exports = {
  createQuiz,
  getQuizzesByCourse,
  submitQuiz,
};

