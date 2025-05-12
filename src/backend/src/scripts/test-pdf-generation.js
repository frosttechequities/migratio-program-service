/**
 * Test PDF Generation
 *
 * This script tests the PDF generation functionality.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
const PDFGenerationService = require('../services/pdf-generation.service');
const { logger } = require('../utils/logger');

// Skip MongoDB connection for testing
console.log('Running in test mode without MongoDB connection');

// Mock roadmap data for testing
const mockRoadmap = {
  _id: '60d0fe4f5311236168a109cc',
  userId: '60d0fe4f5311236168a109ca',
  programId: 'ca_express_entry',
  programName: 'Express Entry',
  country: 'Canada',
  title: 'Express Entry Immigration Roadmap',
  description: 'A personalized roadmap for your Express Entry immigration journey.',
  status: 'draft',
  progress: 0,
  startDate: new Date(),
  targetCompletionDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months from now
  phases: [
    {
      title: 'Preparation',
      description: 'Gather documents and prepare for application',
      order: 1,
      status: 'not_started',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1 * 30 * 24 * 60 * 60 * 1000), // 1 month from now
      milestones: [
        {
          title: 'Document Checklist Review',
          description: 'Review required documents for your application',
          category: 'preparation',
          status: 'not_started',
          priority: 'high',
          tasks: [
            {
              title: 'Review document requirements',
              description: 'Carefully review all required documents for your application',
              status: 'not_started'
            },
            {
              title: 'Create document checklist',
              description: 'Create a checklist of all required documents',
              status: 'not_started'
            }
          ]
        }
      ]
    },
    {
      title: 'Application',
      description: 'Submit application and supporting documents',
      order: 2,
      status: 'not_started',
      startDate: new Date(Date.now() + 1 * 30 * 24 * 60 * 60 * 1000), // 1 month from now
      endDate: new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000), // 2 months from now
      milestones: [
        {
          title: 'Application Form Completion',
          description: 'Complete all required application forms',
          category: 'application',
          status: 'not_started',
          priority: 'high',
          tasks: [
            {
              title: 'Download application forms',
              description: 'Download all required application forms from official website',
              status: 'not_started'
            },
            {
              title: 'Complete application forms',
              description: 'Fill out all application forms accurately and completely',
              status: 'not_started'
            }
          ]
        }
      ]
    }
  ],
  estimatedCost: {
    total: 2000,
    currency: 'CAD',
    breakdown: [
      {
        category: 'Application Fee',
        amount: 1500,
        description: 'Government application fee'
      },
      {
        category: 'Biometrics',
        amount: 500,
        description: 'Biometrics fee'
      }
    ]
  }
};

/**
 * Test roadmap PDF generation with a simulated real roadmap
 */
async function testSimulatedRoadmapPDFGeneration() {
  try {
    console.log('Testing roadmap PDF generation with a simulated real roadmap...');

    // Create a simulated roadmap
    const roadmap = {
      _id: new ObjectId(),
      userId: new ObjectId(),
      title: 'Express Entry Immigration Roadmap',
      description: 'A personalized roadmap for your Express Entry immigration journey.',
      programId: 'ca_express_entry',
      programName: 'Express Entry',
      country: 'Canada',
      status: 'active',
      progress: 25,
      startDate: new Date(),
      targetCompletionDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months from now
      phases: [
        {
          title: 'Preparation',
          description: 'Gather documents and prepare for application',
          order: 1,
          status: 'in_progress',
          startDate: new Date(),
          endDate: new Date(Date.now() + 1 * 30 * 24 * 60 * 60 * 1000), // 1 month from now
          milestones: [
            {
              title: 'Document Checklist Review',
              description: 'Review required documents for your application',
              category: 'preparation',
              status: 'completed',
              priority: 'high',
              tasks: [
                {
                  title: 'Review document requirements',
                  description: 'Carefully review all required documents for your application',
                  status: 'completed'
                },
                {
                  title: 'Create document checklist',
                  description: 'Create a checklist of all required documents',
                  status: 'completed'
                }
              ]
            },
            {
              title: 'Language Test Preparation',
              description: 'Prepare for and take language tests',
              category: 'preparation',
              status: 'in_progress',
              priority: 'high',
              tasks: [
                {
                  title: 'Register for language test',
                  description: 'Register for IELTS or CELPIP test',
                  status: 'completed'
                },
                {
                  title: 'Prepare for language test',
                  description: 'Study and practice for the language test',
                  status: 'in_progress'
                },
                {
                  title: 'Take language test',
                  description: 'Attend and complete the language test',
                  status: 'not_started'
                }
              ]
            }
          ]
        },
        {
          title: 'Application',
          description: 'Submit application and supporting documents',
          order: 2,
          status: 'not_started',
          startDate: new Date(Date.now() + 1 * 30 * 24 * 60 * 60 * 1000), // 1 month from now
          endDate: new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000), // 2 months from now
          milestones: [
            {
              title: 'Express Entry Profile Creation',
              description: 'Create your Express Entry profile',
              category: 'application',
              status: 'not_started',
              priority: 'high',
              tasks: [
                {
                  title: 'Gather information for profile',
                  description: 'Collect all information needed for your Express Entry profile',
                  status: 'not_started'
                },
                {
                  title: 'Create IRCC account',
                  description: 'Create an account on the IRCC website',
                  status: 'not_started'
                },
                {
                  title: 'Complete and submit profile',
                  description: 'Fill out and submit your Express Entry profile',
                  status: 'not_started'
                }
              ]
            }
          ]
        }
      ],
      estimatedCost: {
        total: 2000,
        currency: 'CAD',
        breakdown: [
          {
            category: 'Application Fee',
            amount: 1500,
            description: 'Government application fee'
          },
          {
            category: 'Biometrics',
            amount: 500,
            description: 'Biometrics fee'
          }
        ]
      }
    };

    console.log(`Created simulated roadmap: ${roadmap.title}`);

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Initialize PDF generation service
    const pdfGenerationService = new PDFGenerationService();

    // Generate PDF
    console.log('Generating PDF...');
    const pdfInfo = await pdfGenerationService.generateRoadmapPDF(roadmap);
    const pdfPath = pdfInfo.filePath;

    console.log(`PDF generated successfully: ${pdfPath}`);
    console.log('Open the PDF to verify its contents.');

    return pdfPath;
  } catch (error) {
    console.error('Error testing simulated roadmap PDF generation:', error);
    throw error;
  }
}

/**
 * Test roadmap PDF generation with mock data
 */
async function testMockRoadmapPDFGeneration() {
  try {
    console.log('Testing roadmap PDF generation with mock data...');

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Initialize PDF generation service
    const pdfGenerationService = new PDFGenerationService();

    // Generate PDF
    console.log('Generating PDF...');
    const pdfInfo = await pdfGenerationService.generateRoadmapPDF(mockRoadmap);
    const pdfPath = pdfInfo.filePath;

    console.log(`PDF generated successfully: ${pdfPath}`);
    console.log('Open the PDF to verify its contents.');

    return pdfPath;
  } catch (error) {
    console.error('Error testing mock roadmap PDF generation:', error);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    // Test with mock data
    await testMockRoadmapPDFGeneration();

    // Test with simulated real data
    await testSimulatedRoadmapPDFGeneration();

    console.log('All tests completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Tests failed:', error);
    process.exit(1);
  }
}

runTests();
