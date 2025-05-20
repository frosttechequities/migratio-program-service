import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentService from './documentService';
import { setMessage } from '../ui/uiSlice';

// Initial state
const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  documents: [],
  categories: [],
  currentDocument: null,
  uploadProgress: 0,
  ocrProcessing: false
};

// Get all documents
export const getDocuments = createAsyncThunk(
  'documents/getDocuments',
  async (_, thunkAPI) => {
    try {
      return await documentService.getDocuments();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch documents';
      thunkAPI.dispatch(setMessage({
        type: 'error',
        text: message
      }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get document by ID
export const getDocumentById = createAsyncThunk(
  'documents/getDocumentById',
  async (documentId, thunkAPI) => {
    try {
      return await documentService.getDocumentById(documentId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch document';
      thunkAPI.dispatch(setMessage({
        type: 'error',
        text: message
      }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upload document
export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async ({ file, metadata }, thunkAPI) => {
    try {
      return await documentService.uploadDocument(file, metadata, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        thunkAPI.dispatch(setUploadProgress(percentCompleted));
      });
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to upload document';
      thunkAPI.dispatch(setMessage({
        type: 'error',
        text: message
      }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Process document with OCR
export const processDocumentOcr = createAsyncThunk(
  'documents/processOcr',
  async ({ id, engineType }, thunkAPI) => {
    try {
      const response = await documentService.processDocumentOcr(id, engineType);
      thunkAPI.dispatch(setMessage({
        type: 'success',
        text: 'Document processed successfully'
      }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to process document';
      thunkAPI.dispatch(setMessage({
        type: 'error',
        text: message
      }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update document
export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async ({ documentId, data }, thunkAPI) => {
    try {
      return await documentService.updateDocument(documentId, data);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update document';
      thunkAPI.dispatch(setMessage({
        type: 'error',
        text: message
      }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete document
export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId, thunkAPI) => {
    try {
      await documentService.deleteDocument(documentId);
      thunkAPI.dispatch(setMessage({
        type: 'success',
        text: 'Document deleted successfully'
      }));
      return documentId;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete document';
      thunkAPI.dispatch(setMessage({
        type: 'error',
        text: message
      }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get document categories
export const getDocumentCategories = createAsyncThunk(
  'documents/getDocumentCategories',
  async (_, thunkAPI) => {
    try {
      return await documentService.getDocumentCategories();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch document categories';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update document verification status
export const updateDocumentVerification = createAsyncThunk(
  'documents/updateVerification',
  async ({ documentId, verificationData }, thunkAPI) => {
    try {
      const response = await documentService.updateDocumentVerification(documentId, verificationData);
      thunkAPI.dispatch(setMessage({ type: 'success', text: 'Document verification updated.' }));
      return response.data; // Return the updated document data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update document verification';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Document slice
const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    resetDocuments: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
    clearDocuments: (state) => {
      state.documents = [];
      state.currentDocument = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all documents
      .addCase(getDocuments.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = action.payload.data;
      })
      .addCase(getDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Get document by ID
      .addCase(getDocumentById.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(getDocumentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentDocument = action.payload.data;
      })
      .addCase(getDocumentById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents.push(action.payload.data);
        state.uploadProgress = 100;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.uploadProgress = 0;
      })

      // Update document
      .addCase(updateDocument.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = state.documents.map(doc =>
          doc.id === action.payload.data.id ? action.payload.data : doc
        );
        state.currentDocument = action.payload.data;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Process document OCR
      .addCase(processDocumentOcr.pending, (state) => {
        state.isLoading = true;
        state.ocrProcessing = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(processDocumentOcr.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ocrProcessing = false;
        state.isSuccess = true;
        state.currentDocument = action.payload.document;
      })
      .addCase(processDocumentOcr.rejected, (state, action) => {
        state.isLoading = false;
        state.ocrProcessing = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = state.documents.filter(doc => doc.id !== action.payload);
        if (state.currentDocument && state.currentDocument.id === action.payload) {
          state.currentDocument = null;
        }
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Get document categories
      .addCase(getDocumentCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data;
      })

      // Update document verification
      .addCase(updateDocumentVerification.pending, (state) => {
        state.isLoading = true; // Or a specific loading state for verification?
      })
      .addCase(updateDocumentVerification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the document in the list and potentially the currentDocument
        state.documents = state.documents.map(doc =>
          doc.id === action.payload.id ? action.payload : doc
        );
        if (state.currentDocument && state.currentDocument.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(updateDocumentVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  }
});

export const {
  resetDocuments,
  clearDocuments,
  setUploadProgress,
  resetUploadProgress
} = documentSlice.actions;

// Selector for the entire document state
export const selectDocumentState = (state) => state.documents;

// Selector for a specific document by ID
export const selectDocumentById = (state, documentId) => {
  if (!documentId) return null;

  // First check currentDocument
  if (state.documents.currentDocument && state.documents.currentDocument.id === documentId) {
    return state.documents.currentDocument;
  }

  // Then check documents array
  return state.documents.documents.find(doc => doc.id === documentId);
};

// Selector for loading state
export const selectIsLoadingDocument = (state) => state.documents.isLoading;

// Alias for getDocumentById to match naming convention in our new components
export const fetchDocumentById = getDocumentById;

export default documentSlice.reducer;
