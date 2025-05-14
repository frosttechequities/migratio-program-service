import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { setMessage } from '../ui/uiSlice';
import { saveUserToLocalStorage, removeUserFromLocalStorage, getUserFromLocalStorage } from '../../utils/authUtils'; // Import localStorage utils

// Initial state
// Attempt to load user from localStorage to persist session across reloads,
// but actual authentication status is verified by checkAuth.
const initialUser = getUserFromLocalStorage();

const initialState = {
  user: initialUser || null,
  isAuthenticated: !!initialUser, // Tentatively set based on localStorage, confirmed by checkAuth
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      thunkAPI.dispatch(setMessage({
        type: 'success',
        text: 'Registration successful! Please check your email to verify your account.'
      }));
      // Optionally, log in the user directly after registration if API returns token/user
      // For now, just return response, user will have to log in.
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData); // response = { user, token }
      if (response.token && response.user) {
        saveUserToLocalStorage(response.user, response.token);
        return { user: response.user, token: response.token }; // Pass user and token to reducer
      } else {
        throw new Error('Login response did not include token or user data.');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await authService.logout(); // Call API logout if it exists (e.g., to invalidate session/token server-side)
      removeUserFromLocalStorage();
      return null;
    } catch (error) {
      // Even if API logout fails, clear client-side session
      removeUserFromLocalStorage();
      const message = error.response?.data?.message || error.message || 'Logout failed';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message); // Or resolve to ensure client logout
    }
  }
);

// Verify email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, thunkAPI) => {
    try {
      const response = await authService.verifyEmail(token);
      thunkAPI.dispatch(setMessage({ type: 'success', text: 'Email verified successfully! You can now log in.' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Email verification failed';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(email);
      thunkAPI.dispatch(setMessage({ type: 'success', text: 'Password reset email sent. Please check your email.' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Password reset request failed';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, thunkAPI) => {
    try {
      const response = await authService.resetPassword(token, password);
      thunkAPI.dispatch(setMessage({ type: 'success', text: 'Password reset successful! You can now log in with your new password.' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Password reset failed';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Check if user is authenticated (e.g., on app load)
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, thunkAPI) => {
    try {
      const user = await authService.checkAuth(); // This service should use token from localStorage
      if (user) {
        // If user data is returned, ensure localStorage is consistent (token is already there)
        // saveUserToLocalStorage(user, getTokenFromLocalStorage()); // getTokenFromLocalStorage needs to be imported if used here
        return user;
      } else {
        removeUserFromLocalStorage();
        return null;
      }
    } catch (error) {
      removeUserFromLocalStorage();
      return thunkAPI.rejectWithValue(null);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
    // Manual logout action if needed, though thunk is preferred for async ops
    manualLogout: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        removeUserFromLocalStorage();
    },
    // Direct login success action for use by ProtectedRoute
    loginSuccess: (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        // Save user to localStorage
        saveUserToLocalStorage(action.payload.user, action.payload.token);
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload.user; // User object from thunk payload
        // localStorage was updated in the thunk
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        // localStorage was cleared in the thunk if needed, or here
        removeUserFromLocalStorage();
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.isAuthenticated = false;
        // localStorage cleared in thunk
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.user = null; // Still ensure client state is logged out
        state.isAuthenticated = false;
        // localStorage cleared in thunk
      })

      // Verify Email, Forgot Password, Reset Password (pending, fulfilled, rejected similar to register)
      // ... (omitted for brevity, assume standard loading/error handling)

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
        // localStorage handled in thunk
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        // localStorage cleared in thunk
      });
  },
});

export const { reset, manualLogout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
