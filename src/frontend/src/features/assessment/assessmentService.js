import supabase from '../../utils/supabaseClient';
import sampleNlpQuestions from '../../data/sampleNlpQuestions';
import questionPathService from './questionPathService';

// Sample questions for the assessment quiz
// Combine NLP questions with structured questions
const sampleQuestions = [
  // Part 1: NLP questions for qualitative data
  ...sampleNlpQuestions,

  // Part 2: Structured Demographic Questions
  {
    id: 'q1',
    section: 'Part 2: Personal Information',
    text: 'What is your age range?',
    type: 'single_choice',
    required: true,
    options: [
      { value: 'under-18', label: 'Under 18' },
      { value: '18-24', label: '18-24' },
      { value: '25-29', label: '25-29' },
      { value: '30-34', label: '30-34' },
      { value: '35-39', label: '35-39' },
      { value: '40-44', label: '40-44' },
      { value: '45-49', label: '45-49' },
      { value: '50-plus', label: '50+' }
    ],
    helpText: 'Age is a critical factor in point-based immigration systems.',
    // Add branching logic based on age
    nextQuestionLogic: [
      {
        condition: "answer === 'under-18'",
        nextQuestionId: 'q8' // Skip to family status for minors
      },
      {
        condition: "answer === '18-24' || answer === '25-29'",
        nextQuestionId: 'q2' // Continue with education for young adults
      }
      // For other age ranges, use defaultNextQuestionId
    ],
    defaultNextQuestionId: 'q2', // Default to education question
    priority: 10 // High priority question
  },
  {
    id: 'q2',
    section: 'Part 2: Personal Information',
    text: 'What is your highest level of education?',
    type: 'single_choice',
    required: true,
    options: [
      { value: 'high-school', label: 'High School' },
      { value: 'associate', label: 'Associate Degree/Diploma' },
      { value: 'bachelor', label: 'Bachelor\'s Degree' },
      { value: 'master', label: 'Master\'s Degree' },
      { value: 'doctorate', label: 'Doctorate/PhD' },
      { value: 'professional', label: 'Professional Degree (MD, JD, etc.)' }
    ],
    helpText: 'Education level directly impacts eligibility for skilled immigration programs.',
    // Add branching logic based on education
    nextQuestionLogic: [
      {
        condition: "answer === 'high-school'",
        nextQuestionId: 'q4' // Skip work experience for high school graduates
      }
    ],
    defaultNextQuestionId: 'q3', // Default to work experience question
    priority: 9 // High priority question
  },
  {
    id: 'q3',
    section: 'Part 2: Personal Information',
    text: 'How many years of work experience do you have in your field?',
    type: 'single_choice',
    required: true,
    options: [
      { value: 'none', label: 'None' },
      { value: 'less-than-1', label: 'Less than 1 year' },
      { value: '1-3', label: '1-3 years' },
      { value: '3-5', label: '3-5 years' },
      { value: '5-10', label: '5-10 years' },
      { value: 'more-than-10', label: 'More than 10 years' }
    ],
    helpText: 'Work experience is weighted heavily in most skilled immigration programs.'
  },
  {
    id: 'q4',
    section: 'Part 2: Personal Information',
    text: 'What is your current occupation or field?',
    type: 'single_choice',
    required: true,
    options: [
      { value: 'it-software', label: 'IT & Software Development' },
      { value: 'healthcare', label: 'Healthcare & Medicine' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'finance', label: 'Finance & Accounting' },
      { value: 'education', label: 'Education & Research' },
      { value: 'trades', label: 'Skilled Trades' },
      { value: 'hospitality', label: 'Hospitality & Tourism' },
      { value: 'arts', label: 'Arts & Creative Industries' },
      { value: 'business', label: 'Business & Management' },
      { value: 'other', label: 'Other' }
    ],
    helpText: 'Your occupation helps match you with countries seeking workers in your field.'
  },
  {
    id: 'q5',
    section: 'Part 2: Personal Information',
    text: 'What is your language proficiency?',
    type: 'matrix',
    required: true,
    subQuestions: [
      { id: 'english', text: 'English' },
      { id: 'french', text: 'French' },
      { id: 'other', text: 'Other Language' }
    ],
    options: [
      { value: 'none', label: 'None' },
      { value: 'basic', label: 'Basic' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'fluent', label: 'Native/Fluent' }
    ],
    helpText: 'Language skills are critical for immigration eligibility in many countries.'
  },

  // Part 3: Immigration-Specific Questions
  {
    id: 'q6',
    section: 'Part 3: Immigration Preferences',
    text: 'What is your timeline for immigration?',
    type: 'single_choice',
    required: true,
    options: [
      { value: 'immediate', label: 'Immediate (0-6 months)' },
      { value: 'short-term', label: 'Short-term (6-12 months)' },
      { value: 'medium-term', label: 'Medium-term (1-2 years)' },
      { value: 'long-term', label: 'Long-term (2+ years)' }
    ],
    helpText: 'Your timeline helps us match you with programs based on processing times.'
  },
  {
    id: 'q7',
    section: 'Part 3: Immigration Preferences',
    text: 'What is your budget for the immigration process?',
    type: 'single_choice',
    required: true,
    options: [
      { value: 'under-5k', label: 'Under $5,000' },
      { value: '5k-10k', label: '$5,000 - $10,000' },
      { value: '10k-20k', label: '$10,000 - $20,000' },
      { value: '20k-50k', label: '$20,000 - $50,000' },
      { value: 'over-50k', label: 'Over $50,000' }
    ],
    helpText: 'Different immigration pathways have different cost requirements.'
  },
  {
    id: 'q8',
    section: 'Part 3: Immigration Preferences',
    text: 'What is your family status? (Select all that apply)',
    type: 'multiple_choice',
    required: true,
    options: [
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married/Common-law partner' },
      { value: 'children', label: 'With dependent children' },
      { value: 'parents', label: 'With parents/grandparents to include' }
    ],
    helpText: 'Family composition affects eligibility and points in immigration systems.'
  },
  {
    id: 'q9',
    section: 'Part 3: Immigration Preferences',
    text: 'Do you have any previous immigration experience? (Select all that apply)',
    type: 'multiple_choice',
    required: false,
    options: [
      { value: 'study', label: 'Previous study permit/visa' },
      { value: 'work', label: 'Previous work permit/visa' },
      { value: 'visitor', label: 'Previous visitor visa' },
      { value: 'application', label: 'Previous immigration application' },
      { value: 'none', label: 'No previous experience' }
    ],
    helpText: 'Previous experience can impact eligibility for certain programs.'
  },
  {
    id: 'q10',
    section: 'Part 3: Immigration Preferences',
    text: 'Which immigration pathways are you most interested in? (Select all that apply)',
    type: 'multiple_choice',
    required: true,
    options: [
      { value: 'skilled', label: 'Skilled worker programs' },
      { value: 'family', label: 'Family sponsorship' },
      { value: 'study', label: 'Study permit/Student visa' },
      { value: 'business', label: 'Entrepreneur/Investor programs' },
      { value: 'humanitarian', label: 'Refugee/Humanitarian programs' }
    ],
    helpText: 'This helps us prioritize specific program types in our recommendations.',
    // Add conditional questions based on selected pathways
    nextQuestionLogic: [
      {
        condition: "Array.isArray(answer) && answer.includes('business')",
        nextQuestionId: 'q-business' // Show business-specific questions
      },
      {
        condition: "Array.isArray(answer) && answer.includes('study')",
        nextQuestionId: 'q-study' // Show study-specific questions
      }
    ],
    defaultNextQuestionId: 'q11',
    priority: 8
  },
  // Conditional question for business pathway
  {
    id: 'q-business',
    section: 'Part 3: Immigration Preferences',
    text: 'What is your investment budget for business immigration?',
    type: 'single_choice',
    required: true,
    options: [
      { value: 'under-100k', label: 'Under $100,000' },
      { value: '100k-250k', label: '$100,000 - $250,000' },
      { value: '250k-500k', label: '$250,000 - $500,000' },
      { value: '500k-1m', label: '$500,000 - $1 million' },
      { value: 'over-1m', label: 'Over $1 million' }
    ],
    helpText: 'Different business immigration programs have different investment requirements.',
    // Only show this question if the user selected business pathway
    relevanceCondition: "Array.isArray(answers.q10) && answers.q10.includes('business')",
    defaultNextQuestionId: 'q11',
    priority: 7
  },
  // Conditional question for study pathway
  {
    id: 'q-study',
    section: 'Part 3: Immigration Preferences',
    text: 'What level of education are you interested in pursuing?',
    type: 'single_choice',
    required: true,
    options: [
      { value: 'language', label: 'Language courses' },
      { value: 'certificate', label: 'Certificate/Diploma' },
      { value: 'bachelor', label: 'Bachelor\'s degree' },
      { value: 'master', label: 'Master\'s degree' },
      { value: 'doctorate', label: 'Doctorate/PhD' }
    ],
    helpText: 'Different study permits have different requirements based on the program level.',
    // Only show this question if the user selected study pathway
    relevanceCondition: "Array.isArray(answers.q10) && answers.q10.includes('study')",
    defaultNextQuestionId: 'q11',
    priority: 7
  },
  {
    id: 'q11',
    section: 'Part 3: Immigration Preferences',
    text: 'What specific challenges or concerns do you have about immigration? (Select all that apply)',
    type: 'multiple_choice',
    required: false,
    options: [
      { value: 'language', label: 'Meeting language requirements' },
      { value: 'financial', label: 'Financial requirements' },
      { value: 'documentation', label: 'Documentation and paperwork' },
      { value: 'processing', label: 'Processing times' },
      { value: 'employment', label: 'Finding employment' },
      { value: 'healthcare', label: 'Healthcare access' },
      { value: 'other', label: 'Other concerns' }
    ],
    helpText: 'We\'ll address these specific concerns in your recommendations.'
  }
];

/**
 * Get all questions for the assessment
 * @returns {Array} All questions for the assessment
 */
const getAllQuestions = () => {
  // Return the sample questions
  return sampleQuestions;
};

/**
 * Initialize quiz session / Get first question
 * @param {boolean} forceNew - Force creation of a new session even if one exists
 * @returns {Promise<Object>} Quiz session data
 */
const startQuiz = async (forceNew = false) => {
  try {
    console.log('[assessmentService] Starting quiz session...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user already has a quiz session
    let existingSession = null;
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error) {
        existingSession = data;
      } else if (error.code !== 'PGRST116') {
        console.error('Error fetching quiz session:', error);
      }
    } catch (error) {
      console.error('Error checking for existing quiz session:', error);
      // Continue with creating a new session
    }

    // If there's an existing incomplete session and we're not forcing a new one, return it
    if (!forceNew && existingSession && !existingSession.is_complete) {
      console.log('[assessmentService] Resuming existing session:', existingSession);

      // Get the current question
      const currentQuestionId = existingSession.current_question_id;
      const currentQuestion = sampleQuestions.find(q => q.id === currentQuestionId) || sampleQuestions[0];

      return {
        status: 'success',
        sessionId: existingSession.id,
        progress: existingSession.progress || 0,
        nextQuestion: currentQuestion,
        isComplete: existingSession.is_complete,
        questions: sampleQuestions // Include all questions
      };
    }

    // If forceNew is true, delete any existing sessions for this user
    if (forceNew && existingSession) {
      console.log('[assessmentService] Forcing new session, deleting existing session:', existingSession.id);
      try {
        await supabase
          .from('quiz_sessions')
          .delete()
          .eq('id', existingSession.id);
      } catch (deleteError) {
        console.error('[assessmentService] Error deleting existing session:', deleteError);
        // Continue with creating a new session anyway
      }
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

    // Get user profile data if available
    let userProfile = {};
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileError && profile) {
        userProfile = profile;
      }
    } catch (profileError) {
      console.error('[assessmentService] Error fetching user profile:', profileError);
      // Continue without profile data
    }

    // For the first question, we'll use the first question in the list
    // In a more advanced implementation, we could use questionPathService.getNextPriorityQuestion
    // We're getting userProfile but not using it yet - will be used in future enhancements
    console.log('[assessmentService] User profile for personalization:', userProfile);

    return {
      status: 'success',
      sessionId: newSession.id,
      progress: 0,
      nextQuestion: sampleQuestions[0],
      isComplete: false,
      questions: sampleQuestions // Include all questions
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

    // Find the current question
    const currentQuestion = sampleQuestions.find(q => q.id === questionId);
    if (!currentQuestion) {
      throw new Error('Question not found');
    }

    // Update the answers in the session
    const updatedAnswers = { ...session.answers, [questionId]: answer };

    // Get user profile data if available
    let userProfile = {};
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileError && profile) {
        userProfile = profile;
      }
    } catch (profileError) {
      console.error('[assessmentService] Error fetching user profile:', profileError);
      // Continue without profile data
    }

    // Use the question path service to determine the next question
    console.log(`[assessmentService] Determining next question after ${questionId} with answer:`, answer);

    // Manual branching logic for testing
    let nextQuestion;

    // Age question branching
    if (questionId === 'q1') {
      console.log(`[assessmentService] Processing age question with answer: ${answer}`);
      if (answer === 'under-18') {
        console.log('[assessmentService] Under 18 selected, skipping to family status (q8)');
        nextQuestion = sampleQuestions.find(q => q.id === 'q8');
      } else {
        console.log('[assessmentService] Adult age selected, continuing to education (q2)');
        nextQuestion = sampleQuestions.find(q => q.id === 'q2');
      }
    }
    // Education question branching
    else if (questionId === 'q2') {
      console.log(`[assessmentService] Processing education question with answer: ${answer}`);
      if (answer === 'high-school') {
        console.log('[assessmentService] High school selected, skipping to occupation (q4)');
        nextQuestion = sampleQuestions.find(q => q.id === 'q4');
      } else {
        console.log('[assessmentService] Higher education selected, continuing to work experience (q3)');
        nextQuestion = sampleQuestions.find(q => q.id === 'q3');
      }
    }
    // Immigration pathway branching
    else if (questionId === 'q10') {
      console.log(`[assessmentService] Processing immigration pathway question with answer:`, answer);
      if (Array.isArray(answer) && answer.includes('business')) {
        console.log('[assessmentService] Business pathway selected, showing business question');
        nextQuestion = sampleQuestions.find(q => q.id === 'q-business');
      } else if (Array.isArray(answer) && answer.includes('study')) {
        console.log('[assessmentService] Study pathway selected, showing study question');
        nextQuestion = sampleQuestions.find(q => q.id === 'q-study');
      } else {
        console.log('[assessmentService] No special pathway, continuing to challenges (q11)');
        nextQuestion = sampleQuestions.find(q => q.id === 'q11');
      }
    }
    // Business question
    else if (questionId === 'q-business') {
      console.log('[assessmentService] After business question, continuing to challenges (q11)');
      nextQuestion = sampleQuestions.find(q => q.id === 'q11');
    }
    // Study question
    else if (questionId === 'q-study') {
      console.log('[assessmentService] After study question, continuing to challenges (q11)');
      nextQuestion = sampleQuestions.find(q => q.id === 'q11');
    }
    // Default sequential behavior for other questions
    else {
      console.log(`[assessmentService] Using default sequential behavior for ${questionId}`);
      const currentIndex = sampleQuestions.findIndex(q => q.id === questionId);
      if (currentIndex >= 0 && currentIndex < sampleQuestions.length - 1) {
        nextQuestion = sampleQuestions[currentIndex + 1];
      } else {
        nextQuestion = null;
      }
    }

    console.log('[assessmentService] Next question:', nextQuestion?.id);

    // Check if the quiz is complete (no more questions)
    const isComplete = !nextQuestion;

    // Calculate progress based on answered questions and total relevant questions
    const progress = questionPathService.calculateProgress(
      updatedAnswers,
      sampleQuestions,
      userProfile
    );

    // Also store the updated answers in localStorage for fallback
    try {
      const storedSession = localStorage.getItem('quizSession');
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        parsedSession.answers = updatedAnswers;
        localStorage.setItem('quizSession', JSON.stringify(parsedSession));
        console.log('[assessmentService] Updated answers in localStorage:', updatedAnswers);
      }
    } catch (error) {
      console.error('[assessmentService] Error updating localStorage:', error);
    }

    // Update the session
    const { data: updatedSession, error: updateError } = await supabase
      .from('quiz_sessions')
      .update({
        current_question_id: isComplete ? null : (nextQuestion ? nextQuestion.id : null),
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
      try {
        recommendations = await generateRecommendations(updatedAnswers);
        console.log('[assessmentService] Generated recommendations in submitAnswer:', recommendations);

        // Store the recommendations in the session for later retrieval
        try {
          const { error: recSessionError } = await supabase
            .from('quiz_sessions')
            .update({
              recommendations: recommendations
            })
            .eq('id', sessionId)
            .eq('user_id', user.id);

          if (recSessionError) {
            console.error('[assessmentService] Error saving recommendations to session:', recSessionError);
          }
        } catch (saveError) {
          console.error('[assessmentService] Error saving recommendations to session:', saveError);
        }
      } catch (recError) {
        console.error('[assessmentService] Error generating recommendations:', recError);
        // Provide fallback recommendations
        recommendations = generateMockRecommendations(updatedAnswers);
      }
    }

    console.log('[assessmentService] Updated session:', updatedSession);
    return {
      status: 'success',
      sessionId,
      progress,
      nextQuestion: isComplete ? null : nextQuestion,
      isComplete,
      recommendations,
      // Include the recommendations in the response for immediate use
      recommendedPrograms: recommendations
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

    if (userError) {
      console.error('[assessmentService] User error in generateRecommendations:', userError.message);
      // Return mock recommendations instead of throwing an error
      return generateMockRecommendations(answers);
    }

    if (!user) {
      console.error('[assessmentService] User not authenticated in generateRecommendations');
      // Return mock recommendations instead of throwing an error
      return generateMockRecommendations(answers);
    }

    // Try to get immigration programs from Supabase
    const { data: programs, error: programsError } = await supabase
      .from('immigration_programs')
      .select('*');

    if (programsError || !programs || programs.length === 0) {
      console.error('[assessmentService] Error fetching programs or no programs found:', programsError?.message);
      // Return mock recommendations instead of throwing an error
      return generateMockRecommendations(answers);
    }

    // Enhanced scoring algorithm based on comprehensive answers
    const scoredPrograms = programs.map(program => {
      let score = 0;
      let matchPoints = [];
      let challengePoints = [];

      // Extract country from program
      const programCountry = program.country || '';
      const programTitle = (program.title || '').toLowerCase();
      const programCategory = (program.category || '').toLowerCase();

      // Score based on NLP-extracted data (if available)
      // This would come from the NLP analysis of free-text responses
      try {
        // Check if we have NLP results stored in the answers
        if (answers['nlp-q1-results']) {
          const nlpResults = answers['nlp-q1-results'];

          // Check for immigration goals alignment
          if (nlpResults.keywords) {
            const goalKeywords = ['work', 'job', 'career', 'study', 'education', 'family', 'business', 'invest'];
            for (const keyword of nlpResults.keywords) {
              if (goalKeywords.includes(keyword.text.toLowerCase())) {
                if (programTitle.includes(keyword.text.toLowerCase())) {
                  score += 15;
                  matchPoints.push(`Your goal of "${keyword.text}" aligns with this program`);
                }
              }
            }
          }

          // Check for sentiment
          if (nlpResults.sentiment === 'positive') {
            score += 5; // Slight boost for positive outlook
          }
        }

        // Check for professional background alignment from NLP
        if (answers['nlp-q2-results']) {
          const nlpResults = answers['nlp-q2-results'];

          // Check for skills/qualifications alignment
          if (nlpResults.keywords) {
            for (const keyword of nlpResults.keywords) {
              if (programTitle.includes(keyword.text.toLowerCase()) ||
                  program.description?.toLowerCase().includes(keyword.text.toLowerCase())) {
                score += 10;
                matchPoints.push(`Your ${keyword.text} background matches this program's requirements`);
              }
            }
          }
        }

        // Check for country preferences from NLP
        if (answers['nlp-q3-results']) {
          const nlpResults = answers['nlp-q3-results'];

          // Check for location entities
          if (nlpResults.extractedEntities) {
            for (const entity of nlpResults.extractedEntities) {
              if (entity.label === 'LOCATION' &&
                  programCountry.toLowerCase().includes(entity.text.toLowerCase())) {
                score += 20;
                matchPoints.push(`This program is in ${entity.text}, one of your preferred destinations`);
              }
            }
          }
        }
      } catch (nlpError) {
        console.warn('Error processing NLP results:', nlpError);
        // Continue with structured data scoring
      }

      // Score based on age (q1)
      if (answers.q1) {
        if ((answers.q1 === '25-29' || answers.q1 === '30-34') &&
            (programCategory.includes('skilled') || programTitle.includes('express'))) {
          score += 15;
          matchPoints.push('Your age range receives maximum points in this program');
        } else if ((answers.q1 === '18-24' || answers.q1 === '35-39') &&
                  (programCategory.includes('skilled') || programTitle.includes('express'))) {
          score += 10;
          matchPoints.push('Your age range receives good points in this program');
        }
      }

      // Score based on education (q2)
      if (answers.q2) {
        if ((answers.q2 === 'master' || answers.q2 === 'doctorate' || answers.q2 === 'professional') &&
            (programCategory.includes('skilled') || programTitle.includes('express'))) {
          score += 20;
          matchPoints.push('Your advanced education is highly valued in this program');
        } else if (answers.q2 === 'bachelor' &&
                  (programCategory.includes('skilled') || programTitle.includes('express'))) {
          score += 15;
          matchPoints.push('Your bachelor\'s degree is well-regarded in this program');
        } else if (programTitle.includes('study') || programCategory.includes('student')) {
          score += 10;
          matchPoints.push('This program offers pathways for further education');
        }
      }

      // Score based on work experience (q3)
      if (answers.q3) {
        if ((answers.q3 === '5-10' || answers.q3 === 'more-than-10') &&
            (programCategory.includes('skilled') || programTitle.includes('express'))) {
          score += 20;
          matchPoints.push('Your extensive work experience is highly valued in this program');
        } else if (answers.q3 === '3-5' &&
                  (programCategory.includes('skilled') || programTitle.includes('express'))) {
          score += 15;
          matchPoints.push('Your work experience meets this program\'s requirements');
        } else if (answers.q3 === 'none' || answers.q3 === 'less-than-1') {
          if (programTitle.includes('study') || programCategory.includes('student')) {
            score += 10;
            matchPoints.push('This program is suitable for those with limited work experience');
          } else {
            score -= 10; // Penalty for skilled programs that require experience
            challengePoints.push('This program typically requires more work experience');
          }
        }
      }

      // Score based on occupation (q4)
      if (answers.q4) {
        // Check if program has in-demand occupations listed
        const inDemandOccupations = {
          'it-software': ['express entry', 'skilled', 'global talent'],
          'healthcare': ['healthcare', 'medical', 'nursing', 'physician'],
          'engineering': ['engineering', 'skilled', 'technical'],
          'trades': ['trades', 'technical', 'construction']
        };

        if (inDemandOccupations[answers.q4]) {
          for (const keyword of inDemandOccupations[answers.q4]) {
            if (programTitle.includes(keyword) || program.description?.toLowerCase().includes(keyword)) {
              score += 15;
              matchPoints.push(`Your occupation in ${answers.q4} is in demand for this program`);
              break;
            }
          }
        }
      }

      // Score based on language proficiency (q5)
      if (answers.q5) {
        // Check English proficiency
        if (answers.q5.english === 'fluent' || answers.q5.english === 'advanced') {
          score += 15;
          matchPoints.push('Your English proficiency meets this program\'s requirements');
        } else if (answers.q5.english === 'intermediate') {
          score += 5;
        } else {
          challengePoints.push('This program may require higher English proficiency');
        }

        // Bonus for French (especially for Canada)
        if (programCountry === 'Canada' &&
            (answers.q5.french === 'fluent' || answers.q5.french === 'advanced')) {
          score += 15;
          matchPoints.push('Your French proficiency is highly valued for Canadian immigration');
        }
      }

      // Score based on timeline (q6)
      if (answers.q6) {
        // Match timeline with program processing time
        const processingTime = program.processingTime || '';

        if (answers.q6 === 'immediate' && processingTime.includes('3-6 months')) {
          score += 10;
          matchPoints.push('This program\'s processing time matches your immediate timeline');
        } else if (answers.q6 === 'short-term' && processingTime.includes('6-12 months')) {
          score += 10;
          matchPoints.push('This program\'s processing time matches your short-term timeline');
        } else if (answers.q6 === 'medium-term' && processingTime.includes('12-18 months')) {
          score += 10;
          matchPoints.push('This program\'s processing time matches your medium-term timeline');
        } else if (answers.q6 === 'immediate' && processingTime.includes('12-18 months')) {
          score -= 10;
          challengePoints.push('This program\'s processing time may be longer than your immediate timeline');
        }
      }

      // Score based on budget (q7)
      if (answers.q7) {
        // Extract cost from program
        const costString = program.estimatedCost || '';
        let estimatedCost = 0;

        // Simple parsing of cost string
        if (costString.includes('$')) {
          const matches = costString.match(/\$(\d+,?\d*)/);
          if (matches && matches[1]) {
            estimatedCost = parseInt(matches[1].replace(',', ''));
          }
        }

        // Match budget with program cost
        if (answers.q7 === 'under-5k' && estimatedCost <= 5000) {
          score += 15;
          matchPoints.push('This program fits within your budget');
        } else if (answers.q7 === '5k-10k' && estimatedCost <= 10000) {
          score += 10;
          matchPoints.push('This program fits within your budget');
        } else if (answers.q7 === '10k-20k' && estimatedCost <= 20000) {
          score += 10;
          matchPoints.push('This program fits within your budget');
        } else if (answers.q7 === 'under-5k' && estimatedCost > 10000) {
          score -= 15;
          challengePoints.push('This program may exceed your budget');
        }
      }

      // Score based on family status (q8)
      if (answers.q8 && Array.isArray(answers.q8)) {
        if (answers.q8.includes('married') &&
            (programTitle.includes('spouse') || programTitle.includes('family'))) {
          score += 10;
          matchPoints.push('This program has good options for married applicants');
        }

        if (answers.q8.includes('children') && programTitle.includes('family')) {
          score += 10;
          matchPoints.push('This program accommodates families with children');
        }

        if (answers.q8.includes('parents') && programTitle.includes('parent')) {
          score += 15;
          matchPoints.push('This program specifically addresses parent/grandparent sponsorship');
        }
      }

      // Score based on previous immigration experience (q9)
      if (answers.q9 && Array.isArray(answers.q9)) {
        if (answers.q9.includes('study') &&
            (programTitle.includes('graduate') || programTitle.includes('post-graduation'))) {
          score += 15;
          matchPoints.push('Your previous study experience qualifies you for this program');
        }

        if (answers.q9.includes('work') && programTitle.includes('experience')) {
          score += 15;
          matchPoints.push('Your previous work permit experience is valuable for this program');
        }
      }

      // Score based on immigration pathway interest (q10)
      if (answers.q10 && Array.isArray(answers.q10)) {
        const pathwayMapping = {
          'skilled': ['express entry', 'skilled worker', 'points-based'],
          'family': ['family', 'spouse', 'partner', 'dependent'],
          'study': ['study', 'student', 'education'],
          'business': ['investor', 'entrepreneur', 'business'],
          'humanitarian': ['refugee', 'humanitarian', 'asylum']
        };

        for (const pathway of answers.q10) {
          if (pathwayMapping[pathway]) {
            for (const keyword of pathwayMapping[pathway]) {
              if (programTitle.includes(keyword) ||
                  programCategory.toLowerCase().includes(keyword) ||
                  program.description?.toLowerCase().includes(keyword)) {
                score += 20;
                matchPoints.push(`This program matches your interest in ${pathway} immigration`);
                break;
              }
            }
          }
        }
      }

      // Score based on specific challenges/concerns (q11)
      if (answers.q11 && Array.isArray(answers.q11)) {
        // Add information about how the program addresses concerns
        for (const concern of answers.q11) {
          challengePoints.push(`We'll provide guidance on ${concern} requirements for this program`);
        }
      }

      // Calculate final score (normalize to 0-100 range)
      score = Math.min(Math.max(score, 0), 100);

      // Generate personalized reasoning
      let reasoning = '';
      if (matchPoints.length > 0) {
        reasoning += 'Key matches: ' + matchPoints.slice(0, 3).join('. ') + '. ';
      }
      if (challengePoints.length > 0) {
        reasoning += 'Considerations: ' + challengePoints.slice(0, 2).join('. ') + '.';
      }

      return {
        ...program,
        score,
        reasoning
      };
    });

    // Sort by score (descending)
    scoredPrograms.sort((a, b) => b.score - a.score);

    // Take top 3 recommendations
    const topRecommendations = scoredPrograms.slice(0, 3);

    // Try to save recommendations to user_recommendations table
    try {
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
    } catch (saveError) {
      console.error('[assessmentService] Error saving recommendations:', saveError.message);
      // Continue even if saving fails
    }

    console.log('[assessmentService] Generated recommendations:', topRecommendations);
    return topRecommendations;
  } catch (error) {
    console.error('Generate Recommendations Error:', error.message);
    // Return mock recommendations instead of throwing an error
    return generateMockRecommendations(answers);
  }
};

/**
 * Generate mock recommendations when Supabase is not available
 * @param {Object} answers - Quiz answers
 * @returns {Array} Mock recommendations
 */
const generateMockRecommendations = (answers) => {
  console.log('[assessmentService] Generating mock recommendations based on answers:', answers);

  // Define mock programs
  const mockPrograms = [
    {
      id: 'express-entry',
      title: 'Express Entry',
      country: 'Canada',
      description: 'A system used to manage applications for permanent residence for skilled workers.',
      category: 'Skilled Worker',
      processingTime: '6-12 months',
      successProbability: 85,
      estimatedCost: '$2,300 CAD',
    },
    {
      id: 'provincial-nominee',
      title: 'Provincial Nominee Program',
      country: 'Canada',
      description: 'Programs run by provinces to nominate immigrants who wish to settle in that province.',
      category: 'Provincial',
      processingTime: '12-18 months',
      successProbability: 75,
      estimatedCost: '$1,500-$2,000 CAD',
    },
    {
      id: 'study-permit',
      title: 'Study Permit',
      country: 'Canada',
      description: 'A permit that allows foreign nationals to study at designated learning institutions in Canada.',
      category: 'Student',
      processingTime: '3-6 months',
      successProbability: 90,
      estimatedCost: '$150 CAD',
    },
    {
      id: 'h1b-visa',
      title: 'H-1B Visa',
      country: 'United States',
      description: 'A visa that allows U.S. employers to temporarily employ foreign workers in specialty occupations.',
      category: 'Work',
      processingTime: '6-12 months',
      successProbability: 65,
      estimatedCost: '$460 USD',
    },
    {
      id: 'eb-5',
      title: 'EB-5 Immigrant Investor Program',
      country: 'United States',
      description: 'A program that provides a method for eligible immigrant investors to become lawful permanent residents.',
      category: 'Investment',
      processingTime: '24-36 months',
      successProbability: 70,
      estimatedCost: '$800,000+ USD',
    },
    {
      id: 'skilled-independent-visa',
      title: 'Skilled Independent Visa (Subclass 189)',
      country: 'Australia',
      description: 'A permanent residence visa for skilled workers who are not sponsored by an employer or family member.',
      category: 'Skilled Worker',
      processingTime: '8-12 months',
      successProbability: 80,
      estimatedCost: 'AUD $4,240',
    },
    {
      id: 'global-talent-visa',
      title: 'Global Talent Visa',
      country: 'United Kingdom',
      description: 'A visa for talented and promising individuals in specific sectors wishing to work in the UK.',
      category: 'Skilled Worker',
      processingTime: '3-8 weeks',
      successProbability: 75,
      estimatedCost: '£623',
    },
    {
      id: 'startup-visa',
      title: 'Start-up Visa',
      country: 'Canada',
      description: 'A program designed for entrepreneurs who want to start a business in Canada.',
      category: 'Entrepreneur',
      processingTime: '12-16 months',
      successProbability: 70,
      estimatedCost: '$2,075 CAD',
    }
  ];

  // Score programs based on answers
  const scoredPrograms = mockPrograms.map(program => {
    let score = 50; // Base score
    let keyStrengths = [];
    let keyWeaknesses = [];

    // Score based on primary reason (q1)
    if (answers.q1 === 'work') {
      if (program.title.includes('Express Entry') || program.title.includes('H-1B') || program.category === 'Skilled Worker') {
        score += 30;
        keyStrengths.push({
          criterionName: 'Work Focus',
          description: 'Your work-focused immigration goal aligns well with this program.',
          score: 90,
          userValue: 'Work/Employment'
        });
      } else if (program.title.includes('Study') || program.category === 'Student') {
        score -= 10;
        keyWeaknesses.push({
          criterionName: 'Program Mismatch',
          description: 'This program is primarily for students, not aligned with your work focus.',
          score: 30,
          userValue: 'Work/Employment'
        });
      }
    } else if (answers.q1 === 'study') {
      if (program.title.includes('Study') || program.category === 'Student') {
        score += 30;
        keyStrengths.push({
          criterionName: 'Education Focus',
          description: 'Your education-focused immigration goal aligns perfectly with this program.',
          score: 90,
          userValue: 'Education/Study'
        });
      } else if (program.category === 'Skilled Worker' || program.category === 'Work') {
        score -= 5;
        keyWeaknesses.push({
          criterionName: 'Program Mismatch',
          description: 'This program is primarily for workers, not students.',
          score: 40,
          userValue: 'Education/Study'
        });
      }
    } else if (answers.q1 === 'investment') {
      if (program.title.includes('EB-5') || program.title.includes('Investor') || program.category === 'Investment' || program.title.includes('Start-up')) {
        score += 30;
        keyStrengths.push({
          criterionName: 'Investment Focus',
          description: 'Your investment-focused immigration goal aligns well with this program.',
          score: 90,
          userValue: 'Investment/Business'
        });
      } else {
        score -= 10;
        keyWeaknesses.push({
          criterionName: 'Program Mismatch',
          description: 'This program is not designed for investment-based immigration.',
          score: 30,
          userValue: 'Investment/Business'
        });
      }
    }

    // Score based on education (q2)
    if (answers.q2 === 'master' || answers.q2 === 'doctorate') {
      if (program.category === 'Skilled Worker' || program.title.includes('Global Talent')) {
        score += 20;
        keyStrengths.push({
          criterionName: 'Advanced Education',
          description: 'Your advanced degree is highly valued in this program.',
          score: 85,
          userValue: answers.q2 === 'master' ? 'Master\'s Degree' : 'Doctorate/PhD'
        });
      }
    } else if (answers.q2 === 'high-school' && program.category === 'Skilled Worker') {
      score -= 15;
      keyWeaknesses.push({
        criterionName: 'Education Level',
        description: 'This program typically requires higher education levels.',
        score: 30,
        userValue: 'High School'
      });
    }

    // Score based on work experience (q3)
    if ((answers.q3 === '5-10' || answers.q3 === 'more-than-10') &&
        (program.category === 'Skilled Worker' || program.category === 'Work')) {
      score += 20;
      keyStrengths.push({
        criterionName: 'Work Experience',
        description: 'Your extensive work experience is a significant advantage for this program.',
        score: 90,
        userValue: answers.q3 === 'more-than-10' ? 'More than 10 years' : '5-10 years'
      });
    } else if (answers.q3 === 'less-than-1' && program.category === 'Skilled Worker') {
      score -= 15;
      keyWeaknesses.push({
        criterionName: 'Limited Work Experience',
        description: 'This program typically requires more work experience.',
        score: 25,
        userValue: 'Less than 1 year'
      });
    }

    // Score based on language proficiency (q4)
    if ((answers.q4 === 'fluent' || answers.q4 === 'native') &&
        (program.country === 'Canada' || program.country === 'United States' ||
         program.country === 'United Kingdom' || program.country === 'Australia')) {
      score += 15;
      keyStrengths.push({
        criterionName: 'Language Proficiency',
        description: 'Your strong English language skills are highly valued in this program.',
        score: 85,
        userValue: answers.q4 === 'native' ? 'Native' : 'Fluent'
      });
    } else if (answers.q4 === 'basic' &&
              (program.country === 'Canada' || program.country === 'United States' ||
               program.country === 'United Kingdom' || program.country === 'Australia')) {
      score -= 20;
      keyWeaknesses.push({
        criterionName: 'Language Barrier',
        description: 'This program requires stronger English language skills.',
        score: 20,
        userValue: 'Basic'
      });
    }

    // Score based on country preference (q5)
    if (answers.q5 && Array.isArray(answers.q5)) {
      const countryMap = {
        'canada': 'Canada',
        'usa': 'United States',
        'australia': 'Australia',
        'uk': 'United Kingdom',
        'new-zealand': 'New Zealand',
        'germany': 'Germany'
      };

      const preferredCountries = answers.q5.map(code => countryMap[code]).filter(Boolean);

      if (preferredCountries.includes(program.country)) {
        score += 15;
        keyStrengths.push({
          criterionName: 'Destination Preference',
          description: `${program.country} is one of your preferred destinations.`,
          score: 90,
          userValue: program.country
        });
      } else if (preferredCountries.length > 0) {
        score -= 10;
        keyWeaknesses.push({
          criterionName: 'Destination Mismatch',
          description: `${program.country} is not among your preferred destinations.`,
          score: 30,
          userValue: preferredCountries.join(', ')
        });
      }
    }

    // Ensure score is within bounds
    score = Math.max(30, Math.min(95, score));

    // Generate personalized reasoning based on the user's answers
    let reasoning = '';

    // Add reasoning based on the user's primary focus
    if (answers.q1) {
      reasoning += `Based on your ${answers.q1} focus, `;
    }

    // Add reasoning based on education
    if (answers.q2) {
      const educationMap = {
        'high-school': 'high school education',
        'associate': 'associate degree',
        'bachelor': 'bachelor\'s degree',
        'master': 'master\'s degree',
        'doctorate': 'doctorate',
        'professional': 'professional degree'
      };
      reasoning += `${educationMap[answers.q2] || 'education'}, `;
    }

    // Add reasoning based on work experience
    if (answers.q3) {
      const experienceMap = {
        'none': 'no formal work experience',
        'less-than-1': 'limited work experience',
        '1-3': '1-3 years of work experience',
        '3-5': '3-5 years of work experience',
        '5-10': 'significant work experience',
        'more-than-10': 'extensive work experience'
      };
      reasoning += `and ${experienceMap[answers.q3] || 'work experience'}.`;
    } else {
      reasoning += 'and profile.';
    }

    // Add country preference if available
    if (answers.q5 && Array.isArray(answers.q5) && answers.q5.includes(program.country.toLowerCase())) {
      reasoning += ` This program is in ${program.country}, one of your preferred destinations.`;
    }

    return {
      id: program.id,
      name: program.title,
      country: program.country,
      matchScore: score,
      description: program.description,
      category: program.category,
      processingTime: program.processingTime,
      successProbability: program.successProbability,
      estimatedCost: program.estimatedCost,
      keyStrengths: keyStrengths,
      keyWeaknesses: keyWeaknesses,
      reasoning: reasoning
    };
  });

  // Sort by score (descending)
  scoredPrograms.sort((a, b) => b.matchScore - a.matchScore);

  // Take top 3-5 recommendations
  const topRecommendations = scoredPrograms.slice(0, 5);

  console.log('[assessmentService] Generated mock recommendations:', topRecommendations);
  return topRecommendations;
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

    if (userError) {
      console.error('[assessmentService] User error in getQuizResults:', userError.message);
      // Return mock results instead of throwing an error
      return getMockQuizResults();
    }

    if (!user) {
      console.error('[assessmentService] User not authenticated in getQuizResults');
      // Return mock results instead of throwing an error
      return getMockQuizResults();
    }

    try {
      // Get the session
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sessionError) {
        console.error('[assessmentService] Session error in getQuizResults:', sessionError.message);
        // Return mock results instead of throwing an error
        return getMockQuizResults();
      }

      if (!session) {
        console.error('[assessmentService] No session found in getQuizResults');
        // Return mock results instead of throwing an error
        return getMockQuizResults();
      }

      // Try to get recommendations for the user
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

      if (recError || !recommendations || recommendations.length === 0) {
        console.error('[assessmentService] Recommendations error or no recommendations found:', recError?.message);
        // Return mock results instead of throwing an error
        return getMockQuizResults();
      }

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
    } catch (dbError) {
      console.error('[assessmentService] Database error in getQuizResults:', dbError.message);
      // Return mock results instead of throwing an error
      return getMockQuizResults();
    }
  } catch (error) {
    console.error('Get Quiz Results Service Error:', error.message);
    // Return mock results instead of throwing an error
    return getMockQuizResults();
  }
};

/**
 * Get mock quiz results when Supabase is not available
 * @returns {Object} Mock quiz results
 */
const getMockQuizResults = () => {
  console.log('[assessmentService] Generating mock quiz results');

  // Try to get the most recent session from localStorage
  let sessionAnswers = {};
  try {
    const storedSession = localStorage.getItem('quizSession');
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      if (parsedSession && parsedSession.answers) {
        sessionAnswers = parsedSession.answers;
        console.log('[assessmentService] Using stored session answers:', sessionAnswers);
      }
    }
  } catch (error) {
    console.error('[assessmentService] Error retrieving session from localStorage:', error);
  }

  // Create mock session with real answers if available
  const mockSession = {
    id: 'mock-session-' + Date.now(),
    user_id: 'mock-user',
    is_complete: true,
    progress: 100,
    created_at: new Date().toISOString(),
    answers: Object.keys(sessionAnswers).length > 0 ? sessionAnswers : {
      // Fallback answers if no real answers are available
      q1: 'work',
      q2: 'bachelor',
      q3: '3-5',
      q4: 'advanced',
      q5: ['canada', 'usa', 'australia']
    }
  };

  // Generate mock recommendations based on the session answers
  const mockRecommendations = generateMockRecommendations(mockSession.answers);

  // Format recommendations to match the expected structure
  const formattedRecommendations = mockRecommendations.map(rec => ({
    id: rec.id,
    score: rec.matchScore,
    reasoning: rec.reasoning,
    program: {
      id: rec.id,
      title: rec.name,
      country: rec.country,
      description: rec.description
    },
    keyStrengths: rec.keyStrengths,
    keyWeaknesses: rec.keyWeaknesses,
    processingTime: rec.processingTime,
    successProbability: rec.successProbability,
    estimatedCost: rec.estimatedCost,
    category: rec.category
  }));

  // Create a properly structured response that matches what the Redux slice expects
  const recommendedPrograms = mockRecommendations.map(rec => ({
    id: rec.id,
    name: rec.name,
    country: rec.country,
    matchScore: rec.matchScore,
    description: rec.description,
    category: rec.category,
    processingTime: rec.processingTime,
    successProbability: rec.successProbability,
    estimatedCost: rec.estimatedCost,
    keyStrengths: rec.keyStrengths || [],
    keyWeaknesses: rec.keyWeaknesses || []
  }));

  // Ensure we always have at least one recommendation
  if (recommendedPrograms.length === 0) {
    recommendedPrograms.push({
      id: 'fallback-program',
      name: 'Express Entry Program',
      country: 'Canada',
      matchScore: 75,
      description: 'A system used to manage applications for permanent residence for skilled workers.',
      category: 'Skilled Worker',
      processingTime: '6-12 months',
      successProbability: 85,
      estimatedCost: '$2,300 CAD',
      keyStrengths: [
        {
          criterionName: 'Language Proficiency',
          description: 'Your strong English language skills are highly valued in this program.',
          score: 85,
          userValue: 'Fluent'
        }
      ],
      keyWeaknesses: [
        {
          criterionName: 'Work Experience',
          description: 'This program typically requires more work experience in skilled occupations.',
          score: 60,
          userValue: '2-3 years'
        }
      ]
    });
  }

  const response = {
    status: 'success',
    data: {
      session: mockSession,
      recommendations: formattedRecommendations || [],
      recommendedPrograms: recommendedPrograms // Add recommendedPrograms to the data object
    },
    // Add additional data for the results page
    recommendationResults: mockRecommendations || [],
    recommendedPrograms: recommendedPrograms
  };

  console.log('[assessmentService] Returning mock quiz results:', response);
  return response;
};

/**
 * Analyze text response using NLP
 * @param {string} text - Text to analyze
 * @param {string} questionId - Question ID
 * @returns {Promise<Object>} NLP analysis results
 */
const analyzeTextResponse = async (text, questionId) => {
  try {
    console.log(`[assessmentService] Analyzing text for question ${questionId}...`);

    console.log(`[assessmentService] Calling NLP service at http://localhost:8000/analyze`);
    console.log(`[assessmentService] Request data:`, { text: text.substring(0, 50) + '...', questionId });

    let data;
    try {
      // Call the NLP service directly (for local testing)
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, questionId })
      });

      console.log(`[assessmentService] NLP service response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        console.error(`[assessmentService] NLP service error: ${response.status} ${response.statusText}`);
        throw new Error(`NLP analysis failed: ${response.status} ${response.statusText}`);
      }

      data = await response.json();
    } catch (error) {
      console.error(`[assessmentService] NLP service fetch error:`, error);
      // Return a fallback response with basic analysis
      return {
        status: 'success',
        data: {
          extractedEntities: [],
          sentiment: "neutral",
          keywords: [],
          confidence: 0.0
        }
      };
    }
    console.log(`[assessmentService] NLP analysis complete:`, data);

    return {
      status: 'success',
      data
    };
  } catch (error) {
    console.error('NLP Analysis Service Error:', error.message);

    // Return a fallback response with empty results
    return {
      status: 'error',
      error: error.message,
      data: {
        extractedEntities: [],
        sentiment: 'neutral',
        keywords: [],
        confidence: 0
      }
    };
  }
};

/**
 * Update user profile with NLP data
 * @param {string} userId - User ID
 * @param {Object} nlpResults - NLP analysis results
 * @returns {Promise<Object>} Update result
 */
const updateUserProfileWithNlpData = async (userId, nlpResults) => {
  try {
    console.log(`[assessmentService] Updating user profile with NLP data for user ${userId}...`);

    if (!nlpResults || !nlpResults.extractedEntities) {
      throw new Error('Invalid NLP results');
    }

    // Check if the user profile exists
    const { error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error(`Error fetching user profile: ${profileError.message}`);
    }

    // Extract relevant information from NLP results
    const { extractedEntities, sentiment } = nlpResults;

    // Map entities to profile fields
    const profileUpdates = {};

    // Look for locations
    const locationEntities = extractedEntities.filter(entity =>
      entity.label === 'PROPER_NOUN' || entity.label.includes('LOC')
    );
    if (locationEntities.length > 0) {
      profileUpdates.preferred_locations = locationEntities.map(e => e.text);
    }

    // Look for skills or professions
    const skillEntities = extractedEntities.filter(entity =>
      entity.label === 'NOUN_PHRASE' &&
      !locationEntities.some(loc => loc.text.includes(entity.text))
    );
    if (skillEntities.length > 0) {
      profileUpdates.skills = skillEntities.map(e => e.text);
    }

    // Update sentiment if available
    if (sentiment) {
      profileUpdates.sentiment_analysis = sentiment;
    }

    // Update the profile if we have any updates
    if (Object.keys(profileUpdates).length > 0) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Error updating user profile: ${updateError.message}`);
      }

      console.log(`[assessmentService] User profile updated with NLP data:`, profileUpdates);

      return {
        status: 'success',
        data: profileUpdates
      };
    }

    return {
      status: 'success',
      data: null,
      message: 'No profile updates needed'
    };
  } catch (error) {
    console.error('Update Profile with NLP Data Service Error:', error.message);

    return {
      status: 'error',
      error: error.message
    };
  }
};

const assessmentService = {
  startQuiz,
  submitAnswer,
  getQuizResults,
  analyzeTextResponse,
  updateUserProfileWithNlpData,
  getAllQuestions,
  supabase
};

export default assessmentService;
