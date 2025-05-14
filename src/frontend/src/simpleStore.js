import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create a simple UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    }
  }
});

// Export actions
export const { setTheme, setLoading, setError, setMessage, clearMessage } = uiSlice.actions;

// Create the store with the UI reducer
const store = configureStore({
  reducer: {
    ui: uiSlice.reducer
  }
});

export { store };
