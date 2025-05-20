import axios from 'axios';
import { API_URL } from '../../../config';

/**
 * Personalization service
 * Handles API calls related to user preferences and personalization
 */
const personalizationService = {
  /**
   * Get user preferences from the API
   * @returns {Promise<Object>} User preferences
   */
  getUserPreferences: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/preferences`);
      return response.data;
    } catch (error) {
      // If API call fails, try to get from localStorage
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        return JSON.parse(storedPreferences);
      }
      throw error;
    }
  },

  /**
   * Save user preferences to the API
   * @param {Object} preferences - User preferences to save
   * @returns {Promise<Object>} Updated user preferences
   */
  saveUserPreferences: async (preferences) => {
    try {
      const response = await axios.put(`${API_URL}/user/preferences`, preferences);
      return response.data;
    } catch (error) {
      // If API call fails, save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      return preferences;
    }
  },

  /**
   * Save dashboard view to the API
   * @param {Object} view - Dashboard view to save
   * @returns {Promise<Object>} Saved dashboard view
   */
  saveDashboardView: async (view) => {
    try {
      const response = await axios.post(`${API_URL}/user/dashboard-views`, view);
      return response.data;
    } catch (error) {
      // If API call fails, save to localStorage
      const storedViews = localStorage.getItem('dashboardViews');
      const views = storedViews ? JSON.parse(storedViews) : [];
      const newView = {
        ...view,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const updatedViews = [...views, newView];
      localStorage.setItem('dashboardViews', JSON.stringify(updatedViews));
      return newView;
    }
  },

  /**
   * Delete dashboard view from the API
   * @param {string} viewId - ID of the dashboard view to delete
   * @returns {Promise<Object>} Response data
   */
  deleteDashboardView: async (viewId) => {
    try {
      const response = await axios.delete(`${API_URL}/user/dashboard-views/${viewId}`);
      return response.data;
    } catch (error) {
      // If API call fails, delete from localStorage
      const storedViews = localStorage.getItem('dashboardViews');
      if (storedViews) {
        const views = JSON.parse(storedViews);
        const updatedViews = views.filter(view => view.id !== viewId);
        localStorage.setItem('dashboardViews', JSON.stringify(updatedViews));
      }
      return { success: true };
    }
  },

  /**
   * Get dashboard views from the API
   * @returns {Promise<Array>} Dashboard views
   */
  getDashboardViews: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/dashboard-views`);
      return response.data;
    } catch (error) {
      // If API call fails, try to get from localStorage
      const storedViews = localStorage.getItem('dashboardViews');
      if (storedViews) {
        return JSON.parse(storedViews);
      }
      return [];
    }
  },

  /**
   * Apply theme preferences to the document
   * @param {Object} displayPreferences - Display preferences
   */
  applyThemePreferences: (displayPreferences) => {
    const { theme, fontSize, density } = displayPreferences;
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply font size
    document.documentElement.setAttribute('data-font-size', fontSize);
    
    // Apply density
    document.documentElement.setAttribute('data-density', density);
  }
};

export default personalizationService;
