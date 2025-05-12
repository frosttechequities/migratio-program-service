import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const generatePDF = createAsyncThunk(
  'pdf/generate',
  async (pdfData, { rejectWithValue }) => {
    try {
      const response = await api.post('/pdf/generate', pdfData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate PDF');
    }
  }
);

export const getPDFById = createAsyncThunk(
  'pdf/getById',
  async (pdfId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pdf/${pdfId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get PDF');
    }
  }
);

export const getUserPDFs = createAsyncThunk(
  'pdf/getUserPDFs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/pdf/user');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user PDFs');
    }
  }
);

// Initial state
const initialState = {
  pdfs: [],
  pdfUrl: null,
  pdfId: null,
  loading: false,
  error: null,
  success: false
};

// Slice
const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    resetPDF: (state) => {
      state.pdfUrl = null;
      state.pdfId = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate PDF
      .addCase(generatePDF.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(generatePDF.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.pdfUrl = action.payload.pdfUrl;
        state.pdfId = action.payload.pdfId;
      })
      .addCase(generatePDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to generate PDF';
      })
      
      // Get PDF by ID
      .addCase(getPDFById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPDFById.fulfilled, (state, action) => {
        state.loading = false;
        state.pdfUrl = action.payload.pdfUrl;
        state.pdfId = action.payload.pdfId;
      })
      .addCase(getPDFById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get PDF';
      })
      
      // Get user PDFs
      .addCase(getUserPDFs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPDFs.fulfilled, (state, action) => {
        state.loading = false;
        state.pdfs = action.payload;
      })
      .addCase(getUserPDFs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get user PDFs';
      });
  }
});

export const { resetPDF, clearError } = pdfSlice.actions;

export default pdfSlice.reducer;
