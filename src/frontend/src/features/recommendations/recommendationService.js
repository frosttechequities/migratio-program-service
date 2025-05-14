import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils';

// API URL - Point to the Recommendation service endpoint
const API_URL = process.env.REACT_APP_RECOMMENDATION_SERVICE_URL || 'https://migratio-program-service.onrender.com/api'; // Use deployed backend
const RECOMMENDATION_API_URL = `${API_URL}/recommendations`;

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

// Generate program recommendations for the current user
const generateRecommendations = async () => {
  try {
    console.log('[recommendationService] Fetching program recommendations...');
    const response = await axios.get(RECOMMENDATION_API_URL, { headers: getAuthHeaders() });
    if (response.data?.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.data?.message || 'Failed to fetch recommendations');
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch recommendations';
    console.error('Generate Recommendations Service Error:', message);
    throw new Error(message);
  }
};

// Suggest destination countries for the current user
const suggestDestinations = async () => {
    try {
        console.log('[recommendationService] Fetching destination suggestions...');
        try {
            const response = await axios.get(`${RECOMMENDATION_API_URL}/destinations`, { headers: getAuthHeaders() });
            if (response.data?.status === 'success') {
                return response.data;
            } else {
                throw new Error(response.data?.message || 'Failed to fetch destination suggestions');
            }
        } catch (apiError) {
            // If the endpoint doesn't exist (404), return mock data
            if (apiError.response?.status === 404) {
                console.log('[recommendationService] Destination suggestions endpoint not found, returning mock data');
                return {
                    status: 'success',
                    data: {
                        destinations: [
                            { country: 'Canada', score: 85, reasoning: 'Strong match based on your profile' },
                            { country: 'Australia', score: 78, reasoning: 'Good match for your skills' },
                            { country: 'New Zealand', score: 72, reasoning: 'Favorable immigration policies' },
                            { country: 'Germany', score: 68, reasoning: 'Demand for your profession' },
                            { country: 'United Kingdom', score: 65, reasoning: 'Language compatibility' }
                        ]
                    }
                };
            }
            throw apiError;
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch destination suggestions';
        console.error('Suggest Destinations Service Error:', message);
        throw new Error(message);
    }
};

// Simulate the impact of profile changes on recommendations
const simulateProfileChange = async (profileChanges) => {
    if (!profileChanges || typeof profileChanges !== 'object' || Object.keys(profileChanges).length === 0) {
        throw new Error('Profile changes object is required for simulation.');
    }
    try {
        console.log('[recommendationService] Simulating profile changes...');
        const response = await axios.post(`${RECOMMENDATION_API_URL}/scenarios/simulate`, { profileChanges }, { headers: getAuthHeaders() });
        if (response.data?.status === 'success') {
            return response.data.data;
        } else {
            throw new Error(response.data?.message || 'Failed to simulate profile changes');
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to simulate profile changes';
        console.error('Simulate Profile Change Service Error:', message);
        throw new Error(message);
  }
};

const recommendationService = {
  generateRecommendations,
  suggestDestinations,
  simulateProfileChange,
};

export default recommendationService;
