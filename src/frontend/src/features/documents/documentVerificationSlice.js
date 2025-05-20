import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentVerificationService from './services/documentVerificationService';

// Initial state
const initialState = {
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
};

// Async thunks
export const fetchVerificationStatus = createAsyncThunk(
  'documentVerification/fetchStatus',
  async (documentId, { rejectWithValue }) => {
    try {
      const status = await documentVerificationService.getVerificationStatus(documentId);
      return status;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const requestVerification = createAsyncThunk(
  'documentVerification/requestVerification',
  async ({ documentId, verificationRequest }, { rejectWithValue }) => {
    try {
      const result = await documentVerificationService.requestVerification(documentId, verificationRequest);
      return { result, verificationRequest };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelVerification = createAsyncThunk(
  'documentVerification/cancelVerification',
  async (documentId, { rejectWithValue }) => {
    try {
      const result = await documentVerificationService.cancelVerification(documentId);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitAdditionalInfo = createAsyncThunk(
  'documentVerification/submitAdditionalInfo',
  async ({ documentId, additionalInfo }, { rejectWithValue }) => {
    try {
      const result = await documentVerificationService.submitAdditionalInfo(documentId, additionalInfo);
      return { result, additionalInfo };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadSupportingDocument = createAsyncThunk(
  'documentVerification/uploadSupportingDocument',
  async ({ documentId, file }, { rejectWithValue }) => {
    try {
      const result = await documentVerificationService.uploadSupportingDocument(documentId, file);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVerificationProviders = createAsyncThunk(
  'documentVerification/fetchProviders',
  async (_, { rejectWithValue }) => {
    try {
      const providers = await documentVerificationService.getVerificationProviders();
      return providers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitToProvider = createAsyncThunk(
  'documentVerification/submitToProvider',
  async ({ documentId, providerId, reference }, { rejectWithValue }) => {
    try {
      const result = await documentVerificationService.submitToProvider(documentId, providerId, reference);
      return { result, providerId, reference };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkProviderStatus = createAsyncThunk(
  'documentVerification/checkProviderStatus',
  async ({ documentId, reference }, { rejectWithValue }) => {
    try {
      const status = await documentVerificationService.checkProviderStatus(documentId, reference);
      return status;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const documentVerificationSlice = createSlice({
  name: 'documentVerification',
  initialState,
  reducers: {
    resetVerificationStatus: (state) => {
      state.verificationStatus = null;
      state.isLoadingStatus = false;
      state.statusError = null;
    },
    resetVerificationRequest: (state) => {
      state.verificationRequest = null;
      state.isSubmittingRequest = false;
      state.requestError = null;
    },
    setSelectedProvider: (state, action) => {
      state.selectedProvider = action.payload;
    },
    resetProviderSubmission: (state) => {
      state.providerSubmission = null;
      state.isSubmittingToProvider = false;
      state.providerSubmissionError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch verification status
      .addCase(fetchVerificationStatus.pending, (state) => {
        state.isLoadingStatus = true;
        state.statusError = null;
      })
      .addCase(fetchVerificationStatus.fulfilled, (state, action) => {
        state.isLoadingStatus = false;
        state.verificationStatus = action.payload;
      })
      .addCase(fetchVerificationStatus.rejected, (state, action) => {
        state.isLoadingStatus = false;
        state.statusError = action.payload;
      })
      
      // Request verification
      .addCase(requestVerification.pending, (state) => {
        state.isSubmittingRequest = true;
        state.requestError = null;
      })
      .addCase(requestVerification.fulfilled, (state, action) => {
        state.isSubmittingRequest = false;
        state.verificationRequest = action.payload.verificationRequest;
        state.verificationStatus = {
          verificationStatus: 'pending_verification',
          verificationDetails: {
            requested_at: new Date().toISOString(),
            verification_method: action.payload.verificationRequest.verificationMethod,
            expedited: action.payload.verificationRequest.expedited
          },
          workflowState: 'pending_review'
        };
      })
      .addCase(requestVerification.rejected, (state, action) => {
        state.isSubmittingRequest = false;
        state.requestError = action.payload;
      })
      
      // Cancel verification
      .addCase(cancelVerification.fulfilled, (state) => {
        state.verificationStatus = {
          verificationStatus: 'pending_submission',
          verificationDetails: {
            canceled_at: new Date().toISOString()
          },
          workflowState: 'none'
        };
        state.verificationRequest = null;
      })
      
      // Submit additional info
      .addCase(submitAdditionalInfo.pending, (state) => {
        state.isSubmittingInfo = true;
        state.infoError = null;
      })
      .addCase(submitAdditionalInfo.fulfilled, (state, action) => {
        state.isSubmittingInfo = false;
        state.additionalInfo = action.payload.additionalInfo;
      })
      .addCase(submitAdditionalInfo.rejected, (state, action) => {
        state.isSubmittingInfo = false;
        state.infoError = action.payload;
      })
      
      // Upload supporting document
      .addCase(uploadSupportingDocument.pending, (state) => {
        state.isUploadingDocument = true;
        state.uploadError = null;
      })
      .addCase(uploadSupportingDocument.fulfilled, (state, action) => {
        state.isUploadingDocument = false;
        state.supportingDocument = action.payload;
      })
      .addCase(uploadSupportingDocument.rejected, (state, action) => {
        state.isUploadingDocument = false;
        state.uploadError = action.payload;
      })
      
      // Fetch verification providers
      .addCase(fetchVerificationProviders.pending, (state) => {
        state.isLoadingProviders = true;
        state.providersError = null;
      })
      .addCase(fetchVerificationProviders.fulfilled, (state, action) => {
        state.isLoadingProviders = false;
        state.verificationProviders = action.payload;
      })
      .addCase(fetchVerificationProviders.rejected, (state, action) => {
        state.isLoadingProviders = false;
        state.providersError = action.payload;
      })
      
      // Submit to provider
      .addCase(submitToProvider.pending, (state) => {
        state.isSubmittingToProvider = true;
        state.providerSubmissionError = null;
      })
      .addCase(submitToProvider.fulfilled, (state, action) => {
        state.isSubmittingToProvider = false;
        state.providerSubmission = {
          providerId: action.payload.providerId,
          reference: action.payload.reference,
          submittedAt: new Date().toISOString()
        };
        state.verificationStatus = {
          verificationStatus: 'verification_in_progress',
          verificationDetails: {
            provider_id: action.payload.providerId,
            reference: action.payload.reference,
            submitted_to_provider_at: new Date().toISOString()
          },
          workflowState: 'under_review'
        };
      })
      .addCase(submitToProvider.rejected, (state, action) => {
        state.isSubmittingToProvider = false;
        state.providerSubmissionError = action.payload;
      })
      
      // Check provider status
      .addCase(checkProviderStatus.pending, (state) => {
        state.isCheckingProviderStatus = true;
        state.providerStatusError = null;
      })
      .addCase(checkProviderStatus.fulfilled, (state, action) => {
        state.isCheckingProviderStatus = false;
        state.providerStatus = action.payload;
      })
      .addCase(checkProviderStatus.rejected, (state, action) => {
        state.isCheckingProviderStatus = false;
        state.providerStatusError = action.payload;
      });
  }
});

// Export actions
export const { 
  resetVerificationStatus, 
  resetVerificationRequest,
  setSelectedProvider,
  resetProviderSubmission
} = documentVerificationSlice.actions;

// Export selectors
export const selectVerificationStatus = (state) => state.documentVerification.verificationStatus;
export const selectIsLoadingStatus = (state) => state.documentVerification.isLoadingStatus;
export const selectStatusError = (state) => state.documentVerification.statusError;

export const selectVerificationRequest = (state) => state.documentVerification.verificationRequest;
export const selectIsSubmittingRequest = (state) => state.documentVerification.isSubmittingRequest;
export const selectRequestError = (state) => state.documentVerification.requestError;

export const selectAdditionalInfo = (state) => state.documentVerification.additionalInfo;
export const selectIsSubmittingInfo = (state) => state.documentVerification.isSubmittingInfo;
export const selectInfoError = (state) => state.documentVerification.infoError;

export const selectSupportingDocument = (state) => state.documentVerification.supportingDocument;
export const selectIsUploadingDocument = (state) => state.documentVerification.isUploadingDocument;
export const selectUploadError = (state) => state.documentVerification.uploadError;

export const selectVerificationProviders = (state) => state.documentVerification.verificationProviders;
export const selectIsLoadingProviders = (state) => state.documentVerification.isLoadingProviders;
export const selectProvidersError = (state) => state.documentVerification.providersError;

export const selectSelectedProvider = (state) => state.documentVerification.selectedProvider;
export const selectProviderSubmission = (state) => state.documentVerification.providerSubmission;
export const selectIsSubmittingToProvider = (state) => state.documentVerification.isSubmittingToProvider;
export const selectProviderSubmissionError = (state) => state.documentVerification.providerSubmissionError;

export const selectProviderStatus = (state) => state.documentVerification.providerStatus;
export const selectIsCheckingProviderStatus = (state) => state.documentVerification.isCheckingProviderStatus;
export const selectProviderStatusError = (state) => state.documentVerification.providerStatusError;

// Export reducer
export default documentVerificationSlice.reducer;
