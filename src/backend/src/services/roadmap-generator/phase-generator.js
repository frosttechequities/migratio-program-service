/**
 * Phase Generator
 * 
 * Generates phases for immigration roadmaps based on program requirements.
 * Uses real-world immigration process phases and milestones.
 */

const { v4: uuidv4 } = require('uuid');
const { logger } = require('../../utils/logger');

/**
 * Generate phases for a roadmap
 * @param {Object} program - Immigration program
 * @param {Object} recommendation - Recommendation object
 * @param {Object} user - User object
 * @returns {Array} - Generated phases
 */
async function generatePhases(program, recommendation, user) {
  try {
    logger.info(`Generating phases for program ${program.programId}`);
    
    const phases = [];
    
    // Phase 1: Preparation and Planning
    phases.push(createPreparationPhase(program, recommendation, user));
    
    // Phase 2: Document Collection and Verification
    phases.push(createDocumentPhase(program, recommendation, user));
    
    // Phase 3: Application Submission
    phases.push(createApplicationPhase(program, recommendation, user));
    
    // Phase 4: Application Processing
    phases.push(createProcessingPhase(program, recommendation, user));
    
    // Phase 5: Pre-Arrival Preparation
    phases.push(createPreArrivalPhase(program, recommendation, user));
    
    // Phase 6: Arrival and Settlement
    phases.push(createSettlementPhase(program, recommendation, user));
    
    logger.info(`Generated ${phases.length} phases for program ${program.programId}`);
    
    return phases;
  } catch (error) {
    logger.error(`Error generating phases: ${error.message}`);
    throw error;
  }
}

/**
 * Create preparation and planning phase
 * @param {Object} program - Immigration program
 * @param {Object} recommendation - Recommendation object
 * @param {Object} user - User object
 * @returns {Object} - Preparation phase
 */
function createPreparationPhase(program, recommendation, user) {
  const phase = {
    title: 'Preparation and Planning',
    description: 'Initial preparation and planning for your immigration journey',
    order: 1,
    status: 'not_started',
    milestones: []
  };
  
  // Milestone: Research and understand the program
  phase.milestones.push({
    title: 'Research and Understand the Program',
    description: `Learn about the ${program.name} requirements, process, and timeline`,
    category: 'preparation',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Review official program information',
        description: `Visit the official website and review all information about the ${program.name}`,
        status: 'not_started'
      },
      {
        title: 'Understand eligibility criteria',
        description: 'Make sure you understand all eligibility requirements and how they apply to your situation',
        status: 'not_started'
      },
      {
        title: 'Review processing times and fees',
        description: 'Understand the current processing times and all associated fees',
        status: 'not_started'
      }
    ],
    resources: [
      {
        title: 'Official Program Website',
        url: program.officialUrl,
        type: 'website'
      }
    ]
  });
  
  // Milestone: Financial planning
  phase.milestones.push({
    title: 'Financial Planning',
    description: 'Plan your finances for the immigration process and settlement',
    category: 'preparation',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 2,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Calculate total immigration costs',
        description: 'Calculate all fees, including application fees, language tests, credential assessments, etc.',
        status: 'not_started'
      },
      {
        title: 'Prepare settlement funds',
        description: 'Ensure you have the required settlement funds as per program requirements',
        status: 'not_started'
      },
      {
        title: 'Create a budget for the immigration process',
        description: 'Create a detailed budget covering all aspects of your immigration journey',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Create a timeline
  phase.milestones.push({
    title: 'Create a Timeline',
    description: 'Develop a realistic timeline for your immigration process',
    category: 'preparation',
    priority: 'medium',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Identify key milestones and deadlines',
        description: 'List all important milestones and their associated deadlines',
        status: 'not_started'
      },
      {
        title: 'Create a calendar of tasks',
        description: 'Develop a calendar with all tasks and their target completion dates',
        status: 'not_started'
      }
    ]
  });
  
  // Add program-specific milestones
  if (program.country === 'Canada' && program.programId.includes('express_entry')) {
    // Express Entry specific milestone
    phase.milestones.push({
      title: 'Create Express Entry Profile',
      description: 'Create your Express Entry profile in the IRCC system',
      category: 'application',
      priority: 'critical',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Gather information for Express Entry profile',
          description: 'Collect all information needed for your Express Entry profile',
          status: 'not_started'
        },
        {
          title: 'Create IRCC account',
          description: 'Create an account on the IRCC website',
          status: 'not_started'
        },
        {
          title: 'Complete and submit Express Entry profile',
          description: 'Fill out and submit your Express Entry profile',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Express Entry System',
          url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html',
          type: 'website'
        }
      ]
    });
  } else if (program.country === 'Australia' && program.programId.includes('189')) {
    // Australia Skilled Independent visa specific milestone
    phase.milestones.push({
      title: 'Submit Expression of Interest (EOI)',
      description: 'Submit your EOI in the SkillSelect system',
      category: 'application',
      priority: 'critical',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Create SkillSelect account',
          description: 'Create an account in the SkillSelect system',
          status: 'not_started'
        },
        {
          title: 'Complete and submit EOI',
          description: 'Fill out and submit your Expression of Interest',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'SkillSelect',
          url: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect',
          type: 'website'
        }
      ]
    });
  }
  
  return phase;
}

module.exports = {
  generatePhases,
  createPreparationPhase
};
