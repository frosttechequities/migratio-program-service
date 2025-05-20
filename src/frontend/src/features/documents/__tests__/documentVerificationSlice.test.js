import { configureStore } from '@reduxjs/toolkit';
import documentVerificationReducer, {
  fetchVerificationStatus,
  requestVerification,
  cancelVerification,
  submitAdditionalInfo,
  uploadSupportingDocument,
  fetchVerificationProviders,
  submitToProvider,
  checkProviderStatus,
  resetVerificationStatus,
  resetVerificationRequest,
  setSelectedProvider,
  resetProviderSubmission
} from '../documentVerificationSlice';

// Mock the service
jest.mock('../services/documentVerificationService', () => ({
  getVerificationStatus: jest.fn(),
  requestVerification: jest.fn(),
  cancelVerification: jest.fn(),
  submitAdditionalInfo: jest.fn(),
  uploadSupportingDocument: jest.fn(),
  getVerificationProviders: jest.fn(),
  submitToProvider: jest.fn(),
  checkProviderStatus: jest.fn()
}));

import documentVerificationService from '../services/documentVerificationService';

describe('documentVerificationSlice', () => {
  let store;

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        documentVerification: documentVerificationReducer
      }
    });
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('reducers', () => {
    test('should handle initial state', () => {
      expect(store.getState().documentVerification).toEqual({
        verificationStatus: null,
        isLoadingStatus: false,
        statusError: null,
        
        verificationRequest: null,
        isSubmittingRequest: false,
        requestError: null,
        
        additionalInfo: null,
        isSubmittingInfo: false,
        infoError: null,
        
        supportingDocument: null,
        isUploadingDocument: false,
        uploadError: null,
        
        verificationProviders: [],
        isLoadingProviders: false,
        providersError: null,
        
        selectedProvider: null,
        providerSubmission: null,
        isSubmittingToProvider: false,
        providerSubmissionError: null,
        
        providerStatus: null,
        isCheckingProviderStatus: false,
        providerStatusError: null
      });
    });

    test('should handle resetVerificationStatus', () => {
      // Set some initial state
      store.dispatch({
        type: 'documentVerification/fetchStatus/fulfilled',
        payload: { verificationStatus: 'pending_verification' }
      });
      
      // Reset verification status
      store.dispatch(resetVerificationStatus());
      
      // Check state
      expect(store.getState().documentVerification.verificationStatus).toBeNull();
      expect(store.getState().documentVerification.isLoadingStatus).toBe(false);
      expect(store.getState().documentVerification.statusError).toBeNull();
    });

    test('should handle resetVerificationRequest', () => {
      // Set some initial state
      store.dispatch({
        type: 'documentVerification/requestVerification/fulfilled',
        payload: { verificationRequest: { method: 'standard' } }
      });
      
      // Reset verification request
      store.dispatch(resetVerificationRequest());
      
      // Check state
      expect(store.getState().documentVerification.verificationRequest).toBeNull();
      expect(store.getState().documentVerification.isSubmittingRequest).toBe(false);
      expect(store.getState().documentVerification.requestError).toBeNull();
    });

    test('should handle setSelectedProvider', () => {
      // Set selected provider
      const mockProvider = { id: 'provider1', name: 'Test Provider' };
      store.dispatch(setSelectedProvider(mockProvider));
      
      // Check state
      expect(store.getState().documentVerification.selectedProvider).toEqual(mockProvider);
    });

    test('should handle resetProviderSubmission', () => {
      // Set some initial state
      store.dispatch({
        type: 'documentVerification/submitToProvider/fulfilled',
        payload: { providerId: 'provider1', reference: 'ref123' }
      });
      
      // Reset provider submission
      store.dispatch(resetProviderSubmission());
      
      // Check state
      expect(store.getState().documentVerification.providerSubmission).toBeNull();
      expect(store.getState().documentVerification.isSubmittingToProvider).toBe(false);
      expect(store.getState().documentVerification.providerSubmissionError).toBeNull();
    });
  });

  describe('async thunks', () => {
    test('fetchVerificationStatus should handle success', async () => {
      // Mock service response
      const mockStatus = {
        verificationStatus: 'pending_verification',
        verificationDetails: { requested_at: new Date().toISOString() },
        workflowState: 'pending_review'
      };
      documentVerificationService.getVerificationStatus.mockResolvedValue(mockStatus);
      
      // Dispatch action
      await store.dispatch(fetchVerificationStatus('doc123'));
      
      // Check state
      expect(store.getState().documentVerification.verificationStatus).toEqual(mockStatus);
      expect(store.getState().documentVerification.isLoadingStatus).toBe(false);
      expect(store.getState().documentVerification.statusError).toBeNull();
      
      // Check service was called
      expect(documentVerificationService.getVerificationStatus).toHaveBeenCalledWith('doc123');
    });

    test('fetchVerificationStatus should handle failure', async () => {
      // Mock service error
      const errorMessage = 'Failed to fetch verification status';
      documentVerificationService.getVerificationStatus.mockRejectedValue(new Error(errorMessage));
      
      // Dispatch action
      await store.dispatch(fetchVerificationStatus('doc123'));
      
      // Check state
      expect(store.getState().documentVerification.verificationStatus).toBeNull();
      expect(store.getState().documentVerification.isLoadingStatus).toBe(false);
      expect(store.getState().documentVerification.statusError).toBe(errorMessage);
    });

    test('requestVerification should update verification request state', async () => {
      // Mock service response
      const mockResult = { id: 'doc123', verification_status: 'pending_verification' };
      documentVerificationService.requestVerification.mockResolvedValue(mockResult);
      
      // Mock verification request
      const mockRequest = {
        verificationMethod: 'standard',
        expedited: false,
        additionalNotes: 'Test notes'
      };
      
      // Dispatch action
      await store.dispatch(requestVerification({ documentId: 'doc123', verificationRequest: mockRequest }));
      
      // Check state
      expect(store.getState().documentVerification.verificationRequest).toEqual(mockRequest);
      expect(store.getState().documentVerification.isSubmittingRequest).toBe(false);
      expect(store.getState().documentVerification.requestError).toBeNull();
      expect(store.getState().documentVerification.verificationStatus.verificationStatus).toBe('pending_verification');
      
      // Check service was called
      expect(documentVerificationService.requestVerification).toHaveBeenCalledWith('doc123', mockRequest);
    });

    test('cancelVerification should update verification status', async () => {
      // Mock service response
      const mockResult = { id: 'doc123', verification_status: 'pending_submission' };
      documentVerificationService.cancelVerification.mockResolvedValue(mockResult);
      
      // Set initial state
      store.dispatch({
        type: 'documentVerification/requestVerification/fulfilled',
        payload: {
          verificationRequest: { method: 'standard' },
          result: { verification_status: 'pending_verification' }
        }
      });
      
      // Dispatch action
      await store.dispatch(cancelVerification('doc123'));
      
      // Check state
      expect(store.getState().documentVerification.verificationStatus.verificationStatus).toBe('pending_submission');
      expect(store.getState().documentVerification.verificationRequest).toBeNull();
      
      // Check service was called
      expect(documentVerificationService.cancelVerification).toHaveBeenCalledWith('doc123');
    });

    test('submitAdditionalInfo should update additional info state', async () => {
      // Mock service response
      const mockResult = { id: 'doc123', verification_details: { additional_info: {} } };
      documentVerificationService.submitAdditionalInfo.mockResolvedValue(mockResult);
      
      // Mock additional info
      const mockInfo = {
        documentNumber: 'DOC123456',
        issuedBy: 'Government',
        issuedDate: '2023-01-01',
        expiryDate: '2028-01-01'
      };
      
      // Dispatch action
      await store.dispatch(submitAdditionalInfo({ documentId: 'doc123', additionalInfo: mockInfo }));
      
      // Check state
      expect(store.getState().documentVerification.additionalInfo).toEqual(mockInfo);
      expect(store.getState().documentVerification.isSubmittingInfo).toBe(false);
      expect(store.getState().documentVerification.infoError).toBeNull();
      
      // Check service was called
      expect(documentVerificationService.submitAdditionalInfo).toHaveBeenCalledWith('doc123', mockInfo);
    });

    test('uploadSupportingDocument should update supporting document state', async () => {
      // Mock service response
      const mockResult = {
        id: 'doc123',
        verification_details: {
          supporting_documents: [{ filename: 'support.pdf' }]
        }
      };
      documentVerificationService.uploadSupportingDocument.mockResolvedValue(mockResult);
      
      // Mock file
      const mockFile = new File(['dummy content'], 'support.pdf', { type: 'application/pdf' });
      
      // Dispatch action
      await store.dispatch(uploadSupportingDocument({ documentId: 'doc123', file: mockFile }));
      
      // Check state
      expect(store.getState().documentVerification.supportingDocument).toEqual(mockResult);
      expect(store.getState().documentVerification.isUploadingDocument).toBe(false);
      expect(store.getState().documentVerification.uploadError).toBeNull();
      
      // Check service was called
      expect(documentVerificationService.uploadSupportingDocument).toHaveBeenCalledWith('doc123', mockFile);
    });

    test('fetchVerificationProviders should update providers state', async () => {
      // Mock service response
      const mockProviders = [
        { id: 'provider1', name: 'Provider 1' },
        { id: 'provider2', name: 'Provider 2' }
      ];
      documentVerificationService.getVerificationProviders.mockResolvedValue(mockProviders);
      
      // Dispatch action
      await store.dispatch(fetchVerificationProviders());
      
      // Check state
      expect(store.getState().documentVerification.verificationProviders).toEqual(mockProviders);
      expect(store.getState().documentVerification.isLoadingProviders).toBe(false);
      expect(store.getState().documentVerification.providersError).toBeNull();
      
      // Check service was called
      expect(documentVerificationService.getVerificationProviders).toHaveBeenCalled();
    });

    test('submitToProvider should update provider submission state', async () => {
      // Mock service response
      const mockResult = {
        id: 'doc123',
        verification_status: 'verification_in_progress',
        verification_details: {
          provider_id: 'provider1',
          reference: 'ref123'
        }
      };
      documentVerificationService.submitToProvider.mockResolvedValue(mockResult);
      
      // Dispatch action
      await store.dispatch(submitToProvider({
        documentId: 'doc123',
        providerId: 'provider1',
        reference: 'ref123'
      }));
      
      // Check state
      expect(store.getState().documentVerification.providerSubmission).toEqual({
        providerId: 'provider1',
        reference: 'ref123',
        submittedAt: expect.any(String)
      });
      expect(store.getState().documentVerification.isSubmittingToProvider).toBe(false);
      expect(store.getState().documentVerification.providerSubmissionError).toBeNull();
      expect(store.getState().documentVerification.verificationStatus.verificationStatus).toBe('verification_in_progress');
      
      // Check service was called
      expect(documentVerificationService.submitToProvider).toHaveBeenCalledWith('doc123', 'provider1', 'ref123');
    });

    test('checkProviderStatus should update provider status state', async () => {
      // Mock service response
      const mockStatus = {
        status: 'in_progress',
        message: 'Verification in progress',
        lastUpdated: new Date().toISOString()
      };
      documentVerificationService.checkProviderStatus.mockResolvedValue(mockStatus);
      
      // Dispatch action
      await store.dispatch(checkProviderStatus({
        documentId: 'doc123',
        reference: 'ref123'
      }));
      
      // Check state
      expect(store.getState().documentVerification.providerStatus).toEqual(mockStatus);
      expect(store.getState().documentVerification.isCheckingProviderStatus).toBe(false);
      expect(store.getState().documentVerification.providerStatusError).toBeNull();
      
      // Check service was called
      expect(documentVerificationService.checkProviderStatus).toHaveBeenCalledWith('doc123', 'ref123');
    });
  });
});
