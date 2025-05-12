import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils';

const PROGRAM_API_URL = process.env.REACT_APP_PROGRAM_SERVICE_URL || 'http://localhost:3004/api';

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

const getAllPrograms = async ({ country, category } = {}) => {
  try {
    const params = {};
    if (country) params.country = country;
    if (category) params.category = category;
    // Assuming public programs might not need auth, but including for consistency if some do
    const response = await axios.get(`${PROGRAM_API_URL}/programs`, { params, headers: getAuthHeaders() });
    return response.data; 
  } catch (error) {
    console.error('Get All Programs Service Error:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to get programs');
  }
};

const getProgramById = async (programId) => {
  try {
    const response = await axios.get(`${PROGRAM_API_URL}/programs/${programId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Get Program By ID Service Error:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to get program details');
  }
};

const getProgramCategories = async () => {
  try {
    // Typically public, but include headers in case of future changes
    const response = await axios.get(`${PROGRAM_API_URL}/programs/categories`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Get Program Categories Service Error:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to get program categories');
  }
};

const getProgramCountries = async () => {
  try {
    // Typically public
    const response = await axios.get(`${PROGRAM_API_URL}/programs/countries`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Get Program Countries Service Error:', error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Failed to get program countries');
  }
};

const programService = {
  getAllPrograms,
  getProgramById,
  getProgramCategories,
  getProgramCountries,
};

export default programService;
