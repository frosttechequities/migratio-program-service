import supabase from '../../utils/supabaseClient';

// Sample questions for the assessment quiz
const sampleQuestions = [
  {
    id: 'q1',
    text: 'What is your primary reason for immigration?',
    type: 'single-select',
    required: true,
    options: [
      { value: 'work', label: 'Work/Employment' },
      { value: 'study', label: 'Education/Study' },
      { value: 'family', label: 'Family Reunification' },
      { value: 'investment', label: 'Investment/Business' },
      { value: 'refugee', label: 'Humanitarian/Refugee' }
    ]
  },
  {
    id: 'q2',
    text: 'What is your highest level of education?',
    type: 'single-select',
    required: true,
    options: [
      { value: 'high-school', label: 'High School' },
      { value: 'associate', label: 'Associate Degree' },
      { value: 'bachelor', label: 'Bachelor\'s Degree' },
      { value: 'master', label: 'Master\'s Degree' },
      { value: 'doctorate', label: 'Doctorate/PhD' }
    ]
  },
  {
    id: 'q3',
    text: 'How many years of work experience do you have in your field?',
    type: 'single-select',
    required: true,
    options: [
      { value: 'less-than-1', label: 'Less than 1 year' },
      { value: '1-3', label: '1-3 years' },
      { value: '3-5', label: '3-5 years' },
      { value: '5-10', label: '5-10 years' },
      { value: 'more-than-10', label: 'More than 10 years' }
    ]
  },
  {
    id: 'q4',
    text: 'What is your current language proficiency in English?',
    type: 'single-select',
    required: true,
    options: [
      { value: 'basic', label: 'Basic' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'fluent', label: 'Fluent' },
      { value: 'native', label: 'Native' }
    ]
  },
  {
    id: 'q5',
    text: 'Which countries are you interested in immigrating to? (Select all that apply)',
    type: 'multi-select',
    required: true,
    options: [
      { value: 'canada', label: 'Canada' },
      { value: 'usa', label: 'United States' },
      { value: 'australia', label: 'Australia' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'new-zealand', label: 'New Zealand' },
      { value: 'germany', label: 'Germany' },
      { value: 'other', label: 'Other' }
    ]
  }
];

/**
 * Initialize quiz session / Get first question
 * @returns {Promise<Object>} Quiz session data
 */
const startQuiz = async () => {
  try {
    console.log('[assessmentService] Starting quiz session...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user already has a quiz session
    const { data: existingSession, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // If there's an existing incomplete session, return it
    if (existingSession && !existingSession.is_complete) {
      console.log('[assessmentService] Resuming existing session:', existingSession);

      // Get the current question
      const currentQuestionId = existingSession.current_question_id;
      const currentQuestion = sampleQuestions.find(q => q.id === currentQuestionId) || sampleQuestions[0];

      return {
        status: 'success',
        sessionId: existingSession.id,
        progress: existingSession.progress || 0,
        nextQuestion: currentQuestion,
        isComplete: existingSession.is_complete
      };
    }

    // Create a new session
    const { data: newSession, error: createError } = await supabase
      .from('quiz_sessions')
      .insert([
        {
          user_id: user.id,
          current_question_id: sampleQuestions[0].id,
          progress: 0,
          is_complete: false,
          answers: {}
        }
      ])
      .select()
      .single();

    if (createError) throw createError;

    console.log('[assessmentService] Created new session:', newSession);
    return {
      status: 'success',
      sessionId: newSession.id,
      progress: 0,
      nextQuestion: sampleQuestions[0],
      isComplete: false
    };
  } catch (error) {
    console.error('Start Quiz Service Error:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Submit an answer and get the next question
 * @param {string} sessionId - Session ID
 * @param {string} questionId - Question ID
 * @param {any} answer - Answer data
 * @returns {Promise<Object>} Next question data
 */
const submitAnswer = async (sessionId, questionId, answer) => {
  try {
    console.log(`[assessmentService] Submitting answer for question ${questionId}:`, answer);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the current session
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError) throw sessionError;

    if (!session) {
      throw new Error('Session not found');
    }

    // Find the current question index
    const currentQuestionIndex = sampleQuestions.findIndex(q => q.id === questionId);
    if (currentQuestionIndex === -1) {
      throw new Error('Question not found');
    }

    // Calculate the next question index
    const nextQuestionIndex = currentQuestionIndex + 1;
    const isComplete = nextQuestionIndex >= sampleQuestions.length;
    const progress = Math.round((nextQuestionIndex / sampleQuestions.length) * 100);

    // Update the answers in the session
    const updatedAnswers = { ...session.answers, [questionId]: answer };

    // Update the session
    const { data: updatedSession, error: updateError } = await supabase
      .from('quiz_sessions')
      .update({
        current_question_id: isComplete ? null : sampleQuestions[nextQuestionIndex].id,
        progress,
        is_complete: isComplete,
        answers: updatedAnswers
      })
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // If the quiz is complete, generate recommendations
    let recommendations = null;
    if (isComplete) {
      recommendations = await generateRecommendations(updatedAnswers);
    }

    console.log('[assessmentService] Updated session:', updatedSession);
    return {
      status: 'success',
      sessionId,
      progress,
      nextQuestion: isComplete ? null : sampleQuestions[nextQuestionIndex],
      isComplete,
      recommendations
    };
  } catch (error) {
    console.error('Submit Answer Service Error:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Generate recommendations based on quiz answers
 * @param {Object} answers - Quiz answers
 * @returns {Promise<Array>} Recommendations
 */
const generateRecommendations = async (answers) => {
  try {
    console.log('[assessmentService] Generating recommendations based on answers:', answers);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get immigration programs
    const { data: programs, error: programsError } = await supabase
      .from('immigration_programs')
      .select('*');

    if (programsError) throw programsError;

    // Simple scoring algorithm based on answers
    const scoredPrograms = programs.map(program => {
      let score = 0;

      // Score based on primary reason
      if (answers.q1 === 'work' && program.title.toLowerCase().includes('express entry')) {
        score += 30;
      } else if (answers.q1 === 'study' && program.title.toLowerCase().includes('study')) {
        score += 30;
      } else if (answers.q1 === 'family' && program.title.toLowerCase().includes('family')) {
        score += 30;
      }

      // Score based on education
      if (answers.q2 === 'master' || answers.q2 === 'doctorate') {
        score += 20;
      } else if (answers.q2 === 'bachelor') {
        score += 15;
      }

      // Score based on work experience
      if (answers.q3 === '5-10' || answers.q3 === 'more-than-10') {
        score += 20;
      } else if (answers.q3 === '3-5') {
        score += 15;
      }

      // Score based on language proficiency
      if (answers.q4 === 'fluent' || answers.q4 === 'native') {
        score += 20;
      } else if (answers.q4 === 'advanced') {
        score += 15;
      }

      // Score based on country preference
      if (answers.q5 && Array.isArray(answers.q5)) {
        if (answers.q5.includes('canada') && program.country === 'Canada') {
          score += 10;
        } else if (answers.q5.includes('usa') && program.country === 'United States') {
          score += 10;
        } else if (answers.q5.includes('australia') && program.country === 'Australia') {
          score += 10;
        }
      }

      return {
        ...program,
        score,
        reasoning: `Based on your ${answers.q1} focus, ${answers.q2} education, and ${answers.q3} work experience.`
      };
    });

    // Sort by score (descending)
    scoredPrograms.sort((a, b) => b.score - a.score);

    // Take top 3 recommendations
    const topRecommendations = scoredPrograms.slice(0, 3);

    // Save recommendations to user_recommendations table
    for (const rec of topRecommendations) {
      const { error: recError } = await supabase
        .from('user_recommendations')
        .insert([
          {
            user_id: user.id,
            program_id: rec.id,
            score: rec.score,
            reasoning: rec.reasoning
          }
        ]);

      if (recError) console.error('Error saving recommendation:', recError);
    }

    console.log('[assessmentService] Generated recommendations:', topRecommendations);
    return topRecommendations;
  } catch (error) {
    console.error('Generate Recommendations Error:', error.message);
    return [];
  }
};

/**
 * Get quiz results
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Quiz results
 */
const getQuizResults = async (sessionId) => {
  try {
    console.log(`[assessmentService] Getting quiz results for session ${sessionId}...`);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the session
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError) throw sessionError;

    if (!session) {
      throw new Error('Session not found');
    }

    // Get recommendations for the user
    const { data: recommendations, error: recError } = await supabase
      .from('user_recommendations')
      .select(`
        id,
        score,
        reasoning,
        immigration_programs (
          id,
          title,
          country,
          description
        )
      `)
      .eq('user_id', user.id)
      .order('score', { ascending: false });

    if (recError) throw recError;

    console.log('[assessmentService] Retrieved quiz results:', { session, recommendations });
    return {
      status: 'success',
      data: {
        session,
        recommendations: recommendations.map(rec => ({
          id: rec.id,
          score: rec.score,
          reasoning: rec.reasoning,
          program: rec.immigration_programs
        }))
      }
    };
  } catch (error) {
    console.error('Get Quiz Results Service Error:', error.message);
    throw new Error(error.message);
  }
};

const assessmentService = {
  startQuiz,
  submitAnswer,
  getQuizResults
};

export default assessmentService;
