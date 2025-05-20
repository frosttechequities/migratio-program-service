// Test script for progress calculation

// Mock questions
const mockQuestions = [
  { 
    id: 'q1', 
    text: 'Question 1',
    relevanceCondition: null
  },
  { 
    id: 'q2', 
    text: 'Question 2',
    relevanceCondition: null
  },
  { 
    id: 'q3', 
    text: 'Question 3',
    relevanceCondition: null
  },
  { 
    id: 'q4', 
    text: 'Question 4',
    relevanceCondition: "answers.q1 === 'option1'"
  },
  { 
    id: 'q5', 
    text: 'Question 5',
    relevanceCondition: "Array.isArray(answers.q3) && answers.q3.includes('business')"
  }
];

// Function to check if a question is relevant
function isQuestionRelevant(question, answers) {
  if (!question.relevanceCondition) {
    return true;
  }
  
  if (question.relevanceCondition.includes("answers.q1 === 'option1'")) {
    return answers.q1 === 'option1';
  }
  
  if (question.relevanceCondition.includes("Array.isArray(answers.q3) && answers.q3.includes('business')")) {
    return Array.isArray(answers.q3) && answers.q3.includes('business');
  }
  
  return true;
}

// Function to calculate progress
function calculateProgress(answers, questions) {
  if (!questions || questions.length === 0) return 0;
  
  // Count answered questions
  const answeredCount = Object.keys(answers).length;
  
  // Count total relevant questions
  const relevantQuestions = questions.filter(q => 
    isQuestionRelevant(q, answers)
  );
  
  // Calculate progress percentage
  return Math.round((answeredCount / relevantQuestions.length) * 100);
}

// Run tests
console.log('=== Testing Progress Calculation ===');

// Test 1: No answers
console.log('Test 1: No answers');
const progress1 = calculateProgress({}, mockQuestions);
console.log(`Progress with no answers: ${progress1}%`);
console.log(`Expected: 0%, Actual: ${progress1}%`);
console.log(`Pass: ${progress1 === 0}`);
console.log('---');

// Test 2: One answer, all questions relevant
console.log('Test 2: One answer, all questions relevant');
const progress2 = calculateProgress({ q1: 'option2' }, mockQuestions);
// Only q1, q2, q3 are relevant (q4 requires q1='option1', q5 requires q3=['business'])
const expectedProgress2 = Math.round((1 / 3) * 100);
console.log(`Progress with one answer: ${progress2}%`);
console.log(`Expected: ${expectedProgress2}%, Actual: ${progress2}%`);
console.log(`Pass: ${progress2 === expectedProgress2}`);
console.log('---');

// Test 3: One answer, making q4 relevant
console.log('Test 3: One answer, making q4 relevant');
const progress3 = calculateProgress({ q1: 'option1' }, mockQuestions);
// Now q1, q2, q3, q4 are relevant (q5 still requires q3=['business'])
const expectedProgress3 = Math.round((1 / 4) * 100);
console.log(`Progress with one answer making q4 relevant: ${progress3}%`);
console.log(`Expected: ${expectedProgress3}%, Actual: ${progress3}%`);
console.log(`Pass: ${progress3 === expectedProgress3}`);
console.log('---');

// Test 4: Multiple answers, making q5 relevant
console.log('Test 4: Multiple answers, making q5 relevant');
const progress4 = calculateProgress({ 
  q1: 'option1', 
  q2: 'answer2',
  q3: ['business', 'skilled']
}, mockQuestions);
// Now all questions are relevant
const expectedProgress4 = Math.round((3 / 5) * 100);
console.log(`Progress with multiple answers making all questions relevant: ${progress4}%`);
console.log(`Expected: ${expectedProgress4}%, Actual: ${progress4}%`);
console.log(`Pass: ${progress4 === expectedProgress4}`);
console.log('---');

// Test 5: All answers
console.log('Test 5: All answers');
const progress5 = calculateProgress({ 
  q1: 'option1', 
  q2: 'answer2',
  q3: ['business', 'skilled'],
  q4: 'answer4',
  q5: 'answer5'
}, mockQuestions);
const expectedProgress5 = 100;
console.log(`Progress with all answers: ${progress5}%`);
console.log(`Expected: ${expectedProgress5}%, Actual: ${progress5}%`);
console.log(`Pass: ${progress5 === expectedProgress5}`);
console.log('---');

console.log('=== Test Summary ===');
const passCount = [
  progress1 === 0,
  progress2 === expectedProgress2,
  progress3 === expectedProgress3,
  progress4 === expectedProgress4,
  progress5 === expectedProgress5
].filter(Boolean).length;

console.log(`Passed: ${passCount} / 5 tests`);
