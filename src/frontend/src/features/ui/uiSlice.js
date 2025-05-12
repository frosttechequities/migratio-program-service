import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  isLoading: false,
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = {
        type: action.payload.type,
        text: action.payload.text,
        id: Date.now(),
      };
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setMessage,
  clearMessage,
  setLoading,
  toggleSidebar,
  setSidebarOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
