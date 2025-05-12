import axios from 'axios';

// Adjust the API_URL to point to your program service endpoint for comparison
// This might be directly to the program service or via an API gateway
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'; // Assuming gateway at 8000
const PROGRAM_SERVICE_API_URL = `${API_BASE_URL}/programs`; // Or specific if gateway routes differently

/**
 * Fetches programs for comparison by their IDs.
 * @param {string[]} programIds - An array of program IDs.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of program data formatted for comparison.
 */
const getProgramsForComparison = async (programIds) => {
  if (!programIds || programIds.length === 0) {
    return [];
  }
  const idsQueryParam = programIds.join(',');
  // The actual endpoint is /api/programs/compare?ids=...
  // If API_BASE_URL is gateway, and it routes /api/programs to program-service, then this is correct.
  // Otherwise, adjust PROGRAM_SERVICE_API_URL if needed.
  const response = await axios.get(`${PROGRAM_SERVICE_API_URL}/compare`, {
    params: {
      ids: idsQueryParam,
    },
    // Consider adding withCredentials: true if auth is needed and cookies are used
  });

  // Assuming the backend returns data in the structure: { status: 'success', data: { comparisonPrograms: [...] } }
  if (response.data && response.data.status === 'success') {
    return response.data.data.comparisonPrograms;
  } else {
    // Handle cases where response is not as expected or status is not 'success'
    throw new Error(response.data?.message || 'Failed to fetch programs for comparison');
  }
};

const comparisonService = {
  getProgramsForComparison,
};

export default comparisonService;
