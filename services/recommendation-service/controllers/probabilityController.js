/**
 * Success Probability Controller
 * Handles requests related to success probability prediction
 */

const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Calculate success probability for a specific program
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Success probability data
 */
exports.getSuccessProbability = async (req, res) => {
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

    logger.info(`Calculating success probability for program ${programId} and user ${userId}`);

    // TODO: Implement ML model for success probability prediction
    // For now, use a rule-based approach based on match score and program data

    // 1. Get user profile data
    // This would typically come from a database or user service
    const userProfile = await getUserProfile(userId);
    
    // 2. Get program data
    // This would typically come from a database or program service
    const program = await getProgramDetails(programId);
    
    // 3. Calculate success probability
    const probability = calculateProbability(userProfile, program);
    
    // 4. Identify positive and negative factors
    const { positiveFactors, negativeFactors } = identifyFactors(userProfile, program);

    return res.status(200).json({
      status: 'success',
      data: {
        probability,
        confidence: 'medium',
        positiveFactors,
        negativeFactors
      }
    });
  } catch (error) {
    logger.error('Error calculating success probability:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to calculate success probability'
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
      years: 5,
      field: 'software development'
    },
    language: {
      english: {
        speaking: 8,
        listening: 8,
        reading: 9,
        writing: 8
      }
    },
    age: 32,
    financialStatus: {
      savings: 50000
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
    },
    historicalSuccessRate: 0.75
  };
};

/**
 * Calculate success probability
 * @param {Object} userProfile - User profile data
 * @param {Object} program - Program details
 * @returns {number} Success probability (0-100)
 */
const calculateProbability = (userProfile, program) => {
  // Base probability on historical success rate
  let probability = program.historicalSuccessRate * 100;
  
  // Adjust based on user profile vs. requirements
  
  // Education
  if (userProfile.education.level === 'phd' || userProfile.education.level === 'master') {
    probability += 10;
  } else if (userProfile.education.level === program.requirements.education.minimumLevel) {
    probability += 5;
  } else {
    probability -= 15;
  }
  
  // Work experience
  if (userProfile.workExperience.years >= program.requirements.workExperience.minimumYears + 2) {
    probability += 10;
  } else if (userProfile.workExperience.years >= program.requirements.workExperience.minimumYears) {
    probability += 5;
  } else {
    probability -= 15;
  }
  
  // Language
  const englishAverage = (userProfile.language.english.speaking + 
                          userProfile.language.english.listening + 
                          userProfile.language.english.reading + 
                          userProfile.language.english.writing) / 4;
  
  if (englishAverage >= program.requirements.language.english.minimumScore + 1) {
    probability += 10;
  } else if (englishAverage >= program.requirements.language.english.minimumScore) {
    probability += 5;
  } else {
    probability -= 15;
  }
  
  // Age
  if (userProfile.age >= program.requirements.age.preferredRange[0] && 
      userProfile.age <= program.requirements.age.preferredRange[1]) {
    probability += 5;
  } else {
    probability -= 5;
  }
  
  // Financial status
  if (userProfile.financialStatus.savings >= program.requirements.financialStatus.minimumSavings * 1.5) {
    probability += 5;
  } else if (userProfile.financialStatus.savings >= program.requirements.financialStatus.minimumSavings) {
    probability += 2;
  } else {
    probability -= 10;
  }
  
  // Ensure probability is within 0-100 range
  probability = Math.max(0, Math.min(100, probability));
  
  return Math.round(probability);
};

/**
 * Identify positive and negative factors
 * @param {Object} userProfile - User profile data
 * @param {Object} program - Program details
 * @returns {Object} Positive and negative factors
 */
const identifyFactors = (userProfile, program) => {
  const positiveFactors = [];
  const negativeFactors = [];
  
  // Education
  if (userProfile.education.level === 'phd' || userProfile.education.level === 'master') {
    positiveFactors.push({
      name: 'Education Level',
      description: 'Your advanced degree significantly improves your chances.',
      impact: 'high'
    });
  } else if (userProfile.education.level === program.requirements.education.minimumLevel) {
    positiveFactors.push({
      name: 'Education Level',
      description: 'Your education meets the minimum requirements for this program.',
      impact: 'medium'
    });
  } else {
    negativeFactors.push({
      name: 'Education Level',
      description: 'Your education level is below the minimum requirements for this program.',
      impact: 'high'
    });
  }
  
  // Work experience
  if (userProfile.workExperience.years >= program.requirements.workExperience.minimumYears + 2) {
    positiveFactors.push({
      name: 'Work Experience',
      description: 'Your extensive work experience is a strong positive factor.',
      impact: 'high'
    });
  } else if (userProfile.workExperience.years >= program.requirements.workExperience.minimumYears) {
    positiveFactors.push({
      name: 'Work Experience',
      description: 'Your work experience meets the requirements for this program.',
      impact: 'medium'
    });
  } else {
    negativeFactors.push({
      name: 'Work Experience',
      description: 'You need more work experience to improve your chances.',
      impact: 'high'
    });
  }
  
  // Language
  const englishAverage = (userProfile.language.english.speaking + 
                          userProfile.language.english.listening + 
                          userProfile.language.english.reading + 
                          userProfile.language.english.writing) / 4;
  
  if (englishAverage >= program.requirements.language.english.minimumScore + 1) {
    positiveFactors.push({
      name: 'Language Proficiency',
      description: 'Your strong language skills significantly improve your chances.',
      impact: 'high'
    });
  } else if (englishAverage >= program.requirements.language.english.minimumScore) {
    positiveFactors.push({
      name: 'Language Proficiency',
      description: 'Your language skills meet the requirements for this program.',
      impact: 'medium'
    });
  } else {
    negativeFactors.push({
      name: 'Language Proficiency',
      description: 'Improving your language skills would increase your chances.',
      impact: 'high'
    });
  }
  
  // Age
  if (userProfile.age >= program.requirements.age.preferredRange[0] && 
      userProfile.age <= program.requirements.age.preferredRange[1]) {
    positiveFactors.push({
      name: 'Age',
      description: 'Your age is within the preferred range for this program.',
      impact: 'medium'
    });
  } else {
    negativeFactors.push({
      name: 'Age',
      description: 'Your age is outside the preferred range for this program.',
      impact: 'low'
    });
  }
  
  // Financial status
  if (userProfile.financialStatus.savings >= program.requirements.financialStatus.minimumSavings * 1.5) {
    positiveFactors.push({
      name: 'Financial Status',
      description: 'Your financial resources exceed the requirements, which is a positive factor.',
      impact: 'medium'
    });
  } else if (userProfile.financialStatus.savings >= program.requirements.financialStatus.minimumSavings) {
    positiveFactors.push({
      name: 'Financial Status',
      description: 'Your financial resources meet the requirements for this program.',
      impact: 'low'
    });
  } else {
    negativeFactors.push({
      name: 'Financial Status',
      description: 'You need to improve your financial situation to meet the requirements.',
      impact: 'medium'
    });
  }
  
  return { positiveFactors, negativeFactors };
};
