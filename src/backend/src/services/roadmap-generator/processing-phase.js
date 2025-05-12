/**
 * Processing Phase Generator
 * 
 * Generates the application processing phase for immigration roadmaps.
 * Uses real-world processing steps for different immigration programs.
 */

const { logger } = require('../../utils/logger');

/**
 * Create application processing phase
 * @param {Object} program - Immigration program
 * @param {Object} recommendation - Recommendation object
 * @param {Object} user - User object
 * @returns {Object} - Processing phase
 */
function createProcessingPhase(program, recommendation, user) {
  const phase = {
    title: 'Application Processing',
    description: 'Track and respond to requests during the processing of your application',
    order: 4,
    status: 'not_started',
    milestones: []
  };
  
  // Milestone: Track application status
  phase.milestones.push({
    title: 'Track Application Status',
    description: 'Regularly check the status of your application',
    category: 'application',
    priority: 'medium',
    status: 'not_started',
    estimatedDuration: {
      value: program.processingTime ? program.processingTime.max : 12,
      unit: program.processingTime ? program.processingTime.unit : 'months'
    },
    tasks: [
      {
        title: 'Set up tracking',
        description: 'Set up online tracking for your application if available',
        status: 'not_started'
      },
      {
        title: 'Regular status checks',
        description: 'Check your application status regularly',
        status: 'not_started'
      },
      {
        title: 'Keep contact information updated',
        description: 'Ensure your contact information is always up to date',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Respond to requests for additional information
  phase.milestones.push({
    title: 'Respond to Requests for Additional Information',
    description: 'Promptly respond to any requests for additional information or documentation',
    category: 'application',
    priority: 'critical',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'months'
    },
    tasks: [
      {
        title: 'Monitor communications',
        description: 'Regularly check email and mail for communications from immigration authorities',
        status: 'not_started'
      },
      {
        title: 'Prepare requested documents',
        description: 'Quickly gather any additional requested documents',
        status: 'not_started'
      },
      {
        title: 'Submit additional information',
        description: 'Submit any requested information by the specified deadline',
        status: 'not_started'
      }
    ]
  });
  
  // Add program-specific processing milestones
  if (program.country === 'Canada') {
    // Biometrics for Canada
    phase.milestones.push({
      title: 'Provide Biometrics',
      description: 'Provide your fingerprints and photo if requested',
      category: 'application',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'months'
      },
      tasks: [
        {
          title: 'Receive biometrics instruction letter',
          description: 'Wait to receive your biometrics instruction letter',
          status: 'not_started'
        },
        {
          title: 'Pay biometrics fee',
          description: 'Pay the biometrics fee if not already included',
          status: 'not_started'
        },
        {
          title: 'Schedule biometrics appointment',
          description: 'Schedule an appointment at a biometrics collection service point',
          status: 'not_started'
        },
        {
          title: 'Attend biometrics appointment',
          description: 'Attend your appointment to provide fingerprints and photo',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Biometrics',
          url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/medical-police/biometrics.html',
          type: 'website'
        }
      ]
    });
    
    // Medical exam for Canada
    phase.milestones.push({
      title: 'Complete Medical Examination',
      description: 'Complete a medical examination with an approved panel physician',
      category: 'medical',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'months'
      },
      tasks: [
        {
          title: 'Receive medical instructions',
          description: 'Wait to receive instructions to complete a medical exam',
          status: 'not_started'
        },
        {
          title: 'Find panel physician',
          description: 'Find an approved panel physician in your area',
          status: 'not_started'
        },
        {
          title: 'Schedule medical exam',
          description: 'Schedule your medical examination',
          status: 'not_started'
        },
        {
          title: 'Complete medical exam',
          description: 'Attend and complete your medical examination',
          status: 'not_started'
        }
      ],
      resources: [
        {
          title: 'Find a Panel Physician',
          url: 'https://secure.cic.gc.ca/pp-md/pp-list.aspx',
          type: 'website'
        }
      ]
    });
  } else if (program.country === 'Australia') {
    // Health undertaking for Australia
    phase.milestones.push({
      title: 'Complete Health Undertaking (if required)',
      description: 'Complete a health undertaking if requested after your health examination',
      category: 'medical',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'months'
      },
      tasks: [
        {
          title: 'Receive health undertaking request',
          description: 'Wait to receive a request to complete a health undertaking',
          status: 'not_started'
        },
        {
          title: 'Sign health undertaking',
          description: 'Complete and sign the health undertaking form',
          status: 'not_started'
        },
        {
          title: 'Submit health undertaking',
          description: 'Submit the completed health undertaking',
          status: 'not_started'
        }
      ]
    });
  } else if (program.country === 'United Kingdom') {
    // Interview for UK
    phase.milestones.push({
      title: 'Attend Interview (if required)',
      description: 'Attend an interview if requested by UK immigration authorities',
      category: 'interview',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 1,
        unit: 'months'
      },
      tasks: [
        {
          title: 'Receive interview request',
          description: 'Wait to receive a request to attend an interview',
          status: 'not_started'
        },
        {
          title: 'Prepare for interview',
          description: 'Prepare for your interview by reviewing your application and supporting documents',
          status: 'not_started'
        },
        {
          title: 'Attend interview',
          description: 'Attend your scheduled interview',
          status: 'not_started'
        }
      ]
    });
  }
  
  // Milestone: Receive decision
  phase.milestones.push({
    title: 'Receive Decision',
    description: 'Receive the decision on your application',
    category: 'application',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'months'
    },
    tasks: [
      {
        title: 'Wait for decision',
        description: 'Wait to receive the decision on your application',
        status: 'not_started'
      },
      {
        title: 'Review decision',
        description: 'Carefully review the decision and any accompanying instructions',
        status: 'not_started'
      },
      {
        title: 'Follow next steps',
        description: 'Follow any instructions provided with the decision',
        status: 'not_started'
      }
    ]
  });
  
  return phase;
}

module.exports = {
  createProcessingPhase
};
