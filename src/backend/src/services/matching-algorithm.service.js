const { logger } = require('../utils/logger');

/**
 * Matching Algorithm Service
 * Handles the scoring and matching of user profiles to immigration programs
 */
class MatchingAlgorithmService {
  /**
   * Calculate match score between user profile and program
   * @param {Object} userProfile - User profile
   * @param {Object} program - Immigration program
   * @param {Object} options - Scoring options
   * @returns {Object} - Match result with scores and explanations
   */
  calculateMatchScore(userProfile, program, options = {}) {
    try {
      const startTime = Date.now();
      
      // Initialize result object
      const result = {
        userId: userProfile.userId,
        programId: program.programId,
        overallScore: 0,
        categoryScores: [],
        criterionScores: [],
        processingTime: 0
      };
      
      // Check if program is points-based
      const isPointsBased = program.pointsSystem && program.pointsSystem.isPointsBased;
      
      // Group criteria by category
      const criteriaByCategory = this._groupCriteriaByCategory(program.eligibilityCriteria);
      
      // Calculate scores for each criterion
      const criterionScores = this._calculateCriterionScores(userProfile, program, criteriaByCategory);
      result.criterionScores = criterionScores;
      
      // Calculate category scores
      result.categoryScores = this._calculateCategoryScores(criterionScores, criteriaByCategory);
      
      // Calculate overall score
      if (isPointsBased) {
        result.overallScore = this._calculatePointsBasedScore(criterionScores, program.pointsSystem);
      } else {
        result.overallScore = this._calculateCompositeScore(result.categoryScores);
      }
      
      // Apply preference adjustments if specified in options
      if (options.applyPreferenceAdjustments && userProfile.immigrationPreferences) {
        result.overallScore = this._applyPreferenceAdjustments(
          result.overallScore, 
          program, 
          userProfile.immigrationPreferences
        );
      }
      
      // Calculate processing time
      result.processingTime = Date.now() - startTime;
      
      return result;
    } catch (error) {
      logger.error('Error calculating match score:', error);
      throw error;
    }
  }
  
  /**
   * Group criteria by category
   * @param {Array} criteria - Program eligibility criteria
   * @returns {Object} - Criteria grouped by category
   * @private
   */
  _groupCriteriaByCategory(criteria) {
    const criteriaByCategory = {};
    
    criteria.forEach(criterion => {
      if (!criteriaByCategory[criterion.category]) {
        criteriaByCategory[criterion.category] = [];
      }
      criteriaByCategory[criterion.category].push(criterion);
    });
    
    return criteriaByCategory;
  }
  
  /**
   * Calculate scores for each criterion
   * @param {Object} userProfile - User profile
   * @param {Object} program - Immigration program
   * @param {Object} criteriaByCategory - Criteria grouped by category
   * @returns {Array} - Criterion scores
   * @private
   */
  _calculateCriterionScores(userProfile, program, criteriaByCategory) {
    const criterionScores = [];
    
    // Process each category
    Object.keys(criteriaByCategory).forEach(category => {
      const categoryCriteria = criteriaByCategory[category];
      
      // Process each criterion in the category
      categoryCriteria.forEach(criterion => {
        // Get user value for this criterion
        const userValue = this._getUserValueForCriterion(userProfile, criterion);
        
        // Calculate score for this criterion
        const score = this._scoreCriterion(userValue, criterion);
        
        // Determine impact (positive, neutral, negative)
        const impact = this._determineImpact(score, criterion);
        
        // Generate description
        const description = this._generateCriterionDescription(userValue, criterion, score);
        
        // Add to criterion scores
        criterionScores.push({
          criterionId: criterion.criterionId,
          criterionName: criterion.name,
          category: criterion.category,
          userValue,
          requiredValue: criterion.value,
          score,
          weight: criterion.pointsAwarded || 1,
          impact,
          description
        });
      });
    });
    
    return criterionScores;
  }
  
  /**
   * Get user value for a specific criterion
   * @param {Object} userProfile - User profile
   * @param {Object} criterion - Program criterion
   * @returns {*} - User value
   * @private
   */
  _getUserValueForCriterion(userProfile, criterion) {
    // Extract user value based on criterion category and ID
    switch (criterion.category) {
      case 'age':
        // Calculate age from date of birth
        if (userProfile.personalInfo && userProfile.personalInfo.dateOfBirth) {
          const dob = new Date(userProfile.personalInfo.dateOfBirth);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
          }
          
          return age;
        }
        return null;
        
      case 'education':
        if (userProfile.education && userProfile.education.length > 0) {
          // Find highest education level
          const educationLevels = {
            'high-school': 1,
            'certificate': 2,
            'diploma': 3,
            'associate': 4,
            'bachelor': 5,
            'master': 6,
            'doctorate': 7,
            'professional': 7
          };
          
          let highestLevel = 0;
          let highestEducation = null;
          
          userProfile.education.forEach(edu => {
            if (educationLevels[edu.level] > highestLevel) {
              highestLevel = educationLevels[edu.level];
              highestEducation = edu;
            }
          });
          
          return highestEducation;
        }
        return null;
        
      case 'work_experience':
        if (userProfile.workExperience && userProfile.workExperience.length > 0) {
          // Calculate total years of work experience
          let totalYears = 0;
          
          userProfile.workExperience.forEach(work => {
            const startDate = new Date(work.startDate);
            const endDate = work.isCurrentJob ? new Date() : new Date(work.endDate);
            
            // Calculate years between start and end dates
            const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
            totalYears += years;
          });
          
          return Math.round(totalYears * 10) / 10; // Round to 1 decimal place
        }
        return 0;
        
      case 'language':
        if (userProfile.languageProficiency && userProfile.languageProficiency.length > 0) {
          // Find language proficiency that matches criterion
          const criterionLanguage = criterion.criterionId.split('_')[1]; // e.g., "language_english_reading"
          
          const languageProficiency = userProfile.languageProficiency.find(
            lp => lp.language.toLowerCase() === criterionLanguage
          );
          
          if (languageProficiency) {
            // Check specific skill (reading, writing, speaking, listening) or overall
            const skill = criterion.criterionId.split('_')[2]; // e.g., "language_english_reading"
            
            if (skill && languageProficiency[skill]) {
              return languageProficiency[skill];
            }
            
            return languageProficiency.overallScore;
          }
        }
        return null;
        
      case 'financial':
        if (userProfile.financialInfo) {
          // Check specific financial criterion
          const financialCriterion = criterion.criterionId.split('_')[1]; // e.g., "financial_net_worth"
          
          switch (financialCriterion) {
            case 'net_worth':
              return userProfile.financialInfo.netWorth;
            case 'liquid_assets':
              return userProfile.financialInfo.liquidAssets;
            case 'annual_income':
              return userProfile.financialInfo.annualIncome;
            default:
              return null;
          }
        }
        return null;
        
      case 'family':
        // Family-related criteria
        return null; // Implement based on specific family criteria
        
      default:
        return null;
    }
  }
  
  /**
   * Score a criterion based on user value and criterion requirements
   * @param {*} userValue - User value
   * @param {Object} criterion - Program criterion
   * @returns {number} - Score (0-100)
   * @private
   */
  _scoreCriterion(userValue, criterion) {
    // If user value is null or undefined, return 0
    if (userValue === null || userValue === undefined) {
      return 0;
    }
    
    // Score based on criterion type
    switch (criterion.type) {
      case 'minimum':
        return this._scoreMinimumCriterion(userValue, criterion.value);
        
      case 'maximum':
        return this._scoreMaximumCriterion(userValue, criterion.value);
        
      case 'range':
        return this._scoreRangeCriterion(userValue, criterion.value);
        
      case 'exact':
        return this._scoreExactCriterion(userValue, criterion.value);
        
      case 'boolean':
        return this._scoreBooleanCriterion(userValue, criterion.value);
        
      case 'list':
        return this._scoreListCriterion(userValue, criterion.value);
        
      case 'points_table':
        return this._scorePointsTableCriterion(userValue, criterion.pointsTable);
        
      default:
        return 0;
    }
  }
  
  /**
   * Score a minimum criterion
   * @param {*} userValue - User value
   * @param {*} requiredValue - Required minimum value
   * @returns {number} - Score (0-100)
   * @private
   */
  _scoreMinimumCriterion(userValue, requiredValue) {
    // Convert to numbers if needed
    const userNum = typeof userValue === 'number' ? userValue : parseFloat(userValue);
    const reqNum = typeof requiredValue === 'number' ? requiredValue : parseFloat(requiredValue);
    
    // If user value is less than required, calculate partial score
    if (userNum < reqNum) {
      // Calculate percentage of requirement met
      const percentMet = (userNum / reqNum) * 100;
      // Cap at 80% for not meeting minimum
      return Math.min(80, percentMet);
    }
    
    // If user value meets or exceeds required value
    return 100;
  }
  
  /**
   * Score a maximum criterion
   * @param {*} userValue - User value
   * @param {*} requiredValue - Required maximum value
   * @returns {number} - Score (0-100)
   * @private
   */
  _scoreMaximumCriterion(userValue, requiredValue) {
    // Convert to numbers if needed
    const userNum = typeof userValue === 'number' ? userValue : parseFloat(userValue);
    const reqNum = typeof requiredValue === 'number' ? requiredValue : parseFloat(requiredValue);
    
    // If user value exceeds maximum, return 0
    if (userNum > reqNum) {
      return 0;
    }
    
    // If user value is within maximum
    // Score higher for values closer to maximum
    return 100 - ((reqNum - userNum) / reqNum) * 20;
  }
  
  /**
   * Score a range criterion
   * @param {*} userValue - User value
   * @param {Object} requiredValue - Required range {min, max}
   * @returns {number} - Score (0-100)
   * @private
   */
  _scoreRangeCriterion(userValue, requiredValue) {
    // Convert to numbers if needed
    const userNum = typeof userValue === 'number' ? userValue : parseFloat(userValue);
    const reqMin = typeof requiredValue.min === 'number' ? requiredValue.min : parseFloat(requiredValue.min);
    const reqMax = typeof requiredValue.max === 'number' ? requiredValue.max : parseFloat(requiredValue.max);
    
    // If user value is below minimum
    if (userNum < reqMin) {
      // Calculate percentage of minimum met
      const percentMet = (userNum / reqMin) * 100;
      // Cap at 80% for not meeting minimum
      return Math.min(80, percentMet);
    }
    
    // If user value is above maximum
    if (userNum > reqMax) {
      return 0;
    }
    
    // If user value is within range
    // Score higher for values in the middle of the range
    const rangeSize = reqMax - reqMin;
    const distanceFromMiddle = Math.abs(userNum - (reqMin + rangeSize / 2));
    const percentFromMiddle = (distanceFromMiddle / (rangeSize / 2)) * 20;
    
    return 100 - percentFromMiddle;
  }
  
  /**
   * Score an exact criterion
   * @param {*} userValue - User value
   * @param {*} requiredValue - Required exact value
   * @returns {number} - Score (0-100)
   * @private
   */
  _scoreExactCriterion(userValue, requiredValue) {
    // If user value exactly matches required value
    if (userValue === requiredValue) {
      return 100;
    }
    
    // If user value is a number and required value is a number
    if (typeof userValue === 'number' && typeof requiredValue === 'number') {
      // Calculate percentage difference
      const diff = Math.abs(userValue - requiredValue);
      const percentDiff = (diff / requiredValue) * 100;
      
      // Score based on how close the values are
      return Math.max(0, 100 - percentDiff);
    }
    
    // If values don't match and aren't numbers
    return 0;
  }
  
  /**
   * Score a boolean criterion
   * @param {*} userValue - User value
   * @param {*} requiredValue - Required boolean value
   * @returns {number} - Score (0-100)
   * @private
   */
  _scoreBooleanCriterion(userValue, requiredValue) {
    // Convert to boolean if needed
    const userBool = !!userValue;
    const reqBool = !!requiredValue;
    
    // If user value matches required value
    return userBool === reqBool ? 100 : 0;
  }
  
  /**
   * Score a list criterion
   * @param {*} userValue - User value
   * @param {Array} requiredValue - Required list of values
   * @returns {number} - Score (0-100)
   * @private
   */
  _scoreListCriterion(userValue, requiredValue) {
    // If user value is not an array, convert to array
    const userArray = Array.isArray(userValue) ? userValue : [userValue];
    const reqArray = Array.isArray(requiredValue) ? requiredValue : [requiredValue];
    
    // If required list is empty, return 100
    if (reqArray.length === 0) {
      return 100;
    }
    
    // Count matches
    let matches = 0;
    
    reqArray.forEach(reqItem => {
      if (userArray.includes(reqItem)) {
        matches++;
      }
    });
    
    // Calculate percentage of matches
    return (matches / reqArray.length) * 100;
  }
  
  /**
   * Score a points table criterion
   * @param {*} userValue - User value
   * @param {Array} pointsTable - Points table
   * @returns {number} - Score (0-100)
   * @private
   */
  _scorePointsTableCriterion(userValue, pointsTable) {
    // If points table is empty, return 0
    if (!pointsTable || pointsTable.length === 0) {
      return 0;
    }
    
    // Find matching condition in points table
    let matchedPoints = 0;
    let maxPoints = 0;
    
    pointsTable.forEach(entry => {
      // Update max points
      maxPoints = Math.max(maxPoints, entry.points);
      
      // Check if user value matches condition
      const condition = entry.condition;
      
      if (typeof condition === 'object') {
        // Range condition
        if (condition.min !== undefined && condition.max !== undefined) {
          const userNum = typeof userValue === 'number' ? userValue : parseFloat(userValue);
          if (userNum >= condition.min && userNum <= condition.max) {
            matchedPoints = Math.max(matchedPoints, entry.points);
          }
        }
        // Exact match condition
        else if (condition.value !== undefined) {
          if (userValue === condition.value) {
            matchedPoints = Math.max(matchedPoints, entry.points);
          }
        }
      }
      // Simple value condition
      else if (userValue === condition) {
        matchedPoints = Math.max(matchedPoints, entry.points);
      }
    });
    
    // Calculate percentage of max points
    return (matchedPoints / maxPoints) * 100;
  }
  
  /**
   * Determine impact of criterion score
   * @param {number} score - Criterion score
   * @param {Object} criterion - Program criterion
   * @returns {string} - Impact (positive, neutral, negative)
   * @private
   */
  _determineImpact(score, criterion) {
    // If criterion is mandatory and score is low, impact is negative
    if (criterion.isMandatory && score < 50) {
      return 'negative';
    }
    
    // If score is high, impact is positive
    if (score >= 80) {
      return 'positive';
    }
    
    // Otherwise, impact is neutral
    return 'neutral';
  }
  
  /**
   * Generate description for criterion score
   * @param {*} userValue - User value
   * @param {Object} criterion - Program criterion
   * @param {number} score - Criterion score
   * @returns {string} - Description
   * @private
   */
  _generateCriterionDescription(userValue, criterion, score) {
    // Generate description based on criterion type and score
    if (score === 0) {
      return `Does not meet the requirement for ${criterion.name}.`;
    }
    
    if (score < 50) {
      return `Partially meets the requirement for ${criterion.name}, but significant improvement needed.`;
    }
    
    if (score < 80) {
      return `Mostly meets the requirement for ${criterion.name}, but some improvement would help.`;
    }
    
    return `Fully meets the requirement for ${criterion.name}.`;
  }
  
  /**
   * Calculate category scores
   * @param {Array} criterionScores - Criterion scores
   * @param {Object} criteriaByCategory - Criteria grouped by category
   * @returns {Array} - Category scores
   * @private
   */
  _calculateCategoryScores(criterionScores, criteriaByCategory) {
    const categoryScores = [];
    
    // Process each category
    Object.keys(criteriaByCategory).forEach(category => {
      // Get criteria for this category
      const categoryCriteria = criteriaByCategory[category];
      
      // Get scores for this category
      const categoryScoreObjects = criterionScores.filter(cs => cs.category === category);
      
      // Calculate weighted average score for this category
      let totalWeight = 0;
      let weightedSum = 0;
      
      categoryScoreObjects.forEach(scoreObj => {
        weightedSum += scoreObj.score * scoreObj.weight;
        totalWeight += scoreObj.weight;
      });
      
      const avgScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
      
      // Add to category scores
      categoryScores.push({
        category,
        score: avgScore,
        weight: categoryCriteria.length, // Weight by number of criteria
        description: this._generateCategoryDescription(category, avgScore)
      });
    });
    
    return categoryScores;
  }
  
  /**
   * Generate description for category score
   * @param {string} category - Category
   * @param {number} score - Category score
   * @returns {string} - Description
   * @private
   */
  _generateCategoryDescription(category, score) {
    // Generate description based on category and score
    const categoryNames = {
      age: 'Age',
      education: 'Education',
      work_experience: 'Work Experience',
      language: 'Language Proficiency',
      financial: 'Financial Requirements',
      family: 'Family Status',
      other: 'Other Requirements'
    };
    
    const categoryName = categoryNames[category] || category;
    
    if (score < 50) {
      return `${categoryName} requirements are not sufficiently met.`;
    }
    
    if (score < 80) {
      return `${categoryName} requirements are partially met.`;
    }
    
    return `${categoryName} requirements are well met.`;
  }
  
  /**
   * Calculate composite score from category scores
   * @param {Array} categoryScores - Category scores
   * @returns {number} - Composite score
   * @private
   */
  _calculateCompositeScore(categoryScores) {
    let totalWeight = 0;
    let weightedSum = 0;
    
    categoryScores.forEach(cs => {
      weightedSum += cs.score * cs.weight;
      totalWeight += cs.weight;
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }
  
  /**
   * Calculate points-based score
   * @param {Array} criterionScores - Criterion scores
   * @param {Object} pointsSystem - Program points system
   * @returns {number} - Points-based score
   * @private
   */
  _calculatePointsBasedScore(criterionScores, pointsSystem) {
    // Calculate total points earned
    let totalPoints = 0;
    
    criterionScores.forEach(cs => {
      // Calculate points earned for this criterion
      const pointsEarned = (cs.score / 100) * cs.weight;
      totalPoints += pointsEarned;
    });
    
    // Calculate percentage of passing score
    const passingScore = pointsSystem.passingScore || 1;
    const percentOfPassing = (totalPoints / passingScore) * 100;
    
    // Cap at 100
    return Math.min(100, percentOfPassing);
  }
  
  /**
   * Apply preference adjustments to score
   * @param {number} baseScore - Base score
   * @param {Object} program - Immigration program
   * @param {Object} preferences - User preferences
   * @returns {number} - Adjusted score
   * @private
   */
  _applyPreferenceAdjustments(baseScore, program, preferences) {
    let adjustedScore = baseScore;
    
    // Country preference adjustment
    if (preferences.destinationCountries && preferences.destinationCountries.length > 0) {
      const preferredCountries = preferences.destinationCountries.map(c => 
        typeof c === 'string' ? c : c.country
      );
      
      if (preferredCountries.includes(program.countryId)) {
        adjustedScore *= 1.2; // 20% boost for preferred countries
      }
    }
    
    // Pathway type preference adjustment
    if (preferences.pathwayTypes && preferences.pathwayTypes.length > 0) {
      const preferredTypes = preferences.pathwayTypes.map(t => 
        typeof t === 'string' ? t : t.type
      );
      
      if (preferredTypes.includes(program.category)) {
        adjustedScore *= 1.1; // 10% boost for preferred pathway types
      }
    }
    
    // Timeline preference adjustment
    if (preferences.timeframe && program.details && program.details.processingTime) {
      const timelineMatch = this._calculateTimelineCompatibility(
        program.details.processingTime,
        preferences.timeframe
      );
      
      adjustedScore *= (0.8 + (timelineMatch * 0.4)); // Up to 20% adjustment
    }
    
    // Budget preference adjustment
    if (preferences.budgetRange && program.details && program.details.totalCost) {
      const costFactor = this._calculateCostCompatibility(
        program.details.totalCost,
        preferences.budgetRange
      );
      
      adjustedScore *= (0.8 + (costFactor * 0.4)); // Up to 20% adjustment
    }
    
    // Cap at 100
    return Math.min(100, adjustedScore);
  }
  
  /**
   * Calculate timeline compatibility
   * @param {Object} processingTime - Program processing time
   * @param {string} preferredTimeframe - User preferred timeframe
   * @returns {number} - Compatibility factor (0-1)
   * @private
   */
  _calculateTimelineCompatibility(processingTime, preferredTimeframe) {
    // Convert preferred timeframe to months
    let preferredMonths;
    
    switch (preferredTimeframe) {
      case 'immediate':
        preferredMonths = 3;
        break;
      case 'within-6-months':
        preferredMonths = 6;
        break;
      case 'within-1-year':
        preferredMonths = 12;
        break;
      case 'within-2-years':
        preferredMonths = 24;
        break;
      case 'flexible':
        return 1; // Fully compatible
      default:
        preferredMonths = 12;
    }
    
    // Get average processing time
    const avgProcessingTime = processingTime.average || 
      ((processingTime.min || 0) + (processingTime.max || 0)) / 2;
    
    // If processing time is within preferred timeframe
    if (avgProcessingTime <= preferredMonths) {
      return 1;
    }
    
    // Calculate compatibility factor
    return Math.max(0, 1 - ((avgProcessingTime - preferredMonths) / preferredMonths));
  }
  
  /**
   * Calculate cost compatibility
   * @param {Object} programCost - Program cost
   * @param {Object} budgetRange - User budget range
   * @returns {number} - Compatibility factor (0-1)
   * @private
   */
  _calculateCostCompatibility(programCost, budgetRange) {
    // Get average program cost
    const avgProgramCost = programCost.min && programCost.max ? 
      (programCost.min + programCost.max) / 2 : 
      (programCost.min || programCost.max || 0);
    
    // If budget range has min and max
    if (budgetRange.min !== undefined && budgetRange.max !== undefined) {
      // If program cost is within budget range
      if (avgProgramCost >= budgetRange.min && avgProgramCost <= budgetRange.max) {
        return 1;
      }
      
      // If program cost is below budget range
      if (avgProgramCost < budgetRange.min) {
        return 1; // Still fully compatible
      }
      
      // If program cost is above budget range
      const overBudgetFactor = (avgProgramCost - budgetRange.max) / budgetRange.max;
      return Math.max(0, 1 - overBudgetFactor);
    }
    
    // If budget range is a string (e.g., 'low', 'medium', 'high')
    if (typeof budgetRange === 'string') {
      // Define budget ranges
      const budgetRanges = {
        low: { max: 5000 },
        medium: { min: 5000, max: 20000 },
        high: { min: 20000 }
      };
      
      const range = budgetRanges[budgetRange];
      
      if (!range) {
        return 1; // Unknown budget range, assume compatible
      }
      
      // If program cost is within budget range
      if (range.min !== undefined && range.max !== undefined) {
        if (avgProgramCost >= range.min && avgProgramCost <= range.max) {
          return 1;
        }
      }
      // If only max is defined (low budget)
      else if (range.max !== undefined) {
        if (avgProgramCost <= range.max) {
          return 1;
        }
        
        const overBudgetFactor = (avgProgramCost - range.max) / range.max;
        return Math.max(0, 1 - overBudgetFactor);
      }
      // If only min is defined (high budget)
      else if (range.min !== undefined) {
        if (avgProgramCost >= range.min) {
          return 1;
        }
        
        return 1; // Under budget is still compatible
      }
    }
    
    return 1; // Default to compatible
  }
}

module.exports = MatchingAlgorithmService;
