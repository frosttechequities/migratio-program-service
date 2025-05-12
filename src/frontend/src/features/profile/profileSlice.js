import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from './profileService';
import { setMessage } from '../ui/uiSlice'; // For displaying messages

// Initial state
const initialState = {
  profile: null,
  isLoading: false,
  isError: false,
  error: null,
  profileCompletion: 0, // To store profile completion percentage
};

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, thunkAPI) => {
    try {
      return await profileService.getProfile();
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to load profile: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to get profile completion
export const getProfileCompletion = createAsyncThunk(
  'profile/getCompletion',
  async (_, thunkAPI) => {
    try {
      // Assuming profileService.getProfileCompletion() returns { completionPercentage: number }
      const response = await profileService.getProfileCompletion();
      return response.completionPercentage;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to get profile completion';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to update a profile section
export const updateProfileSection = createAsyncThunk(
  'profile/updateSection',
  async ({ section, data }, thunkAPI) => {
    try {
      // Assuming profileService.updateProfileSection(section, data) returns the updated profile
      const updatedProfile = await profileService.updateProfileSection(section, data);
      thunkAPI.dispatch(setMessage({ type: 'success', text: `${section} updated successfully.` }));
      return updatedProfile;
    } catch (error) {
      const message = error.response?.data?.message || error.message || `Failed to update ${section}`;
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to update a readiness checklist item
export const updateReadinessChecklistItem = createAsyncThunk(
  'profile/updateChecklistItem',
  async ({ itemId, updateData }, thunkAPI) => {
    try {
      const updatedItem = await profileService.updateReadinessChecklistItem(itemId, updateData);
      // Return the updated item along with its itemId to find it in the state
      return { itemId, updatedItem };
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to update checklist item: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.profile = null;
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.profileCompletion = 0;
    },
    // Could add local update reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.profile = null;
      })
      // Update checklist item
      .addCase(updateReadinessChecklistItem.pending, (state) => {
        // Optionally indicate loading state for the specific item?
        state.isError = false; // Clear previous errors on new attempt
        state.error = null;
      })
      .addCase(updateReadinessChecklistItem.fulfilled, (state, action) => {
        const { itemId, updatedItem } = action.payload;
        if (state.profile && state.profile.readinessChecklist) {
          const itemIndex = state.profile.readinessChecklist.findIndex(item => item.itemId === itemId);
          if (itemIndex !== -1) {
            // Update the specific item in the profile state
            state.profile.readinessChecklist[itemIndex] = {
              ...state.profile.readinessChecklist[itemIndex], // Keep existing fields
              ...updatedItem // Overwrite with updated fields
            };
          }
        }
      })
      .addCase(updateReadinessChecklistItem.rejected, (state, action) => {
        state.isError = true;
        state.error = action.payload;
        // Optionally revert optimistic updates if implemented
      })
      // Get profile completion
      .addCase(getProfileCompletion.pending, (state) => {
        state.isLoading = true; // Can use a more specific loading state if needed
      })
      .addCase(getProfileCompletion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileCompletion = action.payload;
      })
      .addCase(getProfileCompletion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        // Keep existing completion or reset? For now, keep.
        state.error = action.payload; // Store error related to completion fetching
      })
      // Update profile section
      .addCase(updateProfileSection.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updateProfileSection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload; // Update the whole profile
        // Optionally re-fetch completion percentage or update based on returned profile
      })
      .addCase(updateProfileSection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  }
});

export const { resetProfile } = profileSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.profile.profile;
export const selectProfileIsLoading = (state) => state.profile.isLoading;
export const selectProfileError = (state) => state.profile.error;
export const selectProfileCompletion = (state) => state.profile.profileCompletion;

export default profileSlice.reducer;
