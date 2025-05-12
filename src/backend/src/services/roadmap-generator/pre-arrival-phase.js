/**
 * Pre-Arrival Phase Generator
 * 
 * Generates the pre-arrival preparation phase for immigration roadmaps.
 * Uses real-world pre-arrival steps for different immigration programs.
 */

const { logger } = require('../../utils/logger');

/**
 * Create pre-arrival preparation phase
 * @param {Object} program - Immigration program
 * @param {Object} recommendation - Recommendation object
 * @param {Object} user - User object
 * @returns {Object} - Pre-arrival phase
 */
function createPreArrivalPhase(program, recommendation, user) {
  const phase = {
    title: 'Pre-Arrival Preparation',
    description: 'Prepare for your move to your destination country',
    order: 5,
    status: 'not_started',
    milestones: []
  };
  
  // Milestone: Travel arrangements
  phase.milestones.push({
    title: 'Travel Arrangements',
    description: 'Make all necessary travel arrangements',
    category: 'travel',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'months'
    },
    tasks: [
      {
        title: 'Book flights',
        description: 'Research and book your flights',
        status: 'not_started'
      },
      {
        title: 'Arrange temporary accommodation',
        description: 'Arrange temporary accommodation for your arrival',
        status: 'not_started'
      },
      {
        title: 'Purchase travel insurance',
        description: 'Purchase travel insurance for your journey',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Financial preparations
  phase.milestones.push({
    title: 'Financial Preparations',
    description: 'Prepare your finances for the move',
    category: 'preparation',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'months'
    },
    tasks: [
      {
        title: 'Open international bank account',
        description: 'Research and open an international bank account if possible',
        status: 'not_started'
      },
      {
        title: 'Arrange currency exchange',
        description: 'Plan how you will exchange currency',
        status: 'not_started'
      },
      {
        title: 'Set up international transfers',
        description: 'Set up a method for international money transfers',
        status: 'not_started'
      },
      {
        title: 'Prepare initial settlement funds',
        description: 'Ensure you have access to sufficient funds for initial settlement',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Housing research
  phase.milestones.push({
    title: 'Housing Research',
    description: 'Research housing options in your destination',
    category: 'preparation',
    priority: 'medium',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'months'
    },
    tasks: [
      {
        title: 'Research neighborhoods',
        description: 'Research different neighborhoods and areas',
        status: 'not_started'
      },
      {
        title: 'Understand rental process',
        description: 'Learn about the rental process and requirements',
        status: 'not_started'
      },
      {
        title: 'Budget for housing',
        description: 'Create a realistic housing budget',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Employment preparation
  phase.milestones.push({
    title: 'Employment Preparation',
    description: 'Prepare for employment in your destination country',
    category: 'preparation',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 2,
      unit: 'months'
    },
    tasks: [
      {
        title: 'Update resume/CV',
        description: 'Update your resume/CV for the local job market',
        status: 'not_started'
      },
      {
        title: 'Research job market',
        description: 'Research the job market in your field',
        status: 'not_started'
      },
      {
        title: 'Network with professionals',
        description: 'Connect with professionals in your field',
        status: 'not_started'
      },
      {
        title: 'Understand employment laws',
        description: 'Learn about employment laws and regulations',
        status: 'not_started'
      }
    ]
  });
  
  // Add country-specific pre-arrival milestones
  if (program.country === 'Canada') {
    // Pre-arrival services for Canada
    phase.milestones.push({
      title: 'Register for Pre-Arrival Services',
      description: 'Register for free pre-arrival services offered by the Canadian government',
      category: 'preparation',
      priority: 'medium',
      status: 'not_started',
      estimatedDuration: {
        value: 2,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Research available services',
          description: 'Research pre-arrival services available to you',
          status: 'not_started'
        },
        {
          title: 'Register for services',
          description: 'Register for appropriate pre-arrival services',
          status: 'not_started'
        },
        {
          title: 'Participate in sessions',
          description: 'Participate in pre-arrival sessions or workshops',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Pre-Arrival Services',
          url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/new-life-canada/pre-arrival-services.html',
          type: 'website'
        }
      ]
    });
  } else if (program.country === 'Australia') {
    // Prepare for customs and quarantine for Australia
    phase.milestones.push({
      title: 'Prepare for Customs and Quarantine',
      description: 'Understand and prepare for Australia\'s strict customs and quarantine regulations',
      category: 'travel',
      priority: 'medium',
      status: 'not_started',
      estimatedDuration: {
        value: 2,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Research regulations',
          description: 'Research customs and quarantine regulations',
          status: 'not_started'
        },
        {
          title: 'Plan what to bring',
          description: 'Plan what items to bring based on regulations',
          status: 'not_started'
        },
        {
          title: 'Complete incoming passenger card',
          description: 'Prepare to complete the incoming passenger card accurately',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Australian Border Force',
          url: 'https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in',
          type: 'website'
        }
      ]
    });
  } else if (program.country === 'United Kingdom') {
    // Register with police if required for UK
    phase.milestones.push({
      title: 'Understand Police Registration Requirements',
      description: 'Check if you need to register with the police upon arrival',
      category: 'legal',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Check if registration is required',
          description: 'Check if your nationality requires police registration',
          status: 'not_started'
        },
        {
          title: 'Understand registration process',
          description: 'Learn about the police registration process',
          status: 'not_started'
        },
        {
          title: 'Prepare required documents',
          description: 'Prepare documents needed for police registration',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Register with the Police',
          url: 'https://www.gov.uk/register-with-the-police',
          type: 'website'
        }
      ]
    });
  }
  
  // Milestone: Cultural adaptation
  phase.milestones.push({
    title: 'Cultural Adaptation',
    description: 'Prepare for cultural differences in your destination country',
    category: 'preparation',
    priority: 'medium',
    status: 'not_started',
    estimatedDuration: {
      value: 2,
      unit: 'months'
    },
    tasks: [
      {
        title: 'Research local culture',
        description: 'Learn about the culture, customs, and etiquette',
        status: 'not_started'
      },
      {
        title: 'Connect with expatriate communities',
        description: 'Find and connect with expatriate communities',
        status: 'not_started'
      },
      {
        title: 'Learn about local laws',
        description: 'Familiarize yourself with important local laws',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Prepare important documents
  phase.milestones.push({
    title: 'Prepare Important Documents',
    description: 'Organize and prepare important documents for your move',
    category: 'document',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 2,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Make copies of important documents',
        description: 'Make physical and digital copies of all important documents',
        status: 'not_started'
      },
      {
        title: 'Organize documents for travel',
        description: 'Organize documents you\'ll need during travel',
        status: 'not_started'
      },
      {
        title: 'Prepare documents for initial settlement',
        description: 'Organize documents you\'ll need for initial settlement',
        status: 'not_started'
      }
    ]
  });
  
  return phase;
}

module.exports = {
  createPreArrivalPhase
};
