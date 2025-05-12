/**
 * Settlement Phase Generator
 * 
 * Generates the arrival and settlement phase for immigration roadmaps.
 * Uses real-world settlement steps for different immigration programs.
 */

const { logger } = require('../../utils/logger');

/**
 * Create arrival and settlement phase
 * @param {Object} program - Immigration program
 * @param {Object} recommendation - Recommendation object
 * @param {Object} user - User object
 * @returns {Object} - Settlement phase
 */
function createSettlementPhase(program, recommendation, user) {
  const phase = {
    title: 'Arrival and Settlement',
    description: 'Complete important tasks after arriving in your destination country',
    order: 6,
    status: 'not_started',
    milestones: []
  };
  
  // Milestone: Initial arrival tasks
  phase.milestones.push({
    title: 'Initial Arrival Tasks',
    description: 'Complete essential tasks immediately after arrival',
    category: 'settlement',
    priority: 'critical',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Clear immigration and customs',
        description: 'Successfully clear immigration and customs at your port of entry',
        status: 'not_started'
      },
      {
        title: 'Travel to accommodation',
        description: 'Travel to your temporary or permanent accommodation',
        status: 'not_started'
      },
      {
        title: 'Purchase essential items',
        description: 'Purchase essential items for your immediate needs',
        status: 'not_started'
      },
      {
        title: 'Activate local phone service',
        description: 'Get a local phone number or activate international roaming',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Government registration
  phase.milestones.push({
    title: 'Government Registration',
    description: 'Register with necessary government agencies',
    category: 'legal',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 2,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Register for identification',
        description: 'Apply for necessary identification documents',
        status: 'not_started'
      },
      {
        title: 'Register for healthcare',
        description: 'Register for the healthcare system',
        status: 'not_started'
      },
      {
        title: 'Register for taxation',
        description: 'Register with the tax authority',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Banking setup
  phase.milestones.push({
    title: 'Banking Setup',
    description: 'Set up local banking services',
    category: 'settlement',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Research banks',
        description: 'Research and select a suitable bank',
        status: 'not_started'
      },
      {
        title: 'Gather required documents',
        description: 'Gather documents required to open a bank account',
        status: 'not_started'
      },
      {
        title: 'Open bank account',
        description: 'Visit the bank and open an account',
        status: 'not_started'
      },
      {
        title: 'Set up online banking',
        description: 'Set up online and mobile banking services',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Housing
  phase.milestones.push({
    title: 'Secure Permanent Housing',
    description: 'Find and secure permanent housing',
    category: 'settlement',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'months'
    },
    tasks: [
      {
        title: 'View properties',
        description: 'Research and view potential properties',
        status: 'not_started'
      },
      {
        title: 'Apply for rental',
        description: 'Apply for your chosen rental property',
        status: 'not_started'
      },
      {
        title: 'Sign lease',
        description: 'Review and sign the lease agreement',
        status: 'not_started'
      },
      {
        title: 'Set up utilities',
        description: 'Set up electricity, water, internet, etc.',
        status: 'not_started'
      },
      {
        title: 'Purchase furniture',
        description: 'Purchase essential furniture and household items',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Employment
  phase.milestones.push({
    title: 'Secure Employment',
    description: 'Find and secure employment',
    category: 'settlement',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 3,
      unit: 'months'
    },
    tasks: [
      {
        title: 'Update resume/CV',
        description: 'Update your resume/CV for the local job market',
        status: 'not_started'
      },
      {
        title: 'Register with employment agencies',
        description: 'Register with relevant employment agencies',
        status: 'not_started'
      },
      {
        title: 'Apply for jobs',
        description: 'Research and apply for suitable positions',
        status: 'not_started'
      },
      {
        title: 'Attend interviews',
        description: 'Prepare for and attend job interviews',
        status: 'not_started'
      },
      {
        title: 'Accept job offer',
        description: 'Review and accept a job offer',
        status: 'not_started'
      },
      {
        title: 'Complete onboarding',
        description: 'Complete the onboarding process with your new employer',
        status: 'not_started'
      }
    ]
  });
  
  // Add country-specific settlement milestones
  if (program.country === 'Canada') {
    // Social Insurance Number for Canada
    phase.milestones.push({
      title: 'Apply for Social Insurance Number (SIN)',
      description: 'Apply for your Social Insurance Number',
      category: 'legal',
      priority: 'critical',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Gather required documents',
          description: 'Gather documents required for SIN application',
          status: 'not_started'
        },
        {
          title: 'Apply for SIN',
          description: 'Apply for your SIN in person or online',
          status: 'not_started'
        },
        {
          title: 'Receive SIN',
          description: 'Receive your SIN and keep it secure',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Social Insurance Number',
          url: 'https://www.canada.ca/en/employment-social-development/services/sin.html',
          type: 'website'
        }
      ]
    });
    
    // Provincial health insurance for Canada
    phase.milestones.push({
      title: 'Apply for Provincial Health Insurance',
      description: 'Apply for health insurance in your province',
      category: 'legal',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 2,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Research provincial health insurance',
          description: 'Research health insurance in your province',
          status: 'not_started'
        },
        {
          title: 'Gather required documents',
          description: 'Gather documents required for health insurance application',
          status: 'not_started'
        },
        {
          title: 'Apply for health insurance',
          description: 'Apply for provincial health insurance',
          status: 'not_started'
        },
        {
          title: 'Receive health card',
          description: 'Receive your health card',
          status: 'not_started'
        }
      ]
    });
  } else if (program.country === 'Australia') {
    // Medicare for Australia
    phase.milestones.push({
      title: 'Register for Medicare',
      description: 'Register for Australia\'s public healthcare system',
      category: 'legal',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Check eligibility',
          description: 'Check if you are eligible for Medicare',
          status: 'not_started'
        },
        {
          title: 'Gather required documents',
          description: 'Gather documents required for Medicare registration',
          status: 'not_started'
        },
        {
          title: 'Visit Medicare service center',
          description: 'Visit a Medicare service center to register',
          status: 'not_started'
        },
        {
          title: 'Receive Medicare card',
          description: 'Receive your Medicare card',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Medicare',
          url: 'https://www.servicesaustralia.gov.au/individuals/services/medicare',
          type: 'website'
        }
      ]
    });
    
    // Tax File Number for Australia
    phase.milestones.push({
      title: 'Apply for Tax File Number (TFN)',
      description: 'Apply for your Tax File Number',
      category: 'legal',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Prepare for application',
          description: 'Gather information needed for TFN application',
          status: 'not_started'
        },
        {
          title: 'Apply for TFN online',
          description: 'Complete the online TFN application',
          status: 'not_started'
        },
        {
          title: 'Receive TFN',
          description: 'Receive your TFN and keep it secure',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Tax File Number',
          url: 'https://www.ato.gov.au/individuals/tax-file-number/',
          type: 'website'
        }
      ]
    });
  } else if (program.country === 'United Kingdom') {
    // National Insurance Number for UK
    phase.milestones.push({
      title: 'Apply for National Insurance Number',
      description: 'Apply for your National Insurance Number',
      category: 'legal',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 2,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Call the National Insurance application line',
          description: 'Call to schedule an appointment',
          status: 'not_started'
        },
        {
          title: 'Attend appointment',
          description: 'Attend your appointment with required documents',
          status: 'not_started'
        },
        {
          title: 'Receive National Insurance Number',
          description: 'Receive your National Insurance Number',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'National Insurance Number',
          url: 'https://www.gov.uk/apply-national-insurance-number',
          type: 'website'
        }
      ]
    });
    
    // Register with GP for UK
    phase.milestones.push({
      title: 'Register with a GP',
      description: 'Register with a local General Practitioner (doctor)',
      category: 'settlement',
      priority: 'medium',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Find local GP practices',
          description: 'Research GP practices in your area',
          status: 'not_started'
        },
        {
          title: 'Contact chosen practice',
          description: 'Contact your chosen GP practice to register',
          status: 'not_started'
        },
        {
          title: 'Complete registration forms',
          description: 'Complete and submit registration forms',
          status: 'not_started'
        },
        {
          title: 'Attend initial appointment',
          description: 'Attend an initial appointment if required',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Find a GP',
          url: 'https://www.nhs.uk/service-search/find-a-gp',
          type: 'website'
        }
      ]
    });
  }
  
  // Milestone: Community integration
  phase.milestones.push({
    title: 'Community Integration',
    description: 'Integrate into your local community',
    category: 'settlement',
    priority: 'medium',
    status: 'not_started',
    estimatedDuration: {
      value: 3,
      unit: 'months'
    },
    tasks: [
      {
        title: 'Explore neighborhood',
        description: 'Explore your local neighborhood',
        status: 'not_started'
      },
      {
        title: 'Join community groups',
        description: 'Join local community groups or clubs',
        status: 'not_started'
      },
      {
        title: 'Attend local events',
        description: 'Attend local events or activities',
        status: 'not_started'
      },
      {
        title: 'Volunteer',
        description: 'Consider volunteering in your community',
        status: 'not_started'
      }
    ]
  });
  
  return phase;
}

module.exports = {
  createSettlementPhase
};
