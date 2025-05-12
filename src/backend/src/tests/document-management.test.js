// Import the setup file to handle MongoDB connection
require('./setup');

const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user.model');
const Roadmap = require('../models/roadmap.model');
const Document = require('../models/document.model');
const config = require('../config');

// Mock data
const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  role: 'user'
};

const mockRoadmap = {
  _id: new mongoose.Types.ObjectId(),
  userId: mockUser._id,
  title: 'Test Roadmap',
  description: 'This is a test roadmap',
  status: 'active',
  startDate: new Date('2023-01-01'),
  targetCompletionDate: new Date('2023-12-31'),
  completionPercentage: 25,
  phases: [
    {
      title: 'Phase 1: Preparation',
      description: 'Prepare documents and applications',
      status: 'in_progress',
      completionPercentage: 50,
      milestones: [
        {
          title: 'Milestone 1: Document Collection',
          description: 'Collect all required documents',
          status: 'completed',
          dueDate: new Date('2023-03-01')
        },
        {
          title: 'Milestone 2: Application Submission',
          description: 'Submit application',
          status: 'in_progress',
          dueDate: new Date('2023-06-01')
        }
      ]
    }
  ]
};

const mockDocuments = [
  {
    _id: new mongoose.Types.ObjectId(),
    userId: mockUser._id,
    originalName: 'passport.pdf',
    fileName: 'passport-123456.pdf',
    mimeType: 'application/pdf',
    size: 1024,
    documentType: 'Identification',
    category: 'Personal',
    createdAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: mockUser._id,
    originalName: 'resume.pdf',
    fileName: 'resume-123456.pdf',
    mimeType: 'application/pdf',
    size: 2048,
    documentType: 'Professional',
    category: 'Employment',
    createdAt: new Date()
  }
];

describe('Document Management', () => {
  let authToken;

  beforeAll(async () => {
    // Create test user
    await User.create(mockUser);

    // Create test roadmap
    await Roadmap.create(mockRoadmap);

    // Create test documents
    await Document.create(mockDocuments);

    // Generate auth token
    authToken = jwt.sign(
      { userId: mockUser._id, email: mockUser.email },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  });

  describe('Assign Documents to Milestone', () => {
    it('should assign documents to a milestone', async () => {
      const response = await request(app)
        .put(`/api/roadmaps/${mockRoadmap._id}/phases/0/milestones/0/documents`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          documents: [
            {
              documentId: mockDocuments[0]._id.toString(),
              status: 'pending'
            },
            {
              documentId: mockDocuments[1]._id.toString(),
              status: 'pending'
            }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.phases[0].milestones[0].documents).toHaveLength(2);
      expect(response.body.data.phases[0].milestones[0].documents[0].documentId).toBe(mockDocuments[0]._id.toString());
      expect(response.body.data.phases[0].milestones[0].documents[0].status).toBe('pending');
    });

    it('should return 400 if documents array is not provided', async () => {
      const response = await request(app)
        .put(`/api/roadmaps/${mockRoadmap._id}/phases/0/milestones/0/documents`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 if roadmap not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/roadmaps/${nonExistentId}/phases/0/milestones/0/documents`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          documents: [
            {
              documentId: mockDocuments[0]._id.toString(),
              status: 'pending'
            }
          ]
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Update Document Status', () => {
    it('should update document status in a milestone', async () => {
      // First, assign a document to a milestone
      await request(app)
        .put(`/api/roadmaps/${mockRoadmap._id}/phases/0/milestones/0/documents`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          documents: [
            {
              documentId: mockDocuments[0]._id.toString(),
              status: 'pending'
            }
          ]
        });

      // Then, update the document status
      const response = await request(app)
        .put(`/api/roadmaps/${mockRoadmap._id}/documents/${mockDocuments[0]._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'approved'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify the document status was updated
      const updatedRoadmap = await Roadmap.findById(mockRoadmap._id);
      expect(updatedRoadmap.phases[0].milestones[0].documents[0].status).toBe('approved');
    });

    it('should return 400 if status is not provided', async () => {
      const response = await request(app)
        .put(`/api/roadmaps/${mockRoadmap._id}/documents/${mockDocuments[0]._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 if status is invalid', async () => {
      const response = await request(app)
        .put(`/api/roadmaps/${mockRoadmap._id}/documents/${mockDocuments[0]._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'invalid_status'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 if document not found in roadmap', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/roadmaps/${mockRoadmap._id}/documents/${nonExistentId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'approved'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PDF Generation with Documents', () => {
    it('should generate a PDF with documents', async () => {
      const response = await request(app)
        .get(`/api/roadmaps/${mockRoadmap._id}/pdf?includeDocuments=true`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.pdfUrl).toBeDefined();
    });

    it('should generate a PDF without documents', async () => {
      const response = await request(app)
        .get(`/api/roadmaps/${mockRoadmap._id}/pdf?includeDocuments=false`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.pdfUrl).toBeDefined();
    });
  });
});
