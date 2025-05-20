const axios = require('axios');

const QUESTION_GENERATION_PROMPT = `Generate a multiple-choice question about {topic} at a {difficulty} level. 
The question should test understanding rather than just memorization.
Format:
{
  "question": "The question text",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": 0-3,
  "explanation": "Detailed explanation of why this answer is correct"
}

Requirements:
1. Question should be clear and unambiguous
2. All options should be plausible
3. Only one option should be correct
4. Explanation should be educational and thorough
5. Difficulty levels:
   - Easy: Basic concepts and fundamentals
   - Medium: Application of concepts
   - Hard: Complex scenarios and edge cases`;

const QUESTION_SET_PROMPT = `Generate a set of 5 multiple-choice questions about {topic} at {difficulty} level.
Each question should follow this format:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0-3,
      "explanation": "Detailed explanation"
    }
  ]
}

Ensure:
1. Questions progress in complexity
2. Cover different aspects of the topic
3. Include both theoretical and practical questions
4. Maintain consistent difficulty level
5. Provide thorough explanations`;

exports.generateQuestion = async (topic, difficulty) => {
  try {
    const prompt = QUESTION_GENERATION_PROMPT
      .replace('{topic}', topic)
      .replace('{difficulty}', difficulty);

    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: "You are an expert computer science educator specializing in creating engaging and educational programming questions."
          },
          { role: "user", content: prompt }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices[0].message.content.trim();
    return JSON.parse(aiText);
  } catch (error) {
    console.error('Error generating question:', error?.response?.data || error.message);
    throw error;
  }
};

exports.generateQuestionSet = async (topic, difficulty) => {
  try {
    const prompt = QUESTION_SET_PROMPT
      .replace('{topic}', topic)
      .replace('{difficulty}', difficulty);

    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: "You are an expert computer science educator specializing in creating engaging and educational programming questions."
          },
          { role: "user", content: prompt }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices[0].message.content.trim();
    return JSON.parse(aiText);
  } catch (error) {
    console.error('Error generating question set:', error?.response?.data || error.message);
    throw error;
  }
};
