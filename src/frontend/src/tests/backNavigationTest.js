// Test script for back navigation functionality

// Mock questions
const mockQuestions = [
  { id: 'q1', text: 'Question 1' },
  { id: 'q2', text: 'Question 2' },
  { id: 'q3', text: 'Question 3' },
  { id: 'q4', text: 'Question 4' },
  { id: 'q5', text: 'Question 5' }
];

// Mock state
let currentState = {
  currentQuestion: mockQuestions[0],
  currentQuestionIndex: 0,
  questionHistory: [],
  answerHistory: {}
};

// Mock functions
function handleAnswerSubmit(answer) {
  // Add current question to history
  currentState.questionHistory.push(currentState.currentQuestion);
  
  // Save the current answer in history
  currentState.answerHistory[currentState.currentQuestion.id] = answer;
  
  // Move to next question
  const nextIndex = currentState.currentQuestionIndex + 1;
  if (nextIndex < mockQuestions.length) {
    currentState.currentQuestion = mockQuestions[nextIndex];
    currentState.currentQuestionIndex = nextIndex;
    return true;
  }
  return false;
}

function handleGoBack() {
  if (currentState.questionHistory.length === 0) {
    console.log('No question history to go back to');
    return false;
  }
  
  // Get the previous question from history
  const prevQuestion = currentState.questionHistory[currentState.questionHistory.length - 1];
  
  // Update the current question
  currentState.currentQuestion = prevQuestion;
  currentState.currentQuestionIndex--;
  
  // Remove the last question from history
  currentState.questionHistory.pop();
  
  return true;
}

// Run tests
console.log('=== Testing Back Navigation ===');

// Test 1: Initial state
console.log('Test 1: Initial state');
console.log(`Current question: ${currentState.currentQuestion.id}`);
console.log(`Current index: ${currentState.currentQuestionIndex}`);
console.log(`History length: ${currentState.questionHistory.length}`);
console.log(`Expected: q1, 0, 0`);
console.log(`Pass: ${
  currentState.currentQuestion.id === 'q1' && 
  currentState.currentQuestionIndex === 0 && 
  currentState.questionHistory.length === 0
}`);
console.log('---');

// Test 2: Submit answer and move to next question
console.log('Test 2: Submit answer and move to next question');
handleAnswerSubmit('answer1');
console.log(`Current question: ${currentState.currentQuestion.id}`);
console.log(`Current index: ${currentState.currentQuestionIndex}`);
console.log(`History length: ${currentState.questionHistory.length}`);
console.log(`Answer for q1: ${currentState.answerHistory.q1}`);
console.log(`Expected: q2, 1, 1, answer1`);
console.log(`Pass: ${
  currentState.currentQuestion.id === 'q2' && 
  currentState.currentQuestionIndex === 1 && 
  currentState.questionHistory.length === 1 &&
  currentState.answerHistory.q1 === 'answer1'
}`);
console.log('---');

// Test 3: Submit another answer
console.log('Test 3: Submit another answer');
handleAnswerSubmit('answer2');
console.log(`Current question: ${currentState.currentQuestion.id}`);
console.log(`Current index: ${currentState.currentQuestionIndex}`);
console.log(`History length: ${currentState.questionHistory.length}`);
console.log(`Answer for q2: ${currentState.answerHistory.q2}`);
console.log(`Expected: q3, 2, 2, answer2`);
console.log(`Pass: ${
  currentState.currentQuestion.id === 'q3' && 
  currentState.currentQuestionIndex === 2 && 
  currentState.questionHistory.length === 2 &&
  currentState.answerHistory.q2 === 'answer2'
}`);
console.log('---');

// Test 4: Go back to previous question
console.log('Test 4: Go back to previous question');
handleGoBack();
console.log(`Current question: ${currentState.currentQuestion.id}`);
console.log(`Current index: ${currentState.currentQuestionIndex}`);
console.log(`History length: ${currentState.questionHistory.length}`);
console.log(`Expected: q2, 1, 1`);
console.log(`Pass: ${
  currentState.currentQuestion.id === 'q2' && 
  currentState.currentQuestionIndex === 1 && 
  currentState.questionHistory.length === 1
}`);
console.log('---');

// Test 5: Go back again to first question
console.log('Test 5: Go back again to first question');
handleGoBack();
console.log(`Current question: ${currentState.currentQuestion.id}`);
console.log(`Current index: ${currentState.currentQuestionIndex}`);
console.log(`History length: ${currentState.questionHistory.length}`);
console.log(`Expected: q1, 0, 0`);
console.log(`Pass: ${
  currentState.currentQuestion.id === 'q1' && 
  currentState.currentQuestionIndex === 0 && 
  currentState.questionHistory.length === 0
}`);
console.log('---');

// Test 6: Try to go back when at the first question
console.log('Test 6: Try to go back when at the first question');
const result = handleGoBack();
console.log(`Go back result: ${result}`);
console.log(`Current question: ${currentState.currentQuestion.id}`);
console.log(`Current index: ${currentState.currentQuestionIndex}`);
console.log(`Expected: false, q1, 0`);
console.log(`Pass: ${
  result === false && 
  currentState.currentQuestion.id === 'q1' && 
  currentState.currentQuestionIndex === 0
}`);
console.log('---');

// Test 7: Move forward again and check answer history
console.log('Test 7: Move forward again and check answer history');
handleAnswerSubmit('new_answer1');
console.log(`Current question: ${currentState.currentQuestion.id}`);
console.log(`Answer for q1: ${currentState.answerHistory.q1}`);
console.log(`Expected: q2, new_answer1`);
console.log(`Pass: ${
  currentState.currentQuestion.id === 'q2' && 
  currentState.answerHistory.q1 === 'new_answer1'
}`);
console.log('---');

console.log('=== Test Summary ===');
const passCount = [
  currentState.currentQuestion.id === 'q2' && 
  currentState.answerHistory.q1 === 'new_answer1'
].filter(Boolean).length;

console.log(`All tests completed. Check results above for any failures.`);
