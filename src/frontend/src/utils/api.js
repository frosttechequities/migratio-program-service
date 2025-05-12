import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * API utility for making HTTP requests
 * Provides a centralized way to handle API requests with authentication
 */
const api = {
  /**
   * Get authentication token from local storage
   * @returns {string|null} JWT token or null if not found
   */
  getToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || null;
  },

  /**
   * Get headers with authentication token
   * @param {Object} additionalHeaders - Additional headers to include
   * @returns {Object} Headers object
   */
  getHeaders(additionalHeaders = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  },

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - URL parameters
   * @param {Object} headers - Additional headers
   * @returns {Promise} Axios response
   */
  async get(endpoint, params = {}, headers = {}) {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, {
        params,
        headers: this.getHeaders(headers)
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} headers - Additional headers
   * @returns {Promise} Axios response
   */
  async post(endpoint, data = {}, headers = {}) {
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, data, {
        headers: this.getHeaders(headers)
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} headers - Additional headers
   * @returns {Promise} Axios response
   */
  async put(endpoint, data = {}, headers = {}) {
    try {
      const response = await axios.put(`${API_URL}${endpoint}`, data, {
        headers: this.getHeaders(headers)
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - URL parameters
   * @param {Object} headers - Additional headers
   * @returns {Promise} Axios response
   */
  async delete(endpoint, params = {}, headers = {}) {
    try {
      const response = await axios.delete(`${API_URL}${endpoint}`, {
        params,
        headers: this.getHeaders(headers)
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  /**
   * Upload a file
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Axios response
   */
  async uploadFile(endpoint, formData, onProgress = null) {
    try {
      const token = this.getToken();
      const headers = {
        'Content-Type': 'multipart/form-data'
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const config = {
        headers,
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        } : undefined
      };

      const response = await axios.post(`${API_URL}${endpoint}`, formData, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  /**
   * Handle API errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Unauthorized - token expired or invalid
        // You might want to redirect to login or refresh token
        console.warn('Authentication error: Token may be expired');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
  }
};

export default api;
