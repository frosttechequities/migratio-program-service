/**
 * Test Document Upload Script
 * Tests the document upload functionality
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { User } = require('../models/user.model');
const DocumentService = require('../services/document.service');
const { logger } = require('../utils/logger');

// Sample user data
const sampleUser = {
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  status: 'active',
  emailVerified: true
};

// Sample document data
const sampleDocument = {
  category: 'identity',
  documentType: 'passport',
  description: 'Test passport document',
  expiryDate: new Date('2030-01-01'),
  issuedDate: new Date('2020-01-01'),
  issuedBy: 'Government of India',
  documentNumber: 'A1234567',
  country: 'in',
  tags: ['identity', 'travel'],
  metadata: {
    pages: 32,
    issuingAuthority: 'Passport Office Mumbai'
  }
};

// Create a sample file
const createSampleFile = () => {
  const tempDir = path.join(process.cwd(), 'temp');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Create a sample text file
  const filePath = path.join(tempDir, 'sample-passport.txt');
  fs.writeFileSync(filePath, 'This is a sample passport document for testing purposes.');
  
  return {
    path: filePath,
    originalname: 'sample-passport.txt',
    mimetype: 'text/plain',
    size: fs.statSync(filePath).size
  };
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    logger.info('Connected to MongoDB');
    
    try {
      // Create document service
      const documentService = new DocumentService();
      
      // Create or get test user
      let user = await User.findOne({ email: sampleUser.email });
      
      if (!user) {
        user = new User(sampleUser);
        await user.save();
        logger.info('Created test user');
      } else {
        logger.info('Test user already exists');
      }
      
      // Create sample file
      const sampleFile = createSampleFile();
      logger.info(`Created sample file: ${sampleFile.path}`);
      
      // Upload document
      logger.info('Uploading document...');
      const document = await documentService.uploadDocument(sampleFile, user._id, sampleDocument);
      
      logger.info('Document uploaded successfully:');
      logger.info(`  Document ID: ${document._id}`);
      logger.info(`  File Name: ${document.fileName}`);
      logger.info(`  Original Name: ${document.originalName}`);
      logger.info(`  File Type: ${document.fileType}`);
      logger.info(`  File Size: ${document.fileSize}`);
      logger.info(`  File Path: ${document.filePath}`);
      logger.info(`  Category: ${document.category}`);
      logger.info(`  Document Type: ${document.documentType}`);
      
      // Get document
      logger.info('Getting document...');
      const retrievedDocument = await documentService.getDocument(document._id, user._id);
      
      logger.info('Document retrieved successfully');
      
      // Update document
      logger.info('Updating document...');
      const updatedDocument = await documentService.updateDocument(document._id, user._id, {
        description: 'Updated test passport document',
        documentNumber: 'B9876543'
      });
      
      logger.info('Document updated successfully:');
      logger.info(`  Description: ${updatedDocument.description}`);
      logger.info(`  Document Number: ${updatedDocument.documentNumber}`);
      
      // Get documents by user
      logger.info('Getting documents by user...');
      const userDocuments = await documentService.getDocumentsByUser(user._id);
      
      logger.info(`Found ${userDocuments.length} documents for user`);
      
      // Delete document
      logger.info('Deleting document...');
      await documentService.deleteDocument(document._id, user._id);
      
      logger.info('Document deleted successfully');
      
      // Verify deletion
      logger.info('Verifying deletion...');
      const documentsAfterDeletion = await documentService.getDocumentsByUser(user._id);
      
      logger.info(`Found ${documentsAfterDeletion.length} documents for user after deletion`);
      
      // Disconnect from MongoDB
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
      
      process.exit(0);
    } catch (error) {
      logger.error('Error testing document upload:', error);
      process.exit(1);
    }
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });
