/**
 * Question Path Service
 * Handles dynamic question paths, branching logic, and question prioritization
 */

/**
 * Determine the next question based on the current question, answer, and user profile
 * @param {string} currentQuestionId - Current question ID
 * @param {any} answer - User's answer to the current question
 * @param {Object} answers - All previous answers
 * @param {Array} questions - All available questions
 * @param {Object} userProfile - User profile data
 * @returns {Object} Next question object
 */
const determineNextQuestion = (currentQuestionId, answer, answers, questions, userProfile = {}) => {
  // Find the current question
  const currentQuestion = questions.find(q => q.id === currentQuestionId);
  if (!currentQuestion) {
    console.error(`Question with ID ${currentQuestionId} not found`);
    return null;
  }

  // Check if the question has branching logic
  if (currentQuestion.nextQuestionLogic && currentQuestion.nextQuestionLogic.length > 0) {
    // Evaluate each condition in the branching logic
    for (const branch of currentQuestion.nextQuestionLogic) {
      if (evaluateCondition(branch.condition, answer, answers, userProfile)) {
        // Find the next question by ID
        const nextQuestion = questions.find(q => q.id === branch.nextQuestionId);
        if (nextQuestion) {
          // Check if the next question is relevant
          if (isQuestionRelevant(nextQuestion, answers, userProfile)) {
            return nextQuestion;
          } else {
            // If not relevant, recursively find the next relevant question
            return determineNextQuestion(branch.nextQuestionId, null, answers, questions, userProfile);
          }
        }
      }
    }
  }

  // If no branching logic or no conditions matched, use default next question
  if (currentQuestion.defaultNextQuestionId) {
    const defaultNextQuestion = questions.find(q => q.id === currentQuestion.defaultNextQuestionId);
    if (defaultNextQuestion) {
      // Check if the default next question is relevant
      if (isQuestionRelevant(defaultNextQuestion, answers, userProfile)) {
        return defaultNextQuestion;
      } else {
        // If not relevant, recursively find the next relevant question
        return determineNextQuestion(currentQuestion.defaultNextQuestionId, null, answers, questions, userProfile);
      }
    }
  }

  // If no specific next question is defined, find the next question by index
  const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
  if (currentIndex >= 0 && currentIndex < questions.length - 1) {
    // Get the next question in sequence
    const nextQuestion = questions[currentIndex + 1];
    // Check if the next question is relevant
    if (isQuestionRelevant(nextQuestion, answers, userProfile)) {
      return nextQuestion;
    } else {
      // If not relevant, recursively find the next relevant question
      return determineNextQuestion(nextQuestion.id, null, answers, questions, userProfile);
    }
  }

  // If we've reached the end of the questions, return null
  return null;
};

/**
 * Evaluate a condition based on the answer and user profile
 * @param {string} condition - Condition to evaluate
 * @param {any} answer - User's answer
 * @param {Object} answers - All previous answers
 * @param {Object} userProfile - User profile data
 * @returns {boolean} Whether the condition is met
 */
const evaluateCondition = (condition, answer, answers, userProfile = {}) => {
  if (!condition) return true;

  try {
    // For simple conditions, use direct comparison
    if (typeof condition === 'string') {
      // Handle common condition patterns
      if (condition.includes('===')) {
        const [left, right] = condition.split('===').map(s => s.trim());
        if (left === 'answer') {
          // Log for debugging
          console.log(`Evaluating condition: ${condition}`);
          console.log(`Comparing answer: "${answer}" with expected: "${right.replace(/['"]/g, '')}"`);

          // Remove quotes from the right side for string comparison
          const rightValue = right.replace(/['"]/g, '');
          const result = answer === rightValue;

          console.log(`Condition result: ${result}`);
          return result;
        }
      } else if (condition.includes('!==')) {
        const [left, right] = condition.split('!==').map(s => s.trim());
        if (left === 'answer') {
          // Remove quotes from the right side for string comparison
          const rightValue = right.replace(/['"]/g, '');
          return answer !== rightValue;
        }
      } else if (condition.includes('includes')) {
        // Handle array inclusion checks
        if (condition.includes('Array.isArray(answer)')) {
          // Log for debugging
          console.log(`Evaluating array condition: ${condition}`);
          console.log(`Answer is array: ${Array.isArray(answer)}, Answer: `, answer);

          // Extract the value to check for inclusion
          const match = condition.match(/answer\.includes\(['"](.+?)['"]\)/);
          if (match && Array.isArray(answer)) {
            const valueToCheck = match[1];
            const result = answer.includes(valueToCheck);
            console.log(`Checking if ${valueToCheck} is in array, result: ${result}`);
            return result;
          }

          return false;
        }

        // Handle simple includes check
        const match = condition.match(/answer\.includes\((['"])(.+?)\1\)/);
        if (match && Array.isArray(answer)) {
          const result = answer.includes(match[2]);
          console.log(`Simple array check: ${match[2]} in ${answer}, result: ${result}`);
          return result;
        }
      } else if (condition.includes('&&') || condition.includes('||')) {
        // For complex conditions, use Function constructor with safety checks
        // Replace 'answer' with the actual answer value
        console.log(`Evaluating complex condition: ${condition}`);
        console.log(`Answer:`, answer);
        console.log(`Answers:`, answers);

        try {
          const safeCondition = condition
            .replace(/\banswer\b/g, JSON.stringify(answer))
            .replace(/\buserProfile\b/g, JSON.stringify(userProfile))
            .replace(/\banswers\b/g, JSON.stringify(answers));

          console.log(`Safe condition: ${safeCondition}`);

          // Use Function constructor to evaluate the condition
          const conditionFn = new Function(`return ${safeCondition};`);
          const result = conditionFn();

          console.log(`Complex condition result: ${result}`);
          return result;
        } catch (error) {
          console.error('Error evaluating complex condition:', error);
          return false;
        }
      }
    }

    // For function conditions, execute the function
    if (typeof condition === 'function') {
      return condition(answer, userProfile, answers);
    }

    return false;
  } catch (error) {
    console.error('Error evaluating condition:', error);
    return false;
  }
};

/**
 * Check if a question is relevant based on its relevance condition
 * @param {Object} question - Question object
 * @param {Object} answers - All previous answers
 * @param {Object} userProfile - User profile data
 * @returns {boolean} Whether the question is relevant
 */
const isQuestionRelevant = (question, answers, userProfile = {}) => {
  if (!question) return false;
  if (!question.relevanceCondition) return true;

  console.log(`Checking relevance for question ${question.id}`);
  console.log(`Relevance condition: ${question.relevanceCondition}`);

  const isRelevant = evaluateCondition(question.relevanceCondition, null, answers, userProfile);
  console.log(`Question ${question.id} is relevant: ${isRelevant}`);

  return isRelevant;
};

/**
 * Get the next highest priority question
 * @param {Array} questions - All available questions
 * @param {Object} answers - All previous answers
 * @param {Object} userProfile - User profile data
 * @returns {Object} Highest priority question
 */
const getNextPriorityQuestion = (questions, answers, userProfile = {}) => {
  // Filter out questions that have already been answered
  const unansweredQuestions = questions.filter(q => !answers[q.id]);

  // Filter out questions that are not relevant
  const relevantQuestions = unansweredQuestions.filter(q =>
    isQuestionRelevant(q, answers, userProfile)
  );

  // Sort by priority (higher number = higher priority)
  const sortedQuestions = relevantQuestions.sort((a, b) =>
    (b.priority || 0) - (a.priority || 0)
  );

  // Return the highest priority question
  return sortedQuestions[0] || null;
};

/**
 * Calculate the progress percentage based on answered questions and total questions
 * @param {Object} answers - All answers
 * @param {Array} questions - All questions
 * @param {Object} userProfile - User profile data
 * @returns {number} Progress percentage (0-100)
 */
const calculateProgress = (answers, questions, userProfile = {}) => {
  if (!questions || questions.length === 0) return 0;

  // Count answered questions
  const answeredCount = Object.keys(answers).length;

  // Count total relevant questions
  const relevantQuestions = questions.filter(q =>
    isQuestionRelevant(q, answers, userProfile)
  );

  // Calculate progress percentage
  return Math.round((answeredCount / relevantQuestions.length) * 100);
};

/**
 * Get the estimated remaining questions
 * @param {Object} answers - All answers
 * @param {Array} questions - All questions
 * @param {Object} userProfile - User profile data
 * @returns {number} Estimated remaining questions
 */
const getEstimatedRemainingQuestions = (answers, questions, userProfile = {}) => {
  if (!questions || questions.length === 0) return 0;

  // Count answered questions
  const answeredCount = Object.keys(answers).length;

  // Count total relevant questions
  const relevantQuestions = questions.filter(q =>
    isQuestionRelevant(q, answers, userProfile)
  );

  // Calculate remaining questions
  return Math.max(0, relevantQuestions.length - answeredCount);
};

// Export the service functions
const questionPathService = {
  determineNextQuestion,
  evaluateCondition,
  isQuestionRelevant,
  getNextPriorityQuestion,
  calculateProgress,
  getEstimatedRemainingQuestions
};

export default questionPathService;
