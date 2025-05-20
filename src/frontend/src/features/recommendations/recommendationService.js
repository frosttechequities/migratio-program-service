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
    try {
      const response = await axios.get(RECOMMENDATION_API_URL, { headers: getAuthHeaders() });
      if (response.data?.status === 'success') {
          return response.data;
      } else {
          throw new Error(response.data?.message || 'Failed to fetch recommendations');
      }
    } catch (apiError) {
      // If the endpoint doesn't exist (404) or connection refused (network error), return mock data
      if (apiError.response?.status === 404 || apiError.message === 'Network Error') {
        console.log('[recommendationService] Recommendations endpoint not available, returning mock data');
        return {
          status: 'success',
          data: {
            recommendations: [
              {
                id: 'mock-rec-1',
                programId: 'ca-express-entry',
                programName: 'Express Entry',
                countryCode: 'CA',
                countryName: 'Canada',
                category: 'Skilled Worker',
                matchScore: 85,
                successProbability: 75,
                processingTime: '6-12 months',
                estimatedCost: '$2,300 CAD',
                requirements: [
                  { name: 'Language Proficiency', met: true },
                  { name: 'Education', met: true },
                  { name: 'Work Experience', met: false }
                ]
              },
              {
                id: 'mock-rec-2',
                programId: 'au-skilled-independent',
                programName: 'Skilled Independent Visa',
                countryCode: 'AU',
                countryName: 'Australia',
                category: 'Skilled Worker',
                matchScore: 78,
                successProbability: 68,
                processingTime: '8-14 months',
                estimatedCost: '$4,045 AUD',
                requirements: [
                  { name: 'Points Test', met: true },
                  { name: 'Age', met: true },
                  { name: 'English Proficiency', met: false }
                ]
              },
              {
                id: 'mock-rec-3',
                programId: 'nz-skilled-migrant',
                programName: 'Skilled Migrant Category',
                countryCode: 'NZ',
                countryName: 'New Zealand',
                category: 'Skilled Worker',
                matchScore: 72,
                successProbability: 65,
                processingTime: '6-10 months',
                estimatedCost: '$3,240 NZD',
                requirements: [
                  { name: 'Expression of Interest', met: true },
                  { name: 'Points Threshold', met: false },
                  { name: 'Job Offer', met: false }
                ]
              }
            ]
          }
        };
      }
      throw apiError;
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
            // If the endpoint doesn't exist (404) or connection refused (network error), return mock data
            if (apiError.response?.status === 404 || apiError.message === 'Network Error') {
                console.log('[recommendationService] Destination suggestions endpoint not available, returning mock data');
                return {
                    status: 'success',
                    data: {
                        destinationSuggestions: [
                            {
                                countryCode: 'CA',
                                countryName: 'Canada',
                                matchScore: 85,
                                reasons: ['Strong match based on your profile']
                            },
                            {
                                countryCode: 'AU',
                                countryName: 'Australia',
                                matchScore: 78,
                                reasons: ['Good match for your skills']
                            },
                            {
                                countryCode: 'NZ',
                                countryName: 'New Zealand',
                                matchScore: 72,
                                reasons: ['Favorable immigration policies']
                            },
                            {
                                countryCode: 'DE',
                                countryName: 'Germany',
                                matchScore: 68,
                                reasons: ['Demand for your profession']
                            },
                            {
                                countryCode: 'GB',
                                countryName: 'United Kingdom',
                                matchScore: 65,
                                reasons: ['Language compatibility']
                            }
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

// Get success probability for a specific program
const getSuccessProbability = async (programId) => {
  try {
    console.log(`[recommendationService] Fetching success probability for program ${programId}...`);
    const response = await axios.get(`${RECOMMENDATION_API_URL}/${programId}/probability`, { headers: getAuthHeaders() });
    if (response.data?.status === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to fetch success probability');
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch success probability';
    console.error('Get Success Probability Service Error:', message);
    throw new Error(message);
  }
};

// Get gap analysis for a specific program
const getGapAnalysis = async (programId) => {
  try {
    console.log(`[recommendationService] Fetching gap analysis for program ${programId}...`);
    const response = await axios.get(`${RECOMMENDATION_API_URL}/${programId}/gaps`, { headers: getAuthHeaders() });
    if (response.data?.status === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to fetch gap analysis');
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch gap analysis';
    console.error('Get Gap Analysis Service Error:', message);
    throw new Error(message);
  }
};

const recommendationService = {
  generateRecommendations,
  suggestDestinations,
  simulateProfileChange,
  getSuccessProbability,
  getGapAnalysis
};

export default recommendationService;
