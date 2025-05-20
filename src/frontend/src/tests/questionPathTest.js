// Test script for question path service
// Create a simplified version of the questionPathService for testing
const questionPathService = {
  determineNextQuestion: (currentQuestionId, answer, answers, questions) => {
    // Find the current question
    const currentQuestion = questions.find(q => q.id === currentQuestionId);
    if (!currentQuestion) {
      return null;
    }

    // Check if the question has branching logic
    if (currentQuestion.nextQuestionLogic && currentQuestion.nextQuestionLogic.length > 0) {
      // Evaluate each condition in the branching logic
      for (const branch of currentQuestion.nextQuestionLogic) {
        if (evaluateCondition(branch.condition, answer, answers, {})) {
          // Find the next question by ID
          const nextQuestion = questions.find(q => q.id === branch.nextQuestionId);
          if (nextQuestion) {
            // Check if the next question is relevant
            if (isQuestionRelevant(nextQuestion, answers, {})) {
              return nextQuestion;
            }
          }
        }
      }
    }

    // If no branching logic or no conditions matched, use default next question
    if (currentQuestion.defaultNextQuestionId) {
      return questions.find(q => q.id === currentQuestion.defaultNextQuestionId);
    }

    // If no specific next question is defined, find the next question by index
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex >= 0 && currentIndex < questions.length - 1) {
      return questions[currentIndex + 1];
    }

    return null;
  },

  isQuestionRelevant: (question, answers, userProfile) => {
    return isQuestionRelevant(question, answers, userProfile);
  },

  calculateProgress: (answers, questions) => {
    if (!questions || questions.length === 0) return 0;

    // Count answered questions
    const answeredCount = Object.keys(answers).length;

    // Count total relevant questions
    const relevantQuestions = questions.filter(q =>
      isQuestionRelevant(q, answers, {})
    );

    // Calculate progress percentage
    return Math.round((answeredCount / relevantQuestions.length) * 100);
  }
};

// Helper functions
function evaluateCondition(condition, answer, answers, userProfile) {
  if (!condition) return true;

  try {
    // For simple conditions, use direct comparison
    if (typeof condition === 'string') {
      // Handle common condition patterns
      if (condition.includes('===')) {
        const [left, right] = condition.split('===').map(s => s.trim());
        if (left === 'answer') {
          return answer === right.replace(/['"]/g, '');
        }
      } else if (condition.includes('!==')) {
        const [left, right] = condition.split('!==').map(s => s.trim());
        if (left === 'answer') {
          return answer !== right.replace(/['"]/g, '');
        }
      } else if (condition.includes('includes')) {
        // Handle array inclusion checks
        if (condition.includes('answer.includes') && Array.isArray(answer)) {
          const match = condition.match(/['"](.+?)['"]/);
          if (match) {
            return answer.includes(match[1]);
          }
        } else if (condition.includes('answers.') && condition.includes('.includes')) {
          const answerKey = condition.match(/answers\.(\w+)/)[1];
          const valueMatch = condition.match(/['"](.+?)['"]/);
          if (answerKey && valueMatch && Array.isArray(answers[answerKey])) {
            return answers[answerKey].includes(valueMatch[1]);
          }
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error evaluating condition:', error);
    return false;
  }
}

function isQuestionRelevant(question, answers, userProfile) {
  if (!question) return false;
  if (!question.relevanceCondition) return true;

  return evaluateCondition(question.relevanceCondition, null, answers, userProfile);
}

// Mock questions with branching logic
const mockQuestions = [
  {
    id: 'q1',
    text: 'What is your age range?',
    nextQuestionLogic: [
      {
        condition: "answer === 'under-18'",
        nextQuestionId: 'q8'
      },
      {
        condition: "answer === '18-24' || answer === '25-29'",
        nextQuestionId: 'q2'
      }
    ],
    defaultNextQuestionId: 'q2'
  },
  {
    id: 'q2',
    text: 'What is your highest level of education?',
    nextQuestionLogic: [
      {
        condition: "answer === 'high-school'",
        nextQuestionId: 'q4'
      }
    ],
    defaultNextQuestionId: 'q3'
  },
  {
    id: 'q3',
    text: 'How many years of work experience do you have?',
    defaultNextQuestionId: 'q4'
  },
  {
    id: 'q4',
    text: 'What is your current occupation?',
    defaultNextQuestionId: 'q5'
  },
  {
    id: 'q5',
    text: 'What is your language proficiency?',
    defaultNextQuestionId: 'q6'
  },
  {
    id: 'q6',
    text: 'What is your timeline for immigration?',
    defaultNextQuestionId: 'q7'
  },
  {
    id: 'q7',
    text: 'What is your budget for immigration?',
    defaultNextQuestionId: 'q8'
  },
  {
    id: 'q8',
    text: 'What is your family status?',
    defaultNextQuestionId: 'q9'
  },
  {
    id: 'q9',
    text: 'Do you have any previous immigration experience?',
    defaultNextQuestionId: 'q10'
  },
  {
    id: 'q10',
    text: 'Which immigration pathways are you most interested in?',
    nextQuestionLogic: [
      {
        condition: "Array.isArray(answer) && answer.includes('business')",
        nextQuestionId: 'q-business'
      },
      {
        condition: "Array.isArray(answer) && answer.includes('study')",
        nextQuestionId: 'q-study'
      }
    ],
    defaultNextQuestionId: 'q11'
  },
  {
    id: 'q-business',
    text: 'What is your investment budget for business immigration?',
    relevanceCondition: "Array.isArray(answers.q10) && answers.q10.includes('business')",
    defaultNextQuestionId: 'q11'
  },
  {
    id: 'q-study',
    text: 'What level of education are you interested in pursuing?',
    relevanceCondition: "Array.isArray(answers.q10) && answers.q10.includes('study')",
    defaultNextQuestionId: 'q11'
  },
  {
    id: 'q11',
    text: 'What specific challenges or concerns do you have about immigration?',
    defaultNextQuestionId: null
  }
];

// Test cases for branching logic
console.log('=== Testing Branching Logic ===');

// Test Case 1: Under 18 should skip to q8
console.log('Test Case 1: Under 18 should skip to q8');
const nextQuestion1 = questionPathService.determineNextQuestion('q1', 'under-18', {}, mockQuestions);
console.log(`Next question after q1 with answer 'under-18': ${nextQuestion1?.id}`);
console.log(`Expected: q8, Actual: ${nextQuestion1?.id}`);
console.log(`Result: ${nextQuestion1?.id === 'q8' ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test Case 2: 18-24 should go to q2
console.log('Test Case 2: 18-24 should go to q2');
const nextQuestion2 = questionPathService.determineNextQuestion('q1', '18-24', {}, mockQuestions);
console.log(`Next question after q1 with answer '18-24': ${nextQuestion2?.id}`);
console.log(`Expected: q2, Actual: ${nextQuestion2?.id}`);
console.log(`Result: ${nextQuestion2?.id === 'q2' ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test Case 3: High school education should skip to q4
console.log('Test Case 3: High school education should skip to q4');
const nextQuestion3 = questionPathService.determineNextQuestion('q2', 'high-school', {}, mockQuestions);
console.log(`Next question after q2 with answer 'high-school': ${nextQuestion3?.id}`);
console.log(`Expected: q4, Actual: ${nextQuestion3?.id}`);
console.log(`Result: ${nextQuestion3?.id === 'q4' ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test Case 4: Bachelor's degree should go to q3
console.log("Test Case 4: Bachelor's degree should go to q3");
const nextQuestion4 = questionPathService.determineNextQuestion('q2', 'bachelor', {}, mockQuestions);
console.log(`Next question after q2 with answer 'bachelor': ${nextQuestion4?.id}`);
console.log(`Expected: q3, Actual: ${nextQuestion4?.id}`);
console.log(`Result: ${nextQuestion4?.id === 'q3' ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test Case 5: Business pathway should go to q-business
console.log('Test Case 5: Business pathway should go to q-business');
const nextQuestion5 = questionPathService.determineNextQuestion('q10', ['business'], {}, mockQuestions);
console.log(`Next question after q10 with answer ['business']: ${nextQuestion5?.id}`);
console.log(`Expected: q-business, Actual: ${nextQuestion5?.id}`);
console.log(`Result: ${nextQuestion5?.id === 'q-business' ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test Case 6: Study pathway should go to q-study
console.log('Test Case 6: Study pathway should go to q-study');
const nextQuestion6 = questionPathService.determineNextQuestion('q10', ['study'], {}, mockQuestions);
console.log(`Next question after q10 with answer ['study']: ${nextQuestion6?.id}`);
console.log(`Expected: q-study, Actual: ${nextQuestion6?.id}`);
console.log(`Result: ${nextQuestion6?.id === 'q-study' ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test Case 7: Multiple pathways should follow first matching condition
console.log('Test Case 7: Multiple pathways should follow first matching condition');
const nextQuestion7 = questionPathService.determineNextQuestion('q10', ['business', 'study'], {}, mockQuestions);
console.log(`Next question after q10 with answer ['business', 'study']: ${nextQuestion7?.id}`);
console.log(`Expected: q-business, Actual: ${nextQuestion7?.id}`);
console.log(`Result: ${nextQuestion7?.id === 'q-business' ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test relevance conditions
console.log('=== Testing Relevance Conditions ===');

// Test Case 8: Business question should be relevant when q10 includes 'business'
console.log("Test Case 8: Business question should be relevant when q10 includes 'business'");
const businessQuestion = mockQuestions.find(q => q.id === 'q-business');
const isBusinessRelevant = questionPathService.isQuestionRelevant(
  businessQuestion,
  { q10: ['business'] },
  {}
);
console.log(`Is business question relevant: ${isBusinessRelevant}`);
console.log(`Expected: true, Actual: ${isBusinessRelevant}`);
console.log(`Result: ${isBusinessRelevant === true ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test Case 9: Business question should not be relevant when q10 doesn't include 'business'
console.log("Test Case 9: Business question should not be relevant when q10 doesn't include 'business'");
const isBusinessNotRelevant = questionPathService.isQuestionRelevant(
  businessQuestion,
  { q10: ['skilled'] },
  {}
);
console.log(`Is business question not relevant: ${!isBusinessNotRelevant}`);
console.log(`Expected: true, Actual: ${!isBusinessNotRelevant}`);
console.log(`Result: ${!isBusinessNotRelevant === true ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test progress calculation
console.log('=== Testing Progress Calculation ===');

// Test Case 10: Progress with no answers
console.log('Test Case 10: Progress with no answers');
const progress1 = questionPathService.calculateProgress({}, mockQuestions);
console.log(`Progress with no answers: ${progress1}%`);
console.log(`Expected: 0, Actual: ${progress1}`);
console.log(`Result: ${progress1 === 0 ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test Case 11: Progress with some answers
console.log('Test Case 11: Progress with some answers');
const progress2 = questionPathService.calculateProgress({ q1: 'under-18', q8: 'single' }, mockQuestions);
console.log(`Progress with 2 answers: ${progress2}%`);
console.log(`Expected: > 0, Actual: ${progress2}`);
console.log(`Result: ${progress2 > 0 ? 'PASS' : 'FAIL'}`);
console.log('---');

// Test Case 12: Progress with all answers
console.log('Test Case 12: Progress with all answers');
const allAnswers = {
  q1: 'under-18',
  q8: 'single',
  q9: 'none',
  q10: ['skilled'],
  q11: ['language']
};
const progress3 = questionPathService.calculateProgress(allAnswers, mockQuestions);
console.log(`Progress with all relevant answers: ${progress3}%`);
console.log(`Expected: 100, Actual: ${progress3}`);
console.log(`Result: ${progress3 === 100 ? 'PASS' : 'FAIL'}`);
console.log('---');

console.log('=== Test Summary ===');
console.log('All tests completed. Check results above for any failures.');
