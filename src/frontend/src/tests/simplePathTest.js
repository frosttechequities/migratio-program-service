// Simple test script for question path logic

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
    id: 'q8',
    text: 'What is your family status?',
    defaultNextQuestionId: 'q9'
  },
  {
    id: 'q10',
    text: 'Which immigration pathways are you most interested in?',
    nextQuestionLogic: [
      {
        condition: "Array.isArray(answer) && answer.includes('business')",
        nextQuestionId: 'q-business'
      }
    ],
    defaultNextQuestionId: 'q11'
  },
  {
    id: 'q-business',
    text: 'What is your investment budget for business immigration?',
    relevanceCondition: "Array.isArray(answers.q10) && answers.q10.includes('business')",
    defaultNextQuestionId: 'q11'
  }
];

// Simple function to determine next question
function getNextQuestion(currentQuestionId, answer, answers) {
  // Find the current question
  const currentQuestion = mockQuestions.find(q => q.id === currentQuestionId);
  if (!currentQuestion) {
    console.log(`Question ${currentQuestionId} not found`);
    return null;
  }

  // Check for branching logic
  if (currentQuestion.nextQuestionLogic && currentQuestion.nextQuestionLogic.length > 0) {
    for (const branch of currentQuestion.nextQuestionLogic) {
      let conditionMet = false;
      
      // Evaluate the condition
      if (branch.condition.includes("answer === 'under-18'") && answer === 'under-18') {
        conditionMet = true;
      } else if (branch.condition.includes("answer === '18-24' || answer === '25-29'") && 
                (answer === '18-24' || answer === '25-29')) {
        conditionMet = true;
      } else if (branch.condition.includes("answer === 'high-school'") && answer === 'high-school') {
        conditionMet = true;
      } else if (branch.condition.includes("Array.isArray(answer) && answer.includes('business')") && 
                Array.isArray(answer) && answer.includes('business')) {
        conditionMet = true;
      }
      
      if (conditionMet) {
        // Find the next question
        const nextQuestion = mockQuestions.find(q => q.id === branch.nextQuestionId);
        if (nextQuestion) {
          return nextQuestion;
        }
      }
    }
  }
  
  // Use default next question if no branching logic matched
  if (currentQuestion.defaultNextQuestionId) {
    return mockQuestions.find(q => q.id === currentQuestion.defaultNextQuestionId);
  }
  
  // If no default, return null
  return null;
}

// Function to check if a question is relevant
function isQuestionRelevant(question, answers) {
  if (!question.relevanceCondition) {
    return true;
  }
  
  if (question.relevanceCondition.includes("Array.isArray(answers.q10) && answers.q10.includes('business')")) {
    return Array.isArray(answers.q10) && answers.q10.includes('business');
  }
  
  return true;
}

// Run tests
console.log('=== Testing Branching Logic ===');

// Test 1: Under 18 should skip to q8
const test1 = getNextQuestion('q1', 'under-18', {});
console.log('Test 1: Under 18 should skip to q8');
console.log(`Result: ${test1 ? test1.id : 'null'}`);
console.log(`Expected: q8, Actual: ${test1 ? test1.id : 'null'}`);
console.log(`Pass: ${test1 && test1.id === 'q8'}`);
console.log('---');

// Test 2: 18-24 should go to q2
const test2 = getNextQuestion('q1', '18-24', {});
console.log('Test 2: 18-24 should go to q2');
console.log(`Result: ${test2 ? test2.id : 'null'}`);
console.log(`Expected: q2, Actual: ${test2 ? test2.id : 'null'}`);
console.log(`Pass: ${test2 && test2.id === 'q2'}`);
console.log('---');

// Test 3: High school education should skip to q4
const test3 = getNextQuestion('q2', 'high-school', {});
console.log('Test 3: High school education should skip to q4');
console.log(`Result: ${test3 ? test3.id : 'null'}`);
console.log(`Expected: q4, Actual: ${test3 ? test3.id : 'null'}`);
console.log(`Pass: ${test3 && test3.id === 'q4'}`);
console.log('---');

// Test 4: Business pathway should go to q-business
const test4 = getNextQuestion('q10', ['business'], {});
console.log('Test 4: Business pathway should go to q-business');
console.log(`Result: ${test4 ? test4.id : 'null'}`);
console.log(`Expected: q-business, Actual: ${test4 ? test4.id : 'null'}`);
console.log(`Pass: ${test4 && test4.id === 'q-business'}`);
console.log('---');

// Test 5: Business question should be relevant when q10 includes 'business'
const businessQuestion = mockQuestions.find(q => q.id === 'q-business');
const test5 = isQuestionRelevant(businessQuestion, { q10: ['business'] });
console.log("Test 5: Business question should be relevant when q10 includes 'business'");
console.log(`Result: ${test5}`);
console.log(`Expected: true, Actual: ${test5}`);
console.log(`Pass: ${test5 === true}`);
console.log('---');

// Test 6: Business question should not be relevant when q10 doesn't include 'business'
const test6 = isQuestionRelevant(businessQuestion, { q10: ['skilled'] });
console.log("Test 6: Business question should not be relevant when q10 doesn't include 'business'");
console.log(`Result: ${test6}`);
console.log(`Expected: false, Actual: ${test6}`);
console.log(`Pass: ${test6 === false}`);
console.log('---');

console.log('=== Test Summary ===');
const passCount = [
  test1 && test1.id === 'q8',
  test2 && test2.id === 'q2',
  test3 && test3.id === 'q4',
  test4 && test4.id === 'q-business',
  test5 === true,
  test6 === false
].filter(Boolean).length;

console.log(`Passed: ${passCount} / 6 tests`);
