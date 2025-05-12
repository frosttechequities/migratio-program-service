const mongoose = require('mongoose');
const QuizResponse = require('../models/QuizResponse');
const Question = require('../models/Question');

// --- Placeholders for Dependencies ---
const UserProfileService = { /* ... (mock as before) ... */ getProfile: async (userId) => ({ userId, answers: {}, preliminaryScores: null }), updateProfile: async (userId, questionId, answer) => {}, updateFromNlp: (userId, questionId, nlpResult) => {}, updatePreliminaryScores: (userId, scores) => {} };
const RecommendationService = { /* ... (mock as before) ... */ getPreliminaryScores: async (userProfile) => { const ageAnswer = userProfile.answers?.q1; if (ageAnswer && ageAnswer < 30) return { topPathwayTypes: ['Study', 'Work'], topCountries: ['CA', 'AU'] }; return { topPathwayTypes: ['Work', 'Investment'], topCountries: ['CA', 'US'] }; } };
const NlpService = { /* ... (mock as before) ... */ analyzeText: async (text, contextId) => ({ skills: ['analysis_skill'], isManagementRole: text.toLowerCase().includes('manage') }) };
// --- End Placeholders ---


class EnhancedAdaptiveQuizEngine {
  constructor(userProfileService = UserProfileService, recommendationService = RecommendationService, nlpService = NlpService) {
    this.userProfileService = userProfileService;
    this.recommendationService = recommendationService;
    this.nlpService = nlpService;
    this.totalQuestionCount = null;
  }

  async getQuestionData(questionId) {
      return await Question.findOne({ questionId: questionId, isActive: true }).lean();
  }

  async determineInitialQuestionSetIds() {
      const initialQuestions = await Question.find({ isActive: true }).sort({ order: 1 }).limit(2).select('questionId');
      return initialQuestions.map(q => q.questionId);
  }

  async getTotalQuestionCount() {
      // Cache this value as it might not change often
      if (this.totalQuestionCount === null) {
          this.totalQuestionCount = await Question.countDocuments({ isActive: true });
      }
      return this.totalQuestionCount;
  }

  async initializeSession(userId) {
    let session = await QuizResponse.findOne({ userId: userId, status: 'in_progress' }).sort({ createdAt: -1 });
    let currentQuestionId = null;
    let currentQuestion = null;

    if (!session) {
        console.log(`ENGINE: No active session for user ${userId}, creating new.`);
        const initialQuestionIds = await this.determineInitialQuestionSetIds();
        const userProfile = await this.userProfileService.getProfile(userId);
        const preliminaryScores = await this.recommendationService.getPreliminaryScores(userProfile);
        const currentAnswers = {}; // Empty answers for initial prioritization
        const prioritizedInitial = await this.reprioritizeQuestions(initialQuestionIds, currentAnswers, preliminaryScores);

        currentQuestionId = prioritizedInitial.length > 0 ? prioritizedInitial[0] : null;
        const remainingIds = currentQuestionId ? prioritizedInitial.slice(1) : [];

        session = await QuizResponse.create({
            userId: userId,
            sessionId: `session_${userId}_${Date.now()}`,
            status: 'in_progress',
            responses: [],
            quizVersion: 'v2.0',
            completionPercentage: 0,
            lastQuestionId: null,
            remainingQuestionIds: remainingIds,
            skippedQuestionIds: []
        });
        console.log(`ENGINE: New session ${session.sessionId} created. First question: ${currentQuestionId}`);

    } else {
        console.log(`ENGINE: Resuming session ${session.sessionId} for user ${userId}`);
        // Reprioritize remaining questions on resume, in case profile/scores changed
        const userProfile = await this.userProfileService.getProfile(userId);
        const currentAnswers = session.responses.reduce((acc, r) => { acc[r.questionId] = r.responseValue; return acc; }, {});
        const preliminaryScores = await this.recommendationService.getPreliminaryScores(userProfile);
        session.remainingQuestionIds = await this.reprioritizeQuestions(session.remainingQuestionIds || [], currentAnswers, preliminaryScores);
        currentQuestionId = session.remainingQuestionIds.length > 0 ? session.remainingQuestionIds[0] : null; // Get top prioritized
        console.log(`ENGINE: Resuming with question: ${currentQuestionId}`);
        // Save reprioritized list if changed? Or just use in memory for this request.
        // For simplicity, we won't save the reprioritized list on resume here.
    }

    if (currentQuestionId) {
        currentQuestion = await this.getQuestionData(currentQuestionId);
    }

    return {
        session: { id: session.sessionId, progress: session.completionPercentage },
        currentQuestion
    };
  }

  async processAnswer(userId, sessionId, questionId, answer) {
    const session = await QuizResponse.findOne({ sessionId: sessionId, userId: userId, status: 'in_progress' });
    if (!session) throw new Error(`Active quiz session not found for ID: ${sessionId}`);

    // --- Record Answer ---
    const existingResponseIndex = session.responses.findIndex(r => r.questionId === questionId);
     if (existingResponseIndex > -1) {
        session.responses[existingResponseIndex].responseValue = answer;
        session.responses[existingResponseIndex].answeredAt = new Date();
    } else {
        session.responses.push({ questionId, responseValue: answer, answeredAt: new Date() });
    }
    session.lastQuestionId = questionId;
    session.markModified('responses');

    // --- Trigger Side Effects (Async) ---
    this.userProfileService.updateProfile(userId, questionId, answer).catch(err => console.error("Profile update failed:", err));
    const question = await this.getQuestionData(questionId);
    if (question?.requiresNlp) {
      this.triggerNlpAnalysis(userId, questionId, answer).catch(err => console.error("NLP analysis failed:", err));
    }
    // Fetch profile and scores *after* potentially updating profile based on answer
    const userProfile = await this.userProfileService.getProfile(userId);
    userProfile.answers = session.responses.reduce((acc, r) => { acc[r.questionId] = r.responseValue; return acc; }, {});
    const preliminaryScores = await this.recommendationService.getPreliminaryScores(userProfile);
    this.userProfileService.updatePreliminaryScores(userId, preliminaryScores).catch(err => console.error("Prelim score update failed:", err));

    // --- Update Question Lists (Adaptive Logic) ---
    // Remove answered question from remaining list *before* applying rules
    session.remainingQuestionIds = session.remainingQuestionIds.filter(id => id !== questionId);
    await this.updateQuestionLists(session, question, answer, preliminaryScores); // This updates remaining/skipped and reprioritizes

    // --- Determine Next Step ---
    const nextQuestionId = session.remainingQuestionIds.length > 0 ? session.remainingQuestionIds.shift() : null; // Get and remove the next prioritized one
    session.markModified('remainingQuestionIds'); // Mark as modified after shift

    session.completionPercentage = await this.calculateProgress(session);
    const isComplete = !nextQuestionId && session.remainingQuestionIds.length === 0;
    let finalRecommendations = null;
    if (isComplete) {
        session.status = 'completed';
        session.completedAt = new Date();
        console.log(`ENGINE: Quiz complete for session ${sessionId}`);
        // TODO: Trigger final recommendation generation
    }

    // --- Save Session & Return ---
    await session.save();
    const nextQuestion = nextQuestionId ? await this.getQuestionData(nextQuestionId) : null;

    return {
        nextQuestion,
        progress: session.completionPercentage,
        isComplete,
        recommendations: finalRecommendations
    };
  }

  // Updates session.remainingQuestionIds and session.skippedQuestionIds based on rules
  async updateQuestionLists(session, answeredQuestion, answer, preliminaryScores) {
    if (!answeredQuestion?.rules?.length) return;

    const currentAnswers = session.responses.reduce((acc, r) => { acc[r.questionId] = r.responseValue; return acc; }, {});
    let changesMade = false;

    for (const rule of answeredQuestion.rules) {
      let conditionMet = this.evaluateRuleCondition(rule.condition, answer, currentAnswers, preliminaryScores);

      if (conditionMet) {
        console.log(`ENGINE: Rule condition met: "${rule.condition}", Action: ${rule.action}, Questions: ${rule.questions}`);
        if (rule.action === 'add') {
          for (const qId of rule.questions) {
              if (!session.responses.some(r => r.questionId === qId) &&
                  !session.skippedQuestionIds.includes(qId) &&
                  !session.remainingQuestionIds.includes(qId)) {
                 const exists = await Question.exists({ questionId: qId, isActive: true });
                 if (exists) {
                    session.remainingQuestionIds.push(qId);
                    changesMade = true;
                    console.log(`ENGINE: Added question ${qId} to remaining list.`);
                 } else { console.warn(`ENGINE: Rule tried to add non-existent/inactive question ${qId}`); }
              }
          }
        } else if (rule.action === 'remove') {
          const initialLength = session.remainingQuestionIds.length;
          session.remainingQuestionIds = session.remainingQuestionIds.filter(qId => !rule.questions.includes(qId));
          if (session.remainingQuestionIds.length !== initialLength) changesMade = true;

          rule.questions.forEach(qId => {
              if (!session.skippedQuestionIds.includes(qId)) {
                 session.skippedQuestionIds.push(qId);
                 changesMade = true;
                 console.log(`ENGINE: Added question ${qId} to skipped list.`);
              }
          });
        }
      }
    }

    // Reprioritize if any questions were added or removed by rules
    if (changesMade) {
        session.remainingQuestionIds = await this.reprioritizeQuestions(session.remainingQuestionIds, currentAnswers, preliminaryScores);
        // MarkModified is handled by session.save() if the array reference changes or direct methods like push/pull are used.
    }
  }

  // Evaluates a rule condition string (Expanded Placeholder)
  evaluateRuleCondition(conditionString, answer, currentAnswers, preliminaryScores) {
      try {
          // --- Direct Answer Checks ---
          // answer === 'value'
          let match = conditionString.match(/^answer\s*===\s*["'](.*)["']$/);
          if (match && answer === match[1]) return true;
          // answer !== 'value'
          match = conditionString.match(/^answer\s*!==\s*["'](.*)["']$/);
          if (match && answer !== match[1]) return true;
          // answer > number
          match = conditionString.match(/^answer\s*>\s*(\d+(\.\d+)?)$/);
          if (match && typeof answer === 'number' && answer > parseFloat(match[1])) return true;
          // answer < number
          match = conditionString.match(/^answer\s*<\s*(\d+(\.\d+)?)$/);
          if (match && typeof answer === 'number' && answer < parseFloat(match[1])) return true;
          // answer >= number
          match = conditionString.match(/^answer\s*>=\s*(\d+(\.\d+)?)$/);
          if (match && typeof answer === 'number' && answer >= parseFloat(match[1])) return true;
          // answer <= number
          match = conditionString.match(/^answer\s*<=\s*(\d+(\.\d+)?)$/);
          if (match && typeof answer === 'number' && answer <= parseFloat(match[1])) return true;
          // answer === number (use parseFloat for comparison)
           match = conditionString.match(/^answer\s*===\s*(\d+(\.\d+)?)$/);
           if (match && typeof answer === 'number' && answer === parseFloat(match[1])) return true;

          // --- Current Answers Checks ---
          // currentAnswers.questionId === 'value'
          match = conditionString.match(/^currentAnswers\.(\w+)\s*===\s*["'](.*)["']$/);
          if (match && currentAnswers[match[1]] === match[2]) return true;
          // currentAnswers.questionId !== 'value'
          match = conditionString.match(/^currentAnswers\.(\w+)\s*!==\s*["'](.*)["']$/);
          if (match && currentAnswers[match[1]] !== match[2]) return true;
          // currentAnswers.questionId > number
          match = conditionString.match(/^currentAnswers\.(\w+)\s*>\s*(\d+(\.\d+)?)$/);
          if (match && typeof currentAnswers[match[1]] === 'number' && currentAnswers[match[1]] > parseFloat(match[2])) return true;
          // currentAnswers.questionId < number
          match = conditionString.match(/^currentAnswers\.(\w+)\s*<\s*(\d+(\.\d+)?)$/);
          if (match && typeof currentAnswers[match[1]] === 'number' && currentAnswers[match[1]] < parseFloat(match[2])) return true;
          // currentAnswers.questionId >= number
           match = conditionString.match(/^currentAnswers\.(\w+)\s*>=\s*(\d+(\.\d+)?)$/);
           if (match && typeof currentAnswers[match[1]] === 'number' && currentAnswers[match[1]] >= parseFloat(match[2])) return true;
          // currentAnswers.questionId <= number
           match = conditionString.match(/^currentAnswers\.(\w+)\s*<=\s*(\d+(\.\d+)?)$/);
           if (match && typeof currentAnswers[match[1]] === 'number' && currentAnswers[match[1]] <= parseFloat(match[2])) return true;
          // currentAnswers.questionId === number
           match = conditionString.match(/^currentAnswers\.(\w+)\s*===\s*(\d+(\.\d+)?)$/);
           if (match && typeof currentAnswers[match[1]] === 'number' && currentAnswers[match[1]] === parseFloat(match[2])) return true;
          // currentAnswers.questionId exists (is answered)
          match = conditionString.match(/^currentAnswers\.(\w+)\s*exists$/);
          if (match && currentAnswers.hasOwnProperty(match[1])) return true;


          // --- Preliminary Scores Checks ---
          // preliminaryScores.someKey === 'value' (assuming simple structure)
          match = conditionString.match(/^preliminaryScores\.(\w+)\s*===\s*["'](.*)["']$/);
          if (match && preliminaryScores && preliminaryScores[match[1]] === match[2]) return true;
          // preliminaryScores.someKey > number
          match = conditionString.match(/^preliminaryScores\.(\w+)\s*>\s*(\d+(\.\d+)?)$/);
          if (match && preliminaryScores && typeof preliminaryScores[match[1]] === 'number' && preliminaryScores[match[1]] > parseFloat(match[2])) return true;
          // preliminaryScores.someArrayKey.includes('value')
          match = conditionString.match(/^preliminaryScores\.(\w+)\.includes\(["'](.*)["']\)$/);
          if (match && preliminaryScores && Array.isArray(preliminaryScores[match[1]]) && preliminaryScores[match[1]].includes(match[2])) return true;

          // --- Add more complex parsing or use a library for robust evaluation ---
          console.warn(`Rule condition evaluation did not match implemented patterns for: ${conditionString}`);
          return false;
      } catch (error) {
          console.error(`Error evaluating rule condition "${conditionString}":`, error);
          return false; // Fail safe
      }
  }


  // Sorts and returns the prioritized list of remaining questions
  async reprioritizeQuestions(remainingQuestionIds, currentAnswers, preliminaryScores) {
    if (!remainingQuestionIds || remainingQuestionIds.length === 0) return [];

    const questionsWithScores = await Promise.all(remainingQuestionIds.map(async (qId) => ({
        id: qId,
        score: await this.calculateQuestionRelevance(qId, currentAnswers, preliminaryScores)
    })));

    questionsWithScores.sort((a, b) => b.score - a.score); // Higher score first

    const newOrder = questionsWithScores.map(item => item.id);
    console.log("ENGINE: Reprioritized questions order:", newOrder);
    return newOrder;
  }

  // Calculates relevance score for a question (Improved Placeholder)
  async calculateQuestionRelevance(questionId, currentAnswers, preliminaryScores) {
    const question = await this.getQuestionData(questionId);
    if (!question) return 0;

    let relevanceScore = question.baseRelevance || 5;

    // Example: Boost relevance if question relates to top pathway types
    if (preliminaryScores?.topPathwayTypes && question.section) {
       if (preliminaryScores.topPathwayTypes.some(type => question.section.toLowerCase().includes(type.toLowerCase()))) {
           relevanceScore += 3; // Boost score
           console.log(`ENGINE: Boosting relevance for ${questionId} due to pathway match.`);
       }
    }

    // --- Apply Relevance Factors ---
    if (question.relevanceFactors && question.relevanceFactors.length > 0) {
        for (const factor of question.relevanceFactors) {
            const answerValue = currentAnswers[factor.profileKey];
            // Only evaluate if the profileKey exists in currentAnswers
            if (answerValue !== undefined) {
                const conditionMet = this.evaluateRelevanceCondition(
                    answerValue,
                    factor.condition,
                    factor.value
                );
                if (conditionMet) {
                    relevanceScore += factor.modifier;
                    console.log(`ENGINE: Relevance factor met for ${questionId} (Key: ${factor.profileKey}, Condition: ${factor.condition}, Value: ${factor.value}). Score adjusted by ${factor.modifier}. New score: ${relevanceScore}`);
                }
            }
        }
    }
    // --- End Apply Relevance Factors ---


    // Ensure score doesn't go below 0 (or some defined minimum)
    return Math.max(0, relevanceScore);
  }

  // Helper to evaluate conditions for relevance factors
  evaluateRelevanceCondition(answerValue, condition, factorValue) {
      try {
          switch (condition) {
              case 'equals':
                  // Handle potential type differences, e.g., string '5' vs number 5
                  // For simplicity, using loose equality here, but strict might be better with type casting
                  return answerValue == factorValue;
              case 'notEquals':
                  return answerValue != factorValue;
              case 'greaterThan':
                  return typeof answerValue === 'number' && answerValue > factorValue;
              case 'lessThan':
                  return typeof answerValue === 'number' && answerValue < factorValue;
              case 'greaterThanOrEquals':
                   return typeof answerValue === 'number' && answerValue >= factorValue;
              case 'lessThanOrEquals':
                   return typeof answerValue === 'number' && answerValue <= factorValue;
              case 'contains': // Assumes answerValue is an array or string
                  if (Array.isArray(answerValue)) {
                      return answerValue.includes(factorValue);
                  } else if (typeof answerValue === 'string') {
                      return answerValue.includes(factorValue);
                  }
                  return false;
              case 'notContains': // Assumes answerValue is an array or string
                   if (Array.isArray(answerValue)) {
                       return !answerValue.includes(factorValue);
                   } else if (typeof answerValue === 'string') {
                       return !answerValue.includes(factorValue);
                   }
                   return false;
              case 'exists': // Checks if the answerValue is not null or undefined
                  return answerValue !== null && answerValue !== undefined;
              default:
                  console.warn(`Unsupported relevance factor condition: ${condition}`);
                  return false;
          }
      } catch (error) {
          console.error(`Error evaluating relevance condition "${condition}" with values "${answerValue}" and "${factorValue}":`, error);
          return false; // Fail safe
      }
  }

  // Determines the next question ID based *only* on the current session state (for resuming)
   determineNextQuestionId(session) {
       if (!session || session.status !== 'in_progress') return null;
       // Simply return the first question from the potentially reprioritized list stored in the session
       if (session.remainingQuestionIds && session.remainingQuestionIds.length > 0) {
           return session.remainingQuestionIds[0];
       }
       console.log(`Session ${session.sessionId} has no more questions in remaining list.`);
       return null;
   }


  // Triggers NLP analysis
  async triggerNlpAnalysis(userId, questionId, answerText) {
    try {
        const analysisResult = await this.nlpService.analyzeText(answerText, questionId);
        this.userProfileService.updateFromNlp(userId, questionId, analysisResult).catch(err => console.error("NLP Profile update failed:", err));
    } catch (error) {
        console.error(`NLP Analysis failed for question ${questionId}, user ${userId}:`, error);
    }
  }

  // Calculates quiz progress percentage
  async calculateProgress(session) {
      const totalQuestions = await this.getTotalQuestionCount();
      const completedCount = session.responses.length;
      const progress = totalQuestions === 0 ? 100 : Math.round((completedCount / totalQuestions) * 100);
      return Math.min(progress, 100);
  }
}

module.exports = EnhancedAdaptiveQuizEngine;
