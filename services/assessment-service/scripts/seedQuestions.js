require('dotenv').config({ path: '../.env' }); // Adjust path if .env is in root or service dir
const mongoose = require('mongoose');
const Question = require('../models/Question');

const MONGODB_URI = process.env.MONGODB_URI;

// --- Sample Question Data ---
// IMPORTANT: Replace with real, well-defined questions, options, and rules
const sampleQuestions = [
  {
    questionId: 'personal_age',
    text: 'What is your age?',
    label: 'Age',
    type: 'number',
    section: 'personal',
    order: 1,
    validation: { min: 16, max: 120, required: true },
    rules: [
        // Example Rule: If age < 25, prioritize asking about youth mobility
        { condition: 'answer < 25', action: 'prioritize', questions: ['pref_youth_mobility'] }
    ],
    helpText: 'Your age is a key factor in many points-based immigration systems.'
  },
  {
    questionId: 'personal_marital_status',
    text: 'What is your current marital status?',
    label: 'Marital Status',
    type: 'single_choice',
    section: 'personal',
    order: 2,
    options: [
      { value: 'single', label: 'Single / Never Married' },
      { value: 'married', label: 'Married' },
      { value: 'common_law', label: 'Common-Law Partnership' },
      { value: 'separated', label: 'Separated' },
      { value: 'divorced', label: 'Divorced' },
      { value: 'widowed', label: 'Widowed' }
    ],
    validation: { required: true },
    rules: [
        // Example Rule: If married or common-law, add questions about partner
        { condition: 'answer === "married" || answer === "common_law"', action: 'add', questions: ['partner_details_start'] }
    ],
    helpText: 'This affects eligibility for family sponsorship and points calculations.'
  },
  {
    questionId: 'goals_reason',
    text: 'What is your primary reason for considering immigration?',
    label: 'Primary Reason',
    type: 'single_choice',
    section: 'goals',
    order: 3,
    options: [
        { value: 'work', label: 'Career Opportunities / Work' },
        { value: 'study', label: 'Education / Study' },
        { value: 'family', label: 'Joining Family' },
        { value: 'investment', label: 'Business / Investment' },
        { value: 'lifestyle', label: 'Lifestyle Change / Quality of Life' },
        { value: 'humanitarian', label: 'Seeking Asylum / Humanitarian Reasons'},
        { value: 'other', label: 'Other'}
    ],
    validation: { required: true },
    rules: [
        // Example Rules: Add specific sections based on reason
        { condition: 'answer === "study"', action: 'add', questions: ['education_study_field'] },
        { condition: 'answer === "work"', action: 'add', questions: ['work_experience_years'] },
        { condition: 'answer === "family"', action: 'add', questions: ['family_sponsor_details'] },
        { condition: 'answer === "investment"', action: 'add', questions: ['financial_investment_capacity'] }
    ]
  },
   {
    questionId: 'education_highest_level',
    text: 'What is your highest level of completed education?',
    label: 'Highest Education',
    type: 'single_choice',
    section: 'education', // This section might be added dynamically by rules
    order: 10, // Example order
    options: [
      { value: 'none', label: 'None' },
      { value: 'high_school', label: 'High School / Secondary' },
      { value: 'vocational', label: 'Vocational/Trade Certificate/Diploma' },
      { value: 'bachelors', label: 'Bachelor\'s Degree' },
      { value: 'masters', label: 'Master\'s Degree' },
      { value: 'doctorate', label: 'Doctorate (PhD)' }
    ],
    validation: { required: true },
    baseRelevance: 4 // Slightly less relevant initially than age/reason
  },
  // Add more questions for different sections and types...
];

const seedDatabase = async () => {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not defined. Cannot seed database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding Questions...');

    // Optional: Clear existing questions
    // console.log('Deleting existing questions...');
    // await Question.deleteMany({});

    // Insert/Update sample questions using questionId as the unique key
    console.log('Upserting sample questions...');
    let count = 0;
    for (const questionData of sampleQuestions) {
        const result = await Question.updateOne(
            { questionId: questionData.questionId },
            { $set: questionData },
            { upsert: true } // Create if not exists, update if exists
        );
        if (result.upsertedCount > 0) {
            console.log(`Inserted: ${questionData.questionId}`);
            count++;
        } else if (result.modifiedCount > 0) {
            console.log(`Updated: ${questionData.questionId}`);
        } else {
             console.log(`Exists: ${questionData.questionId}`);
        }
    }

    console.log(`Database seeding complete. ${count} new questions inserted/updated.`);
  } catch (error) {
    console.error('Error seeding questions database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

// Run the seeding function
seedDatabase();
