import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils';

// API URL - Point to the Roadmap service endpoint
const API_URL = process.env.REACT_APP_ROADMAP_SERVICE_URL || 'http://localhost:3006/api'; // Roadmap service runs on 3006

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
 * Get all roadmaps for the user
 */
const getAllRoadmaps = async () => {
  try {
    console.log('[roadmapService] Fetching all roadmaps...');
    const response = await axios.get(`${API_URL}/roadmaps`, { headers: getAuthHeaders() });
    if (response.data && response.data.status === 'success') {
      return response.data; 
    } else {
      throw new Error(response.data?.message || 'Failed to fetch roadmaps');
    }
  } catch (error) {
    const message =
      (error.response?.data?.message) || error.message || error.toString();
    console.error('Get All Roadmaps Service Error:', message);
    throw new Error(message);
  }
};

/**
 * Get a specific roadmap by ID
 */
const getRoadmapById = async (roadmapId) => {
  if (!roadmapId) {
    throw new Error('Roadmap ID is required');
  }
  try {
    console.log(`[roadmapService] Fetching roadmap ${roadmapId}...`);
    const response = await axios.get(`${API_URL}/roadmaps/${roadmapId}`, { headers: getAuthHeaders() });
    if (response.data && response.data.status === 'success') {
       return response.data; 
    } else {
      throw new Error(response.data?.message || `Failed to fetch roadmap ${roadmapId}`);
    }
  } catch (error) {
     const message =
      (error.response?.data?.message) || error.message || error.toString();
    console.error(`Get Roadmap By ID Service Error (${roadmapId}):`, message);
    throw new Error(message);
  }
};

/**
 * Updates the status of a specific task within a roadmap.
 */
const updateTaskStatus = async (roadmapId, phaseId, taskId, updateData) => {
  if (!roadmapId || !phaseId || !taskId || !updateData || !updateData.status) {
    throw new Error('Missing required parameters for updating task status.');
  }
  try {
    const url = `${API_URL}/roadmaps/${roadmapId}/phases/${phaseId}/tasks/${taskId}`;
    console.log(`[roadmapService] Updating task ${taskId} status to ${updateData.status} via PATCH ${url}`);
    const response = await axios.patch(url, updateData, { headers: getAuthHeaders() });

    if (response.data && response.data.status === 'success') {
      return response.data.data.updatedTask; 
    } else {
      throw new Error(response.data?.message || 'Failed to update task status');
    }
  } catch (error) {
    const message =
      (error.response?.data?.message) || error.message || error.toString();
    console.error(`Update Task Status Service Error (${taskId}):`, message);
    throw new Error(message);
  }
};

/**
 * Updates the status of a specific document requirement within a roadmap phase.
 */
const updateDocumentStatus = async (roadmapId, phaseId, docStatusId, updateData) => {
    if (!roadmapId || !phaseId || !docStatusId || !updateData || !updateData.status) {
        throw new Error('Missing required parameters for updating document status.');
    }
    try {
        const url = `${API_URL}/roadmaps/${roadmapId}/phases/${phaseId}/documents/${docStatusId}`;
        console.log(`[roadmapService] Updating document status ${docStatusId} to ${updateData.status} via PATCH ${url}`);
        const response = await axios.patch(url, updateData, { headers: getAuthHeaders() });

        if (response.data && response.data.status === 'success') {
            return response.data.data.updatedDocumentStatus; 
        } else {
            throw new Error(response.data?.message || 'Failed to update document status');
        }
    } catch (error) {
        const message =
            (error.response?.data?.message) || error.message || error.toString();
        console.error(`Update Document Status Service Error (${docStatusId}):`, message);
        throw new Error(message);
    }
};

// Placeholder for generateRoadmap if it's called from roadmapSlice
const generateRoadmap = async (roadmapData) => {
  console.warn('generateRoadmap service function in roadmapService.js needs implementation if used.');
  // Example structure, adjust based on actual API
  // try {
  //   const response = await axios.post(`${API_URL}/roadmaps`, roadmapData, { headers: getAuthHeaders() });
  //   if (response.data && response.data.status === 'success') {
  //     return response.data;
  //   } else {
  //     throw new Error(response.data?.message || 'Failed to generate roadmap');
  //   }
  // } catch (error) {
  //   const message = (error.response?.data?.message) || error.message || error.toString();
  //   console.error('Generate Roadmap Service Error:', message);
  //   throw new Error(message);
  // }
  return Promise.reject(new Error('generateRoadmap not implemented in roadmapService'));
};


const roadmapService = {
  getAllRoadmaps,
  getRoadmapById,
  updateTaskStatus,
  updateDocumentStatus,
  generateRoadmap, // Added placeholder
};

export default roadmapService;
