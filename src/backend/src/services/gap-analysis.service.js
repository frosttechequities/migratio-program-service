const { GapAnalysis } = require('../models/gap-analysis.model');
const { logger } = require('../utils/logger');

/**
 * Gap Analysis Service
 * Identifies gaps between user profile and program requirements
 * and provides improvement suggestions
 */
class GapAnalysisService {
  /**
   * Perform gap analysis
   * @param {Object} userProfile - User profile
   * @param {Object} program - Immigration program
   * @param {Object} matchResult - Match result
   * @returns {Promise<Object>} - Gap analysis result
   */
  async performGapAnalysis(userProfile, program, matchResult) {
    try {
      const startTime = Date.now();
      
      // Initialize gap analysis
      const gapAnalysis = {
        userId: userProfile.userId,
        programId: program.programId,
        recommendationId: matchResult.recommendationId,
        gaps: [],
        alternativePrograms: [],
        algorithmVersion: '1.0',
        processingTime: 0
      };
      
      // Identify gaps from criterion scores
      gapAnalysis.gaps = this._identifyGaps(matchResult.criterionScores, program);
      
      // Calculate processing time
      gapAnalysis.processingTime = Date.now() - startTime;
      
      // Create and save gap analysis
      const gapAnalysisDoc = new GapAnalysis(gapAnalysis);
      await gapAnalysisDoc.save();
      
      return gapAnalysisDoc;
    } catch (error) {
      logger.error('Error performing gap analysis:', error);
      throw error;
    }
  }
  
  /**
   * Identify gaps from criterion scores
   * @param {Array} criterionScores - Criterion scores
   * @param {Object} program - Immigration program
   * @returns {Array} - Identified gaps
   * @private
   */
  _identifyGaps(criterionScores, program) {
    const gaps = [];
    
    // Filter criterion scores with low scores
    const lowScores = criterionScores.filter(cs => cs.score < 80);
    
    // Process each low score
    lowScores.forEach(scoreObj => {
      // Find corresponding criterion in program
      const criterion = program.eligibilityCriteria.find(
        c => c.criterionId === scoreObj.criterionId
      );
      
      if (!criterion) {
        return;
      }
      
      // Determine gap severity
      const severity = this._determineGapSeverity(scoreObj, criterion);
      
      // Create gap object
      const gap = {
        criterionId: scoreObj.criterionId,
        criterionName: scoreObj.criterionName,
        category: scoreObj.category,
        severity,
        userValue: scoreObj.userValue,
        requiredValue: scoreObj.requiredValue,
        description: this._generateGapDescription(scoreObj, criterion),
        improvementSuggestions: this._generateImprovementSuggestions(scoreObj, criterion)
      };
      
      gaps.push(gap);
    });
    
    return gaps;
  }
  
  /**
   * Determine gap severity
   * @param {Object} scoreObj - Criterion score object
   * @param {Object} criterion - Program criterion
   * @returns {string} - Severity (minor, moderate, major, critical)
   * @private
   */
  _determineGapSeverity(scoreObj, criterion) {
    // If criterion is mandatory and score is very low, it's critical
    if (criterion.isMandatory && scoreObj.score < 30) {
      return 'critical';
    }
    
    // If criterion is mandatory and score is low, it's major
    if (criterion.isMandatory && scoreObj.score < 60) {
      return 'major';
    }
    
    // If criterion is not mandatory but score is very low, it's moderate
    if (!criterion.isMandatory && scoreObj.score < 30) {
      return 'moderate';
    }
    
    // Otherwise, it's minor
    return 'minor';
  }
  
  /**
   * Generate gap description
   * @param {Object} scoreObj - Criterion score object
   * @param {Object} criterion - Program criterion
   * @returns {string} - Gap description
   * @private
   */
  _generateGapDescription(scoreObj, criterion) {
    // Generate description based on criterion type and score
    const userValue = scoreObj.userValue;
    const requiredValue = scoreObj.requiredValue;
    
    switch (criterion.type) {
      case 'minimum':
        return `Your ${criterion.name.toLowerCase()} (${userValue}) is below the minimum requirement of ${requiredValue}.`;
        
      case 'maximum':
        return `Your ${criterion.name.toLowerCase()} (${userValue}) exceeds the maximum limit of ${requiredValue}.`;
        
      case 'range':
        return `Your ${criterion.name.toLowerCase()} (${userValue}) is outside the required range of ${requiredValue.min} to ${requiredValue.max}.`;
        
      case 'exact':
        return `Your ${criterion.name.toLowerCase()} (${userValue}) does not match the required value of ${requiredValue}.`;
        
      case 'boolean':
        return `The requirement for ${criterion.name.toLowerCase()} is not met.`;
        
      case 'list':
        return `Your ${criterion.name.toLowerCase()} does not include all required values.`;
        
      case 'points_table':
        return `Your ${criterion.name.toLowerCase()} does not earn enough points in the points table.`;
        
      default:
        return `There is a gap in meeting the requirement for ${criterion.name.toLowerCase()}.`;
    }
  }
  
  /**
   * Generate improvement suggestions
   * @param {Object} scoreObj - Criterion score object
   * @param {Object} criterion - Program criterion
   * @returns {Array} - Improvement suggestions
   * @private
   */
  _generateImprovementSuggestions(scoreObj, criterion) {
    const suggestions = [];
    
    // Generate suggestions based on criterion category
    switch (criterion.category) {
      case 'age':
        // Age can't be changed, but can suggest alternative programs
        suggestions.push({
          title: 'Consider alternative programs',
          description: 'Age requirements cannot be changed. Consider programs with more favorable age criteria or where age has less impact.',
          difficulty: 'moderate',
          estimatedTimeToResolve: {
            value: 1,
            unit: 'months'
          },
          potentialImpact: 70,
          steps: [
            {
              step: 1,
              description: 'Explore programs with different age requirements or where age has less weight.'
            },
            {
              step: 2,
              description: 'Consider programs where your other strengths can compensate for age factors.'
            }
          ],
          resources: [
            {
              title: 'Age-friendly immigration programs',
              type: 'article'
            }
          ]
        });
        break;
        
      case 'education':
        suggestions.push({
          title: 'Pursue additional education',
          description: 'Enhance your educational qualifications to meet program requirements.',
          difficulty: 'difficult',
          estimatedTimeToResolve: {
            value: 1,
            unit: 'years'
          },
          estimatedCost: {
            min: 5000,
            max: 30000,
            currency: 'USD'
          },
          potentialImpact: 90,
          steps: [
            {
              step: 1,
              description: 'Research educational programs that would meet the requirement.'
            },
            {
              step: 2,
              description: 'Apply to and complete the educational program.'
            },
            {
              step: 3,
              description: 'Obtain official transcripts and credentials.'
            }
          ],
          resources: [
            {
              title: 'Online education options',
              type: 'article'
            },
            {
              title: 'Credential evaluation services',
              type: 'service'
            }
          ]
        });
        
        suggestions.push({
          title: 'Get credentials evaluated',
          description: 'Have your existing education credentials properly evaluated for equivalency.',
          difficulty: 'easy',
          estimatedTimeToResolve: {
            value: 1,
            unit: 'months'
          },
          estimatedCost: {
            min: 100,
            max: 500,
            currency: 'USD'
          },
          potentialImpact: 60,
          steps: [
            {
              step: 1,
              description: 'Identify an appropriate credential evaluation service.'
            },
            {
              step: 2,
              description: 'Submit your educational documents for evaluation.'
            },
            {
              step: 3,
              description: 'Receive and include the evaluation report with your application.'
            }
          ],
          resources: [
            {
              title: 'Credential evaluation services',
              type: 'service'
            }
          ]
        });
        break;
        
      case 'work_experience':
        suggestions.push({
          title: 'Gain additional work experience',
          description: 'Acquire more work experience in your field to meet program requirements.',
          difficulty: 'moderate',
          estimatedTimeToResolve: {
            value: 1,
            unit: 'years'
          },
          potentialImpact: 85,
          steps: [
            {
              step: 1,
              description: 'Seek employment opportunities in your field.'
            },
            {
              step: 2,
              description: 'Maintain detailed records of your work responsibilities and achievements.'
            },
            {
              step: 3,
              description: 'Obtain reference letters from employers.'
            }
          ],
          resources: [
            {
              title: 'Job search strategies',
              type: 'article'
            }
          ]
        });
        
        suggestions.push({
          title: 'Improve documentation of existing experience',
          description: 'Better document your existing work experience to strengthen your application.',
          difficulty: 'easy',
          estimatedTimeToResolve: {
            value: 2,
            unit: 'weeks'
          },
          potentialImpact: 50,
          steps: [
            {
              step: 1,
              description: 'Create detailed job descriptions for each position you\'ve held.'
            },
            {
              step: 2,
              description: 'Obtain reference letters that specifically mention key responsibilities.'
            },
            {
              step: 3,
              description: 'Organize employment records, pay stubs, and tax documents.'
            }
          ],
          resources: [
            {
              title: 'Work experience documentation guide',
              type: 'article'
            }
          ]
        });
        break;
        
      case 'language':
        suggestions.push({
          title: 'Improve language proficiency',
          description: 'Enhance your language skills and take a recognized language test.',
          difficulty: 'moderate',
          estimatedTimeToResolve: {
            value: 6,
            unit: 'months'
          },
          estimatedCost: {
            min: 500,
            max: 2000,
            currency: 'USD'
          },
          potentialImpact: 95,
          steps: [
            {
              step: 1,
              description: 'Enroll in language courses or use language learning apps.'
            },
            {
              step: 2,
              description: 'Practice regularly with native speakers.'
            },
            {
              step: 3,
              description: 'Take practice tests to prepare for the official exam.'
            },
            {
              step: 4,
              description: 'Register for and take an official language test.'
            }
          ],
          resources: [
            {
              title: 'Language learning resources',
              type: 'article'
            },
            {
              title: 'Official language test preparation',
              type: 'course'
            }
          ]
        });
        
        suggestions.push({
          title: 'Retake language test',
          description: 'If you\'ve already taken a language test, consider retaking it to improve your score.',
          difficulty: 'easy',
          estimatedTimeToResolve: {
            value: 2,
            unit: 'months'
          },
          estimatedCost: {
            min: 200,
            max: 300,
            currency: 'USD'
          },
          potentialImpact: 75,
          steps: [
            {
              step: 1,
              description: 'Review your previous test results to identify areas for improvement.'
            },
            {
              step: 2,
              description: 'Practice with focus on weak areas.'
            },
            {
              step: 3,
              description: 'Register for and take the test again.'
            }
          ],
          resources: [
            {
              title: 'Language test preparation tips',
              type: 'article'
            }
          ]
        });
        break;
        
      case 'financial':
        suggestions.push({
          title: 'Increase savings or assets',
          description: 'Build up your financial resources to meet program requirements.',
          difficulty: 'difficult',
          estimatedTimeToResolve: {
            value: 1,
            unit: 'years'
          },
          potentialImpact: 90,
          steps: [
            {
              step: 1,
              description: 'Create a savings plan to reach the required amount.'
            },
            {
              step: 2,
              description: 'Consider liquidating non-essential assets if needed.'
            },
            {
              step: 3,
              description: 'Maintain funds in your account for the required period (usually 6-12 months).'
            }
          ],
          resources: [
            {
              title: 'Financial planning for immigration',
              type: 'article'
            }
          ]
        });
        
        suggestions.push({
          title: 'Explore alternative funding options',
          description: 'Consider other ways to meet financial requirements, such as loans or sponsorship.',
          difficulty: 'moderate',
          estimatedTimeToResolve: {
            value: 3,
            unit: 'months'
          },
          potentialImpact: 70,
          steps: [
            {
              step: 1,
              description: 'Research loan options specifically for immigration purposes.'
            },
            {
              step: 2,
              description: 'Explore family sponsorship possibilities if applicable.'
            },
            {
              step: 3,
              description: 'Consult with a financial advisor about options.'
            }
          ],
          resources: [
            {
              title: 'Immigration financing options',
              type: 'article'
            }
          ]
        });
        break;
        
      default:
        suggestions.push({
          title: 'Consult with an immigration specialist',
          description: 'Seek professional advice on how to address this specific requirement.',
          difficulty: 'moderate',
          estimatedTimeToResolve: {
            value: 1,
            unit: 'months'
          },
          estimatedCost: {
            min: 200,
            max: 500,
            currency: 'USD'
          },
          potentialImpact: 80,
          steps: [
            {
              step: 1,
              description: 'Find a reputable immigration consultant or lawyer.'
            },
            {
              step: 2,
              description: 'Schedule a consultation to discuss your specific situation.'
            },
            {
              step: 3,
              description: 'Follow their professional advice to address the gap.'
            }
          ],
          resources: [
            {
              title: 'Finding a qualified immigration consultant',
              type: 'article'
            }
          ]
        });
    }
    
    return suggestions;
  }
  
  /**
   * Find alternative programs
   * @param {Object} userProfile - User profile
   * @param {Array} allPrograms - All available programs
   * @param {Object} currentProgram - Current program
   * @param {Object} matchResult - Current match result
   * @returns {Array} - Alternative programs
   */
  async findAlternativePrograms(userProfile, allPrograms, currentProgram, matchResult) {
    try {
      // Filter programs by user's preferred countries if specified
      let filteredPrograms = allPrograms;
      
      if (userProfile.immigrationPreferences && 
          userProfile.immigrationPreferences.destinationCountries && 
          userProfile.immigrationPreferences.destinationCountries.length > 0) {
        
        const preferredCountries = userProfile.immigrationPreferences.destinationCountries.map(c => 
          typeof c === 'string' ? c : c.country
        );
        
        filteredPrograms = allPrograms.filter(p => 
          preferredCountries.includes(p.countryId)
        );
      }
      
      // Find programs with fewer critical gaps
      const alternativePrograms = [];
      
      // Get critical gaps in current program
      const criticalGaps = matchResult.criterionScores.filter(cs => 
        cs.score < 30 && cs.impact === 'negative'
      );
      
      // Process each program
      for (const program of filteredPrograms) {
        // Skip current program
        if (program.programId === currentProgram.programId) {
          continue;
        }
        
        // Calculate match score for this program
        // This would typically be done by the matching algorithm service
        // For simplicity, we'll just count the number of criteria the user meets
        let matchScore = 0;
        let gapCount = 0;
        
        program.eligibilityCriteria.forEach(criterion => {
          // Simple check if user meets criterion
          // In a real implementation, this would use the matching algorithm
          const userValue = this._getUserValueForCriterion(userProfile, criterion);
          
          if (this._userMeetsCriterion(userValue, criterion)) {
            matchScore += 1;
          } else {
            gapCount += 1;
          }
        });
        
        // Normalize match score to 0-100
        matchScore = (matchScore / program.eligibilityCriteria.length) * 100;
        
        // If match score is reasonable and has fewer gaps than current program
        if (matchScore >= 50 && gapCount < criticalGaps.length) {
          alternativePrograms.push({
            programId: program.programId,
            programName: program.name,
            countryId: program.countryId,
            matchScore,
            gapCount,
            keyAdvantages: this._identifyKeyAdvantages(program, currentProgram),
            keyDisadvantages: this._identifyKeyDisadvantages(program, currentProgram)
          });
        }
      }
      
      // Sort by match score
      return alternativePrograms.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      logger.error('Error finding alternative programs:', error);
      throw error;
    }
  }
  
  /**
   * Check if user meets criterion
   * @param {*} userValue - User value
   * @param {Object} criterion - Program criterion
   * @returns {boolean} - Whether user meets criterion
   * @private
   */
  _userMeetsCriterion(userValue, criterion) {
    // Simple implementation - in a real system, this would be more sophisticated
    if (userValue === null || userValue === undefined) {
      return false;
    }
    
    switch (criterion.type) {
      case 'minimum':
        return userValue >= criterion.value;
        
      case 'maximum':
        return userValue <= criterion.value;
        
      case 'range':
        return userValue >= criterion.value.min && userValue <= criterion.value.max;
        
      case 'exact':
        return userValue === criterion.value;
        
      case 'boolean':
        return userValue === criterion.value;
        
      case 'list':
        return Array.isArray(criterion.value) ? 
          criterion.value.some(v => userValue.includes(v)) : 
          userValue.includes(criterion.value);
        
      default:
        return false;
    }
  }
  
  /**
   * Get user value for criterion
   * @param {Object} userProfile - User profile
   * @param {Object} criterion - Program criterion
   * @returns {*} - User value
   * @private
   */
  _getUserValueForCriterion(userProfile, criterion) {
    // This is a simplified version - in a real implementation, this would be more comprehensive
    switch (criterion.category) {
      case 'age':
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
        return userProfile.education && userProfile.education.length > 0 ? 
          userProfile.education[0].level : null;
        
      case 'work_experience':
        return userProfile.workExperience ? userProfile.workExperience.length : 0;
        
      case 'language':
        return userProfile.languageProficiency && userProfile.languageProficiency.length > 0 ? 
          userProfile.languageProficiency[0].overallScore : null;
        
      case 'financial':
        return userProfile.financialInfo ? userProfile.financialInfo.netWorth : null;
        
      default:
        return null;
    }
  }
  
  /**
   * Identify key advantages of alternative program
   * @param {Object} alternativeProgram - Alternative program
   * @param {Object} currentProgram - Current program
   * @returns {Array} - Key advantages
   * @private
   */
  _identifyKeyAdvantages(alternativeProgram, currentProgram) {
    const advantages = [];
    
    // Compare processing times
    if (alternativeProgram.details && currentProgram.details && 
        alternativeProgram.details.processingTime && currentProgram.details.processingTime) {
      
      const altAvgTime = alternativeProgram.details.processingTime.average || 
        ((alternativeProgram.details.processingTime.min || 0) + (alternativeProgram.details.processingTime.max || 0)) / 2;
      
      const currentAvgTime = currentProgram.details.processingTime.average || 
        ((currentProgram.details.processingTime.min || 0) + (currentProgram.details.processingTime.max || 0)) / 2;
      
      if (altAvgTime < currentAvgTime) {
        advantages.push(`Faster processing time (approximately ${altAvgTime} months)`);
      }
    }
    
    // Compare costs
    if (alternativeProgram.details && currentProgram.details && 
        alternativeProgram.details.totalCost && currentProgram.details.totalCost) {
      
      const altAvgCost = alternativeProgram.details.totalCost.min && alternativeProgram.details.totalCost.max ? 
        (alternativeProgram.details.totalCost.min + alternativeProgram.details.totalCost.max) / 2 : 
        (alternativeProgram.details.totalCost.min || alternativeProgram.details.totalCost.max || 0);
      
      const currentAvgCost = currentProgram.details.totalCost.min && currentProgram.details.totalCost.max ? 
        (currentProgram.details.totalCost.min + currentProgram.details.totalCost.max) / 2 : 
        (currentProgram.details.totalCost.min || currentProgram.details.totalCost.max || 0);
      
      if (altAvgCost < currentAvgCost) {
        advantages.push(`Lower cost (approximately ${altAvgCost} ${alternativeProgram.details.totalCost.currency || 'USD'})`);
      }
    }
    
    // Compare path to permanent residence
    if (alternativeProgram.details && currentProgram.details && 
        alternativeProgram.details.pathToPermanentResidence && currentProgram.details.pathToPermanentResidence) {
      
      if (alternativeProgram.details.pathToPermanentResidence.hasPathway && 
          (!currentProgram.details.pathToPermanentResidence.hasPathway || 
           alternativeProgram.details.pathToPermanentResidence.timeToEligibility < currentProgram.details.pathToPermanentResidence.timeToEligibility)) {
        
        advantages.push('Better pathway to permanent residence');
      }
    }
    
    // Add generic advantage if none found
    if (advantages.length === 0) {
      advantages.push('May be easier to qualify for based on your profile');
    }
    
    return advantages;
  }
  
  /**
   * Identify key disadvantages of alternative program
   * @param {Object} alternativeProgram - Alternative program
   * @param {Object} currentProgram - Current program
   * @returns {Array} - Key disadvantages
   * @private
   */
  _identifyKeyDisadvantages(alternativeProgram, currentProgram) {
    const disadvantages = [];
    
    // Compare processing times
    if (alternativeProgram.details && currentProgram.details && 
        alternativeProgram.details.processingTime && currentProgram.details.processingTime) {
      
      const altAvgTime = alternativeProgram.details.processingTime.average || 
        ((alternativeProgram.details.processingTime.min || 0) + (alternativeProgram.details.processingTime.max || 0)) / 2;
      
      const currentAvgTime = currentProgram.details.processingTime.average || 
        ((currentProgram.details.processingTime.min || 0) + (currentProgram.details.processingTime.max || 0)) / 2;
      
      if (altAvgTime > currentAvgTime) {
        disadvantages.push(`Longer processing time (approximately ${altAvgTime} months)`);
      }
    }
    
    // Compare costs
    if (alternativeProgram.details && currentProgram.details && 
        alternativeProgram.details.totalCost && currentProgram.details.totalCost) {
      
      const altAvgCost = alternativeProgram.details.totalCost.min && alternativeProgram.details.totalCost.max ? 
        (alternativeProgram.details.totalCost.min + alternativeProgram.details.totalCost.max) / 2 : 
        (alternativeProgram.details.totalCost.min || alternativeProgram.details.totalCost.max || 0);
      
      const currentAvgCost = currentProgram.details.totalCost.min && currentProgram.details.totalCost.max ? 
        (currentProgram.details.totalCost.min + currentProgram.details.totalCost.max) / 2 : 
        (currentProgram.details.totalCost.min || currentProgram.details.totalCost.max || 0);
      
      if (altAvgCost > currentAvgCost) {
        disadvantages.push(`Higher cost (approximately ${altAvgCost} ${alternativeProgram.details.totalCost.currency || 'USD'})`);
      }
    }
    
    // Compare benefits
    if (alternativeProgram.benefits && currentProgram.benefits) {
      if (alternativeProgram.benefits.length < currentProgram.benefits.length) {
        disadvantages.push('Fewer benefits or rights');
      }
    }
    
    // Add generic disadvantage if none found
    if (disadvantages.length === 0) {
      disadvantages.push('May not offer all the same advantages as your primary match');
    }
    
    return disadvantages;
  }
}

module.exports = GapAnalysisService;
