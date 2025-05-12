// Import the setup file to handle MongoDB connection
require('./setup');

const mongoose = require('mongoose');
const PDFGenerationService = require('../services/pdf-generation.service');
const fs = require('fs');
const path = require('path');

// Mock data
const mockRoadmap = {
  _id: new mongoose.Types.ObjectId(),
  title: 'Test Roadmap',
  description: 'This is a test roadmap for PDF generation',
  status: 'active',
  startDate: new Date('2023-01-01'),
  targetCompletionDate: new Date('2023-12-31'),
  completionPercentage: 25,
  estimatedCost: {
    total: 2000,
    currency: 'CAD',
    breakdown: [
      { category: 'Application Fees', amount: 1000 },
      { category: 'Legal Fees', amount: 1000 }
    ]
  },
  notes: 'These are test notes for the roadmap',
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
          dueDate: new Date('2023-03-01'),
          documents: [
            { documentId: 'doc1', status: 'approved', assignedAt: new Date() },
            { documentId: 'doc2', status: 'pending', assignedAt: new Date() }
          ]
        },
        {
          title: 'Milestone 2: Application Submission',
          description: 'Submit application',
          status: 'in_progress',
          dueDate: new Date('2023-06-01')
        }
      ]
    },
    {
      title: 'Phase 2: Processing',
      description: 'Application processing',
      status: 'not_started',
      completionPercentage: 0,
      milestones: [
        {
          title: 'Milestone 3: Application Review',
          description: 'Wait for application review',
          status: 'not_started',
          dueDate: new Date('2023-09-01')
        }
      ]
    }
  ]
};

// Mock document data
const mockDocuments = [
  { _id: 'doc1', originalName: 'Passport.pdf', documentType: 'Identification', category: 'Personal' },
  { _id: 'doc2', originalName: 'Resume.pdf', documentType: 'Professional', category: 'Employment' }
];

describe('PDF Generation Service', () => {
  let pdfGenerationService;

  beforeAll(() => {
    // Create PDF generation service instance
    pdfGenerationService = new PDFGenerationService();
  });

  describe('generateRoadmapPdf', () => {
    it('should generate a PDF file', async () => {
      // Mock the document retrieval
      jest.spyOn(pdfGenerationService, '_getDocumentInfo').mockImplementation(async (documentId) => {
        const doc = mockDocuments.find(d => d._id === documentId);
        return doc ? doc : null;
      });

      // Generate PDF
      const pdfPath = await pdfGenerationService.generateRoadmapPdf(mockRoadmap, {
        includeNotes: true,
        includeDocuments: true
      });

      // Verify PDF was created
      expect(fs.existsSync(pdfPath)).toBe(true);

      // Verify PDF file size is greater than 0
      const stats = fs.statSync(pdfPath);
      expect(stats.size).toBeGreaterThan(0);

      // Clean up - delete the generated PDF
      fs.unlinkSync(pdfPath);
    });

    it('should generate a PDF without notes when includeNotes is false', async () => {
      // Mock the document retrieval
      jest.spyOn(pdfGenerationService, '_getDocumentInfo').mockImplementation(async (documentId) => {
        const doc = mockDocuments.find(d => d._id === documentId);
        return doc ? doc : null;
      });

      // Generate PDF without notes
      const pdfPath = await pdfGenerationService.generateRoadmapPdf(mockRoadmap, {
        includeNotes: false,
        includeDocuments: true
      });

      // Verify PDF was created
      expect(fs.existsSync(pdfPath)).toBe(true);

      // Clean up - delete the generated PDF
      fs.unlinkSync(pdfPath);
    });

    it('should generate a PDF without documents when includeDocuments is false', async () => {
      // Generate PDF without documents
      const pdfPath = await pdfGenerationService.generateRoadmapPdf(mockRoadmap, {
        includeNotes: true,
        includeDocuments: false
      });

      // Verify PDF was created
      expect(fs.existsSync(pdfPath)).toBe(true);

      // Clean up - delete the generated PDF
      fs.unlinkSync(pdfPath);
    });

    it('should handle errors gracefully', async () => {
      // Mock a function to throw an error
      jest.spyOn(pdfGenerationService, '_addTitle').mockImplementation(() => {
        throw new Error('Test error');
      });

      // Expect the function to throw an error
      await expect(
        pdfGenerationService.generateRoadmapPdf(mockRoadmap, {
          includeNotes: true,
          includeDocuments: true
        })
      ).rejects.toThrow('Test error');

      // Restore the original implementation
      jest.restoreAllMocks();
    });
  });

  describe('_formatStatus', () => {
    it('should format status correctly', () => {
      expect(pdfGenerationService._formatStatus('in_progress')).toBe('In Progress');
      expect(pdfGenerationService._formatStatus('not_started')).toBe('Not Started');
      expect(pdfGenerationService._formatStatus('completed')).toBe('Completed');
      expect(pdfGenerationService._formatStatus(null)).toBe('Not Started');
    });
  });
});
