import { configureStore } from '@reduxjs/toolkit';
import documentOptimizationReducer, {
  fetchOptimizationSuggestions,
  applySuggestion,
  startImprovementWorkflow,
  uploadImprovedDocument,
  completeImprovementWorkflow,
  fetchDocumentComparison,
  fetchDocumentTypeDetails,
  resetWorkflow,
  resetComparison,
  resetImprovedDocument
} from '../documentOptimizationSlice';

// Mock the service
jest.mock('../services/documentOptimizationService', () => ({
  getOptimizationSuggestions: jest.fn(),
  applySuggestion: jest.fn(),
  startImprovementWorkflow: jest.fn(),
  uploadImprovedDocument: jest.fn(),
  completeImprovementWorkflow: jest.fn(),
  getDocumentComparison: jest.fn(),
  getDocumentTypeDetails: jest.fn()
}));

import documentOptimizationService from '../services/documentOptimizationService';

describe('documentOptimizationSlice', () => {
  let store;

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        documentOptimization: documentOptimizationReducer
      }
    });
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('reducers', () => {
    test('should handle initial state', () => {
      expect(store.getState().documentOptimization).toEqual({
        suggestions: [],
        isLoadingSuggestions: false,
        suggestionsError: null,
        
        workflowStatus: null,
        isWorkflowActive: false,
        workflowError: null,
        
        comparisonData: null,
        isLoadingComparison: false,
        comparisonError: null,
        
        documentTypeDetails: null,
        isLoadingDocumentTypeDetails: false,
        documentTypeDetailsError: null,
        
        improvedDocument: null,
        isUploadingImproved: false,
        uploadImprovedError: null
      });
    });

    test('should handle resetWorkflow', () => {
      // Set some initial state
      store.dispatch({
        type: 'documentOptimization/startWorkflow/fulfilled',
        payload: { status: 'in_progress' }
      });
      
      // Reset workflow
      store.dispatch(resetWorkflow());
      
      // Check state
      expect(store.getState().documentOptimization.workflowStatus).toBeNull();
      expect(store.getState().documentOptimization.isWorkflowActive).toBe(false);
      expect(store.getState().documentOptimization.workflowError).toBeNull();
    });

    test('should handle resetComparison', () => {
      // Set some initial state
      store.dispatch({
        type: 'documentOptimization/fetchComparison/fulfilled',
        payload: { originalAnalysis: {}, improvedAnalysis: {} }
      });
      
      // Reset comparison
      store.dispatch(resetComparison());
      
      // Check state
      expect(store.getState().documentOptimization.comparisonData).toBeNull();
      expect(store.getState().documentOptimization.isLoadingComparison).toBe(false);
      expect(store.getState().documentOptimization.comparisonError).toBeNull();
    });

    test('should handle resetImprovedDocument', () => {
      // Set some initial state
      store.dispatch({
        type: 'documentOptimization/uploadImproved/fulfilled',
        payload: { improvedDocumentId: '123' }
      });
      
      // Reset improved document
      store.dispatch(resetImprovedDocument());
      
      // Check state
      expect(store.getState().documentOptimization.improvedDocument).toBeNull();
      expect(store.getState().documentOptimization.isUploadingImproved).toBe(false);
      expect(store.getState().documentOptimization.uploadImprovedError).toBeNull();
    });
  });

  describe('async thunks', () => {
    test('fetchOptimizationSuggestions should handle success', async () => {
      // Mock service response
      const mockSuggestions = [
        { id: '1', text: 'Suggestion 1', applied: false },
        { id: '2', text: 'Suggestion 2', applied: false }
      ];
      documentOptimizationService.getOptimizationSuggestions.mockResolvedValue(mockSuggestions);
      
      // Dispatch action
      await store.dispatch(fetchOptimizationSuggestions('doc123'));
      
      // Check state
      expect(store.getState().documentOptimization.suggestions).toEqual(mockSuggestions);
      expect(store.getState().documentOptimization.isLoadingSuggestions).toBe(false);
      expect(store.getState().documentOptimization.suggestionsError).toBeNull();
      
      // Check service was called
      expect(documentOptimizationService.getOptimizationSuggestions).toHaveBeenCalledWith('doc123');
    });

    test('fetchOptimizationSuggestions should handle failure', async () => {
      // Mock service error
      const errorMessage = 'Failed to fetch suggestions';
      documentOptimizationService.getOptimizationSuggestions.mockRejectedValue(new Error(errorMessage));
      
      // Dispatch action
      await store.dispatch(fetchOptimizationSuggestions('doc123'));
      
      // Check state
      expect(store.getState().documentOptimization.suggestions).toEqual([]);
      expect(store.getState().documentOptimization.isLoadingSuggestions).toBe(false);
      expect(store.getState().documentOptimization.suggestionsError).toBe(errorMessage);
    });

    test('applySuggestion should update suggestion state', async () => {
      // Set initial state with suggestions
      const mockSuggestions = [
        { id: '1', text: 'Suggestion 1', applied: false },
        { id: '2', text: 'Suggestion 2', applied: false }
      ];
      store.dispatch({
        type: 'documentOptimization/fetchSuggestions/fulfilled',
        payload: mockSuggestions
      });
      
      // Mock service response
      const mockResult = { success: true };
      documentOptimizationService.applySuggestion.mockResolvedValue(mockResult);
      
      // Dispatch action
      await store.dispatch(applySuggestion({ documentId: 'doc123', suggestionIndex: 0 }));
      
      // Check state - suggestion should be marked as applied
      expect(store.getState().documentOptimization.suggestions[0].applied).toBe(true);
      expect(store.getState().documentOptimization.suggestions[1].applied).toBe(false);
      
      // Check service was called
      expect(documentOptimizationService.applySuggestion).toHaveBeenCalledWith('doc123', 0);
    });

    test('startImprovementWorkflow should update workflow state', async () => {
      // Mock service response
      const mockWorkflowStatus = { status: 'started', steps: ['upload', 'review'] };
      documentOptimizationService.startImprovementWorkflow.mockResolvedValue(mockWorkflowStatus);
      
      // Dispatch action
      await store.dispatch(startImprovementWorkflow('doc123'));
      
      // Check state
      expect(store.getState().documentOptimization.workflowStatus).toEqual(mockWorkflowStatus);
      expect(store.getState().documentOptimization.isWorkflowActive).toBe(true);
      expect(store.getState().documentOptimization.workflowError).toBeNull();
      
      // Check service was called
      expect(documentOptimizationService.startImprovementWorkflow).toHaveBeenCalledWith('doc123');
    });

    test('uploadImprovedDocument should update document state', async () => {
      // Mock service response
      const mockImprovedDoc = { improvedDocumentId: 'improved123', url: 'http://example.com/doc' };
      documentOptimizationService.uploadImprovedDocument.mockResolvedValue(mockImprovedDoc);
      
      // Mock file
      const mockFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
      
      // Dispatch action
      await store.dispatch(uploadImprovedDocument({ documentId: 'doc123', file: mockFile }));
      
      // Check state
      expect(store.getState().documentOptimization.improvedDocument).toEqual(mockImprovedDoc);
      expect(store.getState().documentOptimization.isUploadingImproved).toBe(false);
      expect(store.getState().documentOptimization.uploadImprovedError).toBeNull();
      
      // Check service was called
      expect(documentOptimizationService.uploadImprovedDocument).toHaveBeenCalledWith('doc123', mockFile);
    });

    test('completeImprovementWorkflow should update workflow state', async () => {
      // Mock service response
      const mockCompletionStatus = { status: 'completed', completedAt: new Date().toISOString() };
      documentOptimizationService.completeImprovementWorkflow.mockResolvedValue(mockCompletionStatus);
      
      // Set initial workflow state
      store.dispatch({
        type: 'documentOptimization/startWorkflow/fulfilled',
        payload: { status: 'in_progress' }
      });
      
      // Dispatch action
      await store.dispatch(completeImprovementWorkflow('doc123'));
      
      // Check state
      expect(store.getState().documentOptimization.workflowStatus).toEqual(mockCompletionStatus);
      expect(store.getState().documentOptimization.isWorkflowActive).toBe(false);
      
      // Check service was called
      expect(documentOptimizationService.completeImprovementWorkflow).toHaveBeenCalledWith('doc123');
    });

    test('fetchDocumentComparison should update comparison state', async () => {
      // Mock service response
      const mockComparison = {
        originalAnalysis: { score: 70, issues: ['issue1'] },
        improvedAnalysis: { score: 90, issues: [] }
      };
      documentOptimizationService.getDocumentComparison.mockResolvedValue(mockComparison);
      
      // Dispatch action
      await store.dispatch(fetchDocumentComparison({
        originalDocumentId: 'doc123',
        improvedDocumentId: 'improved123'
      }));
      
      // Check state
      expect(store.getState().documentOptimization.comparisonData).toEqual(mockComparison);
      expect(store.getState().documentOptimization.isLoadingComparison).toBe(false);
      expect(store.getState().documentOptimization.comparisonError).toBeNull();
      
      // Check service was called
      expect(documentOptimizationService.getDocumentComparison).toHaveBeenCalledWith(
        'doc123',
        'improved123'
      );
    });

    test('fetchDocumentTypeDetails should update document type details state', async () => {
      // Mock service response
      const mockDetails = {
        type: 'passport',
        requirements: ['requirement1', 'requirement2'],
        bestPractices: ['practice1', 'practice2']
      };
      documentOptimizationService.getDocumentTypeDetails.mockResolvedValue(mockDetails);
      
      // Dispatch action
      await store.dispatch(fetchDocumentTypeDetails('passport'));
      
      // Check state
      expect(store.getState().documentOptimization.documentTypeDetails).toEqual(mockDetails);
      expect(store.getState().documentOptimization.isLoadingDocumentTypeDetails).toBe(false);
      expect(store.getState().documentOptimization.documentTypeDetailsError).toBeNull();
      
      // Check service was called
      expect(documentOptimizationService.getDocumentTypeDetails).toHaveBeenCalledWith('passport');
    });
  });
});
