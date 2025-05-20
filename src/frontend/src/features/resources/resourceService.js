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

    try {
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
    } catch (apiError) {
      // If the endpoint doesn't exist (404) or connection refused (network error), return mock data
      if (apiError.response?.status === 404 || apiError.message === 'Network Error') {
        console.log('[resourceService] Resources endpoint not available, returning mock data');
        return {
          status: 'success',
          results: 3,
          data: {
            resources: [
              {
                id: 'mock-1',
                title: 'Getting Started with Immigration',
                contentType: 'guide',
                summary: 'A comprehensive guide to starting your immigration journey',
                targetAudienceTags: ['beginner', 'all-countries', 'pre-decision', ...tags]
              },
              {
                id: 'mock-2',
                title: 'Document Checklist',
                contentType: 'checklist',
                summary: 'Essential documents you need to prepare for immigration',
                targetAudienceTags: ['intermediate', 'all-countries', 'pre-application', ...tags]
              },
              {
                id: 'mock-3',
                title: 'Post-Arrival Guide',
                contentType: 'article',
                summary: 'What to do after you arrive in your new country',
                targetAudienceTags: ['advanced', 'all-countries', 'post-arrival', ...tags]
              }
            ]
          }
        };
      }
      throw apiError;
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
    try {
      const response = await axios.get(`${RESOURCE_API_URL}/${resourceId}`, {
        headers: getAuthHeaders()
      });
      // Expect backend to return { status: 'success', data: { resource: {} } }
      if (response.data?.status === 'success') {
          return response.data; // Return the full response object
      } else {
          throw new Error(response.data?.message || `Failed to fetch resource ${resourceId}`);
      }
    } catch (apiError) {
      // If the endpoint doesn't exist (404) or connection refused (network error), return mock data
      if (apiError.response?.status === 404 || apiError.message === 'Network Error') {
        console.log(`[resourceService] Resource endpoint not available, returning mock data for ${resourceId}`);

        // Return mock data based on the resource ID
        if (resourceId === 'mock-1') {
          return {
            status: 'success',
            data: {
              resource: {
                id: 'mock-1',
                title: 'Getting Started with Immigration',
                contentType: 'guide',
                content: '# Getting Started with Immigration\n\nThis guide will help you understand the basics of immigration...',
                summary: 'A comprehensive guide to starting your immigration journey',
                targetAudienceTags: ['beginner', 'all-countries', 'pre-decision']
              }
            }
          };
        } else {
          return {
            status: 'success',
            data: {
              resource: {
                id: resourceId,
                title: `Resource ${resourceId}`,
                contentType: 'article',
                content: `This is a mock resource with ID ${resourceId}`,
                summary: 'Mock resource summary',
                targetAudienceTags: ['mock']
              }
            }
          };
        }
      }
      throw apiError;
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
