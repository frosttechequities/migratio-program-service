/**
 * Profile Analyzer
 *
 * Analyzes user profiles to extract relevant information for immigration recommendations.
 */

const { logger } = require('../../utils/logger');
const { Profile } = require('../../models/profile.model');
const { QuizSession } = require('../../models/quiz-session.model');
const { Response } = require('../../models/response.model');

class ProfileAnalyzer {
  /**
   * Analyze a user profile
   * @param {string} userId - User ID
   * @param {string} sessionId - Assessment session ID (optional)
   * @returns {Promise<Object>} - Profile analysis
   */
  async analyzeProfile(userId, sessionId = null) {
    try {
      logger.info(`Analyzing profile for user ${userId}`);

      // Get user profile
      const profile = await Profile.findOne({ userId });
      if (!profile) {
        throw new Error('User profile not found');
      }

      // Get assessment responses if sessionId is provided
      let assessmentResponses = [];
      if (sessionId) {
        const session = await QuizSession.findOne({ sessionId });
        if (session) {
          assessmentResponses = await Response.getSessionResponses(sessionId);
        }
      }

      // Analyze different aspects of the profile
      const personalInfo = this.analyzePersonalInfo(profile, assessmentResponses);
      const educationInfo = this.analyzeEducation(profile, assessmentResponses);
      const workInfo = this.analyzeWorkExperience(profile, assessmentResponses);
      const languageInfo = this.analyzeLanguageProficiency(profile, assessmentResponses);
      const financialInfo = this.analyzeFinancialInfo(profile, assessmentResponses);
      const immigrationPreferences = this.analyzeImmigrationPreferences(profile, assessmentResponses);

      // Calculate overall profile strength
      const profileStrength = this.calculateProfileStrength({
        personalInfo,
        educationInfo,
        workInfo,
        languageInfo,
        financialInfo
      });

      return {
        userId,
        sessionId,
        personalInfo,
        educationInfo,
        workInfo,
        languageInfo,
        financialInfo,
        immigrationPreferences,
        profileStrength,
        profileCompleteness: profile.completeness || 0
      };
    } catch (error) {
      logger.error(`Error analyzing profile for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze personal information
   * @param {Object} profile - User profile
   * @param {Array} responses - Assessment responses
   * @returns {Object} - Analyzed personal information
   */
  analyzePersonalInfo(profile, responses) {
    try {
      const personalInfo = profile.personalInfo || {};

      // Calculate age from date of birth
      let age = null;
      if (personalInfo.dateOfBirth) {
        const birthDate = new Date(personalInfo.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      // Get nationality/citizenship
      const nationalities = personalInfo.nationality || [];
      const primaryNationality = nationalities.find(n => n.isPrimary)?.country ||
                                (nationalities.length > 0 ? nationalities[0].country : null);

      // Get current residence
      const currentResidence = personalInfo.currentResidence?.country || null;

      // Determine if the person has dependents
      const hasDependents = personalInfo.hasChildren || false;
      const numberOfDependents = personalInfo.numberOfChildren || 0;

      // Determine marital status
      const maritalStatus = personalInfo.maritalStatus || null;
      const hasSpouse = maritalStatus === 'married' || maritalStatus === 'common_law';

      return {
        age,
        dateOfBirth: personalInfo.dateOfBirth,
        nationalities,
        primaryNationality,
        currentResidence,
        maritalStatus,
        hasSpouse,
        hasDependents,
        numberOfDependents,
        // Age-based factors for immigration scoring
        ageFactors: {
          isOptimalAge: age >= 25 && age <= 35,
          isYoung: age < 25,
          isMature: age > 35 && age <= 45,
          isSenior: age > 45
        }
      };
    } catch (error) {
      logger.error(`Error analyzing personal information: ${error.message}`);
      return {};
    }
  }

  /**
   * Analyze education information
   * @param {Object} profile - User profile
   * @param {Array} responses - Assessment responses
   * @returns {Object} - Analyzed education information
   */
  analyzeEducation(profile, responses) {
    try {
      const education = profile.education || [];

      // Find highest education level
      const educationLevels = {
        'high_school': 1,
        'certificate': 2,
        'diploma': 3,
        'associate': 4,
        'bachelors': 5,
        'post_graduate_diploma': 6,
        'masters': 7,
        'doctoral': 8,
        'professional': 8
      };

      let highestEducation = null;
      let highestLevel = 0;

      education.forEach(edu => {
        const level = educationLevels[edu.level] || 0;
        if (level > highestLevel) {
          highestLevel = level;
          highestEducation = edu;
        }
      });

      // Check for education in destination countries
      const destinationCountries = profile.immigrationPreferences?.destinationCountries?.map(d => d.country) || [];
      const hasEducationInDestination = education.some(edu =>
        destinationCountries.includes(edu.country)
      );

      // Check for STEM education
      const stemFields = ['computer_science', 'engineering', 'mathematics', 'physics', 'chemistry', 'biology'];
      const hasStemEducation = education.some(edu =>
        stemFields.includes(edu.field)
      );

      return {
        allEducation: education,
        highestEducation,
        highestLevel,
        hasEducationInDestination,
        hasStemEducation,
        // Education-based factors for immigration scoring
        educationFactors: {
          hasPostSecondary: highestLevel >= 3,
          hasBachelors: highestLevel >= 5,
          hasMasters: highestLevel >= 7,
          hasPhd: highestLevel >= 8,
          hasDesirableField: hasStemEducation
        }
      };
    } catch (error) {
      logger.error(`Error analyzing education information: ${error.message}`);
      return {};
    }
  }

  /**
   * Analyze work experience
   * @param {Object} profile - User profile
   * @param {Array} responses - Assessment responses
   * @returns {Object} - Analyzed work experience
   */
  analyzeWorkExperience(profile, responses) {
    try {
      const workExperience = profile.workExperience || [];

      // Calculate total years of experience
      const totalYearsOfExperience = workExperience.reduce((total, job) => {
        if (job.startDate && (job.endDate || job.isCurrentJob)) {
          const start = new Date(job.startDate);
          const end = job.isCurrentJob ? new Date() : new Date(job.endDate);
          const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
          return total + years;
        }
        return total;
      }, 0);

      // Check for experience in destination countries
      const destinationCountries = profile.immigrationPreferences?.destinationCountries?.map(d => d.country) || [];
      const hasExperienceInDestination = workExperience.some(job =>
        destinationCountries.includes(job.country)
      );

      // Check for managerial experience
      const hasManagerialExperience = workExperience.some(job =>
        job.jobTitle?.toLowerCase().includes('manager') ||
        job.jobTitle?.toLowerCase().includes('director') ||
        job.jobTitle?.toLowerCase().includes('lead') ||
        job.isManagerial
      );

      // Check for experience in high-demand fields
      const highDemandFields = [
        'software', 'healthcare', 'nursing', 'medicine', 'engineering',
        'data', 'ai', 'machine learning', 'construction', 'trades'
      ];

      const hasHighDemandExperience = workExperience.some(job =>
        highDemandFields.some(field =>
          job.jobTitle?.toLowerCase().includes(field) ||
          job.industry?.toLowerCase().includes(field)
        )
      );

      // Get current job
      const currentJob = workExperience.find(job => job.isCurrentJob);

      return {
        allWorkExperience: workExperience,
        totalYearsOfExperience,
        hasExperienceInDestination,
        hasManagerialExperience,
        hasHighDemandExperience,
        currentJob,
        // Work-based factors for immigration scoring
        workFactors: {
          hasMinimumExperience: totalYearsOfExperience >= 1,
          hasSubstantialExperience: totalYearsOfExperience >= 3,
          hasSeniorExperience: totalYearsOfExperience >= 5,
          hasDesirableExperience: hasHighDemandExperience,
          hasLeadershipExperience: hasManagerialExperience
        }
      };
    } catch (error) {
      logger.error(`Error analyzing work experience: ${error.message}`);
      return {};
    }
  }

  /**
   * Analyze language proficiency
   * @param {Object} profile - User profile
   * @param {Array} responses - Assessment responses
   * @returns {Object} - Analyzed language proficiency
   */
  analyzeLanguageProficiency(profile, responses) {
    try {
      const languageProficiency = profile.languageProficiency || [];

      // Get English proficiency
      const englishProficiency = languageProficiency.find(lang =>
        lang.language.toLowerCase() === 'english'
      );

      // Get French proficiency
      const frenchProficiency = languageProficiency.find(lang =>
        lang.language.toLowerCase() === 'french'
      );

      // Convert language scores to CLB levels
      const englishClb = this.convertToCLB(englishProficiency);
      const frenchClb = this.convertToCLB(frenchProficiency);

      // Determine if bilingual
      const isBilingual = englishClb >= 5 && frenchClb >= 5;

      return {
        allLanguages: languageProficiency,
        englishProficiency,
        frenchProficiency,
        englishClb,
        frenchClb,
        isBilingual,
        // Language-based factors for immigration scoring
        languageFactors: {
          hasMinimumEnglish: englishClb >= 4,
          hasIntermediateEnglish: englishClb >= 7,
          hasAdvancedEnglish: englishClb >= 9,
          hasFrench: frenchClb >= 4,
          isBilingual
        }
      };
    } catch (error) {
      logger.error(`Error analyzing language proficiency: ${error.message}`);
      return {};
    }
  }

  /**
   * Convert language proficiency to CLB level
   * @param {Object} proficiency - Language proficiency
   * @returns {number} - CLB level
   */
  convertToCLB(proficiency) {
    if (!proficiency) return 0;

    // If CLB is already provided
    if (proficiency.clbLevel) {
      return proficiency.clbLevel;
    }

    // If IELTS scores are provided
    if (proficiency.testType === 'ielts' && proficiency.reading && proficiency.writing &&
        proficiency.speaking && proficiency.listening) {
      // IELTS to CLB conversion (simplified)
      const scores = [
        proficiency.reading,
        proficiency.writing,
        proficiency.speaking,
        proficiency.listening
      ];

      const minScore = Math.min(...scores);

      if (minScore >= 8.0) return 10;
      if (minScore >= 7.5) return 9;
      if (minScore >= 7.0) return 8;
      if (minScore >= 6.5) return 7;
      if (minScore >= 6.0) return 6;
      if (minScore >= 5.5) return 5;
      if (minScore >= 5.0) return 4;
      if (minScore >= 4.0) return 3;
      return 0;
    }

    // If CELPIP scores are provided
    if (proficiency.testType === 'celpip' && proficiency.reading && proficiency.writing &&
        proficiency.speaking && proficiency.listening) {
      // CELPIP scores are already aligned with CLB levels
      const scores = [
        proficiency.reading,
        proficiency.writing,
        proficiency.speaking,
        proficiency.listening
      ];

      return Math.min(...scores);
    }

    // If TEF/TCF scores are provided for French
    if ((proficiency.testType === 'tef' || proficiency.testType === 'tcf') &&
        proficiency.reading && proficiency.writing && proficiency.speaking && proficiency.listening) {
      // Simplified conversion
      const avgScore = (proficiency.reading + proficiency.writing +
                        proficiency.speaking + proficiency.listening) / 4;

      if (avgScore >= 450) return 10;
      if (avgScore >= 400) return 9;
      if (avgScore >= 350) return 8;
      if (avgScore >= 300) return 7;
      if (avgScore >= 250) return 6;
      if (avgScore >= 200) return 5;
      if (avgScore >= 150) return 4;
      return 0;
    }

    // If only overall score is provided
    if (proficiency.overallScore) {
      // Simplified conversion based on overall score
      if (proficiency.testType === 'ielts') {
        if (proficiency.overallScore >= 8.0) return 10;
        if (proficiency.overallScore >= 7.5) return 9;
        if (proficiency.overallScore >= 7.0) return 8;
        if (proficiency.overallScore >= 6.5) return 7;
        if (proficiency.overallScore >= 6.0) return 6;
        if (proficiency.overallScore >= 5.5) return 5;
        if (proficiency.overallScore >= 5.0) return 4;
        return 0;
      }

      if (proficiency.testType === 'celpip') {
        return Math.min(proficiency.overallScore, 10);
      }

      if (proficiency.testType === 'tef' || proficiency.testType === 'tcf') {
        if (proficiency.overallScore >= 450) return 10;
        if (proficiency.overallScore >= 400) return 9;
        if (proficiency.overallScore >= 350) return 8;
        if (proficiency.overallScore >= 300) return 7;
        if (proficiency.overallScore >= 250) return 6;
        if (proficiency.overallScore >= 200) return 5;
        if (proficiency.overallScore >= 150) return 4;
        return 0;
      }

      // For self-assessment or other test types, use a scale of 0-10
      return Math.min(Math.round(proficiency.overallScore), 10);
    }

    return 0;
  }

  /**
   * Analyze financial information
   * @param {Object} profile - User profile
   * @param {Array} responses - Assessment responses
   * @returns {Object} - Analyzed financial information
   */
  analyzeFinancialInfo(profile, responses) {
    try {
      const financialInfo = profile.financialInfo || {};

      // Determine financial capacity levels
      const netWorth = financialInfo.netWorth || 0;
      const liquidAssets = financialInfo.liquidAssets || 0;
      const annualIncome = financialInfo.annualIncome || 0;

      // Financial capacity levels
      const hasMinimumFinancialCapacity = liquidAssets >= 10000;
      const hasModerateFinancialCapacity = liquidAssets >= 25000;
      const hasSubstantialFinancialCapacity = liquidAssets >= 100000;
      const hasInvestorCapacity = liquidAssets >= 300000;

      // Income levels
      const hasLowIncome = annualIncome < 30000;
      const hasModerateIncome = annualIncome >= 30000 && annualIncome < 60000;
      const hasHighIncome = annualIncome >= 60000 && annualIncome < 100000;
      const hasVeryHighIncome = annualIncome >= 100000;

      return {
        netWorth,
        liquidAssets,
        annualIncome,
        ownsRealEstate: financialInfo.ownsRealEstate || false,
        hasBusinessInvestments: financialInfo.hasBusinessInvestments || false,
        // Financial-based factors for immigration scoring
        financialFactors: {
          hasMinimumFinancialCapacity,
          hasModerateFinancialCapacity,
          hasSubstantialFinancialCapacity,
          hasInvestorCapacity,
          hasLowIncome,
          hasModerateIncome,
          hasHighIncome,
          hasVeryHighIncome
        }
      };
    } catch (error) {
      logger.error(`Error analyzing financial information: ${error.message}`);
      return {};
    }
  }

  /**
   * Analyze immigration preferences
   * @param {Object} profile - User profile
   * @param {Array} responses - Assessment responses
   * @returns {Object} - Analyzed immigration preferences
   */
  analyzeImmigrationPreferences(profile, responses) {
    try {
      const immigrationPreferences = profile.immigrationPreferences || {};

      // Get destination countries
      const destinationCountries = immigrationPreferences.destinationCountries || [];

      // Get pathway types
      const pathwayTypes = immigrationPreferences.pathwayTypes || [];

      // Get timeframe
      const timeframe = immigrationPreferences.timeframe || null;

      // Get budget range
      const budgetRange = immigrationPreferences.budgetRange || null;

      // Get priority factors
      const priorityFactors = immigrationPreferences.priorityFactors || [];

      // Determine if willing to study
      const willingToStudy = immigrationPreferences.willingToStudy || false;

      // Determine if willing to invest
      const willingToInvest = immigrationPreferences.willingToInvest || false;

      // Determine if willing to live in rural areas
      const willingToLiveInRuralArea = immigrationPreferences.willingToLiveInRuralArea || false;

      return {
        destinationCountries,
        pathwayTypes,
        timeframe,
        budgetRange,
        priorityFactors,
        willingToStudy,
        willingToInvest,
        willingToLiveInRuralArea,
        // Preference-based factors for immigration scoring
        preferenceFactors: {
          hasSpecificDestination: destinationCountries.length > 0,
          hasSpecificPathway: pathwayTypes.length > 0,
          isFlexibleOnLocation: willingToLiveInRuralArea,
          isFlexibleOnPathway: pathwayTypes.length === 0 || pathwayTypes.length > 2,
          hasUrgentTimeframe: timeframe === 'immediate' || timeframe === 'within-6-months',
          hasFlexibleTimeframe: timeframe === 'flexible' || timeframe === 'within-2-years'
        }
      };
    } catch (error) {
      logger.error(`Error analyzing immigration preferences: ${error.message}`);
      return {};
    }
  }

  /**
   * Calculate overall profile strength
   * @param {Object} analysis - Profile analysis
   * @returns {Object} - Profile strength
   */
  calculateProfileStrength(analysis) {
    try {
      // Calculate scores for different categories
      const ageScore = this.calculateAgeScore(analysis.personalInfo);
      const educationScore = this.calculateEducationScore(analysis.educationInfo);
      const workScore = this.calculateWorkScore(analysis.workInfo);
      const languageScore = this.calculateLanguageScore(analysis.languageInfo);
      const financialScore = this.calculateFinancialScore(analysis.financialInfo);

      // Calculate overall score (weighted average)
      const weights = {
        age: 15,
        education: 25,
        work: 25,
        language: 25,
        financial: 10
      };

      const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

      const overallScore = (
        (ageScore * weights.age) +
        (educationScore * weights.education) +
        (workScore * weights.work) +
        (languageScore * weights.language) +
        (financialScore * weights.financial)
      ) / totalWeight;

      // Determine profile strength category
      let strengthCategory;
      if (overallScore >= 85) {
        strengthCategory = 'excellent';
      } else if (overallScore >= 70) {
        strengthCategory = 'strong';
      } else if (overallScore >= 50) {
        strengthCategory = 'moderate';
      } else {
        strengthCategory = 'limited';
      }

      return {
        overall: Math.round(overallScore),
        age: Math.round(ageScore),
        education: Math.round(educationScore),
        work: Math.round(workScore),
        language: Math.round(languageScore),
        financial: Math.round(financialScore),
        category: strengthCategory
      };
    } catch (error) {
      logger.error(`Error calculating profile strength: ${error.message}`);
      return {
        overall: 0,
        age: 0,
        education: 0,
        work: 0,
        language: 0,
        financial: 0,
        category: 'unknown'
      };
    }
  }

  /**
   * Calculate age score
   * @param {Object} personalInfo - Personal information
   * @returns {number} - Age score (0-100)
   */
  calculateAgeScore(personalInfo) {
    if (!personalInfo || !personalInfo.age) return 0;

    const age = personalInfo.age;

    // Age scoring based on real-world immigration point systems (Canada Express Entry and Australia)
    if (age < 18) {
      return 0;
    } else if (age >= 18 && age <= 24) {
      return 80; // Good but not optimal
    } else if (age >= 25 && age <= 32) {
      return 100; // Optimal age range for most immigration programs
    } else if (age === 33) {
      return 95;
    } else if (age === 34) {
      return 90;
    } else if (age === 35) {
      return 85;
    } else if (age === 36) {
      return 80;
    } else if (age === 37) {
      return 75;
    } else if (age === 38) {
      return 70;
    } else if (age === 39) {
      return 65;
    } else if (age === 40) {
      return 60;
    } else if (age === 41) {
      return 55;
    } else if (age === 42) {
      return 50;
    } else if (age === 43) {
      return 45;
    } else if (age === 44) {
      return 35;
    } else if (age === 45) {
      return 25;
    } else if (age >= 46 && age <= 50) {
      return 15;
    } else {
      return 0; // Most immigration programs don't award points for age over 50
    }
  }

  /**
   * Calculate education score
   * @param {Object} educationInfo - Education information
   * @returns {number} - Education score (0-100)
   */
  calculateEducationScore(educationInfo) {
    if (!educationInfo || !educationInfo.highestLevel) return 0;

    // Education level scoring based on real-world immigration systems (Canada Express Entry and Australia)
    const levelScores = {
      1: 0,    // High school (no points in most skilled immigration programs)
      2: 40,   // Certificate (trade qualification/certificate)
      3: 50,   // Diploma (1-2 year diploma)
      4: 60,   // Associate degree (2-year degree)
      5: 75,   // Bachelor's degree (3-4 year degree)
      6: 85,   // Post-graduate diploma (graduate certificate/diploma)
      7: 90,   // Master's degree
      8: 100   // Doctoral/Professional degree (PhD)
    };

    const baseScore = levelScores[educationInfo.highestLevel] || 0;

    // Bonus for education in destination country (recognized in both Canada and Australia)
    const destinationBonus = educationInfo.hasEducationInDestination ? 15 : 0;

    // Bonus for STEM education (in-demand fields get additional points)
    const stemBonus = educationInfo.hasStemEducation ? 15 : 0;

    // Bonus for Australian study requirement (2+ years study in Australia)
    // or Canadian education (Canadian educational credential)
    const localStudyBonus = (educationInfo.hasEducationInDestination &&
                            educationInfo.highestEducation?.duration >= 2) ? 10 : 0;

    // Calculate total score (capped at 100)
    return Math.min(baseScore + destinationBonus + stemBonus + localStudyBonus, 100);
  }

  /**
   * Calculate work score
   * @param {Object} workInfo - Work information
   * @returns {number} - Work score (0-100)
   */
  calculateWorkScore(workInfo) {
    if (!workInfo) return 0;

    // Base score based on years of experience - aligned with Express Entry and Australia's points system
    let baseScore = 0;
    const years = workInfo.totalYearsOfExperience || 0;

    // Foreign skilled work experience scoring
    if (years >= 8) {
      baseScore = 100; // Maximum points for extensive experience
    } else if (years >= 6) {
      baseScore = 90; // High points for substantial experience
    } else if (years >= 4) {
      baseScore = 80; // Good points for moderate experience
    } else if (years >= 3) {
      baseScore = 70; // Moderate points for some experience
    } else if (years >= 2) {
      baseScore = 60; // Basic points for minimal experience
    } else if (years >= 1) {
      baseScore = 40; // Minimum points for entry-level experience
    } else {
      baseScore = 0; // No points for less than 1 year
    }

    // Bonus for experience in destination country (highly valued in both Canada and Australia)
    const destinationYears = workInfo.allWorkExperience?.filter(job =>
      job.country === workInfo.currentJob?.country
    ).reduce((total, job) => {
      if (job.startDate && (job.endDate || job.isCurrentJob)) {
        const start = new Date(job.startDate);
        const end = job.isCurrentJob ? new Date() : new Date(job.endDate);
        const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
        return total + years;
      }
      return total;
    }, 0) || 0;

    let destinationBonus = 0;
    if (destinationYears >= 5) {
      destinationBonus = 25; // Maximum points for 5+ years in destination country
    } else if (destinationYears >= 3) {
      destinationBonus = 20; // High points for 3-5 years in destination country
    } else if (destinationYears >= 1) {
      destinationBonus = 15; // Moderate points for 1-3 years in destination country
    }

    // Bonus for managerial experience (valued in skilled migration)
    const managerialBonus = workInfo.hasManagerialExperience ? 10 : 0;

    // Bonus for high-demand field (occupation on skills shortage list)
    const highDemandBonus = workInfo.hasHighDemandExperience ? 15 : 0;

    // Calculate total score (capped at 100)
    return Math.min(baseScore + destinationBonus + managerialBonus + highDemandBonus, 100);
  }

  /**
   * Calculate language score
   * @param {Object} languageInfo - Language information
   * @returns {number} - Language score (0-100)
   */
  calculateLanguageScore(languageInfo) {
    if (!languageInfo) return 0;

    // English score based on CLB level - aligned with Express Entry and Australia's points system
    const englishClb = languageInfo.englishClb || 0;
    let englishScore = 0;

    // First official language (English) scoring
    if (englishClb >= 10) {
      englishScore = 100; // Maximum points for superior English
    } else if (englishClb === 9) {
      englishScore = 90; // Near-maximum points for proficient English
    } else if (englishClb === 8) {
      englishScore = 80; // High points for proficient English
    } else if (englishClb === 7) {
      englishScore = 70; // Good points for competent plus English
    } else if (englishClb === 6) {
      englishScore = 60; // Moderate points for competent English
    } else if (englishClb === 5) {
      englishScore = 50; // Basic points for modest English
    } else if (englishClb === 4) {
      englishScore = 30; // Minimum points for basic English
    } else {
      englishScore = 0; // Below minimum requirement for most programs
    }

    // French score based on CLB level - with additional points for French (Canada specific)
    const frenchClb = languageInfo.frenchClb || 0;
    let frenchScore = 0;

    // Second official language (French) scoring
    if (frenchClb >= 7) {
      frenchScore = 30; // Maximum points for proficient French
    } else if (frenchClb >= 5) {
      frenchScore = 20; // Moderate points for intermediate French
    } else if (frenchClb >= 4) {
      frenchScore = 10; // Minimum points for basic French
    }

    // Bilingual bonus - specific to Canadian immigration
    const bilingualBonus = (englishClb >= 5 && frenchClb >= 5) ? 20 : 0;

    // Calculate total score (capped at 100)
    return Math.min(englishScore + (frenchScore * 0.5) + bilingualBonus, 100);
  }

  /**
   * Calculate financial score
   * @param {Object} financialInfo - Financial information
   * @returns {number} - Financial score (0-100)
   */
  calculateFinancialScore(financialInfo) {
    if (!financialInfo) return 0;

    // Score based on liquid assets - aligned with settlement funds requirements and business visa thresholds
    const liquidAssets = financialInfo.liquidAssets || 0;
    let liquidAssetsScore = 0;

    // Thresholds based on real immigration program requirements
    if (liquidAssets >= 1500000) {
      liquidAssetsScore = 100; // Investor visa level (UK, Australia, Canada)
    } else if (liquidAssets >= 500000) {
      liquidAssetsScore = 90; // Business/entrepreneur visa level
    } else if (liquidAssets >= 300000) {
      liquidAssetsScore = 80; // Start-up visa level
    } else if (liquidAssets >= 100000) {
      liquidAssetsScore = 70; // Self-employed visa level
    } else if (liquidAssets >= 50000) {
      liquidAssetsScore = 60; // Settlement funds for family of 6+
    } else if (liquidAssets >= 25000) {
      liquidAssetsScore = 50; // Settlement funds for family of 3-5
    } else if (liquidAssets >= 15000) {
      liquidAssetsScore = 40; // Settlement funds for couple
    } else if (liquidAssets >= 10000) {
      liquidAssetsScore = 30; // Minimum settlement funds for single person
    } else if (liquidAssets >= 5000) {
      liquidAssetsScore = 20; // Below minimum for most programs
    } else {
      liquidAssetsScore = 0; // Insufficient funds
    }

    // Score based on annual income - aligned with minimum income requirements and salary thresholds
    const annualIncome = financialInfo.annualIncome || 0;
    let incomeScore = 0;

    // Income thresholds based on real visa salary requirements
    if (annualIncome >= 150000) {
      incomeScore = 100; // High-income threshold (UK Global Talent equivalent)
    } else if (annualIncome >= 100000) {
      incomeScore = 90; // Senior professional salary
    } else if (annualIncome >= 80000) {
      incomeScore = 80; // Professional salary
    } else if (annualIncome >= 60000) {
      incomeScore = 70; // Skilled worker upper threshold
    } else if (annualIncome >= 45000) {
      incomeScore = 60; // Skilled worker middle threshold
    } else if (annualIncome >= 38700) {
      incomeScore = 50; // UK Skilled Worker minimum (2024)
    } else if (annualIncome >= 30000) {
      incomeScore = 40; // Lower skilled threshold
    } else if (annualIncome >= 20000) {
      incomeScore = 20; // Below minimum for most skilled programs
    } else {
      incomeScore = 0; // Insufficient income
    }

    // Bonus for owning real estate (relevant for some business/investor visas)
    const realEstateBonus = financialInfo.ownsRealEstate ? 10 : 0;

    // Bonus for business investments (relevant for entrepreneur/investor visas)
    const businessBonus = financialInfo.hasBusinessInvestments ? 15 : 0;

    // Calculate weighted score (liquid assets 40%, income 40%, bonuses 20%)
    return Math.min(
      (liquidAssetsScore * 0.4) + (incomeScore * 0.4) + realEstateBonus + businessBonus,
      100
    );
  }
}

module.exports = ProfileAnalyzer;
