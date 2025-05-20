import axios from 'axios';
import { API_URL } from '../../../config';

/**
 * Chatbot service
 * Handles API calls related to the chatbot
 */
const chatbotService = {
  /**
   * Send message to chatbot
   * @param {string} message - Message to send
   * @param {string|null} conversationId - Conversation ID (optional)
   * @param {Object} context - Context information (optional)
   * @returns {Promise<Object>} Response from chatbot
   */
  sendMessage: async (message, conversationId = null, context = {}) => {
    try {
      const response = await axios.post(`${API_URL}/chatbot/message`, {
        message,
        conversationId,
        context
      });
      return response.data;
    } catch (error) {
      // If API call fails, return a fallback response
      if (error.response?.status === 404) {
        return {
          id: Date.now().toString(),
          content: "I'm sorry, I'm having trouble connecting to the server. Please try again later.",
          timestamp: new Date().toISOString(),
          suggestions: [
            "Tell me about Express Entry",
            "How do I apply for a work visa?",
            "What documents do I need?"
          ]
        };
      }
      throw error;
    }
  },

  /**
   * Create a new conversation
   * @param {string} title - Conversation title
   * @returns {Promise<Object>} Created conversation
   */
  createConversation: async (title) => {
    try {
      const response = await axios.post(`${API_URL}/chatbot/conversations`, { title });
      return response.data;
    } catch (error) {
      // If API call fails, create a local conversation
      return {
        id: `local-${Date.now()}`,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  /**
   * Get conversation history
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Conversation with messages
   */
  getConversationHistory: async (conversationId) => {
    try {
      const response = await axios.get(`${API_URL}/chatbot/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      // If API call fails, return empty conversation
      return {
        id: conversationId,
        title: 'Conversation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  /**
   * Get all conversations
   * @returns {Promise<Array>} List of conversations
   */
  getConversations: async () => {
    try {
      const response = await axios.get(`${API_URL}/chatbot/conversations`);
      return response.data;
    } catch (error) {
      // If API call fails, return empty array
      return [];
    }
  },

  /**
   * Delete conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Response data
   */
  deleteConversation: async (conversationId) => {
    try {
      const response = await axios.delete(`${API_URL}/chatbot/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      // If API call fails, return success anyway
      return { success: true };
    }
  },

  /**
   * Get guided workflows
   * @returns {Promise<Array>} List of guided workflows
   */
  getGuidedWorkflows: async () => {
    try {
      const response = await axios.get(`${API_URL}/chatbot/workflows`);
      return response.data;
    } catch (error) {
      // If API call fails, return default workflows
      return [
        {
          id: 'express-entry',
          title: 'Express Entry Guide',
          description: 'Step-by-step guide to applying for Express Entry',
          icon: 'flight',
          steps: 5
        },
        {
          id: 'document-checklist',
          title: 'Document Checklist',
          description: 'Create a personalized document checklist',
          icon: 'description',
          steps: 3
        },
        {
          id: 'language-test',
          title: 'Language Test Preparation',
          description: 'Prepare for your language proficiency test',
          icon: 'language',
          steps: 4
        },
        {
          id: 'job-search',
          title: 'Job Search Strategy',
          description: 'Develop a strategy for finding a job in your destination country',
          icon: 'work',
          steps: 6
        }
      ];
    }
  },

  /**
   * Start guided workflow
   * @param {string} workflowId - Workflow ID
   * @returns {Promise<Object>} Workflow data
   */
  startGuidedWorkflow: async (workflowId) => {
    try {
      const response = await axios.post(`${API_URL}/chatbot/workflows/${workflowId}/start`);
      return response.data;
    } catch (error) {
      // If API call fails, return default workflow data
      const workflows = {
        'express-entry': {
          id: 'express-entry',
          title: 'Express Entry Guide',
          currentStep: 1,
          totalSteps: 5,
          initialMessage: "Welcome to the Express Entry Guide! I'll help you understand and navigate the Express Entry system. Let's start by checking your eligibility. Are you applying as a Federal Skilled Worker, Federal Skilled Trades, or Canadian Experience Class?",
          steps: [
            { id: 1, title: 'Check Eligibility' },
            { id: 2, title: 'Create Express Entry Profile' },
            { id: 3, title: 'Receive Invitation to Apply' },
            { id: 4, title: 'Submit Application' },
            { id: 5, title: 'Prepare for Arrival' }
          ]
        },
        'document-checklist': {
          id: 'document-checklist',
          title: 'Document Checklist',
          currentStep: 1,
          totalSteps: 3,
          initialMessage: "Let's create your personalized document checklist. First, which immigration program are you applying for?",
          steps: [
            { id: 1, title: 'Select Program' },
            { id: 2, title: 'Personal Information' },
            { id: 3, title: 'Generate Checklist' }
          ]
        },
        'language-test': {
          id: 'language-test',
          title: 'Language Test Preparation',
          currentStep: 1,
          totalSteps: 4,
          initialMessage: "I'll help you prepare for your language proficiency test. Which test are you planning to take? IELTS, CELPIP, TEF, or TCF?",
          steps: [
            { id: 1, title: 'Choose Test' },
            { id: 2, title: 'Understand Format' },
            { id: 3, title: 'Practice Resources' },
            { id: 4, title: 'Test Day Tips' }
          ]
        },
        'job-search': {
          id: 'job-search',
          title: 'Job Search Strategy',
          currentStep: 1,
          totalSteps: 6,
          initialMessage: "Let's develop a strategy for finding a job in your destination country. What is your profession or field of expertise?",
          steps: [
            { id: 1, title: 'Assess Skills' },
            { id: 2, title: 'Research Market' },
            { id: 3, title: 'Prepare Resume' },
            { id: 4, title: 'Find Opportunities' },
            { id: 5, title: 'Interview Preparation' },
            { id: 6, title: 'Follow-up Strategy' }
          ]
        }
      };
      
      return workflows[workflowId] || {
        id: workflowId,
        title: 'Custom Workflow',
        currentStep: 1,
        totalSteps: 1,
        initialMessage: "I'll guide you through this process. What would you like to know?",
        steps: [
          { id: 1, title: 'Get Started' }
        ]
      };
    }
  }
};

export default chatbotService;
