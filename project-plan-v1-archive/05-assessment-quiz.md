# Migratio Assessment Quiz Specification

## Overview

The assessment quiz is a critical component of the Migratio platform, serving as the primary mechanism for collecting user data to power the recommendation algorithm. This document outlines the comprehensive specifications for the assessment quiz, including its purpose, structure, question types, user experience considerations, and technical implementation approach.

## Purpose and Objectives

The assessment quiz aims to:

1. **Collect Comprehensive User Data**: Gather all necessary information to accurately match users with suitable immigration programs
2. **Provide an Engaging User Experience**: Create an intuitive, non-intimidating interface that encourages completion
3. **Adapt to User Circumstances**: Dynamically adjust questions based on previous answers
4. **Educate Users**: Help users understand why certain information is relevant to their immigration options
5. **Build User Profiles**: Create structured data profiles that can be used across the platform
6. **Minimize User Effort**: Ask only relevant questions while maximizing data collection

## Quiz Structure

### Section Organization

The quiz is organized into logical sections to improve user experience and completion rates:

1. **Personal Information**
   - Basic demographics
   - Family status
   - Current residence
   - Contact details

2. **Education Background**
   - Degrees and certifications
   - Educational institutions
   - Fields of study
   - Academic achievements

3. **Work Experience**
   - Employment history
   - Job titles and responsibilities
   - Industry sectors
   - Skills and specializations

4. **Language Proficiency**
   - Languages spoken
   - Proficiency levels
   - Official test scores
   - Learning history

5. **Financial Resources**
   - Available funds
   - Income sources
   - Investment capacity
   - Financial obligations

6. **Immigration History**
   - Previous applications
   - Travel history
   - Visa rejections
   - Current immigration status

7. **Destination Preferences**
   - Target countries
   - Location preferences
   - Climate preferences
   - Urban/rural preferences

8. **Immigration Goals**
   - Primary motivation
   - Timeline expectations
   - Long-term plans
   - Family considerations

### Question Types

The quiz employs various question types to efficiently collect different kinds of information:

1. **Multiple Choice**
   - Single selection
   - Multiple selection
   - Dropdown menus
   - Radio button groups

2. **Scale Questions**
   - Likert scales (1-5, 1-7)
   - Slider inputs
   - Priority ranking
   - Comparative scales

3. **Text Input**
   - Short text responses
   - Autocomplete fields
   - Formatted inputs (dates, numbers)
   - Optional elaboration fields

4. **File Upload**
   - Document uploads
   - Image uploads
   - Verification documents
   - Portfolio materials

5. **Structured Data Entry**
   - Address forms
   - Employment history tables
   - Education history tables
   - Language proficiency matrices

6. **Interactive Elements**
   - Maps for location selection
   - Sliders for numerical ranges
   - Drag-and-drop prioritization
   - Interactive timelines

## Adaptive Logic

The quiz implements sophisticated adaptive logic to create a personalized experience:

### Conditional Branching

```javascript
// Example conditional branching logic
function determineNextQuestion(currentQuestion, answer, userProfile) {
  switch(currentQuestion.id) {
    case 'employment_status':
      if (answer === 'employed') {
        return 'current_employment';
      } else if (answer === 'self_employed') {
        return 'business_details';
      } else if (answer === 'student') {
        return 'current_education';
      } else {
        return 'employment_history';
      }
    
    case 'has_children':
      if (answer === true) {
        return 'children_details';
      } else {
        return 'planning_children';
      }
      
    // Additional branching logic...
  }
}
```

### Question Prioritization

The system dynamically prioritizes questions based on their relevance to the user's emerging profile:

```javascript
// Example question prioritization algorithm
function prioritizeRemainingQuestions(userProfile, remainingQuestions) {
  return remainingQuestions.sort((a, b) => {
    const relevanceA = calculateQuestionRelevance(a, userProfile);
    const relevanceB = calculateQuestionRelevance(b, userProfile);
    return relevanceB - relevanceA; // Higher relevance first
  });
}

function calculateQuestionRelevance(question, userProfile) {
  let relevance = question.baseRelevance || 5;
  
  // Apply modifiers based on user profile
  question.relevanceFactors.forEach(factor => {
    const profileValue = userProfile[factor.key];
    if (profileValue) {
      relevance += factor.getModifier(profileValue);
    }
  });
  
  return relevance;
}
```

### Skip Logic

Questions are automatically skipped when they become irrelevant based on previous answers:

```javascript
// Example skip logic
function shouldSkipQuestion(question, userProfile) {
  // Skip education details if user has no formal education
  if (question.category === 'education_details' && 
      userProfile.education_level === 'none') {
    return true;
  }
  
  // Skip visa rejection questions if no previous applications
  if (question.category === 'visa_rejections' && 
      userProfile.previous_applications === false) {
    return true;
  }
  
  // Skip language test questions for native speakers
  if (question.category === 'language_tests' && 
      userProfile.language_status === 'native') {
    return true;
  }
  
  return false;
}
```

### Progressive Disclosure

Complex topics are introduced gradually to prevent overwhelming users:

```javascript
// Example progressive disclosure implementation
function getQuestionComplexity(question, userProfile) {
  const baseComplexity = question.complexity || 1;
  const userSophistication = calculateUserSophistication(userProfile);
  
  // Adjust complexity based on user's demonstrated sophistication
  if (userSophistication > 7) {
    // Show more complex version for sophisticated users
    return Math.min(baseComplexity + 1, 3);
  } else if (userSophistication < 3) {
    // Show simpler version for less sophisticated users
    return Math.max(baseComplexity - 1, 1);
  }
  
  return baseComplexity;
}
```

## User Experience Design

### Interface Principles

1. **Clarity**: Clear, concise questions with minimal jargon
2. **Transparency**: Explanation of why information is needed
3. **Progress Indication**: Visual feedback on quiz completion
4. **Error Prevention**: Inline validation and helpful error messages
5. **Accessibility**: WCAG 2.1 AA compliance for all quiz elements
6. **Responsiveness**: Optimized for all device types and sizes

### Visual Design

```html
<!-- Example progress indicator -->
<div class="quiz-progress">
  <div class="progress-bar">
    <div class="progress-fill" style="width: 45%"></div>
  </div>
  <div class="section-indicators">
    <div class="section-indicator completed">
      <div class="indicator-icon">
        <svg><!-- Personal icon --></svg>
      </div>
      <div class="indicator-label">Personal</div>
    </div>
    <div class="section-indicator current">
      <div class="indicator-icon">
        <svg><!-- Education icon --></svg>
      </div>
      <div class="indicator-label">Education</div>
    </div>
    <div class="section-indicator">
      <div class="indicator-icon">
        <svg><!-- Work icon --></svg>
      </div>
      <div class="indicator-label">Work</div>
    </div>
    <!-- Additional section indicators -->
  </div>
</div>
```

### Contextual Help

Each question includes supporting information to guide users:

1. **Information Tooltips**: Explanations of technical terms
2. **Why We Ask**: Brief explanation of relevance to immigration
3. **Example Answers**: Guidance for complex questions
4. **Data Privacy Notes**: How sensitive information is protected

```html
<!-- Example contextual help -->
<div class="question-container">
  <h3 class="question-text">What is your highest level of education?</h3>
  
  <div class="help-tooltip">
    <button class="tooltip-trigger" aria-label="Why we ask">?</button>
    <div class="tooltip-content">
      <h4>Why we ask</h4>
      <p>Education level is a key factor in many immigration programs, particularly those focused on skilled workers. Higher education levels often result in more points or eligibility for additional programs.</p>
    </div>
  </div>
  
  <div class="answer-options">
    <!-- Answer options here -->
  </div>
  
  <div class="example-guidance">
    <h4>Guidance:</h4>
    <p>Select the highest degree or certificate you've completed. If you have multiple degrees at the same level, you'll be able to add them in the next questions.</p>
  </div>
</div>
```

### Save and Resume Functionality

Users can save their progress and return later to complete the quiz:

```javascript
// Example save and resume functionality
function saveQuizProgress(userId, quizState) {
  return fetch('/api/quiz/save-progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      currentQuestion: quizState.currentQuestion,
      completedQuestions: quizState.completedQuestions,
      answers: quizState.answers,
      timestamp: new Date().toISOString()
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showSaveConfirmation();
      return true;
    } else {
      showSaveError(data.error);
      return false;
    }
  })
  .catch(error => {
    console.error('Save progress error:', error);
    showSaveError('Network error');
    return false;
  });
}
```

### Mobile Optimization

The quiz is designed for optimal mobile experience:

1. **Touch-Friendly Controls**: Large tap targets for all interactive elements
2. **Responsive Layouts**: Adapts to different screen sizes
3. **Minimal Typing**: Preference for selection controls over text input
4. **Efficient Navigation**: Streamlined interaction patterns
5. **Offline Support**: Progressive web app capabilities for unstable connections

## Technical Implementation

### Frontend Architecture

```javascript
// React component structure example
function AssessmentQuiz() {
  const [quizState, setQuizState] = useState({
    currentQuestion: null,
    answers: {},
    progress: 0,
    currentSection: null,
    isLoading: true,
    error: null
  });
  
  const [userProfile, setUserProfile] = useState({});
  
  useEffect(() => {
    // Initialize quiz
    async function initializeQuiz() {
      try {
        const savedProgress = await loadSavedProgress();
        const initialQuestion = savedProgress?.currentQuestion || 
                               await fetchInitialQuestion();
        
        setQuizState({
          ...quizState,
          currentQuestion: initialQuestion,
          answers: savedProgress?.answers || {},
          progress: savedProgress?.progress || 0,
          currentSection: initialQuestion.section,
          isLoading: false
        });
      } catch (error) {
        setQuizState({
          ...quizState,
          error: "Failed to load quiz. Please try again.",
          isLoading: false
        });
      }
    }
    
    initializeQuiz();
  }, []);
  
  const handleAnswer = async (answer) => {
    // Update answers
    const updatedAnswers = {
      ...quizState.answers,
      [quizState.currentQuestion.id]: answer
    };
    
    setQuizState({
      ...quizState,
      answers: updatedAnswers,
      isLoading: true
    });
    
    try {
      const nextQuestion = await fetchNextQuestion(quizState.currentQuestion.id, answer);
      
      setQuizState({
        currentQuestion: nextQuestion,
        answers: updatedAnswers,
        progress: calculateProgress(updatedAnswers, nextQuestion),
        currentSection: nextQuestion?.section || quizState.currentSection,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setQuizState({
        ...quizState,
        error: "Failed to load next question. Please try again.",
        isLoading: false
      });
    }
  };
  
  // Additional methods and rendering logic...
}
```

### Backend Services

```javascript
// Backend API Example (Node.js/Express)
const express = require('express');
const router = express.Router();
const QuizEngine = require('../services/QuizEngine');
const UserProfileService = require('../services/UserProfileService');
const ValidationService = require('../services/ValidationService');

// Initialize quiz session
router.post('/quiz/initialize', async (req, res) => {
  try {
    const { userId, resumeSession } = req.body;
    
    // Create or resume quiz session
    const quizEngine = new QuizEngine();
    const userProfileService = new UserProfileService();
    
    let session;
    if (resumeSession) {
      // Load existing session
      session = await quizEngine.resumeSession(userId);
      if (!session) {
        // No session found, create new
        session = await quizEngine.createSession(userId);
      }
    } else {
      // Create new session
      session = await quizEngine.createSession(userId);
    }
    
    // Get initial question
    const initialQuestion = await quizEngine.getInitialQuestion(session.id);
    
    // Get user profile
    const userProfile = await userProfileService.getProfile(userId);
    
    res.json({
      sessionId: session.id,
      initialQuestion,
      progress: session.progress,
      userProfile
    });
  } catch (error) {
    console.error('Quiz initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize quiz' });
  }
});

// Process answer and get next question
router.post('/quiz/answer', async (req, res) => {
  try {
    const { sessionId, questionId, answer } = req.body;
    
    // Validate input
    const validationService = new ValidationService();
    const validationResult = validationService.validateAnswer(questionId, answer);
    
    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.error });
    }
    
    // Process answer
    const quizEngine = new QuizEngine();
    const result = await quizEngine.processAnswer(sessionId, questionId, answer);
    
    // Update user profile
    const userProfileService = new UserProfileService();
    await userProfileService.updateProfile(result.userId, questionId, answer);
    
    res.json({
      nextQuestion: result.nextQuestion,
      progress: result.progress,
      isComplete: result.isComplete,
      recommendations: result.recommendations
    });
  } catch (error) {
    console.error('Answer processing error:', error);
    res.status(500).json({ error: 'Failed to process answer' });
  }
});

// Save quiz progress
router.post('/quiz/save-progress', async (req, res) => {
  try {
    const { userId, currentQuestion, completedQuestions, answers } = req.body;
    
    const quizEngine = new QuizEngine();
    const result = await quizEngine.saveProgress(userId, {
      currentQuestion,
      completedQuestions,
      answers,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      savedAt: result.timestamp
    });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Additional routes...

module.exports = router;
```

### Data Model

```javascript
// Quiz Session Schema
const QuizSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  currentQuestionId: {
    type: String
  },
  completedQuestions: [{
    type: String
  }],
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
});

// Question Schema
const QuestionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'text', 'number', 'date', 'file', 'scale'],
    required: true
  },
  options: [{
    value: String,
    label: String
  }],
  validation: {
    required: Boolean,
    pattern: String,
    min: Number,
    max: Number
  },
  relevance: {
    baseScore: {
      type: Number,
      default: 5
    },
    factors: [{
      profileKey: String,
      condition: String,
      modifier: Number
    }]
  },
  dependencies: [{
    questionId: String,
    condition: String,
    value: mongoose.Schema.Types.Mixed
  }],
  metadata: {
    helpText: String,
    whyWeAsk: String,
    exampleAnswer: String,
    privacyNote: String
  }
});
```

### Integration Points

1. **User Authentication System**
   - User identification and session management
   - Profile linking and data persistence
   - Access control and permissions

2. **Recommendation Engine**
   - Data transfer to matching algorithm
   - Preliminary results during quiz completion
   - Final recommendation generation

3. **User Profile Service**
   - Progressive profile building
   - Data validation and normalization
   - Profile completion tracking

4. **Analytics System**
   - Completion rate tracking
   - Drop-off point identification
   - Question effectiveness analysis
   - A/B testing framework

## Testing Strategy

### Unit Testing

```javascript
// Example unit tests for quiz engine
describe('QuizEngine', () => {
  let quizEngine;
  let mockUserProfile;
  
  beforeEach(() => {
    quizEngine = new QuizEngine();
    mockUserProfile = {
      age: 30,
      education: 'bachelors',
      workExperience: 5
    };
  });
  
  test('should determine correct next question based on answer', () => {
    const result = quizEngine.determineNextQuestion('employment_status', 'employed', mockUserProfile);
    expect(result).toBe('current_employment');
  });
  
  test('should correctly calculate question relevance', () => {
    const question = {
      id: 'masters_details',
      relevance: {
        baseScore: 3,
        factors: [
          { profileKey: 'education', condition: 'equals', value: 'masters', modifier: 5 },
          { profileKey: 'education', condition: 'equals', value: 'bachelors', modifier: 2 }
        ]
      }
    };
    
    const relevance = quizEngine.calculateQuestionRelevance(question, mockUserProfile);
    expect(relevance).toBe(5); // 3 base + 2 modifier for bachelors
  });
  
  test('should correctly calculate completion percentage', () => {
    // Test implementation
  });
  
  // Additional tests...
});
```

### Integration Testing

```javascript
// Example integration tests for quiz API
describe('Quiz API', () => {
  let testUser;
  let sessionId;
  
  beforeAll(async () => {
    // Create test user
    testUser = await createTestUser();
  });
  
  test('should initialize a new quiz session', async () => {
    const response = await request(app)
      .post('/api/quiz/initialize')
      .send({ userId: testUser.id })
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('sessionId');
    expect(response.body).toHaveProperty('initialQuestion');
    
    sessionId = response.body.sessionId;
  });
  
  test('should process answer and return next question', async () => {
    const response = await request(app)
      .post('/api/quiz/answer')
      .send({
        sessionId,
        questionId: 'personal_age',
        answer: 30
      })
      .set('Accept', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nextQuestion');
    expect(response.body.progress).toBeGreaterThan(0);
  });
  
  // Additional tests...
});
```

### User Acceptance Testing

1. **Completion Rate Testing**
   - Measure quiz completion rates across different user segments
   - Identify drop-off points and optimize problematic questions
   - Test different question sequences for improved completion

2. **Usability Testing**
   - Observe users completing the quiz in controlled environment
   - Collect feedback on question clarity and interface usability
   - Measure time to complete different sections

3. **Cross-Device Testing**
   - Verify functionality across desktop, tablet, and mobile devices
   - Test with different browsers and operating systems
   - Validate responsive design implementation

4. **Accessibility Testing**
   - Screen reader compatibility testing
   - Keyboard navigation testing
   - Color contrast and text size validation
   - WCAG 2.1 AA compliance verification

## Analytics and Optimization

### Key Metrics

1. **Completion Rate**: Percentage of users who complete the entire quiz
2. **Section Completion**: Completion rates for individual sections
3. **Time per Question**: Average time spent on each question
4. **Drop-off Points**: Questions with highest abandonment rates
5. **Device Distribution**: Completion rates across different devices
6. **Answer Distribution**: Statistical analysis of answer patterns

### Optimization Strategy

1. **Question Refinement**
   - Reword questions with high confusion rates
   - Simplify complex questions with high drop-off rates
   - Add additional context to frequently skipped questions
   - Optimize question order based on completion analytics

2. **Interface Improvements**
   - Enhance UI elements with low engagement
   - Optimize page load times for sections with high abandonment
   - Improve mobile experience for questions with mobile-specific drop-offs
   - Test alternative designs for problematic sections

3. **Adaptive Logic Tuning**
   - Refine branching logic based on user path analysis
   - Adjust question prioritization algorithms
   - Optimize skip logic to reduce irrelevant questions
   - Personalize question complexity based on user sophistication

## Conclusion

The assessment quiz is a foundational component of the Migratio platform, designed to collect comprehensive user data while providing an engaging, intuitive experience. Through adaptive logic, thoughtful UX design, and continuous optimization, the quiz aims to maximize completion rates while gathering the detailed information necessary for accurate immigration pathway recommendations.

The implementation approach balances technical sophistication with user-centered design principles, ensuring that the quiz is both powerful in its data collection capabilities and accessible to users from diverse backgrounds and technical skill levels.
