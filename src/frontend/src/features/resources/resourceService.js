import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils';

// API URL - Point to the API Gateway or User service endpoint for resources
const API_URL = process.env.REACT_APP_API_URL || 'https://migratio-program-service.onrender.com/api'; // Use deployed backend
const RESOURCE_API_URL = `${API_URL}/resources`;

// Get auth headers for API requests
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

// Get resources, optionally filtered by tags
// Assumes an axios interceptor handles adding the auth token if needed for specific resources
const getResources = async (tags = []) => {
  try {
    const params = {};
    if (tags.length > 0) {
      params.tags = tags.join(','); // Example: Pass tags as comma-separated string
      // Backend needs to implement filtering based on this query param
    }
    console.log(`[resourceService] Fetching resources with tags: ${tags.join(',')}`);
    const response = await axios.get(RESOURCE_API_URL, {
      params,
      headers: getAuthHeaders()
    });
    // Expect backend to return { status: 'success', results: number, data: { resources: [] } }
    if (response.data?.status === 'success') {
        return response.data; // Return the full response object
    } else {
        throw new Error(response.data?.message || 'Failed to fetch resources');
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch resources';
    console.error('Get Resources Service Error:', message);
    throw new Error(message);
  }
};

// Get a single resource by ID
const getResourceById = async (resourceId) => {
  if (!resourceId) throw new Error('Resource ID is required');
  try {
    console.log(`[resourceService] Fetching resource ${resourceId}`);
    const response = await axios.get(`${RESOURCE_API_URL}/${resourceId}`, {
      headers: getAuthHeaders()
    });
    // Expect backend to return { status: 'success', data: { resource: {} } }
    if (response.data?.status === 'success') {
        return response.data; // Return the full response object
    } else {
        throw new Error(response.data?.message || `Failed to fetch resource ${resourceId}`);
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || `Failed to fetch resource ${resourceId}`;
    console.error(`Get Resource By ID Service Error (${resourceId}):`, message);
    throw new Error(message);
  }
};

// Add other functions (create, update, delete) if needed, likely admin-only

const resourceService = {
  getResources,
  getResourceById,
};

export default resourceService;
