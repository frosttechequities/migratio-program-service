import { configureStore } from '@reduxjs/toolkit';
import chatbotReducer, {
  addUserMessage,
  setContext,
  addRecentActivity,
  clearMessages,
  setTyping,
  resetActiveWorkflow,
  sendMessage,
  createConversation,
  getConversationHistory,
  getConversations,
  deleteConversation,
  getGuidedWorkflows,
  startGuidedWorkflow,
  selectMessages,
  selectConversation,
  selectConversations,
  selectSuggestions,
  selectIsTyping,
  selectContext,
  selectGuidedWorkflows,
  selectActiveWorkflow,
  selectChatbotLoading,
  selectChatbotError
} from '../chatbotSlice';

// Mock chatbot service
jest.mock('../services/chatbotService', () => ({
  sendMessage: jest.fn(),
  createConversation: jest.fn(),
  getConversationHistory: jest.fn(),
  getConversations: jest.fn(),
  deleteConversation: jest.fn(),
  getGuidedWorkflows: jest.fn(),
  startGuidedWorkflow: jest.fn()
}));

// Import mocked service
import chatbotService from '../services/chatbotService';

describe('chatbotSlice', () => {
  let store;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create store
    store = configureStore({
      reducer: {
        chatbot: chatbotReducer
      }
    });
  });
  
  describe('initial state', () => {
    test('should have the correct initial state', () => {
      const state = store.getState().chatbot;
      
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(false);
      expect(state.isError).toBe(false);
      expect(state.error).toBeNull();
      expect(state.messages).toEqual([]);
      expect(state.conversation).toEqual({
        id: null,
        title: 'New Conversation',
        createdAt: null,
        updatedAt: null
      });
      expect(state.conversations).toEqual([]);
      expect(state.suggestions).toEqual([]);
      expect(state.isTyping).toBe(false);
      expect(state.context).toEqual({
        currentPage: null,
        selectedProgram: null,
        userProfile: null,
        recentActivity: []
      });
      expect(state.guidedWorkflows).toEqual([]);
      expect(state.activeWorkflow).toBeNull();
    });
  });
  
  describe('reducers', () => {
    test('addUserMessage should add a user message to the messages array', () => {
      const message = 'Hello, I need help';
      
      store.dispatch(addUserMessage(message));
      
      const state = store.getState().chatbot;
      
      // Verify message was added
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0].content).toBe(message);
      expect(state.messages[0].sender).toBe('user');
      expect(state.messages[0].id).toBeDefined();
      expect(state.messages[0].timestamp).toBeDefined();
    });
    
    test('setContext should update the context object', () => {
      const context = {
        currentPage: 'dashboard',
        selectedProgram: { id: 'program1', name: 'Express Entry' }
      };
      
      store.dispatch(setContext(context));
      
      const state = store.getState().chatbot;
      
      // Verify context was updated
      expect(state.context.currentPage).toBe('dashboard');
      expect(state.context.selectedProgram).toEqual({ id: 'program1', name: 'Express Entry' });
      expect(state.context.userProfile).toBeNull(); // Other properties should remain
    });
    
    test('addRecentActivity should add activity to the recentActivity array', () => {
      const activity = {
        type: 'document_upload',
        documentId: 'doc1',
        timestamp: '2023-01-01T00:00:00Z'
      };
      
      store.dispatch(addRecentActivity(activity));
      
      const state = store.getState().chatbot;
      
      // Verify activity was added
      expect(state.context.recentActivity).toHaveLength(1);
      expect(state.context.recentActivity[0]).toEqual(activity);
    });
    
    test('addRecentActivity should limit the array to 10 items', () => {
      // Add 11 activities
      for (let i = 0; i < 11; i++) {
        store.dispatch(addRecentActivity({ type: `activity${i}` }));
      }
      
      const state = store.getState().chatbot;
      
      // Verify only 10 activities are kept
      expect(state.context.recentActivity).toHaveLength(10);
      
      // Verify the oldest activity was removed
      expect(state.context.recentActivity[0].type).toBe('activity10');
      expect(state.context.recentActivity[9].type).toBe('activity1');
    });
    
    test('clearMessages should empty the messages array', () => {
      // Add a message first
      store.dispatch(addUserMessage('Test message'));
      
      // Then clear messages
      store.dispatch(clearMessages());
      
      const state = store.getState().chatbot;
      
      // Verify messages array is empty
      expect(state.messages).toHaveLength(0);
    });
    
    test('setTyping should update the isTyping state', () => {
      store.dispatch(setTyping(true));
      
      const state = store.getState().chatbot;
      
      // Verify isTyping is true
      expect(state.isTyping).toBe(true);
      
      // Set to false
      store.dispatch(setTyping(false));
      
      const updatedState = store.getState().chatbot;
      
      // Verify isTyping is false
      expect(updatedState.isTyping).toBe(false);
    });
    
    test('resetActiveWorkflow should set activeWorkflow to null', () => {
      // Set up initial state with an active workflow
      store = configureStore({
        reducer: {
          chatbot: chatbotReducer
        },
        preloadedState: {
          chatbot: {
            ...store.getState().chatbot,
            activeWorkflow: {
              id: 'workflow1',
              title: 'Test Workflow',
              currentStep: 1,
              totalSteps: 3
            }
          }
        }
      });
      
      // Reset active workflow
      store.dispatch(resetActiveWorkflow());
      
      const state = store.getState().chatbot;
      
      // Verify activeWorkflow is null
      expect(state.activeWorkflow).toBeNull();
    });
  });
  
  describe('async thunks', () => {
    test('sendMessage should call service and update state on success', async () => {
      const userMessage = 'Hello, I need help';
      const botResponse = {
        id: 'msg1',
        content: 'How can I help you?',
        timestamp: '2023-01-01T00:00:00Z',
        suggestions: ['What documents do I need?', 'How long does the process take?']
      };
      
      chatbotService.sendMessage.mockResolvedValue(botResponse);
      
      await store.dispatch(sendMessage(userMessage));
      
      const state = store.getState().chatbot;
      
      // Verify service was called
      expect(chatbotService.sendMessage).toHaveBeenCalledWith(userMessage, null, expect.any(Object));
      
      // Verify state was updated
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.isTyping).toBe(false);
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0].content).toBe('How can I help you?');
      expect(state.messages[0].sender).toBe('assistant');
      expect(state.suggestions).toEqual(['What documents do I need?', 'How long does the process take?']);
    });
    
    test('sendMessage should handle errors', async () => {
      const errorMessage = 'Failed to send message';
      chatbotService.sendMessage.mockRejectedValue(new Error(errorMessage));
      
      await store.dispatch(sendMessage('Test message'));
      
      const state = store.getState().chatbot;
      
      // Verify error state
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.isTyping).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
    
    test('createConversation should call service and update state on success', async () => {
      const mockConversation = {
        id: 'conv1',
        title: 'New Conversation',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      chatbotService.createConversation.mockResolvedValue(mockConversation);
      
      await store.dispatch(createConversation());
      
      const state = store.getState().chatbot;
      
      // Verify service was called
      expect(chatbotService.createConversation).toHaveBeenCalledWith('New Conversation');
      
      // Verify state was updated
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.conversation).toEqual(mockConversation);
      expect(state.messages).toEqual([]);
    });
    
    test('getConversationHistory should call service and update state on success', async () => {
      const mockHistory = {
        id: 'conv1',
        title: 'Test Conversation',
        messages: [
          {
            id: 'msg1',
            content: 'Hello',
            sender: 'user',
            timestamp: '2023-01-01T00:00:00Z'
          },
          {
            id: 'msg2',
            content: 'Hi there',
            sender: 'assistant',
            timestamp: '2023-01-01T00:01:00Z'
          }
        ],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:01:00Z'
      };
      
      chatbotService.getConversationHistory.mockResolvedValue(mockHistory);
      
      await store.dispatch(getConversationHistory('conv1'));
      
      const state = store.getState().chatbot;
      
      // Verify service was called
      expect(chatbotService.getConversationHistory).toHaveBeenCalledWith('conv1');
      
      // Verify state was updated
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.messages).toEqual(mockHistory.messages);
      expect(state.conversation).toEqual({
        id: mockHistory.id,
        title: mockHistory.title,
        createdAt: mockHistory.createdAt,
        updatedAt: mockHistory.updatedAt
      });
    });
    
    test('getConversations should call service and update state on success', async () => {
      const mockConversations = [
        {
          id: 'conv1',
          title: 'Test Conversation 1',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:01:00Z'
        },
        {
          id: 'conv2',
          title: 'Test Conversation 2',
          createdAt: '2023-01-02T00:00:00Z',
          updatedAt: '2023-01-02T00:01:00Z'
        }
      ];
      
      chatbotService.getConversations.mockResolvedValue(mockConversations);
      
      await store.dispatch(getConversations());
      
      const state = store.getState().chatbot;
      
      // Verify service was called
      expect(chatbotService.getConversations).toHaveBeenCalled();
      
      // Verify state was updated
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.conversations).toEqual(mockConversations);
    });
    
    test('deleteConversation should call service and update state on success', async () => {
      // Set up initial state with conversations
      store = configureStore({
        reducer: {
          chatbot: chatbotReducer
        },
        preloadedState: {
          chatbot: {
            ...store.getState().chatbot,
            conversations: [
              { id: 'conv1', title: 'Test Conversation 1' },
              { id: 'conv2', title: 'Test Conversation 2' }
            ],
            conversation: {
              id: 'conv1',
              title: 'Test Conversation 1'
            }
          }
        }
      });
      
      chatbotService.deleteConversation.mockResolvedValue({ success: true });
      
      await store.dispatch(deleteConversation('conv1'));
      
      const state = store.getState().chatbot;
      
      // Verify service was called
      expect(chatbotService.deleteConversation).toHaveBeenCalledWith('conv1');
      
      // Verify state was updated
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.conversations).toHaveLength(1);
      expect(state.conversations[0].id).toBe('conv2');
      
      // Verify current conversation was reset
      expect(state.conversation).toEqual({
        id: null,
        title: 'New Conversation',
        createdAt: null,
        updatedAt: null
      });
      expect(state.messages).toEqual([]);
    });
    
    test('getGuidedWorkflows should call service and update state on success', async () => {
      const mockWorkflows = [
        {
          id: 'workflow1',
          title: 'Express Entry Guide',
          description: 'Step-by-step guide to applying for Express Entry',
          steps: 5
        },
        {
          id: 'workflow2',
          title: 'Document Checklist',
          description: 'Create a personalized document checklist',
          steps: 3
        }
      ];
      
      chatbotService.getGuidedWorkflows.mockResolvedValue(mockWorkflows);
      
      await store.dispatch(getGuidedWorkflows());
      
      const state = store.getState().chatbot;
      
      // Verify service was called
      expect(chatbotService.getGuidedWorkflows).toHaveBeenCalled();
      
      // Verify state was updated
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.guidedWorkflows).toEqual(mockWorkflows);
    });
    
    test('startGuidedWorkflow should call service and update state on success', async () => {
      const mockWorkflow = {
        id: 'workflow1',
        title: 'Express Entry Guide',
        currentStep: 1,
        totalSteps: 5,
        initialMessage: 'Welcome to the Express Entry Guide!',
        steps: [
          { id: 1, title: 'Check Eligibility' },
          { id: 2, title: 'Create Express Entry Profile' }
        ]
      };
      
      chatbotService.startGuidedWorkflow.mockResolvedValue(mockWorkflow);
      
      await store.dispatch(startGuidedWorkflow('workflow1'));
      
      const state = store.getState().chatbot;
      
      // Verify service was called
      expect(chatbotService.startGuidedWorkflow).toHaveBeenCalledWith('workflow1');
      
      // Verify state was updated
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.activeWorkflow).toEqual(mockWorkflow);
      
      // Verify initial message was added
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0].content).toBe('Welcome to the Express Entry Guide!');
      expect(state.messages[0].sender).toBe('assistant');
    });
  });
  
  describe('selectors', () => {
    test('selectMessages should return the messages array', () => {
      const state = {
        chatbot: {
          messages: [{ id: 'msg1', content: 'Test message' }]
        }
      };
      
      const result = selectMessages(state);
      
      expect(result).toEqual([{ id: 'msg1', content: 'Test message' }]);
    });
    
    test('selectConversation should return the conversation object', () => {
      const state = {
        chatbot: {
          conversation: { id: 'conv1', title: 'Test Conversation' }
        }
      };
      
      const result = selectConversation(state);
      
      expect(result).toEqual({ id: 'conv1', title: 'Test Conversation' });
    });
    
    test('selectConversations should return the conversations array', () => {
      const state = {
        chatbot: {
          conversations: [{ id: 'conv1', title: 'Test Conversation' }]
        }
      };
      
      const result = selectConversations(state);
      
      expect(result).toEqual([{ id: 'conv1', title: 'Test Conversation' }]);
    });
    
    test('selectSuggestions should return the suggestions array', () => {
      const state = {
        chatbot: {
          suggestions: ['What documents do I need?', 'How long does the process take?']
        }
      };
      
      const result = selectSuggestions(state);
      
      expect(result).toEqual(['What documents do I need?', 'How long does the process take?']);
    });
    
    test('selectIsTyping should return the isTyping state', () => {
      const state = {
        chatbot: {
          isTyping: true
        }
      };
      
      const result = selectIsTyping(state);
      
      expect(result).toBe(true);
    });
    
    test('selectContext should return the context object', () => {
      const state = {
        chatbot: {
          context: {
            currentPage: 'dashboard',
            selectedProgram: { id: 'program1' }
          }
        }
      };
      
      const result = selectContext(state);
      
      expect(result).toEqual({
        currentPage: 'dashboard',
        selectedProgram: { id: 'program1' }
      });
    });
    
    test('selectGuidedWorkflows should return the guidedWorkflows array', () => {
      const state = {
        chatbot: {
          guidedWorkflows: [{ id: 'workflow1', title: 'Test Workflow' }]
        }
      };
      
      const result = selectGuidedWorkflows(state);
      
      expect(result).toEqual([{ id: 'workflow1', title: 'Test Workflow' }]);
    });
    
    test('selectActiveWorkflow should return the activeWorkflow object', () => {
      const state = {
        chatbot: {
          activeWorkflow: { id: 'workflow1', title: 'Test Workflow' }
        }
      };
      
      const result = selectActiveWorkflow(state);
      
      expect(result).toEqual({ id: 'workflow1', title: 'Test Workflow' });
    });
    
    test('selectChatbotLoading should return the loading state', () => {
      const state = {
        chatbot: {
          isLoading: true
        }
      };
      
      const result = selectChatbotLoading(state);
      
      expect(result).toBe(true);
    });
    
    test('selectChatbotError should return the error state', () => {
      const state = {
        chatbot: {
          error: 'Test error'
        }
      };
      
      const result = selectChatbotError(state);
      
      expect(result).toBe('Test error');
    });
  });
});
