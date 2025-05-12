/**
 * Gap Analyzer
 *
 * Analyzes gaps between user profiles and immigration program requirements.
 */

const { logger } = require('../../utils/logger');

class GapAnalyzer {
  /**
   * Analyze gaps between user profile and matched programs
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Array} matchedPrograms - Programs matched to the user
   * @returns {Promise<Array>} - Programs with gap analysis
   */
  async analyzeGaps(profileAnalysis, matchedPrograms) {
    try {
      logger.info(`Analyzing gaps for user ${profileAnalysis.userId}`);

      const programsWithGaps = matchedPrograms.map(program => {
        try {
          return this.analyzeGapsForProgram(profileAnalysis, program);
        } catch (error) {
          logger.error(`Error analyzing gaps for program ${program.programId}: ${error.message}`);
          return program;
        }
      });

      return programsWithGaps;
    } catch (error) {
      logger.error(`Error analyzing gaps: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze gaps for a single program
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} program - Matched program
   * @returns {Object} - Program with gap analysis
   */
  analyzeGapsForProgram(profileAnalysis, program) {
    // Create a copy of the program
    const programWithGaps = { ...program };

    // Analyze key weaknesses
    if (program.keyWeaknesses && program.keyWeaknesses.length > 0) {
      programWithGaps.gapAnalysis = {
        gaps: this.identifyGaps(profileAnalysis, program.keyWeaknesses),
        improvementPlan: this.createImprovementPlan(profileAnalysis, program.keyWeaknesses),
        alternativePathways: this.suggestAlternativePathways(profileAnalysis, program)
      };
    } else {
      programWithGaps.gapAnalysis = {
        gaps: [],
        improvementPlan: [],
        alternativePathways: []
      };
    }

    return programWithGaps;
  }

  /**
   * Identify gaps based on key weaknesses
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Array} keyWeaknesses - Key weaknesses
   * @returns {Array} - Identified gaps
   */
  identifyGaps(profileAnalysis, keyWeaknesses) {
    return keyWeaknesses.map(weakness => {
      const gap = {
        criterionId: weakness.criterionId,
        criterionName: weakness.criterionName,
        description: weakness.description,
        severity: this.calculateGapSeverity(weakness.score),
        userValue: weakness.userValue,
        requiredValue: this.extractRequiredValue(weakness.description)
      };

      return gap;
    });
  }

  /**
   * Calculate gap severity based on score
   * @param {number} score - Criterion score
   * @returns {string} - Gap severity
   */
  calculateGapSeverity(score) {
    if (score >= 40) {
      return 'low';
    } else if (score >= 20) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  /**
   * Extract required value from description
   * @param {string} description - Criterion description
   * @returns {string|null} - Required value
   */
  extractRequiredValue(description) {
    // Try to extract required values from common patterns in descriptions
    const minimumPattern = /minimum (?:requirement|level) of ([^\.]+)/i;
    const belowPattern = /below the (?:minimum|requirement) of ([^\.]+)/i;
    const requiresPattern = /requires ([^\.]+)/i;

    const minimumMatch = description.match(minimumPattern);
    if (minimumMatch) return minimumMatch[1].trim();

    const belowMatch = description.match(belowPattern);
    if (belowMatch) return belowMatch[1].trim();

    const requiresMatch = description.match(requiresPattern);
    if (requiresMatch) return requiresMatch[1].trim();

    return null;
  }

  /**
   * Create improvement plan based on key weaknesses
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Array} keyWeaknesses - Key weaknesses
   * @returns {Array} - Improvement plan
   */
  createImprovementPlan(profileAnalysis, keyWeaknesses) {
    const improvementPlan = [];

    keyWeaknesses.forEach(weakness => {
      const criterionId = weakness.criterionId;

      // Create improvement steps based on criterion type
      switch (criterionId) {
        case 'age':
          // Age cannot be improved
          improvementPlan.push({
            area: 'Age',
            action: 'Consider alternative programs with more favorable age criteria',
            description: 'Since age cannot be changed, focus on programs where age has less impact or where you can compensate with other strengths.',
            timeframe: 'Immediate',
            difficulty: 'Low',
            resources: [
              {
                title: 'Provincial Nominee Programs (Canada)',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html'
              },
              {
                title: 'Regional Sponsored Migration Scheme (Australia)',
                url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/regional-sponsor-migration-scheme-187'
              }
            ]
          });
          break;

        case 'education':
        case 'level':
          improvementPlan.push({
            area: 'Education',
            action: 'Pursue higher education or get credentials assessed',
            description: 'Consider upgrading your education level or getting your existing credentials assessed by the appropriate authority.',
            timeframe: 'Medium-term (6-12 months)',
            difficulty: 'High',
            steps: [
              'Research educational credential assessment services for your target country',
              'Submit your credentials for evaluation',
              'Consider enrolling in a post-graduate program in your target country',
              'Look for bridging programs that can help you meet specific requirements'
            ],
            resources: [
              {
                title: 'World Education Services (WES)',
                url: 'https://www.wes.org/'
              },
              {
                title: 'Educational Credential Assessment (ECA) for Canada',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/education-assessed.html'
              },
              {
                title: 'Skills Assessment for Australia',
                url: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skills-assessment'
              }
            ]
          });
          break;

        case 'language':
        case 'english':
          improvementPlan.push({
            area: 'Language Proficiency',
            action: 'Improve language skills and take official tests',
            description: 'Take language courses and prepare for official language tests recognized by immigration authorities.',
            timeframe: 'Short-term (3-6 months)',
            difficulty: 'Medium',
            steps: [
              'Enroll in language courses focused on the specific test format',
              'Practice regularly with native speakers',
              'Take practice tests to identify weak areas',
              'Schedule an official test with enough time for retakes if needed'
            ],
            resources: [
              {
                title: 'IELTS Official Practice Materials',
                url: 'https://www.ielts.org/for-test-takers/sample-test-questions'
              },
              {
                title: 'CELPIP Preparation Program',
                url: 'https://www.celpip.ca/prepare-for-celpip/'
              },
              {
                title: 'PTE Academic Test Preparation',
                url: 'https://pearsonpte.com/preparation/'
              },
              {
                title: 'TEF Canada Preparation Resources',
                url: 'https://www.lefrancaisdesaffaires.fr/tests-diplomes/test-evaluation-francais-tef/tef-canada/'
              }
            ]
          });
          break;

        case 'work_experience':
        case 'skilled_work_experience':
        case 'canadian_work_experience':
        case 'skilled_trades_experience':
          improvementPlan.push({
            area: 'Work Experience',
            action: 'Gain relevant work experience in your field',
            description: 'Continue working in your current role or seek opportunities to gain experience in a relevant field recognized by immigration authorities.',
            timeframe: 'Long-term (1-3 years)',
            difficulty: 'Medium',
            steps: [
              'Research which occupations are in demand in your target country',
              'Ensure your current role aligns with official occupation classifications',
              'Consider temporary work permits or working holiday visas to gain experience in the target country',
              'Document all work experience with reference letters and employment contracts'
            ],
            resources: [
              {
                title: 'National Occupation Classification (NOC) - Canada',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/find-national-occupation-code.html'
              },
              {
                title: 'ANZSCO - Australia and New Zealand',
                url: 'https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations'
              },
              {
                title: 'Skilled Occupation List - Australia',
                url: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list'
              },
              {
                title: 'UK Shortage Occupation List',
                url: 'https://www.gov.uk/government/publications/skilled-worker-visa-shortage-occupations'
              }
            ]
          });
          break;

        case 'arranged_employment':
        case 'job_offer':
          improvementPlan.push({
            area: 'Job Offer',
            action: 'Secure a job offer from an eligible employer',
            description: 'Search for job opportunities with employers who can provide a valid job offer for immigration purposes.',
            timeframe: 'Medium-term (6-12 months)',
            difficulty: 'High',
            steps: [
              'Research companies in your target country that sponsor foreign workers',
              'Update your resume/CV to highlight skills relevant to your target country',
              'Network with professionals in your industry in the target country',
              'Apply to positions with employers who are licensed to hire foreign workers',
              'Prepare for remote interviews and be ready to discuss immigration requirements'
            ],
            resources: [
              {
                title: 'Find employers who can hire through Express Entry - Canada',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/hire-permanent-foreign/express-entry.html'
              },
              {
                title: 'Register of Licensed Sponsors - UK',
                url: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers'
              },
              {
                title: 'Employer Nomination Scheme - Australia',
                url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186'
              }
            ]
          });
          break;

        case 'adaptability':
          improvementPlan.push({
            area: 'Adaptability',
            action: 'Improve adaptability factors',
            description: 'Consider options like studying in the destination country, visiting on a temporary visa, or connecting with relatives there.',
            timeframe: 'Medium-term (6-12 months)',
            difficulty: 'Medium',
            steps: [
              'Research short-term study options in your target country',
              'Plan a visit to explore potential areas to live and work',
              'Connect with family members who may be able to provide support',
              'Join community groups related to your target country'
            ],
            resources: [
              {
                title: 'Study Permit - Canada',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html'
              },
              {
                title: 'Visitor Visa Information',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html'
              }
            ]
          });
          break;

        case 'settlement_funds':
        case 'financial_requirement':
        case 'maintenance_funds':
          improvementPlan.push({
            area: 'Financial Preparation',
            action: 'Increase savings or liquid assets',
            description: 'Build up your savings to meet the minimum settlement funds requirement.',
            timeframe: 'Medium-term (6-12 months)',
            difficulty: 'Medium',
            steps: [
              'Create a savings plan specifically for immigration purposes',
              'Research the exact financial requirements for your target program',
              'Consider consolidating assets into liquid forms that are easily verifiable',
              'Prepare bank statements and financial documentation according to requirements'
            ],
            resources: [
              {
                title: 'Settlement Funds for Express Entry - Canada',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/proof-funds.html'
              },
              {
                title: 'Financial Requirements for UK Visas',
                url: 'https://www.gov.uk/guidance/financial-evidence-for-student-and-child-student-route-applicants'
              }
            ]
          });
          break;

        case 'business_idea':
        case 'qualifying_business':
          improvementPlan.push({
            area: 'Business Plan',
            action: 'Develop a comprehensive business plan',
            description: 'Create a detailed business plan that meets the requirements of the business immigration program.',
            timeframe: 'Medium-term (3-6 months)',
            difficulty: 'High',
            steps: [
              'Research the specific business plan requirements for your target program',
              'Conduct market research in your target country',
              'Develop financial projections and funding strategies',
              'Consider consulting with a business immigration specialist',
              'Prepare to demonstrate the viability and innovative nature of your business concept'
            ],
            resources: [
              {
                title: 'Start-up Visa Program Guide - Canada',
                url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/eligibility.html'
              },
              {
                title: 'Business Innovation and Investment Program - Australia',
                url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188'
              },
              {
                title: 'Innovator Founder Visa - UK',
                url: 'https://www.gov.uk/innovator-founder-visa'
              }
            ]
          });
          break;

        default:
          // Generic improvement step
          improvementPlan.push({
            area: weakness.criterionName,
            action: `Improve ${weakness.criterionName.toLowerCase()}`,
            description: `Address the gap in ${weakness.criterionName.toLowerCase()} based on program requirements.`,
            timeframe: 'Varies',
            difficulty: 'Medium',
            steps: [
              `Research specific requirements for ${weakness.criterionName.toLowerCase()}`,
              'Consult with an immigration specialist for personalized advice',
              'Develop a targeted plan to address this specific requirement'
            ]
          });
      }
    });

    return improvementPlan;
  }

  /**
   * Suggest alternative pathways based on profile and program
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Object} program - Matched program
   * @returns {Array} - Alternative pathways
   */
  suggestAlternativePathways(profileAnalysis, program) {
    const alternatives = [];

    // Suggest study pathway if education is a weakness
    const hasEducationWeakness = program.keyWeaknesses.some(w =>
      w.criterionId === 'education' || w.criterionId === 'level'
    );

    if (hasEducationWeakness) {
      const studyPathway = {
        type: 'Study Pathway',
        description: 'Consider studying in the destination country to improve your education credentials and potentially qualify for post-graduation work permits.',
        benefits: [
          'Gain recognized credentials',
          'Build local experience',
          'Access to post-graduation work permits',
          'Potential pathway to permanent residence'
        ],
        programs: []
      };

      // Add country-specific study programs
      switch (program.countryId) {
        case 'Canada':
          studyPathway.programs.push({
            name: 'Study Permit',
            description: 'Canadian study permit with Post-Graduation Work Permit eligibility',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html'
          });
          break;
        case 'Australia':
          studyPathway.programs.push({
            name: 'Student Visa (Subclass 500)',
            description: 'Australian student visa with potential pathway to Temporary Graduate visa (subclass 485)',
            url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500'
          });
          break;
        case 'United Kingdom':
          studyPathway.programs.push({
            name: 'Student Visa',
            description: 'UK student visa with potential pathway to Graduate visa',
            url: 'https://www.gov.uk/student-visa'
          });
          break;
      }

      alternatives.push(studyPathway);
    }

    // Suggest work permit pathway if work experience is a weakness
    const hasWorkWeakness = program.keyWeaknesses.some(w =>
      w.criterionId === 'work_experience' ||
      w.criterionId === 'arranged_employment' ||
      w.criterionId === 'job_offer' ||
      w.criterionId === 'skilled_work_experience'
    );

    if (hasWorkWeakness) {
      const workPathway = {
        type: 'Temporary Work Pathway',
        description: 'Consider applying for a temporary work permit to gain work experience in the destination country.',
        benefits: [
          'Gain local work experience',
          'Build professional network',
          'Potential for employer sponsorship',
          'Pathway to permanent residence through experience class programs'
        ],
        programs: []
      };

      // Add country-specific work programs
      switch (program.countryId) {
        case 'Canada':
          workPathway.programs.push({
            name: 'Temporary Foreign Worker Program',
            description: 'Work permit through LMIA-based job offer',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/work-permit.html'
          });
          workPathway.programs.push({
            name: 'International Experience Canada',
            description: 'Working holiday, young professionals, or international co-op programs',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec.html'
          });
          break;
        case 'Australia':
          workPathway.programs.push({
            name: 'Temporary Skill Shortage visa (subclass 482)',
            description: 'Temporary work visa for skilled workers',
            url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482'
          });
          workPathway.programs.push({
            name: 'Working Holiday visa',
            description: 'For young adults who want to work and travel in Australia',
            url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417'
          });
          break;
        case 'United Kingdom':
          workPathway.programs.push({
            name: 'Skilled Worker visa',
            description: 'For skilled workers with a job offer from a UK employer',
            url: 'https://www.gov.uk/skilled-worker-visa'
          });
          workPathway.programs.push({
            name: 'Youth Mobility Scheme',
            description: 'For young people who want to live and work in the UK for up to 2 years',
            url: 'https://www.gov.uk/youth-mobility'
          });
          break;
      }

      alternatives.push(workPathway);
    }

    // Suggest provincial/regional programs if main federal programs have high requirements
    if ((program.category === 'Skilled Worker' || program.category === 'Provincial Nomination') && program.matchScore < 70) {
      const regionalPathway = {
        type: 'Provincial/Regional Programs',
        description: 'Explore provincial nomination programs or regional immigration pilots that may have different requirements.',
        benefits: [
          'Often lower thresholds for key criteria',
          'May prioritize specific skills or occupations',
          'Can provide a direct path to permanent residence',
          'May have faster processing times'
        ],
        programs: []
      };

      // Add country-specific regional programs
      switch (program.countryId) {
        case 'Canada':
          regionalPathway.programs.push({
            name: 'Provincial Nominee Program (PNP)',
            description: 'Nomination by a Canadian province or territory',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html'
          });
          regionalPathway.programs.push({
            name: 'Rural and Northern Immigration Pilot',
            description: 'Community-based program for smaller communities',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-northern-immigration-pilot.html'
          });
          regionalPathway.programs.push({
            name: 'Atlantic Immigration Program',
            description: 'For skilled workers and international graduates who want to work and live in Atlantic Canada',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/atlantic-immigration.html'
          });
          break;
        case 'Australia':
          regionalPathway.programs.push({
            name: 'Skilled Work Regional (Provisional) visa (subclass 491)',
            description: 'For skilled workers who want to live and work in regional Australia',
            url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-provisional-491'
          });
          regionalPathway.programs.push({
            name: 'Skilled Employer Sponsored Regional (Provisional) visa (subclass 494)',
            description: 'For skilled workers sponsored by an employer in regional Australia',
            url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494'
          });
          break;
        case 'United Kingdom':
          regionalPathway.programs.push({
            name: 'Scale-up visa',
            description: 'For talented individuals recruited by a UK Scale-up Sponsor',
            url: 'https://www.gov.uk/scale-up-visa'
          });
          regionalPathway.programs.push({
            name: 'High Potential Individual visa',
            description: 'For graduates from top global universities',
            url: 'https://www.gov.uk/high-potential-individual-visa'
          });
          break;
      }

      alternatives.push(regionalPathway);
    }

    // Suggest business pathways for those with financial capacity
    if (profileAnalysis.financialInfo.financialFactors.hasSubstantialFinancialCapacity ||
        profileAnalysis.financialInfo.liquidAssets >= 100000) {
      const businessPathway = {
        type: 'Business/Investor Pathway',
        description: 'Consider business or investor immigration programs if you have significant financial resources.',
        benefits: [
          'Leverages financial assets rather than work experience or education',
          'May have faster processing times',
          'Provides entrepreneurial opportunities',
          'Often leads to permanent residence'
        ],
        programs: []
      };

      // Add country-specific business programs
      switch (program.countryId) {
        case 'Canada':
          businessPathway.programs.push({
            name: 'Start-up Visa Program',
            description: 'For entrepreneurs with innovative business ideas',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html'
          });
          businessPathway.programs.push({
            name: 'Self-employed Persons Program',
            description: 'For self-employed persons with relevant experience in cultural activities or athletics',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/self-employed.html'
          });
          break;
        case 'Australia':
          businessPathway.programs.push({
            name: 'Business Innovation and Investment (Provisional) visa (subclass 188)',
            description: 'For business owners, investors, and entrepreneurs',
            url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188'
          });
          break;
        case 'United Kingdom':
          businessPathway.programs.push({
            name: 'Innovator Founder visa',
            description: 'For experienced businesspeople with an innovative, viable and scalable business idea',
            url: 'https://www.gov.uk/innovator-founder-visa'
          });
          businessPathway.programs.push({
            name: 'Start-up visa',
            description: 'For people setting up an innovative business for the first time',
            url: 'https://www.gov.uk/start-up-visa'
          });
          break;
      }

      alternatives.push(businessPathway);
    }

    // Suggest family pathways if applicable
    if (profileAnalysis.personalInfo && profileAnalysis.personalInfo.hasRelativesAbroad) {
      const familyPathway = {
        type: 'Family Sponsorship Pathway',
        description: 'If you have close family members who are citizens or permanent residents of your target country, they may be able to sponsor you.',
        benefits: [
          'May have less stringent requirements than skilled worker programs',
          'Based on family relationships rather than skills or education',
          'Often leads directly to permanent residence',
          'May have priority processing in some countries'
        ],
        programs: []
      };

      // Add country-specific family programs
      switch (program.countryId) {
        case 'Canada':
          familyPathway.programs.push({
            name: 'Family Sponsorship Program',
            description: 'For spouses, partners, children, parents, and grandparents',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship.html'
          });
          break;
        case 'Australia':
          familyPathway.programs.push({
            name: 'Family visa',
            description: 'For partners, children, parents, and other family members',
            url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder/join-family'
          });
          break;
        case 'United Kingdom':
          familyPathway.programs.push({
            name: 'Family visa',
            description: 'For partners, children, parents, and other family members',
            url: 'https://www.gov.uk/uk-family-visa'
          });
          break;
      }

      alternatives.push(familyPathway);
    }

    return alternatives;
  }
}

module.exports = GapAnalyzer;
