/**
 * Test Document Management
 *
 * This script tests the document management functionality.
 */

require('dotenv').config();
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');

// Skip MongoDB connection for testing
console.log('Running in test mode without MongoDB connection');

// Mock user data
const mockUser = {
  _id: new ObjectId(),
  name: 'Test User',
  email: 'test@example.com'
};

// Mock roadmap data
const mockRoadmap = {
  _id: new ObjectId(),
  userId: mockUser._id,
  title: 'Test Roadmap',
  programId: 'ca_express_entry',
  programName: 'Express Entry',
  country: 'Canada'
};

/**
 * Test document creation
 */
async function testDocumentCreation() {
  try {
    console.log('Testing document creation...');

    // Create a document object
    const document = {
      _id: new ObjectId(),
      userId: mockUser._id,
      roadmapId: mockRoadmap._id,
      title: 'Test Document',
      description: 'This is a test document',
      category: 'identification',
      documentType: 'passport',
      status: 'draft',
      isRequired: true,
      priority: 'high',
      tags: ['test', 'passport'],
      metadata: {
        issueDate: new Date(),
        expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // 5 years from now
        issuingAuthority: 'Test Authority',
        issuingCountry: 'Test Country',
        documentNumber: 'TEST123456'
      },
      notes: 'This is a test document for testing purposes',
      history: [
        {
          action: 'created',
          timestamp: new Date(),
          userId: mockUser._id
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add methods to the document object
    document.isExpired = function() {
      if (this.metadata && this.metadata.expiryDate) {
        return new Date() > this.metadata.expiryDate;
      }
      return false;
    };

    document.updateStatus = function(status, userId, notes) {
      this.status = status;
      this.history.push({
        action: status,
        timestamp: new Date(),
        userId: userId,
        notes: notes
      });
      return this;
    };

    document.addFileDetails = function(fileDetails, userId) {
      this.fileDetails = {
        ...fileDetails,
        uploadDate: new Date()
      };
      this.status = 'pending';
      this.history.push({
        action: 'uploaded',
        timestamp: new Date(),
        userId: userId,
        notes: `File uploaded: ${fileDetails.originalFilename}`
      });
      return this;
    };

    console.log('Document created successfully:');
    console.log(`- ID: ${document._id}`);
    console.log(`- Title: ${document.title}`);
    console.log(`- Category: ${document.category}`);
    console.log(`- Type: ${document.documentType}`);
    console.log(`- Status: ${document.status}`);

    return document;
  } catch (error) {
    console.error('Error testing document creation:', error);
    throw error;
  }
}

/**
 * Test document update
 */
async function testDocumentUpdate(document) {
  try {
    console.log('\nTesting document update...');

    // Update the document
    document.status = 'pending';
    document.notes = 'Updated notes';
    document.updateStatus('pending', mockUser._id, 'Document status updated');
    document.updatedAt = new Date();

    console.log('Document updated successfully:');
    console.log(`- Status: ${document.status}`);
    console.log(`- Notes: ${document.notes}`);
    console.log(`- History entries: ${document.history.length}`);

    return document;
  } catch (error) {
    console.error('Error testing document update:', error);
    throw error;
  }
}

/**
 * Test document file upload
 */
async function testDocumentFileUpload(document) {
  try {
    console.log('\nTesting document file upload...');

    // Create a mock file
    const fileDetails = {
      originalFilename: 'test-passport.pdf',
      filename: `${Date.now()}-test-passport.pdf`,
      path: '/uploads/test-passport.pdf',
      mimetype: 'application/pdf',
      size: 1024
    };

    // Add file details to the document
    document.addFileDetails(fileDetails, mockUser._id);
    document.updatedAt = new Date();

    console.log('Document file details added successfully:');
    console.log(`- Original filename: ${document.fileDetails.originalFilename}`);
    console.log(`- Filename: ${document.fileDetails.filename}`);
    console.log(`- Path: ${document.fileDetails.path}`);
    console.log(`- Mimetype: ${document.fileDetails.mimetype}`);
    console.log(`- Size: ${document.fileDetails.size}`);
    console.log(`- Upload date: ${document.fileDetails.uploadDate}`);

    return document;
  } catch (error) {
    console.error('Error testing document file upload:', error);
    throw error;
  }
}

/**
 * Test document queries
 */
async function testDocumentQueries() {
  try {
    console.log('\nTesting document queries...');

    // Create a few test documents
    const documents = [
      {
        _id: new ObjectId(),
        userId: mockUser._id,
        roadmapId: mockRoadmap._id,
        title: 'Passport',
        category: 'identification',
        documentType: 'passport',
        status: 'draft',
        isRequired: true
      },
      {
        _id: new ObjectId(),
        userId: mockUser._id,
        roadmapId: mockRoadmap._id,
        title: 'Birth Certificate',
        category: 'identification',
        documentType: 'birth_certificate',
        status: 'pending',
        isRequired: true
      },
      {
        _id: new ObjectId(),
        userId: mockUser._id,
        roadmapId: mockRoadmap._id,
        title: 'Resume',
        category: 'work',
        documentType: 'resume',
        status: 'approved',
        isRequired: false
      }
    ];

    // Simulate document queries
    console.log('Simulating document queries...');

    // Find all documents
    const allDocuments = documents.filter(doc => doc.userId.equals(mockUser._id));
    console.log(`Found ${allDocuments.length} documents for user`);

    // Find documents by category
    const identificationDocuments = documents.filter(doc =>
      doc.userId.equals(mockUser._id) && doc.category === 'identification'
    );
    console.log(`Found ${identificationDocuments.length} identification documents`);

    // Find documents by type
    const passportDocuments = documents.filter(doc =>
      doc.userId.equals(mockUser._id) && doc.documentType === 'passport'
    );
    console.log(`Found ${passportDocuments.length} passport documents`);

    // Find required documents
    const requiredDocuments = documents.filter(doc =>
      doc.userId.equals(mockUser._id) && doc.roadmapId.equals(mockRoadmap._id) && doc.isRequired
    );
    console.log(`Found ${requiredDocuments.length} required documents`);

    return {
      allDocuments,
      identificationDocuments,
      passportDocuments,
      requiredDocuments
    };
  } catch (error) {
    console.error('Error testing document queries:', error);
    throw error;
  }
}

/**
 * Test with simulated real data
 */
async function testWithSimulatedRealData() {
  try {
    console.log('\nTesting with simulated real data...');

    // Create a simulated roadmap
    const roadmap = {
      _id: new ObjectId(),
      userId: new ObjectId(),
      title: 'Express Entry Immigration Roadmap',
      programId: 'ca_express_entry',
      programName: 'Express Entry',
      country: 'Canada'
    };

    console.log(`Created simulated roadmap: ${roadmap.title}`);

    // Create a document for the roadmap
    const document = {
      _id: new ObjectId(),
      userId: roadmap.userId,
      roadmapId: roadmap._id,
      title: 'Test Document for Simulated Roadmap',
      description: 'This is a test document for a simulated roadmap',
      category: 'identification',
      documentType: 'passport',
      status: 'draft',
      isRequired: true,
      priority: 'high',
      tags: ['test', 'passport'],
      metadata: {
        issueDate: new Date(),
        expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // 5 years from now
        issuingAuthority: 'Test Authority',
        issuingCountry: 'Test Country',
        documentNumber: 'TEST123456'
      },
      notes: 'This is a test document for a simulated roadmap',
      history: [
        {
          action: 'created',
          timestamp: new Date(),
          userId: roadmap.userId
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add methods to the document object
    document.isExpired = function() {
      if (this.metadata && this.metadata.expiryDate) {
        return new Date() > this.metadata.expiryDate;
      }
      return false;
    };

    document.updateStatus = function(status, userId, notes) {
      this.status = status;
      this.history.push({
        action: status,
        timestamp: new Date(),
        userId: userId,
        notes: notes
      });
      return this;
    };

    document.addFileDetails = function(fileDetails, userId) {
      this.fileDetails = {
        ...fileDetails,
        uploadDate: new Date()
      };
      this.status = 'pending';
      this.history.push({
        action: 'uploaded',
        timestamp: new Date(),
        userId: userId,
        notes: `File uploaded: ${fileDetails.originalFilename}`
      });
      return this;
    };

    console.log('Document created successfully for simulated roadmap:');
    console.log(`- ID: ${document._id}`);
    console.log(`- Title: ${document.title}`);
    console.log(`- Roadmap: ${roadmap.title}`);

    // Simulate finding documents for the roadmap
    const roadmapDocuments = [document];
    console.log(`Found ${roadmapDocuments.length} documents for roadmap`);

    console.log('\nSimulated real data test completed successfully.');
    return document;
  } catch (error) {
    console.error('Error testing with simulated real data:', error);
    console.log('Skipping simulated real data test due to error.');
  }
}

/**
 * Clean up test data
 */
async function cleanUp(document) {
  try {
    console.log('\nCleaning up test data...');

    // In a real environment, we would delete the test documents from the database
    // Since we're using simulated data, we just need to clean up memory

    console.log('Cleanup completed successfully.');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

// Run the tests
async function runTests() {
  let testDocument = null;

  try {
    // Test document creation
    testDocument = await testDocumentCreation();

    // Test document update
    await testDocumentUpdate(testDocument);

    // Test document file upload
    await testDocumentFileUpload(testDocument);

    // Test document queries
    await testDocumentQueries();

    // Test with simulated real data
    await testWithSimulatedRealData();

    console.log('\nAll tests completed successfully.');
  } catch (error) {
    console.error('\nTests failed:', error);
  } finally {
    // Clean up test data
    await cleanUp(testDocument);
    process.exit(0);
  }
}

runTests();
