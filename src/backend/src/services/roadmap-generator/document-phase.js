/**
 * Document Phase Generator
 * 
 * Generates the document collection and verification phase for immigration roadmaps.
 * Uses real-world document requirements for different immigration programs.
 */

const { logger } = require('../../utils/logger');

/**
 * Create document collection and verification phase
 * @param {Object} program - Immigration program
 * @param {Object} recommendation - Recommendation object
 * @param {Object} user - User object
 * @returns {Object} - Document phase
 */
function createDocumentPhase(program, recommendation, user) {
  const phase = {
    title: 'Document Collection and Verification',
    description: 'Gather and verify all required documents for your application',
    order: 2,
    status: 'not_started',
    milestones: []
  };
  
  // Milestone: Identify required documents
  phase.milestones.push({
    title: 'Identify Required Documents',
    description: 'Create a comprehensive list of all required documents',
    category: 'preparation',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 1,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Research document requirements',
        description: 'Research all document requirements for your specific situation',
        status: 'not_started'
      },
      {
        title: 'Create a document checklist',
        description: 'Create a detailed checklist of all required documents',
        status: 'not_started'
      }
    ]
  });
  
  // Milestone: Personal identification documents
  phase.milestones.push({
    title: 'Personal Identification Documents',
    description: 'Gather all personal identification documents',
    category: 'document',
    priority: 'critical',
    status: 'not_started',
    estimatedDuration: {
      value: 2,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Passport',
        description: 'Ensure your passport is valid for at least 6 months beyond your planned stay',
        status: 'not_started'
      },
      {
        title: 'Birth certificate',
        description: 'Obtain your birth certificate and any required translations',
        status: 'not_started'
      },
      {
        title: 'Marriage certificate (if applicable)',
        description: 'Obtain your marriage certificate and any required translations',
        status: 'not_started'
      },
      {
        title: 'Divorce certificate (if applicable)',
        description: 'Obtain your divorce certificate and any required translations',
        status: 'not_started'
      },
      {
        title: 'National ID card',
        description: 'Obtain a copy of your national ID card',
        status: 'not_started'
      }
    ],
    documents: [
      {
        documentId: 'passport',
        required: true,
        status: 'missing'
      },
      {
        documentId: 'birth_certificate',
        required: true,
        status: 'missing'
      },
      {
        documentId: 'marriage_certificate',
        required: false,
        status: 'missing'
      }
    ]
  });
  
  // Milestone: Educational documents
  phase.milestones.push({
    title: 'Educational Documents',
    description: 'Gather all educational documents and get them assessed if required',
    category: 'document',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 4,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Diplomas and degrees',
        description: 'Obtain copies of all diplomas and degrees',
        status: 'not_started'
      },
      {
        title: 'Transcripts',
        description: 'Obtain official transcripts from all educational institutions',
        status: 'not_started'
      },
      {
        title: 'Educational credential assessment',
        description: 'Get your educational credentials assessed by the appropriate authority',
        status: 'not_started'
      }
    ],
    documents: [
      {
        documentId: 'diplomas',
        required: true,
        status: 'missing'
      },
      {
        documentId: 'transcripts',
        required: true,
        status: 'missing'
      },
      {
        documentId: 'credential_assessment',
        required: true,
        status: 'missing'
      }
    ]
  });
  
  // Milestone: Work experience documents
  phase.milestones.push({
    title: 'Work Experience Documents',
    description: 'Gather all work experience documents',
    category: 'document',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 4,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Reference letters',
        description: 'Obtain reference letters from all relevant employers',
        status: 'not_started'
      },
      {
        title: 'Employment contracts',
        description: 'Gather copies of all employment contracts',
        status: 'not_started'
      },
      {
        title: 'Pay stubs/tax documents',
        description: 'Collect pay stubs or tax documents to prove employment',
        status: 'not_started'
      },
      {
        title: 'Resume/CV',
        description: 'Update your resume/CV with all relevant experience',
        status: 'not_started'
      }
    ],
    documents: [
      {
        documentId: 'reference_letters',
        required: true,
        status: 'missing'
      },
      {
        documentId: 'employment_contracts',
        required: true,
        status: 'missing'
      },
      {
        documentId: 'pay_stubs',
        required: true,
        status: 'missing'
      },
      {
        documentId: 'resume',
        required: true,
        status: 'missing'
      }
    ]
  });
  
  // Milestone: Language proficiency documents
  phase.milestones.push({
    title: 'Language Proficiency Documents',
    description: 'Take language tests and obtain official results',
    category: 'document',
    priority: 'critical',
    status: 'not_started',
    estimatedDuration: {
      value: 6,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Register for language test',
        description: 'Register for the appropriate language test (IELTS, CELPIP, TEF, etc.)',
        status: 'not_started'
      },
      {
        title: 'Prepare for language test',
        description: 'Study and prepare for your language test',
        status: 'not_started'
      },
      {
        title: 'Take language test',
        description: 'Take the language test on your scheduled date',
        status: 'not_started'
      },
      {
        title: 'Obtain test results',
        description: 'Receive and save your official test results',
        status: 'not_started'
      }
    ],
    documents: [
      {
        documentId: 'language_test_results',
        required: true,
        status: 'missing'
      }
    ]
  });
  
  // Milestone: Financial documents
  phase.milestones.push({
    title: 'Financial Documents',
    description: 'Gather documents to prove you have sufficient funds',
    category: 'document',
    priority: 'high',
    status: 'not_started',
    estimatedDuration: {
      value: 2,
      unit: 'weeks'
    },
    tasks: [
      {
        title: 'Bank statements',
        description: 'Obtain bank statements showing sufficient funds',
        status: 'not_started'
      },
      {
        title: 'Investment statements',
        description: 'Gather statements for any investments',
        status: 'not_started'
      },
      {
        title: 'Proof of assets',
        description: 'Collect documents proving ownership of any relevant assets',
        status: 'not_started'
      }
    ],
    documents: [
      {
        documentId: 'bank_statements',
        required: true,
        status: 'missing'
      },
      {
        documentId: 'investment_statements',
        required: false,
        status: 'missing'
      },
      {
        documentId: 'asset_proof',
        required: false,
        status: 'missing'
      }
    ]
  });
  
  // Add program-specific document milestones
  if (program.country === 'Canada') {
    // Police certificates for Canada
    phase.milestones.push({
      title: 'Police Certificates',
      description: 'Obtain police certificates from all countries where you lived for 6+ months since age 18',
      category: 'document',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 8,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Research requirements',
          description: 'Research how to obtain police certificates from each relevant country',
          status: 'not_started'
        },
        {
          title: 'Apply for certificates',
          description: 'Apply for all required police certificates',
          status: 'not_started'
        },
        {
          title: 'Receive certificates',
          description: 'Receive and save all police certificates',
          status: 'not_started'
        }
      ],
      documents: [
        {
          documentId: 'police_certificates',
          required: true,
          status: 'missing'
        }
      ]
    });
  } else if (program.country === 'Australia') {
    // Health examination for Australia
    phase.milestones.push({
      title: 'Health Examination',
      description: 'Complete the required health examination with an approved panel physician',
      category: 'document',
      priority: 'high',
      status: 'not_started',
      estimatedDuration: {
        value: 4,
        unit: 'weeks'
      },
      tasks: [
        {
          title: 'Find panel physician',
          description: 'Locate an approved panel physician in your area',
          status: 'not_started'
        },
        {
          title: 'Schedule examination',
          description: 'Schedule your health examination',
          status: 'not_started'
        },
        {
          title: 'Complete examination',
          description: 'Complete the health examination',
          status: 'not_started'
        },
        {
          title: 'Receive results',
          description: 'Ensure results are submitted to immigration authorities',
          status: 'not_started'
        }
      ],
      documents: [
        {
          documentId: 'health_examination',
          required: true,
          status: 'missing'
        }
      ]
    });
  }
  
  return phase;
}

module.exports = {
  createDocumentPhase
};
