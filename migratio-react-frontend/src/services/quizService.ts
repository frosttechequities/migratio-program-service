const QUIZ_API_BASE_URL = 'https://migratio-quiz-api-frost.onrender.com';

// Interface matching the backend QuizQuestionInDB model (including MongoDB _id as id)
// and QuestionOption model
export interface ApiQuizOption { // Added export
  option_id: string;
  text: string;
}

export interface ApiQuizQuestion { // Added export
  id: string; // This corresponds to MongoDB's _id, returned by the API
  question_id: string; // The custom QID...
  text: string;
  question_type: string;
  options: ApiQuizOption[];
  section: string;
  order: number;
  is_active: boolean;
}

export const quizService = {
  fetchQuestions: async (): Promise<ApiQuizQuestion[]> => {
    const response = await fetch(`${QUIZ_API_BASE_URL}/questions`);
    if (!response.ok) {
      // Try to parse error detail if available
      let errorDetail = 'Failed to fetch quiz questions';
      try {
        const errorData = await response.json();
        if (errorData && errorData.detail) {
          errorDetail = errorData.detail;
        }
      } catch { // Removed unused variable binding
        // Ignore if response is not JSON or error parsing JSON
      }
      throw new Error(errorDetail);
    }
    const data = await response.json();
    return data as ApiQuizQuestion[];
  },
};
