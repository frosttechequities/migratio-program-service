/**
 * Application Phase Generator
 * 
 * Generates the application submission phase for immigration roadmaps.
 * Uses real-world application processes for different immigration programs.
 */

const { logger } = require('../../utils/logger');

/**
 * Create application submission phase
 * @param {Object} program - Immigration program
 * @param {Object} recommendation - Recommendation object
 * @param {Object} user - User object
 * @returns {Object} - Application phase
 */
function createApplicationPhase(program, recommendation, user) {
  const phase = {
    title: 'Application Submission',
    description: 'Prepare and submit your immigration application',
    order: 3,
    status: 'not_started',
    milestones: []
  };
  
  // Milestone: Complete application forms
  phase.milestones.push({
    title: 'Complete Application Forms',
    description: 'Fill out all required application forms accurately',
    category: 'application',
    priority: 'critical',
    status: 'not_started',
    estimatedDuration: {
      value: 2,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Download application forms',
        description: 'Download all required application forms from the official website',
        status: 'not_started'
      },
      {
        title: 'Fill out forms',
        description: 'Complete all forms with accurate information',
        status: 'not_started'
      },
      {
        title: 'Review forms for accuracy',
        description: 'Double-check all forms for errors or omissions',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Pay application fees
  phase.milestones.push({
    title: 'Pay Application Fees',
    description: 'Pay all required application fees',
    category: 'application',
    priority: 'critical',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Confirm fee amounts',
        description: 'Verify the current fee amounts on the official website',
        status: 'not_started'
      },
      {
        title: 'Prepare payment method',
        description: 'Ensure you have an accepted payment method ready',
        status: 'not_started'
      },
      {
        title: 'Make payment',
        description: 'Pay all required fees and save receipts',
        status: 'not_started'
      }
    ],
    cost: {
      amount: program.fees ? program.fees.total : null,
      currency: program.fees ? program.fees.currency : null,
      description: 'Application fees'
    }
  });
  
  // Milestone: Organize application package
  phase.milestones.push({
    title: 'Organize Application Package',
    description: 'Organize all forms and supporting documents into a complete application package',
    category: 'application',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Create document inventory',
        description: 'Create a detailed inventory of all documents in your application',
        status: 'not_started'
      },
      {
        title: 'Organize documents',
        description: 'Organize documents according to official guidelines',
        status: 'not_started'
      },
      {
        title: 'Make copies',
        description: 'Make copies of all documents for your records',
        status: 'not_started'
      }
    ]
  });
  
  // Add program-specific application milestones
  if (program.country === 'Canada') {
    if (program.programId.includes('express_entry')) {
      // Express Entry specific milestone
      phase.milestones.push({
        title: 'Respond to Invitation to Apply (ITA)',
        description: 'Submit your complete application after receiving an ITA',
        category: 'application',
        priority: 'critical',
        status: 'not_started',
        estimatedDuration: {
          value: 2,
          unit: 'months'
        },
        tasks: [
          {
            title: 'Receive ITA',
            description: 'Wait to receive an Invitation to Apply',
            status: 'not_started'
          },
          {
            title: 'Gather additional documents',
            description: 'Gather any additional documents required for the full application',
            status: 'not_started'
          },
          {
            title: 'Submit application',
            description: 'Submit your complete application within 60 days of receiving the ITA',
            status: 'not_started'
          }
        ],
        resources: [
          {
            title: 'Express Entry: After you get an invitation to apply',
            url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/after-invitation.html',
            type: 'website'
          }
        ]
      });
    } else if (program.programId.includes('pnp')) {
      // Provincial Nominee Program specific milestone
      phase.milestones.push({
        title: 'Apply for Provincial Nomination',
        description: 'Submit your application to the provincial nominee program',
        category: 'application',
        priority: 'critical',
        status: 'not_started',
        estimatedDuration: {
          value: 3,
          unit: 'months'
        },
        tasks: [
          {
            title: 'Research provincial requirements',
            description: 'Research specific requirements for your chosen province',
            status: 'not_started'
          },
          {
            title: 'Prepare provincial application',
            description: 'Prepare your application for provincial nomination',
            status: 'not_started'
          },
          {
            title: 'Submit provincial application',
            description: 'Submit your application to the provincial program',
            status: 'not_started'
          },
          {
            title: 'Receive nomination certificate',
            description: 'Wait to receive your provincial nomination certificate',
            status: 'not_started'
          },
          {
            title: 'Apply to federal government',
            description: 'Submit your application to the federal government with your nomination certificate',
            status: 'not_started'
          }
        ]
      });
    }
  } else if (program.country === 'Australia') {
    if (program.programId.includes('189') || program.programId.includes('190') || program.programId.includes('491')) {
      // Australia skilled visa specific milestone
      phase.milestones.push({
        title: 'Receive and Respond to Invitation',
        description: 'Submit your visa application after receiving an invitation',
        category: 'application',
        priority: 'critical',
        status: 'not_started',
        estimatedDuration: {
          value: 2,
          unit: 'months'
        },
        tasks: [
          {
            title: 'Receive invitation',
            description: 'Wait to receive an invitation to apply for the visa',
            status: 'not_started'
          },
          {
            title: 'Create ImmiAccount',
            description: 'Create an ImmiAccount if you don\'t already have one',
            status: 'not_started'
          },
          {
            title: 'Submit visa application',
            description: 'Submit your complete visa application within 60 days of receiving the invitation',
            status: 'not_started'
          }
        ],
        resources: [
          {
            title: 'ImmiAccount',
            url: 'https://online.immi.gov.au/lusc/login',
            type: 'website'
          }
        ]
      });
    }
  } else if (program.country === 'United Kingdom') {
    // UK specific milestone
    phase.milestones.push({
      title: 'Submit Online Application',
      description: 'Complete and submit your online visa application',
      category: 'application',
      priority: 'critical',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'months'
      },
      tasks: [
        {
          title: 'Create account',
          description: 'Create an account on the UK visa application website',
          status: 'not_started'
        },
        {
          title: 'Complete online application',
          description: 'Fill out the online application form',
          status: 'not_started'
        },
        {
          title: 'Pay the healthcare surcharge',
          description: 'Pay the Immigration Health Surcharge if applicable',
          status: 'not_started'
        },
        {
          title: 'Book biometric appointment',
          description: 'Schedule an appointment to provide your biometric information',
          status: 'not_started'
        },
        {
          title: 'Attend biometric appointment',
          description: 'Attend your appointment to provide fingerprints and photo',
          status: 'not_started'
        },
        {
          title: 'Submit supporting documents',
          description: 'Submit all supporting documents as instructed',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'UK Visa Application',
          url: 'https://www.gov.uk/apply-to-come-to-the-uk',
          type: 'website'
        }
      ]
    });
  }
  
  // Milestone: Submit application
  phase.milestones.push({
    title: 'Submit Application',
    description: 'Submit your complete application package',
    category: 'application',
    priority: 'critical',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Final review',
        description: 'Conduct a final review of your entire application package',
        status: 'not_started'
      },
      {
        title: 'Submit application',
        description: 'Submit your application through the appropriate channel',
        status: 'not_started'
      },
      {
        title: 'Confirm receipt',
        description: 'Ensure you receive confirmation that your application was received',
        status: 'not_started'
      }
    ]
  });
  
  return phase;
}

module.exports = {
  createApplicationPhase
};
