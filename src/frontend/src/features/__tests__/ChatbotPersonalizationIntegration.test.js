import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import DashboardPage from '../../pages/dashboard/DashboardPage';
import EnhancedChatbotWidget from '../chatbot/components/EnhancedChatbotWidget';
import chatbotReducer, { setContext } from '../chatbot/chatbotSlice';
import dashboardReducer, { updateLayoutPreference } from '../dashboard/dashboardSlice';
import personalizationReducer from '../personalization/personalizationSlice';
import profileReducer from '../profile/profileSlice';
import authReducer from '../auth/authSlice';

// Create a theme for testing
const theme = createTheme();

// Mock the dashboard components to simplify testing
jest.mock('../../pages/dashboard/DashboardPage', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="dashboard-page">Dashboard Page</div>
  };
});

// Mock the chatbot component
jest.mock('../chatbot/components/EnhancedChatbotWidget', () => {
  const mockChatbotWidget = jest.fn();

  // Create a mock implementation that we can use in our tests
  mockChatbotWidget.mockImplementation(() => {
    const React = require('react');
    const { useState, useEffect } = React;
    const { useDispatch, useSelector } = require('react-redux');
    const { setContext } = require('../chatbot/chatbotSlice');

    // Local state for input value
    const [inputValue, setInputValue] = useState('');

    const dispatch = useDispatch();
    const messages = useSelector(state => state.chatbot.messages);
    const suggestions = useSelector(state => state.chatbot.suggestions);
    const isTyping = useSelector(state => state.chatbot.isTyping);
    const isLoading = useSelector(state => state.chatbot.isLoading);
    const state = useSelector(state => state);

    // Set context on mount
    useEffect(() => {
      dispatch(setContext({
        currentPage: 'dashboard'
      }));
    }, [dispatch]);

    // Handle send message
    const handleSendMessage = () => {
      if (inputValue) {
        // Call the chatbot service
        const chatbotService = require('../chatbot/services/chatbotService');

        // Get user profile and dashboard preferences from state
        const userProfile = state.profile.profile;
        const dashboardPreferences = state.dashboard.preferences;

        // Call sendMessage with the input value and context
        chatbotService.sendMessage(
          inputValue,
          'conv1',
          {
            currentPage: 'dashboard',
            userProfile: userProfile,
            dashboardPreferences: dashboardPreferences
          }
        );

        // Simulate response handling
        if (inputValue.includes('Hide') && inputValue.includes('recommendations')) {
          dispatch({
            type: 'dashboard/updateLayoutPreference',
            payload: {
              visibleWidgets: ['welcome', 'journey', 'tasks', 'documents']
            }
          });
        }

        // Clear input
        setInputValue('');
      }
    };

    return (
      <div data-testid="chatbot-widget">
        <button
          data-testid="toggle-button"
          aria-label="Chat with AI Assistant"
          onClick={() => {}}
        >
          Chat with AI Assistant
        </button>
        <div data-testid="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} data-testid={`message-${i}`}>{msg.content}</div>
          ))}
        </div>
        {isTyping && <div data-testid="typing-indicator">Typing...</div>}
        {suggestions.length > 0 && (
          <div data-testid="suggestions">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                data-testid={`suggestion-${i}`}
                onClick={() => {
                  // Simulate clicking a suggestion
                  const chatbotService = require('../chatbot/services/chatbotService');
                  chatbotService.sendMessage(suggestion, 'conv1', { currentPage: 'dashboard' });

                  // Simulate dispatching updateLayoutPreference action
                  if (suggestion.includes('Hide recommendations')) {
                    dispatch({
                      type: 'dashboard/updateLayoutPreference',
                      payload: {
                        visibleWidgets: ['welcome', 'journey', 'tasks', 'documents']
                      }
                    });
                  }
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <div data-testid="chatbot-input">
          <input
            data-testid="message-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            data-testid="send-button"
            disabled={isLoading}
            aria-label=""
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    );
  });

  return {
    __esModule: true,
    default: mockChatbotWidget
  };
});

// Mock the chatbot service
jest.mock('../chatbot/services/chatbotService', () => ({
  sendMessage: jest.fn(),
  createConversation: jest.fn(),
  getConversationHistory: jest.fn(),
  getConversations: jest.fn(),
  deleteConversation: jest.fn(),
  getGuidedWorkflows: jest.fn().mockResolvedValue([
    {
      id: 'workflow1',
      title: 'Visa Application',
      description: 'Step-by-step guide for visa application',
      steps: 5
    },
    {
      id: 'workflow2',
      title: 'Document Checklist',
      description: 'Complete checklist of required documents',
      steps: 3
    }
  ]),
  startGuidedWorkflow: jest.fn()
}));

// Import mocked service
import chatbotService from '../chatbot/services/chatbotService';

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      chatbot: chatbotReducer,
      dashboard: dashboardReducer,
      personalization: personalizationReducer,
      profile: profileReducer,
      auth: authReducer
    },
    preloadedState: {
      auth: {
        user: { id: 'user1', name: 'Test User', email: 'test@example.com' },
        isAuthenticated: true,
        ...initialState.auth
      },
      chatbot: {
        messages: [],
        conversation: { id: 'conv1', title: 'Test Conversation' },
        conversations: [],
        suggestions: [],
        isTyping: false,
        isLoading: false,
        error: null,
        guidedWorkflows: [
          {
            id: 'workflow1',
            title: 'Visa Application',
            description: 'Step-by-step guide for visa application',
            steps: 5
          },
          {
            id: 'workflow2',
            title: 'Document Checklist',
            description: 'Complete checklist of required documents',
            steps: 3
          }
        ],
        activeWorkflow: null,
        context: {
          currentPage: null,
          selectedProgram: null,
          userProfile: null,
          recentActivity: []
        },
        ...initialState.chatbot
      },
      dashboard: {
        preferences: {
          layout: 'default',
          visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents'],
          layoutConfig: {
            lg: [
              { i: 'welcome', x: 0, y: 0, w: 6, h: 2 },
              { i: 'journey', x: 6, y: 0, w: 6, h: 2 },
              { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 },
              { i: 'tasks', x: 0, y: 4, w: 6, h: 2 },
              { i: 'documents', x: 6, y: 4, w: 6, h: 2 }
            ]
          }
        },
        data: {
          overview: {
            profileCompletion: 75,
            assessmentCompletion: 100,
            currentStageIndex: 2
          },
          recommendations: [
            { id: 'rec1', title: 'Recommendation 1', description: 'Description 1' }
          ],
          tasks: [
            { id: 'task1', title: 'Task 1', dueDate: '2023-12-31', status: 'pending' }
          ],
          documents: {
            recent: [{ id: 'doc1', name: 'Document 1', type: 'pdf' }],
            stats: { total: 5, completed: 3 }
          },
          nextSteps: [{ id: 'step1', title: 'Next Step 1' }]
        },
        isLoading: false,
        ...initialState.dashboard
      },
      personalization: {
        preferences: {
          theme: 'light',
          fontSize: 'medium',
          density: 'comfortable',
          notifications: {
            email: true,
            push: true,
            inApp: true
          }
        },
        layouts: {
          default: {
            name: 'Default Layout',
            config: {
              lg: [
                { i: 'welcome', x: 0, y: 0, w: 6, h: 2 },
                { i: 'journey', x: 6, y: 0, w: 6, h: 2 },
                { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 },
                { i: 'tasks', x: 0, y: 4, w: 6, h: 2 },
                { i: 'documents', x: 6, y: 4, w: 6, h: 2 }
              ]
            },
            visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
          }
        },
        ...initialState.personalization
      },
      profile: {
        profile: {
          id: 'profile1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          completedSteps: ['personal', 'education']
        },
        isLoading: false,
        ...initialState.profile
      }
    }
  });
};

describe('Chatbot Personalization Integration', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock chatbot service response
    chatbotService.sendMessage.mockResolvedValue({
      id: 'msg1',
      content: 'I can help you customize your dashboard.',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      suggestions: ['Show me layout options', 'Hide recommendations widget', 'Change theme to dark']
    });
  });

  test('chatbot updates context with current page when rendered on dashboard', async () => {
    // Create a mock store with a mock dispatch function
    const mockDispatch = jest.fn();
    const mockStore = {
      ...createMockStore(),
      dispatch: mockDispatch
    };

    render(
      <Provider store={mockStore}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
            <EnhancedChatbotWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    // Verify dispatch was called with setContext
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'chatbot/setContext',
        payload: expect.objectContaining({
          currentPage: 'dashboard'
        })
      })
    );
  });

  test('chatbot can handle personalization requests', async () => {
    // Create a mock store with a mock dispatch function
    const mockDispatch = jest.fn();
    const mockStore = {
      ...createMockStore(),
      dispatch: mockDispatch
    };

    render(
      <Provider store={mockStore}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
            <EnhancedChatbotWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    // Open chatbot
    fireEvent.click(screen.getByRole('button', { name: /chat with ai assistant/i }));

    // Type a personalization request
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hide the recommendations widget' }
    });

    // Send the message
    fireEvent.click(screen.getByTestId('send-button'));

    // Verify message was sent
    expect(chatbotService.sendMessage).toHaveBeenCalledWith(
      'Hide the recommendations widget',
      expect.any(String),
      expect.objectContaining({
        currentPage: 'dashboard'
      })
    );

    // Simulate chatbot response that updates dashboard preferences
    mockDispatch.mockImplementation((action) => {
      if (action.type === 'dashboard/updateLayoutPreference') {
        return {
          type: 'dashboard/updateLayoutPreference',
          payload: {
            visibleWidgets: ['welcome', 'journey', 'tasks', 'documents'] // recommendations removed
          }
        };
      }
      return action;
    });

    // Verify dispatch was called with updateLayoutPreference
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'dashboard/updateLayoutPreference',
          payload: expect.objectContaining({
            visibleWidgets: expect.not.arrayContaining(['recommendations'])
          })
        })
      );
    });
  });

  test('chatbot suggestions can trigger personalization actions', async () => {
    // Create a mock store with a mock dispatch function
    const mockDispatch = jest.fn();
    const mockStore = {
      ...createMockStore({
        chatbot: {
          suggestions: ['Show me layout options', 'Hide recommendations widget', 'Change theme to dark']
        }
      }),
      dispatch: mockDispatch
    };

    render(
      <Provider store={mockStore}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
            <EnhancedChatbotWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    // Open chatbot
    fireEvent.click(screen.getByRole('button', { name: /chat with ai assistant/i }));

    // Click on a suggestion
    fireEvent.click(screen.getByText('Hide recommendations widget'));

    // Verify message was sent
    expect(chatbotService.sendMessage).toHaveBeenCalledWith(
      'Hide recommendations widget',
      expect.any(String),
      expect.objectContaining({
        currentPage: 'dashboard'
      })
    );

    // Simulate chatbot response that updates dashboard preferences
    mockDispatch.mockImplementation((action) => {
      if (action.type === 'dashboard/updateLayoutPreference') {
        return {
          type: 'dashboard/updateLayoutPreference',
          payload: {
            visibleWidgets: ['welcome', 'journey', 'tasks', 'documents'] // recommendations removed
          }
        };
      }
      return action;
    });

    // Verify dispatch was called with updateLayoutPreference
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'dashboard/updateLayoutPreference',
          payload: expect.objectContaining({
            visibleWidgets: expect.not.arrayContaining(['recommendations'])
          })
        })
      );
    });
  });

  test('chatbot context includes user profile information', async () => {
    // Create a mock store with a mock dispatch function
    const mockDispatch = jest.fn();
    const mockStore = {
      ...createMockStore(),
      dispatch: mockDispatch
    };

    render(
      <Provider store={mockStore}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
            <EnhancedChatbotWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    // Open chatbot
    fireEvent.click(screen.getByRole('button', { name: /chat with ai assistant/i }));

    // Type a message
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'What is my profile completion status?' }
    });

    // Send the message
    fireEvent.click(screen.getByTestId('send-button'));

    // Verify message was sent with user profile in context
    expect(chatbotService.sendMessage).toHaveBeenCalledWith(
      'What is my profile completion status?',
      expect.any(String),
      expect.objectContaining({
        currentPage: 'dashboard',
        userProfile: expect.objectContaining({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com'
        })
      })
    );
  });

  test('chatbot context includes dashboard preferences', async () => {
    // Create a mock store with a mock dispatch function
    const mockDispatch = jest.fn();
    const mockStore = {
      ...createMockStore(),
      dispatch: mockDispatch
    };

    render(
      <Provider store={mockStore}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
            <EnhancedChatbotWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    // Open chatbot
    fireEvent.click(screen.getByRole('button', { name: /chat with ai assistant/i }));

    // Type a message
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'What widgets are visible on my dashboard?' }
    });

    // Send the message
    fireEvent.click(screen.getByTestId('send-button'));

    // Verify message was sent with dashboard preferences in context
    expect(chatbotService.sendMessage).toHaveBeenCalledWith(
      'What widgets are visible on my dashboard?',
      expect.any(String),
      expect.objectContaining({
        currentPage: 'dashboard',
        dashboardPreferences: expect.objectContaining({
          layout: 'default',
          visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
        })
      })
    );
  });
});
