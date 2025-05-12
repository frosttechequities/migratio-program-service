/**
 * Test script for document management and PDF generation integration
 * 
 * This script tests:
 * 1. Creating a roadmap
 * 2. Uploading documents
 * 3. Assigning documents to roadmap milestones
 * 4. Generating a PDF with the assigned documents
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');
const config = require('../config');
const User = require('../models/user.model');
const Roadmap = require('../models/roadmap.model');
const Document = require('../models/document.model');
const RoadmapService = require('../services/roadmap.service');
const DocumentService = require('../services/document.service');
const PDFGenerationService = require('../services/pdf-generation.service');

// Initialize services
const roadmapService = new RoadmapService();
const documentService = new DocumentService();
const pdfGenerationService = new PDFGenerationService();

// Test data
const testUser = {
  _id: new mongoose.Types.ObjectId(),
  email: 'test-integration@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'Integration',
  role: 'user'
};

const testRoadmap = {
  title: 'Integration Test Roadmap',
  description: 'This is a test roadmap for integration testing',
  status: 'active',
  startDate: new Date(),
  targetCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  visibility: 'private',
  phases: [
    {
      title: 'Phase 1: Document Collection',
      description: 'Collect all required documents',
      status: 'in_progress',
      completionPercentage: 50,
      milestones: [
        {
          title: 'Milestone 1: Personal Documents',
          description: 'Collect personal identification documents',
          status: 'in_progress',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Milestone 2: Professional Documents',
          description: 'Collect professional and educational documents',
          status: 'not_started',
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        }
      ]
    }
  ]
};

// Connect to database
async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongoURI);
    logger.info('Connected to database');
  } catch (error) {
    logger.error('Failed to connect to database', error);
    process.exit(1);
  }
}

// Setup test data
async function setupTestData() {
  try {
    // Clear existing test data
    await User.deleteMany({ email: testUser.email });
    await Roadmap.deleteMany({ title: testRoadmap.title });
    await Document.deleteMany({ userId: testUser._id });

    // Create test user
    await User.create(testUser);
    logger.info('Created test user');

    // Create test roadmap
    const roadmap = new Roadmap({
      ...testRoadmap,
      userId: testUser._id
    });
    await roadmap.save();
    logger.info('Created test roadmap');

    return roadmap;
  } catch (error) {
    logger.error('Failed to setup test data', error);
    process.exit(1);
  }
}

// Upload test documents
async function uploadTestDocuments() {
  try {
    logger.info('Uploading test documents...');
    
    // Create test document files if they don't exist
    const testDocsDir = path.join(__dirname, '../../test-docs');
    if (!fs.existsSync(testDocsDir)) {
      fs.mkdirSync(testDocsDir, { recursive: true });
    }

    const testDocPaths = [];
    
    // Create a test PDF file for passport
    const passportPath = path.join(testDocsDir, 'passport.pdf');
    if (!fs.existsSync(passportPath)) {
      fs.writeFileSync(passportPath, 'Test passport file content');
    }
    testDocPaths.push(passportPath);
    
    // Create a test PDF file for resume
    const resumePath = path.join(testDocsDir, 'resume.pdf');
    if (!fs.existsSync(resumePath)) {
      fs.writeFileSync(resumePath, 'Test resume file content');
    }
    testDocPaths.push(resumePath);

    // Upload documents
    const documents = [];
    for (const filePath of testDocPaths) {
      const fileName = path.basename(filePath);
      const fileStats = fs.statSync(filePath);
      
      const documentData = {
        userId: testUser._id,
        originalName: fileName,
        fileName: `${path.parse(fileName).name}-${Date.now()}${path.extname(fileName)}`,
        mimeType: 'application/pdf',
        size: fileStats.size,
        documentType: fileName.includes('passport') ? 'Identification' : 'Professional',
        category: fileName.includes('passport') ? 'Personal' : 'Employment'
      };
      
      const document = await Document.create(documentData);
      documents.push(document);
      logger.info(`Uploaded document: ${document.originalName}`);
    }

    return documents;
  } catch (error) {
    logger.error('Failed to upload test documents', error);
    throw error;
  }
}

// Assign documents to roadmap milestones
async function assignDocumentsToMilestones(roadmap, documents) {
  try {
    logger.info('Assigning documents to milestones...');
    
    // Assign passport to first milestone
    const passportDoc = documents.find(doc => doc.originalName.includes('passport'));
    if (passportDoc && roadmap.phases[0] && roadmap.phases[0].milestones[0]) {
      roadmap.phases[0].milestones[0].documents = [
        {
          documentId: passportDoc._id,
          status: 'pending',
          assignedAt: new Date()
        }
      ];
    }
    
    // Assign resume to second milestone
    const resumeDoc = documents.find(doc => doc.originalName.includes('resume'));
    if (resumeDoc && roadmap.phases[0] && roadmap.phases[0].milestones[1]) {
      roadmap.phases[0].milestones[1].documents = [
        {
          documentId: resumeDoc._id,
          status: 'pending',
          assignedAt: new Date()
        }
      ];
    }
    
    // Save updated roadmap
    await roadmap.save();
    logger.info('Documents assigned to milestones');
    
    return roadmap;
  } catch (error) {
    logger.error('Failed to assign documents to milestones', error);
    throw error;
  }
}

// Generate PDF with documents
async function generatePDF(roadmap) {
  try {
    logger.info('Generating PDF with documents...');
    
    // Generate PDF
    const pdfPath = await pdfGenerationService.generateRoadmapPdf(roadmap, {
      includeNotes: true,
      includeDocuments: true
    });
    
    logger.info(`PDF generated successfully: ${pdfPath}`);
    
    // Verify PDF exists and has content
    const fileStats = fs.statSync(pdfPath);
    logger.info(`PDF file size: ${fileStats.size} bytes`);
    
    if (fileStats.size > 0) {
      logger.info('PDF generation test passed!');
    } else {
      logger.error('PDF generation test failed: PDF file is empty');
    }
    
    return pdfPath;
  } catch (error) {
    logger.error('Failed to generate PDF', error);
    throw error;
  }
}

// Run all tests
async function runTests() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Setup test data
    const roadmap = await setupTestData();
    
    // Upload test documents
    const documents = await uploadTestDocuments();
    
    // Assign documents to milestones
    const updatedRoadmap = await assignDocumentsToMilestones(roadmap, documents);
    
    // Generate PDF with documents
    const pdfPath = await generatePDF(updatedRoadmap);
    
    logger.info('All tests completed successfully!');
    logger.info(`PDF saved to: ${pdfPath}`);
    
    // Disconnect from database
    await mongoose.disconnect();
    logger.info('Disconnected from database');
    
    process.exit(0);
  } catch (error) {
    logger.error('Tests failed', error);
    
    // Disconnect from database
    try {
      await mongoose.disconnect();
      logger.info('Disconnected from database');
    } catch (disconnectError) {
      logger.error('Failed to disconnect from database', disconnectError);
    }
    
    process.exit(1);
  }
}

// Run the tests
runTests();
