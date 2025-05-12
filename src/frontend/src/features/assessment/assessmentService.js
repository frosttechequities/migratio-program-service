import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils'; // Added import

// Define the base URL for the assessment service API
// Ensure this matches the port defined in services/assessment-service/.env.example
const API_URL = process.env.REACT_APP_ASSESSMENT_SERVICE_URL || 'http://localhost:3003/api/quiz';

const getAuthHeaders = () => { // Added helper
  const token = getTokenFromLocalStorage();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Initialize quiz session / Get first question
const startQuiz = async () => {
  try {
    // POST request to start/resume session for the authenticated user
    const response = await axios.post(`${API_URL}/start`, {}, { headers: getAuthHeaders() }); // Added empty data object and headers
    // Expects response like: { status: 'success', sessionId, progress, nextQuestion, isComplete }
    if (response.data && response.data.status === 'success') {
      return response.data; // Return the data part containing session info and first question
    } else {
      throw new Error(response.data?.message || 'Failed to start quiz session');
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.error('Start Quiz Service Error:', message);
    throw new Error(message);
  }
};

// Submit an answer and get the next question
const submitAnswer = async (sessionId, questionId, answer) => {
   try {
    // POST request to submit the answer
    const response = await axios.post(`${API_URL}/answer`, {
        sessionId,
        questionId,
        answer
    }, { headers: getAuthHeaders() }); // Added headers
    // Expects response like: { status: 'success', sessionId, progress, nextQuestion, isComplete, recommendations? }
     if (response.data && response.data.status === 'success') {
      return response.data; // Return data containing next question, progress etc.
    } else {
      throw new Error(response.data?.message || 'Failed to submit answer');
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.error('Submit Answer Service Error:', message);
    throw new Error(message);
  }
};

// --- Remove or implement other functions as needed ---
// const getQuizProgress = async (sessionId) => { ... };
// const saveQuizProgress = async (sessionId, progressData) => { ... };
// const getQuizResults = async (sessionId) => { ... };


const assessmentService = {
  startQuiz,
  submitAnswer,
  // getQuizProgress, // Add back if implemented
  // saveQuizProgress, // Add back if implemented
  // getQuizResults, // Add back if implemented
};

export default assessmentService;
