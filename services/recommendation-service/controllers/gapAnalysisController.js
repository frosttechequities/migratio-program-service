/**
 * Gap Analysis Controller
 * Handles requests related to qualification gap analysis
 */

const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Get gap analysis for a specific program
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Gap analysis data
 */
exports.getGapAnalysis = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { programId } = req.params;
    const userId = req.user?.id;

    if (!programId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Program ID is required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not authenticated'
      });
    }

    logger.info(`Performing gap analysis for program ${programId} and user ${userId}`);

    // TODO: Implement actual gap analysis algorithm
    // For now, use a rule-based approach based on user profile and program requirements

    // 1. Get user profile data
    const userProfile = await getUserProfile(userId);
    
    // 2. Get program data
    const program = await getProgramDetails(programId);
    
    // 3. Identify qualification gaps
    const gaps = identifyGaps(userProfile, program);
    
    // 4. Generate recommendations for closing gaps
    const recommendations = generateRecommendations(gaps);
    
    // 5. Create timeline estimation
    const timeline = estimateTimeline(gaps);

    return res.status(200).json({
      status: 'success',
      data: {
        gaps,
        recommendations,
        timeline
      }
    });
  } catch (error) {
    logger.error('Error performing gap analysis:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to perform gap analysis'
    });
  }
};

/**
 * Get user profile data
 * @param {string} userId - User ID
 * @returns {Object} User profile data
 */
const getUserProfile = async (userId) => {
  // TODO: Implement actual user profile retrieval from database or user service
  // For now, return mock data
  return {
    id: userId,
    education: {
      level: 'bachelor',
      field: 'computer science',
      yearsOfEducation: 16
    },
    workExperience: {
      years: 2,
      field: 'software development'
    },
    language: {
      english: {
        speaking: 6,
        listening: 7,
        reading: 8,
        writing: 6
      }
    },
    age: 32,
    financialStatus: {
      savings: 20000
    }
  };
};

/**
 * Get program details
 * @param {string} programId - Program ID
 * @returns {Object} Program details
 */
const getProgramDetails = async (programId) => {
  // TODO: Implement actual program details retrieval from database or program service
  // For now, return mock data based on program ID
  return {
    id: programId,
    name: programId.includes('express') ? 'Express Entry' : 'Provincial Nominee Program',
    country: 'Canada',
    requirements: {
      education: {
        minimumLevel: 'bachelor',
        points: 25
      },
      workExperience: {
        minimumYears: 3,
        points: 15
      },
      language: {
        english: {
          minimumScore: 7,
          points: 20
        }
      },
      age: {
        preferredRange: [25, 35],
        points: 12
      },
      financialStatus: {
        minimumSavings: 25000,
        points: 10
      }
    }
  };
};

/**
 * Identify qualification gaps
 * @param {Object} userProfile - User profile data
 * @param {Object} program - Program details
 * @returns {Array} Qualification gaps
 */
const identifyGaps = (userProfile, program) => {
  const gaps = [];
  
  // Work experience gap
  if (userProfile.workExperience.years < program.requirements.workExperience.minimumYears) {
    gaps.push({
      name: 'Work Experience',
      category: 'Work Experience',
      description: `You need additional work experience in a skilled occupation.`,
      severity: 'major',
      currentValue: `${userProfile.workExperience.years} years`,
      requiredValue: `${program.requirements.workExperience.minimumYears}+ years`,
      timeToClose: `${program.requirements.workExperience.minimumYears - userProfile.workExperience.years} years`
    });
  }
  
  // Language proficiency gap
  const englishAverage = (userProfile.language.english.speaking + 
                          userProfile.language.english.listening + 
                          userProfile.language.english.reading + 
                          userProfile.language.english.writing) / 4;
  
  if (englishAverage < program.requirements.language.english.minimumScore) {
    gaps.push({
      name: 'Language Proficiency',
      category: 'Language',
      description: 'Your language test scores need improvement.',
      severity: 'moderate',
      currentValue: `CLB ${Math.floor(englishAverage)}`,
      requiredValue: `CLB ${program.requirements.language.english.minimumScore}`,
      timeToClose: '6 months'
    });
  }
  
  // Financial status gap
  if (userProfile.financialStatus.savings < program.requirements.financialStatus.minimumSavings) {
    gaps.push({
      name: 'Financial Resources',
      category: 'Financial',
      description: 'You need to increase your financial resources to meet the requirements.',
      severity: 'moderate',
      currentValue: `$${userProfile.financialStatus.savings}`,
      requiredValue: `$${program.requirements.financialStatus.minimumSavings}`,
      timeToClose: '12 months'
    });
  }
  
  return gaps;
};

/**
 * Generate recommendations for closing gaps
 * @param {Array} gaps - Qualification gaps
 * @returns {Array} Recommendations
 */
const generateRecommendations = (gaps) => {
  const recommendations = [];
  
  // Work experience recommendation
  const workExperienceGap = gaps.find(gap => gap.name === 'Work Experience');
  if (workExperienceGap) {
    recommendations.push({
      title: 'Gain Additional Work Experience',
      description: 'Continue in your current role or seek opportunities in related fields.',
      steps: [
        'Stay in your current position for at least the required additional time',
        'Document all job responsibilities and achievements',
        'Request detailed reference letters from supervisors',
        'Consider opportunities for advancement or specialized roles'
      ],
      timeframe: workExperienceGap.timeToClose,
      difficulty: 'Medium',
      impact: 'High'
    });
  }
  
  // Language proficiency recommendation
  const languageGap = gaps.find(gap => gap.name === 'Language Proficiency');
  if (languageGap) {
    recommendations.push({
      title: 'Improve Language Proficiency',
      description: 'Take language courses and practice tests to improve your scores.',
      steps: [
        'Enroll in an IELTS or CELPIP preparation course',
        'Practice with official test materials',
        'Take a practice test every 2-4 weeks',
        'Focus on your weakest skills (speaking, writing, etc.)',
        'Schedule the official test when ready'
      ],
      timeframe: '3-6 months',
      difficulty: 'Medium',
      impact: 'High'
    });
  }
  
  // Financial resources recommendation
  const financialGap = gaps.find(gap => gap.name === 'Financial Resources');
  if (financialGap) {
    recommendations.push({
      title: 'Increase Financial Resources',
      description: 'Build your savings to meet the financial requirements.',
      steps: [
        'Create a budget and savings plan',
        'Reduce unnecessary expenses',
        'Consider additional income sources',
        'Set up automatic transfers to a dedicated savings account',
        'Track your progress monthly'
      ],
      timeframe: '6-12 months',
      difficulty: 'Medium',
      impact: 'Medium'
    });
  }
  
  return recommendations;
};

/**
 * Estimate timeline for closing all gaps
 * @param {Array} gaps - Qualification gaps
 * @returns {Object} Timeline estimation
 */
const estimateTimeline = (gaps) => {
  if (gaps.length === 0) {
    return {
      minMonths: 0,
      maxMonths: 0,
      milestones: []
    };
  }
  
  // Extract timeframes from gaps
  const timeframes = gaps.map(gap => {
    const timeToClose = gap.timeToClose;
    if (timeToClose.includes('years')) {
      const years = parseInt(timeToClose);
      return { months: years * 12, gap };
    } else if (timeToClose.includes('months')) {
      const months = parseInt(timeToClose);
      return { months, gap };
    } else {
      return { months: 3, gap }; // Default to 3 months if timeframe is unclear
    }
  });
  
  // Sort timeframes by duration (ascending)
  timeframes.sort((a, b) => a.months - b.months);
  
  // Create milestones
  const milestones = timeframes.map(tf => ({
    title: `${tf.gap.name} Target`,
    description: `Achieve required ${tf.gap.name.toLowerCase()} level`,
    timeframe: tf.gap.timeToClose
  }));
  
  // Calculate min and max months
  const minMonths = timeframes[0].months;
  const maxMonths = timeframes[timeframes.length - 1].months;
  
  return {
    minMonths,
    maxMonths,
    milestones
  };
};
