/**
 * Program Matcher
 *
 * Matches user profiles with immigration programs based on eligibility criteria.
 */

const { logger } = require('../../utils/logger');

class ProgramMatcher {
  /**
   * Match programs to a user profile
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Array} programs - Immigration programs
   * @param {Object} preferences - User preferences
   * @returns {Promise<Array>} - Matched programs with scores
   */
  async matchPrograms(profileAnalysis, programs, preferences = {}) {
    try {
      logger.info(`Matching programs for user ${profileAnalysis.userId}`);

      // Filter programs based on user preferences
      const filteredPrograms = this.filterProgramsByPreferences(programs, preferences);
      logger.info(`Filtered to ${filteredPrograms.length} programs based on preferences`);

      // Match each program
      const matchedPrograms = [];

      for (const program of filteredPrograms) {
        try {
          const matchResult = this.matchProgram(profileAnalysis, program);

          // Only include programs with a minimum match score
          if (matchResult.matchScore >= 50) {
            matchedPrograms.push(matchResult);
          }
        } catch (error) {
          logger.error(`Error matching program ${program.programId}: ${error.message}`);
        }
      }

      // Sort by match score (descending)
      matchedPrograms.sort((a, b) => b.matchScore - a.matchScore);

      logger.info(`Matched ${matchedPrograms.length} programs for user ${profileAnalysis.userId}`);
      return matchedPrograms;
    } catch (error) {
      logger.error(`Error matching programs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Match programs with relaxed criteria
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Array} programs - Immigration programs
   * @returns {Promise<Array>} - Matched programs with scores
   */
  async matchProgramsRelaxed(profileAnalysis, programs) {
    try {
      logger.info(`Matching programs with relaxed criteria for user ${profileAnalysis.userId}`);

      // Match each program with relaxed criteria
      const matchedPrograms = [];

      for (const program of programs) {
        try {
          const matchResult = this.matchProgramRelaxed(profileAnalysis, program);

          // Only include programs with a minimum match score
          if (matchResult.matchScore >= 30) {
            matchedPrograms.push(matchResult);
          }
        } catch (error) {
          logger.error(`Error matching program with relaxed criteria ${program.programId}: ${error.message}`);
        }
      }

      // Sort by match score (descending)
      matchedPrograms.sort((a, b) => b.matchScore - a.matchScore);

      logger.info(`Matched ${matchedPrograms.length} programs with relaxed criteria for user ${profileAnalysis.userId}`);
      return matchedPrograms;
    } catch (error) {
      logger.error(`Error matching programs with relaxed criteria: ${error.message}`);
      throw error;
    }
  }

  /**
   * Filter programs based on user preferences
   * @param {Array} programs - Immigration programs
   * @param {Object} preferences - User preferences
   * @returns {Array} - Filtered programs
   */
  filterProgramsByPreferences(programs, preferences) {
    // Start with all programs
    let filteredPrograms = [...programs];

    // Filter by countries if specified
    if (preferences.countries && preferences.countries.length > 0) {
      filteredPrograms = filteredPrograms.filter(program =>
        preferences.countries.includes(program.country)
      );
    }

    // Filter by program categories if specified
    if (preferences.pathwayTypes && preferences.pathwayTypes.length > 0) {
      filteredPrograms = filteredPrograms.filter(program =>
        preferences.pathwayTypes.includes(program.category)
      );
    }

    // Filter by processing time if specified
    if (preferences.timeframe) {
      const maxMonths = this.getMaxMonthsFromTimeframe(preferences.timeframe);
      if (maxMonths) {
        filteredPrograms = filteredPrograms.filter(program =>
          !program.processingTime ||
          !program.processingTime.max ||
          program.processingTime.max <= maxMonths
        );
      }
    }

    // Filter by budget if specified
    if (preferences.budgetRange && preferences.budgetRange.max) {
      filteredPrograms = filteredPrograms.filter(program =>
        !program.fees ||
        !program.fees.total ||
        program.fees.total <= preferences.budgetRange.max
      );
    }

    return filteredPrograms;
  }

  /**
   * Get maximum processing time in months from timeframe preference
   * @param {string} timeframe - Timeframe preference
   * @returns {number|null} - Maximum months
   */
  getMaxMonthsFromTimeframe(timeframe) {
    switch (timeframe) {
      case 'immediate':
        return 3;
      case 'within-6-months':
        return 6;
      case 'within-1-year':
        return 12;
      case 'within-2-years':
        return 24;
      default:
        return null;
    }
  }

  /**
   * Match a single program to a user profile
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} program - Immigration program
   * @returns {Object} - Match result
   */
  matchProgram(profileAnalysis, program) {
    // Initialize match result
    const matchResult = {
      programId: program.programId,
      programName: program.name,
      countryId: program.country,
      category: program.category,
      description: program.description,
      officialUrl: program.officialUrl,
      processingTime: program.processingTime,
      fees: program.fees,
      successProbability: program.successRate || 0.5,
      matchScore: 0,
      matchCategory: 'poor',
      keyStrengths: [],
      keyWeaknesses: [],
      eligibilityDetails: []
    };

    // If no eligibility criteria, use a basic match
    if (!program.eligibilityCriteria || program.eligibilityCriteria.length === 0) {
      const basicScore = this.calculateBasicMatchScore(profileAnalysis, program);
      matchResult.matchScore = basicScore;
      matchResult.matchCategory = this.getMatchCategory(basicScore);
      return matchResult;
    }

    // Evaluate each criterion
    const criteriaResults = [];
    let totalPoints = 0;
    let earnedPoints = 0;
    let requiredCriteriaCount = 0;
    let metRequiredCriteriaCount = 0;

    for (const criterion of program.eligibilityCriteria) {
      const criterionResult = this.evaluateCriterion(criterion, profileAnalysis);
      criteriaResults.push(criterionResult);

      // Add to eligibility details
      matchResult.eligibilityDetails.push({
        criterionId: criterion.criterionId,
        criterionName: criterion.name,
        description: criterion.description,
        required: criterion.required,
        score: criterionResult.score,
        message: criterionResult.message,
        userValue: criterionResult.userValue,
        maxPoints: criterionResult.maxPoints,
        earnedPoints: criterionResult.earnedPoints
      });

      // Add to total points
      totalPoints += criterionResult.maxPoints;
      earnedPoints += criterionResult.earnedPoints;

      // Track required criteria
      if (criterion.required) {
        requiredCriteriaCount++;
        if (criterionResult.score >= 50) {
          metRequiredCriteriaCount++;
        }
      }

      // Add to strengths or weaknesses
      if (criterionResult.score >= 80) {
        matchResult.keyStrengths.push({
          criterionId: criterion.criterionId,
          criterionName: criterion.name,
          description: criterionResult.message,
          score: criterionResult.score,
          userValue: criterionResult.userValue
        });
      } else if (criterion.required && criterionResult.score < 50) {
        matchResult.keyWeaknesses.push({
          criterionId: criterion.criterionId,
          criterionName: criterion.name,
          description: criterionResult.message,
          score: criterionResult.score,
          userValue: criterionResult.userValue
        });
      }
    }

    // Calculate overall match score
    let overallScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 50;

    // Check for disqualifying criteria (required criteria that weren't met)
    if (requiredCriteriaCount > 0 && metRequiredCriteriaCount < requiredCriteriaCount) {
      // Calculate percentage of required criteria met
      const requiredCriteriaPercentage = (metRequiredCriteriaCount / requiredCriteriaCount) * 100;

      // Adjust overall score based on required criteria met
      // If no required criteria are met, score should be very low
      if (metRequiredCriteriaCount === 0) {
        overallScore = Math.min(overallScore, 20);
      } else {
        // Blend the overall score with the required criteria percentage
        overallScore = (overallScore * 0.4) + (requiredCriteriaPercentage * 0.6);
      }
    }

    // Apply country-specific scoring adjustments
    overallScore = this.applyCountrySpecificScoring(overallScore, program.country, criteriaResults);

    // Round and set the match score
    matchResult.matchScore = Math.round(overallScore);
    matchResult.matchCategory = this.getMatchCategory(overallScore);

    return matchResult;
  }

  /**
   * Apply country-specific scoring adjustments
   * @param {number} score - Initial score
   * @param {string} country - Country
   * @param {Array} criteriaResults - Results of criteria evaluation
   * @returns {number} - Adjusted score
   */
  applyCountrySpecificScoring(score, country, criteriaResults) {
    let adjustedScore = score;

    switch (country) {
      case 'Canada':
        // For Canada, Express Entry programs heavily weight language and education
        const languageCriterion = criteriaResults.find(r => r.name === 'Language Proficiency');
        const educationCriterion = criteriaResults.find(r => r.name === 'Education');

        if (languageCriterion && languageCriterion.score < 60) {
          // Language is critical for Express Entry
          adjustedScore = adjustedScore * 0.8;
        }

        if (educationCriterion && educationCriterion.score < 50) {
          // Education is important but slightly less critical
          adjustedScore = adjustedScore * 0.9;
        }
        break;

      case 'Australia':
        // For Australia, points-based programs have strict age requirements
        const ageCriterion = criteriaResults.find(r => r.name === 'Age');
        const englishCriterion = criteriaResults.find(r => r.name === 'English Language Ability');

        if (ageCriterion && ageCriterion.score < 50) {
          // Age is very important for Australian points-based programs
          adjustedScore = adjustedScore * 0.8;
        }

        if (englishCriterion && englishCriterion.score < 60) {
          // English proficiency is critical
          adjustedScore = adjustedScore * 0.85;
        }
        break;

      case 'United Kingdom':
        // For UK, job offer and salary are often the most critical factors
        const jobOfferCriterion = criteriaResults.find(r => r.name === 'Job Offer');
        const salaryCriterion = criteriaResults.find(r => r.name === 'Salary');

        if (jobOfferCriterion && jobOfferCriterion.score < 50) {
          // Job offer is critical for many UK visas
          adjustedScore = adjustedScore * 0.75;
        }

        if (salaryCriterion && salaryCriterion.score < 50) {
          // Salary requirements are strict
          adjustedScore = adjustedScore * 0.8;
        }
        break;
    }

    return adjustedScore;
  }

  /**
   * Match a single program with relaxed criteria
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} program - Immigration program
   * @returns {Object} - Match result
   */
  matchProgramRelaxed(profileAnalysis, program) {
    // Start with regular match
    const matchResult = this.matchProgram(profileAnalysis, program);

    // Increase match score for relaxed matching
    matchResult.matchScore = Math.min(100, matchResult.matchScore + 20);
    matchResult.matchCategory = this.getMatchCategory(matchResult.matchScore);
    matchResult.isAlternative = true;

    return matchResult;
  }

  /**
   * Calculate a basic match score when no detailed criteria are available
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} program - Immigration program
   * @returns {number} - Match score
   */
  calculateBasicMatchScore(profileAnalysis, program) {
    // Use profile strength as a base
    const baseScore = profileAnalysis.profileStrength.overall;

    // Adjust based on program category
    let categoryAdjustment = 0;

    switch (program.category.toLowerCase()) {
      case 'skilled worker':
        categoryAdjustment =
          (profileAnalysis.educationInfo.educationFactors.hasBachelors ? 10 : -10) +
          (profileAnalysis.workInfo.workFactors.hasSubstantialExperience ? 10 : -10) +
          (profileAnalysis.languageInfo.languageFactors.hasIntermediateEnglish ? 10 : -10);
        break;

      case 'business':
        categoryAdjustment =
          (profileAnalysis.financialInfo.financialFactors.hasInvestorCapacity ? 20 : -20) +
          (profileAnalysis.workInfo.workFactors.hasLeadershipExperience ? 10 : -10);
        break;

      case 'family':
        // Family programs are less dependent on skills/education
        categoryAdjustment = 10;
        break;

      case 'study':
        categoryAdjustment =
          (profileAnalysis.educationInfo.educationFactors.hasBachelors ? 10 : 0) +
          (profileAnalysis.languageInfo.languageFactors.hasIntermediateEnglish ? 10 : -10) +
          (profileAnalysis.financialInfo.financialFactors.hasModerateFinancialCapacity ? 10 : -10);
        break;
    }

    // Calculate final score
    const finalScore = Math.max(30, Math.min(100, baseScore + categoryAdjustment));
    return Math.round(finalScore);
  }

  /**
   * Evaluate a single criterion against a user profile
   * @param {Object} criterion - Eligibility criterion
   * @param {Object} profileAnalysis - User profile analysis
   * @returns {Object} - Evaluation result
   */
  evaluateCriterion(criterion, profileAnalysis) {
    // Initialize result
    const result = {
      criterionId: criterion.criterionId,
      name: criterion.name,
      isRequired: criterion.required,
      maxPoints: criterion.points || 100,
      earnedPoints: 0,
      score: 0,
      message: '',
      userValue: null
    };

    // Evaluate based on criterion type
    switch (criterion.type) {
      case 'range':
        return this.evaluateRangeCriterion(criterion, profileAnalysis, result);

      case 'level':
        return this.evaluateEducationLevelCriterion(criterion, profileAnalysis, result);

      case 'language':
        return this.evaluateLanguageCriterion(criterion, profileAnalysis, result);

      case 'boolean':
        return this.evaluateBooleanCriterion(criterion, profileAnalysis, result);

      case 'money':
        return this.evaluateMoneyCriterion(criterion, profileAnalysis, result);

      default:
        result.message = 'Unknown criterion type';
        return result;
    }
  }

  /**
   * Evaluate a range criterion (e.g., age, work experience)
   * @param {Object} criterion - Range criterion
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} result - Initial result object
   * @returns {Object} - Evaluation result
   */
  evaluateRangeCriterion(criterion, profileAnalysis, result) {
    let value = null;

    // Get the appropriate value based on criterion ID
    if (criterion.criterionId === 'age') {
      value = profileAnalysis.personalInfo.age;
      result.userValue = value;
    } else if (criterion.criterionId === 'work_experience') {
      value = profileAnalysis.workInfo.totalYearsOfExperience;
      result.userValue = `${value} years`;
    }

    // If no value found, return with zero score
    if (value === null) {
      result.message = 'No data available for this criterion';
      return result;
    }

    // Check if value is within range
    const min = criterion.min !== undefined ? criterion.min : -Infinity;
    const max = criterion.max !== undefined ? criterion.max : Infinity;
    const idealMin = criterion.idealMin !== undefined ? criterion.idealMin : min;
    const idealMax = criterion.idealMax !== undefined ? criterion.idealMax : max;

    // Calculate score
    let score = 0;

    if (value >= idealMin && value <= idealMax) {
      // Ideal range - full points
      score = 100;
      result.message = `Your value (${value}) is in the ideal range`;
    } else if (value >= min && value <= max) {
      // Within acceptable range but not ideal
      if (value < idealMin) {
        // Below ideal but above minimum
        score = 50 + ((value - min) / (idealMin - min)) * 50;
        result.message = `Your value (${value}) is below the ideal range but still acceptable`;
      } else {
        // Above ideal but below maximum
        score = 50 + ((max - value) / (max - idealMax)) * 50;
        result.message = `Your value (${value}) is above the ideal range but still acceptable`;
      }
    } else {
      // Outside acceptable range
      if (value < min) {
        score = Math.max(0, 50 - ((min - value) / min) * 50);
        result.message = `Your value (${value}) is below the minimum requirement`;
      } else {
        score = Math.max(0, 50 - ((value - max) / max) * 50);
        result.message = `Your value (${value}) is above the maximum requirement`;
      }
    }

    // Update result
    result.score = Math.round(score);
    result.earnedPoints = (result.score / 100) * result.maxPoints;

    return result;
  }

  /**
   * Evaluate an education level criterion
   * @param {Object} criterion - Education level criterion
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} result - Initial result object
   * @returns {Object} - Evaluation result
   */
  evaluateEducationLevelCriterion(criterion, profileAnalysis, result) {
    const highestLevel = profileAnalysis.educationInfo.highestLevel;
    const highestEducation = profileAnalysis.educationInfo.highestEducation;

    result.userValue = highestEducation ? highestEducation.level : 'None';

    // If no education data, return with zero score
    if (!highestLevel) {
      result.message = 'No education data available';
      return result;
    }

    // Find the matching level in criterion levels
    const educationLevelMap = {
      1: 'high_school',
      2: 'certificate',
      3: 'diploma',
      4: 'associate',
      5: 'bachelors',
      6: 'post_graduate_diploma',
      7: 'masters',
      8: 'doctoral'
    };

    const userLevelValue = educationLevelMap[highestLevel];

    // Find the user's level in the criterion levels
    const userLevelInCriterion = criterion.levels.find(level => level.value === userLevelValue);

    // Find the highest possible points
    const maxLevelPoints = Math.max(...criterion.levels.map(level => level.points));

    if (userLevelInCriterion) {
      // User has a matching level
      result.score = (userLevelInCriterion.points / maxLevelPoints) * 100;
      result.earnedPoints = userLevelInCriterion.points;
      result.message = `Your education level (${userLevelInCriterion.label}) meets the requirement`;
    } else {
      // Find the closest level below the user's level
      const levelsBelow = criterion.levels.filter(level => {
        const levelIndex = Object.values(educationLevelMap).indexOf(level.value);
        return levelIndex >= 0 && levelIndex < highestLevel;
      });

      if (levelsBelow.length > 0) {
        // Get the highest level below
        const highestLevelBelow = levelsBelow.reduce((prev, current) =>
          (prev.points > current.points) ? prev : current
        );

        result.score = (highestLevelBelow.points / maxLevelPoints) * 100;
        result.earnedPoints = highestLevelBelow.points;
        result.message = `Your education level exceeds the minimum requirement (${highestLevelBelow.label})`;
      } else {
        // No matching level and no levels below
        result.score = 0;
        result.earnedPoints = 0;
        result.message = 'Your education level does not meet the minimum requirement';
      }
    }

    // Round score
    result.score = Math.round(result.score);

    return result;
  }

  /**
   * Evaluate a language criterion
   * @param {Object} criterion - Language criterion
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} result - Initial result object
   * @returns {Object} - Evaluation result
   */
  evaluateLanguageCriterion(criterion, profileAnalysis, result) {
    // Get language proficiency
    const englishClb = profileAnalysis.languageInfo.englishClb || 0;
    const frenchClb = profileAnalysis.languageInfo.frenchClb || 0;

    // Determine which language to evaluate
    const languages = criterion.languages || ['english'];
    const minLevel = criterion.minLevel || 0;
    const maxLevel = criterion.maxLevel || 12;

    // Calculate score for each language
    const languageScores = [];

    if (languages.includes('english')) {
      result.userValue = `English: CLB ${englishClb}`;

      if (englishClb >= minLevel) {
        // Calculate score based on how far above minimum
        const levelRange = maxLevel - minLevel;
        const userLevelAboveMin = Math.min(englishClb - minLevel, levelRange);
        const languageScore = 50 + (userLevelAboveMin / levelRange) * 50;
        languageScores.push(languageScore);
      } else {
        // Below minimum
        const percentOfMin = englishClb / minLevel;
        const languageScore = percentOfMin * 50;
        languageScores.push(languageScore);
      }
    }

    if (languages.includes('french')) {
      result.userValue = result.userValue ?
        `${result.userValue}, French: CLB ${frenchClb}` :
        `French: CLB ${frenchClb}`;

      if (frenchClb >= minLevel) {
        // Calculate score based on how far above minimum
        const levelRange = maxLevel - minLevel;
        const userLevelAboveMin = Math.min(frenchClb - minLevel, levelRange);
        const languageScore = 50 + (userLevelAboveMin / levelRange) * 50;
        languageScores.push(languageScore);
      } else {
        // Below minimum
        const percentOfMin = frenchClb / minLevel;
        const languageScore = percentOfMin * 50;
        languageScores.push(languageScore);
      }
    }

    // Calculate overall language score
    const overallScore = languageScores.length > 0 ?
      languageScores.reduce((sum, score) => sum + score, 0) / languageScores.length :
      0;

    // Update result
    result.score = Math.round(overallScore);
    result.earnedPoints = (result.score / 100) * result.maxPoints;

    // Set message
    if (result.score >= 80) {
      result.message = `Your language proficiency exceeds the requirements`;
    } else if (result.score >= 50) {
      result.message = `Your language proficiency meets the minimum requirements`;
    } else {
      result.message = `Your language proficiency is below the minimum requirement of CLB ${minLevel}`;
    }

    return result;
  }

  /**
   * Evaluate a boolean criterion
   * @param {Object} criterion - Boolean criterion
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} result - Initial result object
   * @returns {Object} - Evaluation result
   */
  evaluateBooleanCriterion(criterion, profileAnalysis, result) {
    let value = false;

    // Determine value based on criterion ID
    switch (criterion.criterionId) {
      case 'arranged_employment':
        value = profileAnalysis.workInfo.workFactors.hasJobOffer || false;
        result.userValue = value ? 'Yes' : 'No';
        break;

      case 'intention_to_reside':
        // Assume true if user has selected the country as a destination
        const country = criterion.country || '';
        value = profileAnalysis.immigrationPreferences.destinationCountries.some(
          dest => dest.country === country
        );
        result.userValue = value ? 'Yes' : 'No';
        break;

      case 'qualifying_business':
        value = profileAnalysis.workInfo.workFactors.hasBusinessExperience ||
                profileAnalysis.financialInfo.financialFactors.hasBusinessInvestments ||
                false;
        result.userValue = value ? 'Yes' : 'No';
        break;

      case 'support_letter':
        // No direct way to determine this, assume false
        value = false;
        result.userValue = 'No';
        break;

      default:
        result.userValue = 'Unknown';
    }

    // Calculate score
    if (value) {
      result.score = 100;
      result.earnedPoints = result.maxPoints;
      result.message = 'You meet this requirement';
    } else {
      result.score = 0;
      result.earnedPoints = 0;
      result.message = 'You do not meet this requirement';
    }

    return result;
  }

  /**
   * Evaluate a money criterion
   * @param {Object} criterion - Money criterion
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} result - Initial result object
   * @returns {Object} - Evaluation result
   */
  evaluateMoneyCriterion(criterion, profileAnalysis, result) {
    // Get financial info
    const liquidAssets = profileAnalysis.financialInfo.liquidAssets || 0;
    result.userValue = `${liquidAssets} ${criterion.currency || 'CAD'}`;

    // Determine required amount based on family size
    const familySize = 1 +
      (profileAnalysis.personalInfo.hasSpouse ? 1 : 0) +
      (profileAnalysis.personalInfo.numberOfDependents || 0);

    // Find the appropriate amount for the family size
    let requiredAmount = 0;

    if (criterion.amounts) {
      // Find exact match
      const exactMatch = criterion.amounts.find(a => a.family_size === familySize);

      if (exactMatch) {
        requiredAmount = exactMatch.amount;
      } else {
        // Find the closest larger family size
        const largerSizes = criterion.amounts.filter(a => a.family_size > familySize);

        if (largerSizes.length > 0) {
          const closestLarger = largerSizes.reduce((prev, current) =>
            (prev.family_size < current.family_size) ? prev : current
          );
          requiredAmount = closestLarger.amount;
        } else {
          // Use the largest available size
          const largestSize = criterion.amounts.reduce((prev, current) =>
            (prev.family_size > current.family_size) ? prev : current
          );
          requiredAmount = largestSize.amount;
        }
      }
    }

    // Calculate score
    if (liquidAssets >= requiredAmount) {
      // Calculate how much above the requirement
      const percentAbove = Math.min((liquidAssets - requiredAmount) / requiredAmount, 1);
      result.score = 50 + percentAbove * 50;
      result.message = `Your liquid assets (${liquidAssets} ${criterion.currency || 'CAD'}) exceed the requirement (${requiredAmount} ${criterion.currency || 'CAD'})`;
    } else {
      // Calculate how close to the requirement
      const percentOfRequired = liquidAssets / requiredAmount;
      result.score = percentOfRequired * 50;
      result.message = `Your liquid assets (${liquidAssets} ${criterion.currency || 'CAD'}) are below the requirement (${requiredAmount} ${criterion.currency || 'CAD'})`;
    }

    // Update result
    result.score = Math.round(result.score);
    result.earnedPoints = (result.score / 100) * result.maxPoints;

    return result;
  }

  /**
   * Get match category based on score
   * @param {number} score - Match score
   * @returns {string} - Match category
   */
  getMatchCategory(score) {
    if (score >= 85) {
      return 'excellent';
    } else if (score >= 70) {
      return 'good';
    } else if (score >= 50) {
      return 'moderate';
    } else {
      return 'poor';
    }
  }
}

module.exports = ProgramMatcher;
