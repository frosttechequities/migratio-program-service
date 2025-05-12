import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils'; // Added import

// API URL - Point to the User service endpoint for profiles
const API_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:3001/api'; // User service runs on 3001
const PROFILE_API_URL = `${API_URL}/profiles`; // This will become http://localhost:3001/api/profiles

const getAuthHeaders = () => { // Added helper
  const token = getTokenFromLocalStorage();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Get current user's profile
const getProfile = async () => {
  try {
    const response = await axios.get(`${PROFILE_API_URL}/me`, { headers: getAuthHeaders() });
    // Expect backend to return { status: 'success', data: { profile: {} } }
    if (response.data?.status === 'success') {
        return response.data.data.profile; // Return only the profile object
    } else {
        throw new Error(response.data?.message || 'Failed to fetch profile');
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch profile';
    console.error('Get Profile Service Error:', message);
    throw new Error(message);
  }
};

// Update a readiness checklist item
const updateReadinessChecklistItem = async (itemId, updateData) => {
   if (!itemId) throw new Error('Checklist Item ID is required for update');
   if (!updateData || typeof updateData.isComplete !== 'boolean') throw new Error('Update data with isComplete boolean is required');

  try {
    const response = await axios.patch(`${PROFILE_API_URL}/me/readiness-checklist/${itemId}`, updateData, { headers: getAuthHeaders() });
     // Expect backend to return { status: 'success', data: { updatedItem: {} } }
     if (response.data?.status === 'success') {
        return response.data.data.updatedItem; // Return the updated item
    } else {
        throw new Error(response.data?.message || `Failed to update checklist item ${itemId}`);
    }
  } catch (error) {
     const message = error.response?.data?.message || error.message || `Failed to update checklist item ${itemId}`;
    console.error(`Update Checklist Item Service Error (${itemId}):`, message);
    throw new Error(message);
  }
};

// TODO: Add function for general profile update (updateProfile) if needed

const profileService = {
  getProfile,
  updateReadinessChecklistItem,
};

export default profileService;
