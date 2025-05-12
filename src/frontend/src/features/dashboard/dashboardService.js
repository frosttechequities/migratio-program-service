import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils';

// API URL - Point to the User Service for dashboard data
const API_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:3001/api'; // User service runs on 3001

const getAuthHeaders = () => {
  const token = getTokenFromLocalStorage();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Get dashboard data
 * Fetches aggregated data needed for the main dashboard view.
 * @param {Object} options - Options for fetching data (currently unused)
 * @returns {Promise<Object>} Dashboard data aggregated by the backend
 */
const getDashboardData = async (options = {}) => {
  // const { forceRefresh = false } = options; // Caching removed for now

  try {
    console.log('[dashboardService] Fetching dashboard data...');
    // GET request to the backend endpoint responsible for aggregating dashboard data
    // Assuming dashboard data is at /api/dashboard/data relative to user service base
    const response = await axios.get(`${API_URL}/dashboard/data`, { headers: getAuthHeaders() }); 

    // Expect backend to return structure like: { status: 'success', data: { overview: {...}, recommendations: [...], tasks: [...] ... } }
    if (response.data && response.data.status === 'success') {
      console.log('[dashboardService] Received dashboard data:', response.data.data);
      return response.data; // Return the whole response object containing the 'data' field
    } else {
      throw new Error(response.data?.message || 'Failed to fetch dashboard data');
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    console.error('Get Dashboard Data Service Error:', message);
    throw new Error(message);
  }
};

/**
 * Update dashboard preferences (Placeholder)
 * @param {Object} preferences - Dashboard preferences
 * @returns {Promise<Object>} Updated preferences
 */
const updateDashboardPreferences = async (preferences) => {
  console.warn('updateDashboardPreferences service function not implemented.');
  // try {
  //   const response = await axios.put(`${API_URL}/dashboard/preferences`, preferences, { headers: getAuthHeaders() });
  //   return response.data;
  // } catch (error) { ... }
  return { success: false, message: 'Not implemented' };
};

const dashboardService = {
  getDashboardData,
  updateDashboardPreferences,
};

export default dashboardService;
