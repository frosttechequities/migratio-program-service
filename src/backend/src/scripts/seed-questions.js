const mongoose = require('mongoose');
const { Question } = require('../models/question.model');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Load questions from JSON files in the data/questions directory
 */
function loadQuestionsFromFiles() {
  try {
    // Get all question files from the data/questions directory
    const questionsDir = path.join(__dirname, '../data/questions');
    const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json'));

    console.log(`Found ${files.length} question files`);

    let allQuestions = [];

    // Process each file
    for (const file of files) {
      const filePath = path.join(questionsDir, file);
      const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      console.log(`Processing ${file} with ${questions.length} questions`);
      allQuestions = allQuestions.concat(questions);
    }

    return allQuestions;
  } catch (error) {
    console.error('Error loading questions from files:', error);
    return [];
  }
}

// Load questions from JSON files
const questions = loadQuestionsFromFiles();

// If no questions were loaded, use a sample question as fallback
if (questions.length === 0) {
  console.warn('No questions loaded from files. Using sample question as fallback.');
  questions.push({
    questionId: 'personal_001',
    text: 'What is your date of birth?',
    helpText: 'Your age may affect eligibility for certain immigration programs.',
    section: 'personal',
    type: 'date',
    required: true,
    order: 1,
    relevanceScore: 10,
    isActive: true
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Clear existing questions
      await Question.deleteMany({});
      console.log('Cleared existing questions');

      // Insert new questions
      await Question.insertMany(questions);
      console.log(`Inserted ${questions.length} questions`);

      // Disconnect from MongoDB
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error seeding questions:', error);
      mongoose.disconnect();
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
