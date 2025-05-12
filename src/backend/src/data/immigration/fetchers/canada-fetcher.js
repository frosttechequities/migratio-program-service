/**
 * Canada Immigration Data Fetcher
 * 
 * Fetches immigration program data from Immigration, Refugees and Citizenship Canada (IRCC).
 */

const BaseImmigrationDataFetcher = require('./base-fetcher');
const { logger } = require('../../../utils/logger');

class CanadaImmigrationDataFetcher extends BaseImmigrationDataFetcher {
  constructor() {
    super('Canada');
    this.baseUrl = 'https://www.canada.ca';
    this.programsUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html';
    this.processingTimesUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html';
    this.feesUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/fees.html';
    
    // Program-specific URLs
    this.expressEntryUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html';
    this.pnpUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html';
    this.startupVisaUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html';
    this.selfEmployedUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/self-employed.html';
    this.caregiverUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/caregivers.html';
    this.familySponsorshipUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship.html';
    this.rnipUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-northern-immigration-pilot.html';
    this.atlanticUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/atlantic-immigration-pilot.html';
    this.aippUrl = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/atlantic-immigration-pilot.html';
  }

  /**
   * Fetch all immigration programs
   * @returns {Promise<Array>} - Array of immigration programs
   */
  async fetchPrograms() {
    try {
      logger.info('Fetching Canada immigration programs');
      
      // Define programs with their details
      // In a real implementation, we would scrape this data from the website
      const programs = [
        {
          id: 'ca_express_entry',
          name: 'Express Entry',
          country: 'Canada',
          category: 'Skilled Worker',
          description: 'Express Entry is an online system that we use to manage applications for permanent residence from skilled workers.',
          officialUrl: this.expressEntryUrl,
          streams: [
            {
              id: 'ca_fsw',
              name: 'Federal Skilled Worker Program',
              description: 'For skilled workers with foreign work experience who want to immigrate to Canada permanently.'
            },
            {
              id: 'ca_fst',
              name: 'Federal Skilled Trades Program',
              description: 'For skilled workers who want to become permanent residents based on being qualified in a skilled trade.'
            },
            {
              id: 'ca_cec',
              name: 'Canadian Experience Class',
              description: 'For skilled workers who have Canadian work experience and want to become permanent residents.'
            }
          ],
          eligibilitySummary: 'Candidates are ranked in the Express Entry pool using a points-based system called the Comprehensive Ranking System (CRS). Points are awarded based on factors such as age, education, language skills, and work experience.',
          processingTimeEstimate: '6-8 months',
          successRate: 0.85
        },
        {
          id: 'ca_pnp',
          name: 'Provincial Nominee Program',
          country: 'Canada',
          category: 'Provincial Nomination',
          description: 'The Provincial Nominee Program allows provinces and territories to nominate individuals who wish to immigrate to Canada and who are interested in settling in a particular province.',
          officialUrl: this.pnpUrl,
          streams: [
            {
              id: 'ca_pnp_express',
              name: 'Express Entry-linked PNP streams',
              description: 'Provincial streams that are aligned with the federal Express Entry system.'
            },
            {
              id: 'ca_pnp_base',
              name: 'Base PNP streams',
              description: 'Provincial streams that operate outside the Express Entry system.'
            }
          ],
          eligibilitySummary: 'Each province and territory has its own "streams" (immigration programs that target certain groups) and requirements. For example, in a program stream, provinces and territories may target students, business people, skilled workers or semi-skilled workers.',
          processingTimeEstimate: '12-18 months',
          successRate: 0.8
        },
        {
          id: 'ca_startup_visa',
          name: 'Start-up Visa Program',
          country: 'Canada',
          category: 'Business',
          description: 'The Start-up Visa Program targets immigrant entrepreneurs with the skills and potential to build businesses in Canada that are innovative, can create jobs for Canadians and can compete on a global scale.',
          officialUrl: this.startupVisaUrl,
          eligibilitySummary: 'To be eligible, you must have a qualifying business, get a letter of support from a designated organization, meet the language requirements, and have enough money to settle and live in Canada before you make money from your business.',
          processingTimeEstimate: '12-16 months',
          successRate: 0.7
        },
        {
          id: 'ca_self_employed',
          name: 'Self-employed Persons Program',
          country: 'Canada',
          category: 'Business',
          description: 'The Self-employed Persons Program is for people who have relevant experience in cultural activities or athletics and are willing and able to make a significant contribution to the cultural or athletic life of Canada.',
          officialUrl: this.selfEmployedUrl,
          eligibilitySummary: 'To be eligible, you must have relevant experience in cultural activities or athletics, be willing and able to be self-employed in Canada, and meet the selection criteria for self-employed people.',
          processingTimeEstimate: '22-24 months',
          successRate: 0.65
        },
        {
          id: 'ca_caregiver',
          name: 'Caregiver Programs',
          country: 'Canada',
          category: 'Caregiver',
          description: 'Canada offers pathways to permanent residence for caregivers who provide care for children, the elderly, or those with medical needs.',
          officialUrl: this.caregiverUrl,
          streams: [
            {
              id: 'ca_home_child_care',
              name: 'Home Child Care Provider Pilot',
              description: 'For caregivers providing child care in a home setting.'
            },
            {
              id: 'ca_home_support_worker',
              name: 'Home Support Worker Pilot',
              description: 'For caregivers providing home support care for seniors or people with disabilities or chronic disease.'
            }
          ],
          eligibilitySummary: 'To be eligible, you must have a job offer to work as a caregiver in Canada, meet education and language requirements, and have the required work experience.',
          processingTimeEstimate: '12-18 months',
          successRate: 0.75
        },
        {
          id: 'ca_family_sponsorship',
          name: 'Family Sponsorship',
          country: 'Canada',
          category: 'Family',
          description: 'Canadian citizens and permanent residents can sponsor certain family members to become permanent residents of Canada.',
          officialUrl: this.familySponsorshipUrl,
          streams: [
            {
              id: 'ca_spouse_sponsorship',
              name: 'Spouse, partner and children sponsorship',
              description: 'For sponsoring a spouse, common-law or conjugal partner, or dependent children.'
            },
            {
              id: 'ca_parent_grandparent',
              name: 'Parents and grandparents sponsorship',
              description: 'For sponsoring parents and grandparents to become permanent residents.'
            }
          ],
          eligibilitySummary: 'To be eligible to sponsor a family member, you must be a Canadian citizen or permanent resident, be 18 years or older, and meet income requirements for certain types of sponsorship.',
          processingTimeEstimate: '12-24 months',
          successRate: 0.9
        },
        {
          id: 'ca_rnip',
          name: 'Rural and Northern Immigration Pilot',
          country: 'Canada',
          category: 'Community-based',
          description: 'The Rural and Northern Immigration Pilot is a community-driven program that helps smaller communities attract and retain foreign skilled workers to meet their economic development and labor market needs.',
          officialUrl: this.rnipUrl,
          eligibilitySummary: 'To be eligible, you must have a job offer from an employer in one of the participating communities, meet education and work experience requirements, and meet the community-specific requirements.',
          processingTimeEstimate: '12-18 months',
          successRate: 0.75
        },
        {
          id: 'ca_aipp',
          name: 'Atlantic Immigration Program',
          country: 'Canada',
          category: 'Regional',
          description: 'The Atlantic Immigration Program helps employers in Atlantic Canada hire qualified candidates for jobs they haven't been able to fill locally. These candidates can be living abroad or be international graduates from publicly funded institutions in Atlantic Canada.',
          officialUrl: this.aippUrl,
          streams: [
            {
              id: 'ca_aipp_skilled',
              name: 'Atlantic High-Skilled Program',
              description: 'For skilled workers with at least one year of work experience in a skilled occupation.'
            },
            {
              id: 'ca_aipp_intermediate',
              name: 'Atlantic Intermediate-Skilled Program',
              description: 'For intermediate-skilled workers with at least one year of work experience.'
            },
            {
              id: 'ca_aipp_graduate',
              name: 'Atlantic International Graduate Program',
              description: 'For international graduates from a publicly funded institution in Atlantic Canada.'
            }
          ],
          eligibilitySummary: 'To be eligible, you must have a job offer from a designated employer in Atlantic Canada, meet education and language requirements, and have enough money to support yourself and your family when you arrive in Canada.',
          processingTimeEstimate: '6-12 months',
          successRate: 0.8
        }
      ];
      
      // For each program, fetch detailed eligibility criteria
      for (const program of programs) {
        try {
          program.eligibilityCriteria = await this.fetchEligibilityCriteria(program.id);
        } catch (error) {
          logger.error(`Error fetching eligibility criteria for ${program.id}: ${error.message}`);
          program.eligibilityCriteria = [];
        }
      }
      
      return programs;
    } catch (error) {
      logger.error(`Error fetching Canada immigration programs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch processing times
   * @returns {Promise<Object>} - Processing times by program
   */
  async fetchProcessingTimes() {
    try {
      logger.info('Fetching Canada immigration processing times');
      
      // In a real implementation, we would scrape this data from the website
      return {
        'ca_express_entry': {
          min: 6,
          max: 8,
          unit: 'months',
          lastUpdated: new Date()
        },
        'ca_pnp': {
          min: 15,
          max: 19,
          unit: 'months',
          lastUpdated: new Date()
        },
        'ca_startup_visa': {
          min: 12,
          max: 16,
          unit: 'months',
          lastUpdated: new Date()
        },
        'ca_self_employed': {
          min: 22,
          max: 24,
          unit: 'months',
          lastUpdated: new Date()
        },
        'ca_caregiver': {
          min: 12,
          max: 18,
          unit: 'months',
          lastUpdated: new Date()
        },
        'ca_family_sponsorship': {
          'ca_spouse_sponsorship': {
            min: 12,
            max: 16,
            unit: 'months',
            lastUpdated: new Date()
          },
          'ca_parent_grandparent': {
            min: 20,
            max: 24,
            unit: 'months',
            lastUpdated: new Date()
          }
        },
        'ca_rnip': {
          min: 12,
          max: 18,
          unit: 'months',
          lastUpdated: new Date()
        },
        'ca_aipp': {
          min: 6,
          max: 12,
          unit: 'months',
          lastUpdated: new Date()
        }
      };
    } catch (error) {
      logger.error(`Error fetching Canada immigration processing times: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch program fees
   * @returns {Promise<Object>} - Fees by program
   */
  async fetchFees() {
    try {
      logger.info('Fetching Canada immigration fees');
      
      // In a real implementation, we would scrape this data from the website
      return {
        'ca_express_entry': {
          application: 825,
          rightOfPermanentResidence: 500,
          total: 1325,
          currency: 'CAD',
          additionalFees: {
            principalApplicant: 825,
            spouse: 825,
            dependentChild: 225
          },
          lastUpdated: new Date()
        },
        'ca_pnp': {
          application: 825,
          rightOfPermanentResidence: 500,
          total: 1325,
          currency: 'CAD',
          additionalFees: {
            principalApplicant: 825,
            spouse: 825,
            dependentChild: 225
          },
          provincialFees: {
            ontario: 1500,
            britishColumbia: 1150,
            alberta: 500,
            saskatchewan: 300,
            manitoba: 500,
            novaScotia: 300,
            newBrunswick: 250,
            pei: 300,
            newfoundland: 250,
            yukon: 250,
            nwt: 300,
            nunavut: 0
          },
          lastUpdated: new Date()
        },
        'ca_startup_visa': {
          application: 1575,
          rightOfPermanentResidence: 500,
          total: 2075,
          currency: 'CAD',
          additionalFees: {
            principalApplicant: 1575,
            spouse: 825,
            dependentChild: 225
          },
          lastUpdated: new Date()
        },
        'ca_self_employed': {
          application: 1575,
          rightOfPermanentResidence: 500,
          total: 2075,
          currency: 'CAD',
          additionalFees: {
            principalApplicant: 1575,
            spouse: 825,
            dependentChild: 225
          },
          lastUpdated: new Date()
        },
        'ca_caregiver': {
          application: 825,
          rightOfPermanentResidence: 500,
          total: 1325,
          currency: 'CAD',
          additionalFees: {
            principalApplicant: 825,
            spouse: 825,
            dependentChild: 225
          },
          lastUpdated: new Date()
        },
        'ca_family_sponsorship': {
          'ca_spouse_sponsorship': {
            sponsorship: 75,
            principalApplicant: 475,
            rightOfPermanentResidence: 500,
            total: 1050,
            currency: 'CAD',
            lastUpdated: new Date()
          },
          'ca_parent_grandparent': {
            sponsorship: 75,
            principalApplicant: 475,
            rightOfPermanentResidence: 500,
            total: 1050,
            currency: 'CAD',
            lastUpdated: new Date()
          }
        },
        'ca_rnip': {
          application: 825,
          rightOfPermanentResidence: 500,
          total: 1325,
          currency: 'CAD',
          additionalFees: {
            principalApplicant: 825,
            spouse: 825,
            dependentChild: 225
          },
          lastUpdated: new Date()
        },
        'ca_aipp': {
          application: 825,
          rightOfPermanentResidence: 500,
          total: 1325,
          currency: 'CAD',
          additionalFees: {
            principalApplicant: 825,
            spouse: 825,
            dependentChild: 225
          },
          lastUpdated: new Date()
        }
      };
    } catch (error) {
      logger.error(`Error fetching Canada immigration fees: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch eligibility criteria for a program
   * @param {string} programId - Program ID
   * @returns {Promise<Array>} - Eligibility criteria
   */
  async fetchEligibilityCriteria(programId) {
    try {
      logger.info(`Fetching eligibility criteria for ${programId}`);
      
      // In a real implementation, we would scrape this data from the website
      const criteriaMap = {
        'ca_express_entry': [
          {
            id: 'age',
            name: 'Age',
            description: 'You can earn a maximum of 110 points for your age. The maximum points are awarded if you are 20 to 29 years old. You will get fewer points if you are 30 or older.',
            type: 'range',
            min: 18,
            max: 45,
            idealMin: 20,
            idealMax: 29,
            points: 110,
            required: true
          },
          {
            id: 'education',
            name: 'Education',
            description: 'You can earn a maximum of 150 points for your education level. You need at least a high school diploma to qualify.',
            type: 'level',
            levels: [
              { value: 'high_school', label: 'High school diploma', points: 30 },
              { value: 'one_year_post_secondary', label: 'One-year post-secondary program', points: 90 },
              { value: 'two_year_post_secondary', label: 'Two-year post-secondary program', points: 98 },
              { value: 'bachelors', label: 'Bachelor\'s degree', points: 120 },
              { value: 'two_or_more_certificates', label: 'Two or more certificates, diplomas, or degrees', points: 128 },
              { value: 'masters', label: 'Master\'s degree', points: 135 },
              { value: 'doctoral', label: 'Doctoral degree', points: 150 }
            ],
            required: true
          },
          {
            id: 'language',
            name: 'Language Skills',
            description: 'You can earn a maximum of 160 points for your language skills in English and/or French. You need to take an approved language test and meet the minimum level of Canadian Language Benchmark (CLB) 7 in all abilities.',
            type: 'language',
            languages: ['english', 'french'],
            skills: ['speaking', 'listening', 'reading', 'writing'],
            minLevel: 7,
            maxLevel: 10,
            points: 160,
            required: true
          },
          {
            id: 'work_experience',
            name: 'Work Experience',
            description: 'You can earn a maximum of 80 points for your work experience. You need at least one year of continuous full-time (or equivalent part-time) skilled work experience in the last 10 years.',
            type: 'range',
            min: 1,
            max: 5,
            unit: 'years',
            points: 80,
            required: true
          },
          {
            id: 'arranged_employment',
            name: 'Arranged Employment',
            description: 'You can earn 50 points if you have a valid job offer from a Canadian employer.',
            type: 'boolean',
            points: 50,
            required: false
          },
          {
            id: 'adaptability',
            name: 'Adaptability',
            description: 'You can earn a maximum of 100 points for adaptability factors such as spouse\'s language skills, Canadian work experience, Canadian education, etc.',
            type: 'composite',
            factors: [
              { id: 'spouse_education', name: 'Spouse\'s education in Canada', points: 25 },
              { id: 'previous_work_in_canada', name: 'Previous work in Canada', points: 50 },
              { id: 'previous_study_in_canada', name: 'Previous study in Canada', points: 25 },
              { id: 'arranged_employment', name: 'Arranged employment', points: 50 },
              { id: 'relatives_in_canada', name: 'Relatives in Canada', points: 25 }
            ],
            points: 100,
            required: false
          }
        ],
        'ca_pnp': [
          {
            id: 'nomination',
            name: 'Provincial Nomination',
            description: 'You must be nominated by a Canadian province or territory.',
            type: 'boolean',
            required: true
          },
          {
            id: 'intention_to_reside',
            name: 'Intention to Reside',
            description: 'You must intend to live in the province or territory that nominates you.',
            type: 'boolean',
            required: true
          },
          {
            id: 'eligibility_criteria',
            name: 'Provincial Eligibility Criteria',
            description: 'You must meet the eligibility criteria of the specific PNP stream you are applying to. Each province and territory has its own streams and criteria.',
            type: 'composite',
            required: true
          }
        ],
        'ca_startup_visa': [
          {
            id: 'qualifying_business',
            name: 'Qualifying Business',
            description: 'You must have a qualifying business that is innovative, can create jobs for Canadians, and can compete on a global scale.',
            type: 'boolean',
            required: true
          },
          {
            id: 'support_letter',
            name: 'Letter of Support',
            description: 'You must get a letter of support from a designated organization (angel investor group, venture capital fund, or business incubator).',
            type: 'boolean',
            required: true
          },
          {
            id: 'language',
            name: 'Language Skills',
            description: 'You must meet the minimum level of Canadian Language Benchmark (CLB) 5 in English or French in all abilities.',
            type: 'language',
            languages: ['english', 'french'],
            skills: ['speaking', 'listening', 'reading', 'writing'],
            minLevel: 5,
            required: true
          },
          {
            id: 'settlement_funds',
            name: 'Settlement Funds',
            description: 'You must have enough money to support yourself and your family after you arrive in Canada.',
            type: 'money',
            amounts: [
              { family_size: 1, amount: 13213 },
              { family_size: 2, amount: 16449 },
              { family_size: 3, amount: 20222 },
              { family_size: 4, amount: 24553 },
              { family_size: 5, amount: 27847 },
              { family_size: 6, amount: 31407 },
              { family_size: 7, amount: 34967 }
            ],
            currency: 'CAD',
            required: true
          }
        ]
      };
      
      return criteriaMap[programId] || [];
    } catch (error) {
      logger.error(`Error fetching eligibility criteria for ${programId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = CanadaImmigrationDataFetcher;
