import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quizService'; // Import service
import type { ApiQuizQuestion, ApiQuizOption } from '../services/quizService'; // Import types separately

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<ApiQuizQuestion[]>([]); // Use ApiQuizQuestion type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({}); // Key by question_id (string), value by option_id (string)

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedQuestions = await quizService.fetchQuestions();
        setQuestions(fetchedQuestions);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching quiz questions.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // const handleAnswerSelection = (questionId: string, optionId: string) => {
  //   setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  // };

  // const handleNextQuestion = () => {
  //   if (currentQuestionIndex < questions.length - 1) {
  //     setCurrentQuestionIndex(prev => prev + 1);
  //   } else {
  //     // TODO: Handle quiz completion (e.g., submit answers)
  //     alert('Quiz completed! Answers: ' + JSON.stringify(selectedAnswers));
  //   }
  // };

  if (isLoading) {
    return <p>Loading quiz questions...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error loading quiz: {error}</p>;
  }

  if (questions.length === 0) {
    return <p>No quiz questions available at the moment.</p>;
  }

  return (
    <div>
      <h2>Quiz Page</h2>
      {questions.map((question) => (
        <div key={question.question_id} style={{ marginBottom: '1.5rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3>{question.text}</h3> {/* Use question.text */}
          <p><small>Category: {question.section}</small></p> {/* Use question.section */}
          <form>
            {question.options.map((option: ApiQuizOption) => ( // Explicitly type option
              <div key={option.option_id}> {/* Use option.option_id for key */}
                <input
                  type="radio"
                  id={`q${question.question_id}-o${option.option_id}`}
                  name={`question-${question.question_id}`}
                  value={option.option_id}
                  // checked={selectedAnswers[question.question_id] === option.option_id}
                  // onChange={() => handleAnswerSelection(question.question_id, option.option_id)}
                />
                <label htmlFor={`q${question.question_id}-o${option.option_id}`}>{option.text}</label> {/* Use option.text */}
              </div>
            ))}
          </form>
        </div>
      ))}
      {/* 
      {questions.length > 0 && currentQuestionIndex < questions.length && (
        <button onClick={handleNextQuestion} style={{ marginTop: '1rem' }}>
          {currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
        </button>
      )}
      */}
    </div>
  );
};

export default QuizPage;
