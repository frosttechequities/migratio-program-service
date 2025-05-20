// Test script for conditional questions

// Mock questions with conditional logic
const mockQuestions = [
  {
    id: 'q1',
    text: 'What is your age range?',
    relevanceCondition: null
  },
  {
    id: 'q2',
    text: 'Are you a student?',
    relevanceCondition: null
  },
  {
    id: 'q3',
    text: 'What is your field of study?',
    relevanceCondition: "answers.q2 === 'yes'"
  },
  {
    id: 'q4',
    text: 'What is your expected graduation date?',
    relevanceCondition: "answers.q2 === 'yes'"
  },
  {
    id: 'q5',
    text: 'What is your current occupation?',
    relevanceCondition: "answers.q2 === 'no'"
  },
  {
    id: 'q6',
    text: 'Do you have dependents?',
    relevanceCondition: null
  },
  {
    id: 'q7',
    text: 'How many dependents do you have?',
    relevanceCondition: "answers.q6 === 'yes'"
  },
  {
    id: 'q8',
    text: 'What are their ages?',
    relevanceCondition: "answers.q6 === 'yes' && answers.q7 && parseInt(answers.q7) > 0"
  }
];

// Function to check if a question is relevant
function isQuestionRelevant(question, answers) {
  if (!question.relevanceCondition) {
    return true;
  }

  // Check for the most specific conditions first
  if (question.id === 'q8') {
    // Special handling for q8 which requires q6='yes' AND q7 > 0
    return answers.q6 === 'yes' &&
           answers.q7 !== undefined &&
           !isNaN(parseInt(answers.q7)) &&
           parseInt(answers.q7) > 0;
  }

  if (question.id === 'q7') {
    // q7 is only relevant if q6='yes'
    return answers.q6 === 'yes';
  }

  if (question.id === 'q3' || question.id === 'q4') {
    // Student-related questions
    return answers.q2 === 'yes';
  }

  if (question.id === 'q5') {
    // Occupation question
    return answers.q2 === 'no';
  }

  // All other questions are always relevant
  return true;
}

// Function to get all relevant questions
function getRelevantQuestions(answers) {
  return mockQuestions.filter(q => isQuestionRelevant(q, answers));
}

// Run tests
console.log('=== Testing Conditional Questions ===');

// Test 1: No answers, only unconditional questions should be relevant
console.log('Test 1: No answers, only unconditional questions should be relevant');
const relevantQuestions1 = getRelevantQuestions({});
console.log(`Relevant questions: ${relevantQuestions1.map(q => q.id).join(', ')}`);
const expectedIds1 = ['q1', 'q2', 'q6'];
console.log(`Expected: ${expectedIds1.join(', ')}`);
const pass1 = relevantQuestions1.length === expectedIds1.length &&
              relevantQuestions1.every(q => expectedIds1.includes(q.id));
console.log(`Pass: ${pass1}`);
console.log('---');

// Test 2: Student = yes, student-related questions should be relevant
console.log('Test 2: Student = yes, student-related questions should be relevant');
const relevantQuestions2 = getRelevantQuestions({ q2: 'yes' });
console.log(`Relevant questions: ${relevantQuestions2.map(q => q.id).join(', ')}`);
const expectedIds2 = ['q1', 'q2', 'q3', 'q4', 'q6'];
console.log(`Expected: ${expectedIds2.join(', ')}`);
const pass2 = relevantQuestions2.length === expectedIds2.length &&
              relevantQuestions2.every(q => expectedIds2.includes(q.id));
console.log(`Pass: ${pass2}`);
console.log('---');

// Test 3: Student = no, occupation question should be relevant
console.log('Test 3: Student = no, occupation question should be relevant');
const relevantQuestions3 = getRelevantQuestions({ q2: 'no' });
console.log(`Relevant questions: ${relevantQuestions3.map(q => q.id).join(', ')}`);
const expectedIds3 = ['q1', 'q2', 'q5', 'q6'];
console.log(`Expected: ${expectedIds3.join(', ')}`);
const pass3 = relevantQuestions3.length === expectedIds3.length &&
              relevantQuestions3.every(q => expectedIds3.includes(q.id));
console.log(`Pass: ${pass3}`);
console.log('---');

// Test 4: Dependents = yes, dependent questions should be relevant
console.log('Test 4: Dependents = yes, dependent questions should be relevant');
const relevantQuestions4 = getRelevantQuestions({ q6: 'yes' });
console.log(`Relevant questions: ${relevantQuestions4.map(q => q.id).join(', ')}`);
const expectedIds4 = ['q1', 'q2', 'q6', 'q7'];
console.log(`Expected: ${expectedIds4.join(', ')}`);
const pass4 = relevantQuestions4.length === expectedIds4.length &&
              relevantQuestions4.every(q => expectedIds4.includes(q.id));
console.log(`Pass: ${pass4}`);
console.log('---');

// Test 5: Dependents = yes, with count > 0, age question should be relevant
console.log('Test 5: Dependents = yes, with count > 0, age question should be relevant');
const relevantQuestions5 = getRelevantQuestions({ q6: 'yes', q7: '2' });
console.log(`Relevant questions: ${relevantQuestions5.map(q => q.id).join(', ')}`);
const expectedIds5 = ['q1', 'q2', 'q6', 'q7', 'q8'];
console.log(`Expected: ${expectedIds5.join(', ')}`);
const pass5 = relevantQuestions5.length === expectedIds5.length &&
              relevantQuestions5.every(q => expectedIds5.includes(q.id));
console.log(`Pass: ${pass5}`);
console.log('---');

// Test 6: Dependents = yes, with count = 0, age question should not be relevant
console.log('Test 6: Dependents = yes, with count = 0, age question should not be relevant');
const relevantQuestions6 = getRelevantQuestions({ q6: 'yes', q7: '0' });
console.log(`Relevant questions: ${relevantQuestions6.map(q => q.id).join(', ')}`);
const expectedIds6 = ['q1', 'q2', 'q6', 'q7'];
console.log(`Expected: ${expectedIds6.join(', ')}`);
const pass6 = relevantQuestions6.length === expectedIds6.length &&
              relevantQuestions6.every(q => expectedIds6.includes(q.id));
console.log(`Pass: ${pass6}`);
console.log('---');

// Test 7: Complex scenario - Student = yes, Dependents = yes with count > 0
console.log('Test 7: Complex scenario - Student = yes, Dependents = yes with count > 0');
const relevantQuestions7 = getRelevantQuestions({ q2: 'yes', q6: 'yes', q7: '2' });
console.log(`Relevant questions: ${relevantQuestions7.map(q => q.id).join(', ')}`);
const expectedIds7 = ['q1', 'q2', 'q3', 'q4', 'q6', 'q7', 'q8'];
console.log(`Expected: ${expectedIds7.join(', ')}`);
const pass7 = relevantQuestions7.length === expectedIds7.length &&
              relevantQuestions7.every(q => expectedIds7.includes(q.id));
console.log(`Pass: ${pass7}`);
console.log('---');

console.log('=== Test Summary ===');
const passCount = [pass1, pass2, pass3, pass4, pass5, pass6, pass7].filter(Boolean).length;
console.log(`Passed: ${passCount} / 7 tests`);
