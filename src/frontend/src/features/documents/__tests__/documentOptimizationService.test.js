import documentOptimizationService from '../services/documentOptimizationService';
import { supabaseClient } from '../../../services/supabaseClient';

// Mock supabaseClient
jest.mock('../../../services/supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  storage: {
    from: jest.fn().mockReturnThis(),
    upload: jest.fn().mockReturnThis(),
    getPublicUrl: jest.fn()
  }
}));

describe('documentOptimizationService', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('getOptimizationSuggestions', () => {
    test('should return optimization suggestions for a document', async () => {
      // Mock Supabase response
      const mockSuggestions = [
        { id: '1', text: 'Improve image quality', applied: false },
        { id: '2', text: 'Add missing information', applied: false }
      ];
      
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: {
          analysis: {
            optimization_suggestions: mockSuggestions
          }
        },
        error: null
      });
      
      // Call service
      const result = await documentOptimizationService.getOptimizationSuggestions('doc123');
      
      // Check result
      expect(result).toEqual(mockSuggestions);
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.select).toHaveBeenCalled();
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
    });

    test('should handle errors when fetching suggestions', async () => {
      // Mock Supabase error
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Document not found' }
      });
      
      // Call service and expect error
      await expect(documentOptimizationService.getOptimizationSuggestions('doc123'))
        .rejects.toThrow('Document not found');
    });

    test('should handle missing analysis data', async () => {
      // Mock Supabase response with no analysis
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: { id: 'doc123' },
        error: null
      });
      
      // Call service
      const result = await documentOptimizationService.getOptimizationSuggestions('doc123');
      
      // Check result is empty array
      expect(result).toEqual([]);
    });
  });

  describe('applySuggestion', () => {
    test('should apply a suggestion to a document', async () => {
      // Mock Supabase response for initial fetch
      const mockSuggestions = [
        { id: '1', text: 'Improve image quality', applied: false },
        { id: '2', text: 'Add missing information', applied: false }
      ];
      
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: {
          id: 'doc123',
          analysis: {
            optimization_suggestions: mockSuggestions
          }
        },
        error: null
      });
      
      // Mock Supabase response for update
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: {
          id: 'doc123',
          analysis: {
            optimization_suggestions: [
              { id: '1', text: 'Improve image quality', applied: true },
              { id: '2', text: 'Add missing information', applied: false }
            ]
          }
        },
        error: null
      });
      
      // Call service
      const result = await documentOptimizationService.applySuggestion('doc123', 0);
      
      // Check result
      expect(result).toEqual({
        id: 'doc123',
        analysis: {
          optimization_suggestions: [
            { id: '1', text: 'Improve image quality', applied: true },
            { id: '2', text: 'Add missing information', applied: false }
          ]
        }
      });
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.update).toHaveBeenCalled();
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
    });

    test('should handle errors when applying suggestion', async () => {
      // Mock Supabase error on fetch
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Document not found' }
      });
      
      // Call service and expect error
      await expect(documentOptimizationService.applySuggestion('doc123', 0))
        .rejects.toThrow('Document not found');
    });
  });

  describe('startImprovementWorkflow', () => {
    test('should start an improvement workflow for a document', async () => {
      // Mock Supabase response
      const mockWorkflowStatus = {
        status: 'started',
        started_at: new Date().toISOString(),
        steps: ['upload', 'review']
      };
      
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: {
          id: 'doc123',
          improvement_workflow: mockWorkflowStatus
        },
        error: null
      });
      
      // Call service
      const result = await documentOptimizationService.startImprovementWorkflow('doc123');
      
      // Check result
      expect(result).toEqual(mockWorkflowStatus);
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.update).toHaveBeenCalled();
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
    });

    test('should handle errors when starting workflow', async () => {
      // Mock Supabase error
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Failed to start workflow' }
      });
      
      // Call service and expect error
      await expect(documentOptimizationService.startImprovementWorkflow('doc123'))
        .rejects.toThrow('Failed to start workflow');
    });
  });

  describe('uploadImprovedDocument', () => {
    test('should upload an improved document', async () => {
      // Mock file
      const mockFile = new File(['dummy content'], 'improved.pdf', { type: 'application/pdf' });
      
      // Mock Supabase storage response
      supabaseClient.storage.from().upload.mockResolvedValue({
        data: { path: 'documents/improved.pdf' },
        error: null
      });
      
      // Mock Supabase getPublicUrl response
      supabaseClient.storage.from().getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://example.com/documents/improved.pdf' }
      });
      
      // Mock Supabase insert response
      supabaseClient.from().insert = jest.fn().mockReturnThis();
      supabaseClient.from().insert().select = jest.fn().mockReturnThis();
      supabaseClient.from().insert().select().single = jest.fn().mockResolvedValue({
        data: {
          id: 'improved123',
          original_document_id: 'doc123',
          file_path: 'documents/improved.pdf',
          file_url: 'https://example.com/documents/improved.pdf'
        },
        error: null
      });
      
      // Call service
      const result = await documentOptimizationService.uploadImprovedDocument('doc123', mockFile);
      
      // Check result
      expect(result).toEqual({
        improvedDocumentId: 'improved123',
        originalDocumentId: 'doc123',
        filePath: 'documents/improved.pdf',
        fileUrl: 'https://example.com/documents/improved.pdf'
      });
      
      // Check Supabase was called correctly
      expect(supabaseClient.storage.from).toHaveBeenCalledWith('documents');
      expect(supabaseClient.storage.from().upload).toHaveBeenCalled();
      expect(supabaseClient.from).toHaveBeenCalledWith('improved_documents');
      expect(supabaseClient.from().insert).toHaveBeenCalled();
    });

    test('should handle errors when uploading improved document', async () => {
      // Mock file
      const mockFile = new File(['dummy content'], 'improved.pdf', { type: 'application/pdf' });
      
      // Mock Supabase storage error
      supabaseClient.storage.from().upload.mockResolvedValue({
        data: null,
        error: { message: 'Failed to upload file' }
      });
      
      // Call service and expect error
      await expect(documentOptimizationService.uploadImprovedDocument('doc123', mockFile))
        .rejects.toThrow('Failed to upload file');
    });
  });

  describe('getDocumentComparison', () => {
    test('should return comparison data for original and improved documents', async () => {
      // Mock Supabase responses for original document
      supabaseClient.from().select().eq().single.mockResolvedValueOnce({
        data: {
          id: 'doc123',
          analysis: { score: 70, issues: ['issue1'] }
        },
        error: null
      });
      
      // Mock Supabase responses for improved document
      supabaseClient.from().select().eq().single.mockResolvedValueOnce({
        data: {
          id: 'improved123',
          analysis: { score: 90, issues: [] }
        },
        error: null
      });
      
      // Call service
      const result = await documentOptimizationService.getDocumentComparison('doc123', 'improved123');
      
      // Check result
      expect(result).toEqual({
        originalAnalysis: { score: 70, issues: ['issue1'] },
        improvedAnalysis: { score: 90, issues: [] }
      });
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'improved123');
    });

    test('should handle errors when fetching comparison data', async () => {
      // Mock Supabase error
      supabaseClient.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Document not found' }
      });
      
      // Call service and expect error
      await expect(documentOptimizationService.getDocumentComparison('doc123', 'improved123'))
        .rejects.toThrow('Document not found');
    });
  });

  describe('getDocumentTypeDetails', () => {
    test('should return details for a document type', async () => {
      // Mock Supabase response
      const mockDetails = {
        type: 'passport',
        requirements: ['requirement1', 'requirement2'],
        bestPractices: ['practice1', 'practice2']
      };
      
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: mockDetails,
        error: null
      });
      
      // Call service
      const result = await documentOptimizationService.getDocumentTypeDetails('passport');
      
      // Check result
      expect(result).toEqual(mockDetails);
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('document_types');
      expect(supabaseClient.eq).toHaveBeenCalledWith('type', 'passport');
    });

    test('should handle errors when fetching document type details', async () => {
      // Mock Supabase error
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Document type not found' }
      });
      
      // Call service and expect error
      await expect(documentOptimizationService.getDocumentTypeDetails('passport'))
        .rejects.toThrow('Document type not found');
    });
  });
});
