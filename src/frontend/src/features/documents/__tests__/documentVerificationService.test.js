import documentVerificationService from '../services/documentVerificationService';
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

describe('documentVerificationService', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('getVerificationStatus', () => {
    test('should return verification status for a document', async () => {
      // Mock Supabase response
      const mockDocument = {
        id: 'doc123',
        verification_status: 'pending_verification',
        verification_details: {
          requested_at: new Date().toISOString(),
          workflow_state: 'pending_review'
        }
      };
      
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: mockDocument,
        error: null
      });
      
      // Call service
      const result = await documentVerificationService.getVerificationStatus('doc123');
      
      // Check result
      expect(result).toEqual({
        verificationStatus: 'pending_verification',
        verificationDetails: {
          requested_at: expect.any(String),
          workflow_state: 'pending_review'
        },
        workflowState: 'pending_review'
      });
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.select).toHaveBeenCalled();
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
    });

    test('should handle errors when fetching verification status', async () => {
      // Mock Supabase error
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Document not found' }
      });
      
      // Call service and expect error
      await expect(documentVerificationService.getVerificationStatus('doc123'))
        .rejects.toThrow('Document not found');
    });

    test('should handle missing verification details', async () => {
      // Mock Supabase response with no verification details
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: { id: 'doc123' },
        error: null
      });
      
      // Call service
      const result = await documentVerificationService.getVerificationStatus('doc123');
      
      // Check result has default values
      expect(result).toEqual({
        verificationStatus: 'pending_submission',
        verificationDetails: {},
        workflowState: 'none'
      });
    });
  });

  describe('requestVerification', () => {
    test('should request verification for a document', async () => {
      // Mock verification request
      const mockRequest = {
        verificationMethod: 'standard',
        expedited: false,
        additionalNotes: 'Test notes'
      };
      
      // Mock Supabase response
      const mockUpdatedDocument = {
        id: 'doc123',
        verification_status: 'pending_verification',
        verification_details: {
          requested_at: new Date().toISOString(),
          verification_method: 'standard',
          expedited: false,
          additional_notes: 'Test notes',
          workflow_state: 'pending_review'
        }
      };
      
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: mockUpdatedDocument,
        error: null
      });
      
      // Call service
      const result = await documentVerificationService.requestVerification('doc123', mockRequest);
      
      // Check result
      expect(result).toEqual(mockUpdatedDocument);
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.update).toHaveBeenCalledWith({
        verification_status: 'pending_verification',
        verification_details: expect.objectContaining({
          requested_at: expect.any(String),
          verification_method: 'standard',
          expedited: false,
          additional_notes: 'Test notes',
          workflow_state: 'pending_review'
        })
      });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
    });

    test('should handle errors when requesting verification', async () => {
      // Mock verification request
      const mockRequest = {
        verificationMethod: 'standard',
        expedited: false
      };
      
      // Mock Supabase error
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Failed to update document' }
      });
      
      // Call service and expect error
      await expect(documentVerificationService.requestVerification('doc123', mockRequest))
        .rejects.toThrow('Failed to update document');
    });
  });

  describe('cancelVerification', () => {
    test('should cancel verification for a document', async () => {
      // Mock Supabase response
      const mockUpdatedDocument = {
        id: 'doc123',
        verification_status: 'pending_submission',
        verification_details: {
          canceled_at: new Date().toISOString(),
          workflow_state: 'none'
        }
      };
      
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: mockUpdatedDocument,
        error: null
      });
      
      // Call service
      const result = await documentVerificationService.cancelVerification('doc123');
      
      // Check result
      expect(result).toEqual(mockUpdatedDocument);
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.update).toHaveBeenCalledWith({
        verification_status: 'pending_submission',
        verification_details: expect.objectContaining({
          canceled_at: expect.any(String),
          workflow_state: 'none'
        })
      });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
    });

    test('should handle errors when canceling verification', async () => {
      // Mock Supabase error
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Failed to update document' }
      });
      
      // Call service and expect error
      await expect(documentVerificationService.cancelVerification('doc123'))
        .rejects.toThrow('Failed to update document');
    });
  });

  describe('submitAdditionalInfo', () => {
    test('should submit additional info for a document', async () => {
      // Mock additional info
      const mockInfo = {
        documentNumber: 'DOC123456',
        issuedBy: 'Government',
        issuedDate: '2023-01-01',
        expiryDate: '2028-01-01'
      };
      
      // Mock Supabase response for fetch
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: {
          id: 'doc123',
          verification_details: {
            workflow_state: 'pending_review'
          }
        },
        error: null
      });
      
      // Mock Supabase response for update
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: {
          id: 'doc123',
          document_number: 'DOC123456',
          issued_by: 'Government',
          issued_date: '2023-01-01',
          expiry_date: '2028-01-01',
          verification_details: {
            workflow_state: 'pending_review',
            additional_info: mockInfo,
            additional_info_submitted_at: expect.any(String)
          }
        },
        error: null
      });
      
      // Call service
      const result = await documentVerificationService.submitAdditionalInfo('doc123', mockInfo);
      
      // Check result
      expect(result).toEqual({
        id: 'doc123',
        document_number: 'DOC123456',
        issued_by: 'Government',
        issued_date: '2023-01-01',
        expiry_date: '2028-01-01',
        verification_details: {
          workflow_state: 'pending_review',
          additional_info: mockInfo,
          additional_info_submitted_at: expect.any(String)
        }
      });
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.update).toHaveBeenCalledWith({
        document_number: 'DOC123456',
        issued_by: 'Government',
        issued_date: '2023-01-01',
        expiry_date: '2028-01-01',
        verification_details: expect.objectContaining({
          workflow_state: 'pending_review',
          additional_info: mockInfo,
          additional_info_submitted_at: expect.any(String)
        })
      });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
    });

    test('should handle errors when submitting additional info', async () => {
      // Mock additional info
      const mockInfo = {
        documentNumber: 'DOC123456',
        issuedBy: 'Government'
      };
      
      // Mock Supabase error on fetch
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Document not found' }
      });
      
      // Call service and expect error
      await expect(documentVerificationService.submitAdditionalInfo('doc123', mockInfo))
        .rejects.toThrow('Document not found');
    });
  });

  describe('uploadSupportingDocument', () => {
    test('should upload a supporting document', async () => {
      // Mock file
      const mockFile = new File(['dummy content'], 'support.pdf', { type: 'application/pdf' });
      
      // Mock Supabase response for fetch
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: {
          id: 'doc123',
          verification_details: {
            workflow_state: 'pending_review'
          }
        },
        error: null
      });
      
      // Mock Supabase response for update
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: {
          id: 'doc123',
          verification_details: {
            workflow_state: 'pending_review',
            supporting_documents: [{
              filename: 'support.pdf',
              size: mockFile.size,
              type: 'application/pdf',
              uploaded_at: expect.any(String)
            }]
          }
        },
        error: null
      });
      
      // Call service
      const result = await documentVerificationService.uploadSupportingDocument('doc123', mockFile);
      
      // Check result
      expect(result).toEqual({
        id: 'doc123',
        verification_details: {
          workflow_state: 'pending_review',
          supporting_documents: [{
            filename: 'support.pdf',
            size: mockFile.size,
            type: 'application/pdf',
            uploaded_at: expect.any(String)
          }]
        }
      });
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.update).toHaveBeenCalledWith({
        verification_details: expect.objectContaining({
          workflow_state: 'pending_review',
          supporting_documents: expect.arrayContaining([
            expect.objectContaining({
              filename: 'support.pdf',
              size: mockFile.size,
              type: 'application/pdf',
              uploaded_at: expect.any(String)
            })
          ])
        })
      });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
    });

    test('should handle errors when uploading supporting document', async () => {
      // Mock file
      const mockFile = new File(['dummy content'], 'support.pdf', { type: 'application/pdf' });
      
      // Mock Supabase error on fetch
      supabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Document not found' }
      });
      
      // Call service and expect error
      await expect(documentVerificationService.uploadSupportingDocument('doc123', mockFile))
        .rejects.toThrow('Document not found');
    });
  });

  describe('getVerificationProviders', () => {
    test('should return verification providers', async () => {
      // Call service
      const result = await documentVerificationService.getVerificationProviders();
      
      // Check result
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          processingTime: expect.any(String),
          supportedDocumentTypes: expect.any(Array)
        })
      ]));
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('submitToProvider', () => {
    test('should submit a document to a provider', async () => {
      // Mock Supabase response
      const mockUpdatedDocument = {
        id: 'doc123',
        verification_status: 'verification_in_progress',
        verification_details: {
          provider_id: 'provider1',
          reference: 'ref123',
          submitted_to_provider_at: new Date().toISOString(),
          workflow_state: 'under_review'
        }
      };
      
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: mockUpdatedDocument,
        error: null
      });
      
      // Call service
      const result = await documentVerificationService.submitToProvider('doc123', 'provider1', 'ref123');
      
      // Check result
      expect(result).toEqual(mockUpdatedDocument);
      
      // Check Supabase was called correctly
      expect(supabaseClient.from).toHaveBeenCalledWith('user_documents');
      expect(supabaseClient.update).toHaveBeenCalledWith({
        verification_status: 'verification_in_progress',
        verification_details: expect.objectContaining({
          provider_id: 'provider1',
          reference: 'ref123',
          submitted_to_provider_at: expect.any(String),
          workflow_state: 'under_review'
        })
      });
      expect(supabaseClient.eq).toHaveBeenCalledWith('id', 'doc123');
    });

    test('should handle errors when submitting to provider', async () => {
      // Mock Supabase error
      supabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Failed to update document' }
      });
      
      // Call service and expect error
      await expect(documentVerificationService.submitToProvider('doc123', 'provider1', 'ref123'))
        .rejects.toThrow('Failed to update document');
    });
  });

  describe('checkProviderStatus', () => {
    test('should check verification status with provider', async () => {
      // Call service
      const result = await documentVerificationService.checkProviderStatus('doc123', 'ref123');
      
      // Check result
      expect(result).toEqual({
        status: 'in_progress',
        message: expect.any(String),
        lastUpdated: expect.any(String)
      });
    });
  });
});
