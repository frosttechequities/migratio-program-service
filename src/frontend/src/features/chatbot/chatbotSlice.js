import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatbotService from './services/chatbotService';
import { setMessage } from '../ui/uiSlice';

// Initial state
const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  messages: [],
  conversation: {
    id: null,
    title: 'New Conversation',
    createdAt: null,
    updatedAt: null
  },
  conversations: [],
  suggestions: [],
  isTyping: false,
  context: {
    currentPage: null,
    selectedProgram: null,
    userProfile: null,
    recentActivity: []
  },
  guidedWorkflows: [],
  activeWorkflow: null
};

// Send message to chatbot
export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async (message, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const conversationId = state.chatbot.conversation.id;
      const context = state.chatbot.context;
      
      const response = await chatbotService.sendMessage(message, conversationId, context);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send message';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new conversation
export const createConversation = createAsyncThunk(
  'chatbot/createConversation',
  async (title = 'New Conversation', thunkAPI) => {
    try {
      const response = await chatbotService.createConversation(title);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create conversation';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get conversation history
export const getConversationHistory = createAsyncThunk(
  'chatbot/getConversationHistory',
  async (conversationId, thunkAPI) => {
    try {
      const response = await chatbotService.getConversationHistory(conversationId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to get conversation history';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all conversations
export const getConversations = createAsyncThunk(
  'chatbot/getConversations',
  async (_, thunkAPI) => {
    try {
      const response = await chatbotService.getConversations();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to get conversations';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete conversation
export const deleteConversation = createAsyncThunk(
  'chatbot/deleteConversation',
  async (conversationId, thunkAPI) => {
    try {
      const response = await chatbotService.deleteConversation(conversationId);
      return { conversationId, ...response };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete conversation';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get guided workflows
export const getGuidedWorkflows = createAsyncThunk(
  'chatbot/getGuidedWorkflows',
  async (_, thunkAPI) => {
    try {
      const response = await chatbotService.getGuidedWorkflows();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to get guided workflows';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Start guided workflow
export const startGuidedWorkflow = createAsyncThunk(
  'chatbot/startGuidedWorkflow',
  async (workflowId, thunkAPI) => {
    try {
      const response = await chatbotService.startGuidedWorkflow(workflowId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to start guided workflow';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Chatbot slice
const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    // Add user message to chat
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        content: action.payload,
        sender: 'user',
        timestamp: new Date().toISOString()
      });
    },
    
    // Set context
    setContext: (state, action) => {
      state.context = {
        ...state.context,
        ...action.payload
      };
    },
    
    // Add to recent activity
    addRecentActivity: (state, action) => {
      state.context.recentActivity = [
        action.payload,
        ...state.context.recentActivity.slice(0, 9) // Keep only 10 most recent activities
      ];
    },
    
    // Clear messages
    clearMessages: (state) => {
      state.messages = [];
    },
    
    // Set typing status
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    
    // Reset active workflow
    resetActiveWorkflow: (state) => {
      state.activeWorkflow = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isTyping = false;
        state.messages.push({
          id: action.payload.id || Date.now().toString(),
          content: action.payload.content,
          sender: 'assistant',
          timestamp: action.payload.timestamp || new Date().toISOString()
        });
        
        // Add suggestions if available
        if (action.payload.suggestions) {
          state.suggestions = action.payload.suggestions;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isTyping = false;
        state.error = action.payload;
      })
      
      // Create conversation
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.conversation = action.payload;
        state.messages = [];
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get conversation history
      .addCase(getConversationHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversationHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages = action.payload.messages;
        state.conversation = {
          id: action.payload.id,
          title: action.payload.title,
          createdAt: action.payload.createdAt,
          updatedAt: action.payload.updatedAt
        };
      })
      .addCase(getConversationHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get all conversations
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Delete conversation
      .addCase(deleteConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.conversations = state.conversations.filter(
          conversation => conversation.id !== action.payload.conversationId
        );
        
        // If the deleted conversation is the current one, reset current conversation
        if (state.conversation.id === action.payload.conversationId) {
          state.conversation = {
            id: null,
            title: 'New Conversation',
            createdAt: null,
            updatedAt: null
          };
          state.messages = [];
        }
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get guided workflows
      .addCase(getGuidedWorkflows.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGuidedWorkflows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.guidedWorkflows = action.payload;
      })
      .addCase(getGuidedWorkflows.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Start guided workflow
      .addCase(startGuidedWorkflow.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startGuidedWorkflow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.activeWorkflow = action.payload;
        
        // Add initial message from workflow if available
        if (action.payload.initialMessage) {
          state.messages.push({
            id: Date.now().toString(),
            content: action.payload.initialMessage,
            sender: 'assistant',
            timestamp: new Date().toISOString()
          });
        }
      })
      .addCase(startGuidedWorkflow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  addUserMessage, 
  setContext, 
  addRecentActivity, 
  clearMessages, 
  setTyping,
  resetActiveWorkflow
} = chatbotSlice.actions;

// Export selectors
export const selectMessages = (state) => state.chatbot.messages;
export const selectConversation = (state) => state.chatbot.conversation;
export const selectConversations = (state) => state.chatbot.conversations;
export const selectSuggestions = (state) => state.chatbot.suggestions;
export const selectIsTyping = (state) => state.chatbot.isTyping;
export const selectContext = (state) => state.chatbot.context;
export const selectGuidedWorkflows = (state) => state.chatbot.guidedWorkflows;
export const selectActiveWorkflow = (state) => state.chatbot.activeWorkflow;
export const selectChatbotLoading = (state) => state.chatbot.isLoading;
export const selectChatbotError = (state) => state.chatbot.error;

export default chatbotSlice.reducer;
