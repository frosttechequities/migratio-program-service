import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentOptimizationService from './services/documentOptimizationService';

// Initial state
const initialState = {
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
};

// Async thunks
export const fetchOptimizationSuggestions = createAsyncThunk(
  'documentOptimization/fetchSuggestions',
  async (documentId, { rejectWithValue }) => {
    try {
      const suggestions = await documentOptimizationService.getOptimizationSuggestions(documentId);
      return suggestions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const applySuggestion = createAsyncThunk(
  'documentOptimization/applySuggestion',
  async ({ documentId, suggestionIndex }, { rejectWithValue }) => {
    try {
      const result = await documentOptimizationService.applySuggestion(documentId, suggestionIndex);
      return { result, suggestionIndex };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startImprovementWorkflow = createAsyncThunk(
  'documentOptimization/startWorkflow',
  async (documentId, { rejectWithValue }) => {
    try {
      const result = await documentOptimizationService.startImprovementWorkflow(documentId);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadImprovedDocument = createAsyncThunk(
  'documentOptimization/uploadImproved',
  async ({ documentId, file }, { rejectWithValue }) => {
    try {
      const result = await documentOptimizationService.uploadImprovedDocument(documentId, file);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeImprovementWorkflow = createAsyncThunk(
  'documentOptimization/completeWorkflow',
  async (documentId, { rejectWithValue }) => {
    try {
      const result = await documentOptimizationService.completeImprovementWorkflow(documentId);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDocumentComparison = createAsyncThunk(
  'documentOptimization/fetchComparison',
  async ({ originalDocumentId, improvedDocumentId }, { rejectWithValue }) => {
    try {
      const comparison = await documentOptimizationService.getDocumentComparison(
        originalDocumentId,
        improvedDocumentId
      );
      return comparison;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDocumentTypeDetails = createAsyncThunk(
  'documentOptimization/fetchDocumentTypeDetails',
  async (documentType, { rejectWithValue }) => {
    try {
      const details = await documentOptimizationService.getDocumentTypeDetails(documentType);
      return details;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const documentOptimizationSlice = createSlice({
  name: 'documentOptimization',
  initialState,
  reducers: {
    resetWorkflow: (state) => {
      state.workflowStatus = null;
      state.isWorkflowActive = false;
      state.workflowError = null;
    },
    resetComparison: (state) => {
      state.comparisonData = null;
      state.isLoadingComparison = false;
      state.comparisonError = null;
    },
    resetImprovedDocument: (state) => {
      state.improvedDocument = null;
      state.isUploadingImproved = false;
      state.uploadImprovedError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch optimization suggestions
      .addCase(fetchOptimizationSuggestions.pending, (state) => {
        state.isLoadingSuggestions = true;
        state.suggestionsError = null;
      })
      .addCase(fetchOptimizationSuggestions.fulfilled, (state, action) => {
        state.isLoadingSuggestions = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchOptimizationSuggestions.rejected, (state, action) => {
        state.isLoadingSuggestions = false;
        state.suggestionsError = action.payload;
      })
      
      // Apply suggestion
      .addCase(applySuggestion.fulfilled, (state, action) => {
        const { suggestionIndex } = action.payload;
        if (state.suggestions[suggestionIndex]) {
          state.suggestions[suggestionIndex].applied = true;
        }
      })
      
      // Start improvement workflow
      .addCase(startImprovementWorkflow.pending, (state) => {
        state.isWorkflowActive = true;
        state.workflowError = null;
      })
      .addCase(startImprovementWorkflow.fulfilled, (state, action) => {
        state.workflowStatus = action.payload;
      })
      .addCase(startImprovementWorkflow.rejected, (state, action) => {
        state.isWorkflowActive = false;
        state.workflowError = action.payload;
      })
      
      // Upload improved document
      .addCase(uploadImprovedDocument.pending, (state) => {
        state.isUploadingImproved = true;
        state.uploadImprovedError = null;
      })
      .addCase(uploadImprovedDocument.fulfilled, (state, action) => {
        state.isUploadingImproved = false;
        state.improvedDocument = action.payload;
      })
      .addCase(uploadImprovedDocument.rejected, (state, action) => {
        state.isUploadingImproved = false;
        state.uploadImprovedError = action.payload;
      })
      
      // Complete improvement workflow
      .addCase(completeImprovementWorkflow.fulfilled, (state, action) => {
        state.workflowStatus = action.payload;
        state.isWorkflowActive = false;
      })
      
      // Fetch document comparison
      .addCase(fetchDocumentComparison.pending, (state) => {
        state.isLoadingComparison = true;
        state.comparisonError = null;
      })
      .addCase(fetchDocumentComparison.fulfilled, (state, action) => {
        state.isLoadingComparison = false;
        state.comparisonData = action.payload;
      })
      .addCase(fetchDocumentComparison.rejected, (state, action) => {
        state.isLoadingComparison = false;
        state.comparisonError = action.payload;
      })
      
      // Fetch document type details
      .addCase(fetchDocumentTypeDetails.pending, (state) => {
        state.isLoadingDocumentTypeDetails = true;
        state.documentTypeDetailsError = null;
      })
      .addCase(fetchDocumentTypeDetails.fulfilled, (state, action) => {
        state.isLoadingDocumentTypeDetails = false;
        state.documentTypeDetails = action.payload;
      })
      .addCase(fetchDocumentTypeDetails.rejected, (state, action) => {
        state.isLoadingDocumentTypeDetails = false;
        state.documentTypeDetailsError = action.payload;
      });
  }
});

// Export actions
export const { resetWorkflow, resetComparison, resetImprovedDocument } = documentOptimizationSlice.actions;

// Export selectors
export const selectOptimizationSuggestions = (state) => state.documentOptimization.suggestions;
export const selectIsLoadingSuggestions = (state) => state.documentOptimization.isLoadingSuggestions;
export const selectSuggestionsError = (state) => state.documentOptimization.suggestionsError;

export const selectWorkflowStatus = (state) => state.documentOptimization.workflowStatus;
export const selectIsWorkflowActive = (state) => state.documentOptimization.isWorkflowActive;
export const selectWorkflowError = (state) => state.documentOptimization.workflowError;

export const selectComparisonData = (state) => state.documentOptimization.comparisonData;
export const selectIsLoadingComparison = (state) => state.documentOptimization.isLoadingComparison;
export const selectComparisonError = (state) => state.documentOptimization.comparisonError;

export const selectDocumentTypeDetails = (state) => state.documentOptimization.documentTypeDetails;
export const selectIsLoadingDocumentTypeDetails = (state) => state.documentOptimization.isLoadingDocumentTypeDetails;
export const selectDocumentTypeDetailsError = (state) => state.documentOptimization.documentTypeDetailsError;

export const selectImprovedDocument = (state) => state.documentOptimization.improvedDocument;
export const selectIsUploadingImproved = (state) => state.documentOptimization.isUploadingImproved;
export const selectUploadImprovedError = (state) => state.documentOptimization.uploadImprovedError;

// Export reducer
export default documentOptimizationSlice.reducer;
