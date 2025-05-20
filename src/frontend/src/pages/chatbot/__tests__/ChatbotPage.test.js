import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import ChatbotPage from '../ChatbotPage';
import chatbotReducer, {
  sendMessage,
  addUserMessage,
  createConversation,
  getConversationHistory,
  getConversations,
  deleteConversation,
  getGuidedWorkflows,
  startGuidedWorkflow
} from '../../../features/chatbot/chatbotSlice';

// Create a theme for testing
const theme = createTheme();

// Mock data
const mockMessages = [
  {
    id: 'msg1',
    content: 'Hello! How can I help you today?',
    sender: 'assistant',
    timestamp: '2023-01-01T12:00:00Z'
  },
  {
    id: 'msg2',
    content: 'I need help with my visa application.',
    sender: 'user',
    timestamp: '2023-01-01T12:01:00Z'
  }
];

const mockSuggestions = [
  'What documents do I need?',
  'How long does the process take?',
  'What are the eligibility requirements?'
];

const mockConversation = {
  id: 'conv1',
  title: 'Visa Application Help',
  createdAt: '2023-01-01T12:00:00Z',
  updatedAt: '2023-01-01T12:01:00Z'
};

const mockConversations = [
  {
    id: 'conv1',
    title: 'Visa Application Help',
    createdAt: '2023-01-01T12:00:00Z',
    updatedAt: '2023-01-01T12:01:00Z'
  },
  {
    id: 'conv2',
    title: 'Express Entry Questions',
    createdAt: '2023-05-28T10:00:00Z',
    updatedAt: '2023-05-28T10:30:00Z'
  }
];

const mockGuidedWorkflows = [
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
  }
];

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      chatbot: chatbotReducer
    },
    preloadedState: {
      chatbot: {
        messages: mockMessages,
        conversation: mockConversation,
        conversations: mockConversations,
        suggestions: mockSuggestions,
        guidedWorkflows: mockGuidedWorkflows,
        isTyping: false,
        isLoading: false,
        error: null,
        activeWorkflow: null,
        ...initialState
      }
    }
  });
};

// Mock dispatch function
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn()
}));

// Wrapper component with router and store
const renderWithRouterAndStore = (ui, initialState = {}) => {
  return render(
    <Provider store={createMockStore(initialState)}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('ChatbotPage', () => {
  test('renders page title and description', () => {
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Verify title and description are rendered
    expect(screen.getByText('AI Immigration Assistant')).toBeInTheDocument();
    expect(screen.getByText('Get personalized guidance and answers to your immigration questions.')).toBeInTheDocument();
  });
  
  test('renders conversation history', () => {
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Verify conversation history is rendered
    expect(screen.getByText('Visa Application Help')).toBeInTheDocument();
    expect(screen.getByText('Express Entry Questions')).toBeInTheDocument();
  });
  
  test('renders guided workflows', async () => {
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Click on the Guides tab
    fireEvent.click(screen.getByRole('tab', { name: /guides/i }));
    
    // Verify guided workflows are rendered
    await waitFor(() => {
      expect(screen.getByText('Express Entry Guide')).toBeInTheDocument();
      expect(screen.getByText('Document Checklist')).toBeInTheDocument();
    });
  });
  
  test('renders messages', () => {
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Verify messages are rendered
    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    expect(screen.getByText('I need help with my visa application.')).toBeInTheDocument();
  });
  
  test('renders suggestions', () => {
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Verify suggestions are rendered
    expect(screen.getByText('What documents do I need?')).toBeInTheDocument();
    expect(screen.getByText('How long does the process take?')).toBeInTheDocument();
    expect(screen.getByText('What are the eligibility requirements?')).toBeInTheDocument();
  });
  
  test('handles sending a message', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Type a message
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hello, I need help with Express Entry' }
    });
    
    // Click send button
    fireEvent.click(screen.getByRole('button', { name: '' })); // Send button has no accessible name
    
    // Verify dispatch was called with addUserMessage and sendMessage
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(addUserMessage('Hello, I need help with Express Entry'));
    expect(mockDispatch).toHaveBeenCalledWith(sendMessage('Hello, I need help with Express Entry'));
  });
  
  test('handles clicking a suggestion', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Click on a suggestion
    fireEvent.click(screen.getByText('What documents do I need?'));
    
    // Verify dispatch was called with addUserMessage and sendMessage
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(addUserMessage('What documents do I need?'));
    expect(mockDispatch).toHaveBeenCalledWith(sendMessage('What documents do I need?'));
  });
  
  test('handles creating a new conversation', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Click New Conversation button
    fireEvent.click(screen.getByRole('button', { name: /new conversation/i }));
    
    // Verify dispatch was called with createConversation
    expect(mockDispatch).toHaveBeenCalledWith(createConversation());
  });
  
  test('handles loading a conversation', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Click on a conversation in the history
    fireEvent.click(screen.getByText('Express Entry Questions'));
    
    // Verify dispatch was called with getConversationHistory
    expect(mockDispatch).toHaveBeenCalledWith(getConversationHistory('conv2'));
  });
  
  test('handles deleting a conversation', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Find delete buttons
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    
    // Click the first delete button
    fireEvent.click(deleteButtons[0]);
    
    // Verify dispatch was called with deleteConversation
    expect(mockDispatch).toHaveBeenCalledWith(deleteConversation('conv1'));
  });
  
  test('handles starting a guided workflow', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Click on the Guides tab
    fireEvent.click(screen.getByRole('tab', { name: /guides/i }));
    
    // Wait for guided workflows to be visible
    await waitFor(() => {
      expect(screen.getByText('Express Entry Guide')).toBeInTheDocument();
    });
    
    // Click on a guided workflow
    fireEvent.click(screen.getByText('Express Entry Guide'));
    
    // Verify dispatch was called with startGuidedWorkflow
    expect(mockDispatch).toHaveBeenCalledWith(startGuidedWorkflow('express-entry'));
  });
  
  test('renders active workflow when one is present', async () => {
    const mockActiveWorkflow = {
      id: 'express-entry',
      title: 'Express Entry Guide',
      currentStep: 1,
      totalSteps: 5,
      steps: [
        {
          id: 'step1',
          title: 'Select Program',
          description: 'Choose the Express Entry program you want to apply for'
        },
        {
          id: 'step2',
          title: 'Personal Information',
          description: 'Enter your personal information'
        }
      ]
    };
    
    renderWithRouterAndStore(<ChatbotPage />, { activeWorkflow: mockActiveWorkflow });
    
    // Verify workflow title and step indicator are rendered
    expect(screen.getByText('Express Entry Guide')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
  });
  
  test('renders typing indicator when isTyping is true', async () => {
    renderWithRouterAndStore(<ChatbotPage />, { isTyping: true });
    
    // Verify typing indicator is rendered
    expect(screen.getByText('Typing...')).toBeInTheDocument();
  });
  
  test('renders error message when there is an error', async () => {
    renderWithRouterAndStore(<ChatbotPage />, { error: 'Failed to connect to the server' });
    
    // Verify error message is rendered
    expect(screen.getByText('Failed to connect to the server')).toBeInTheDocument();
  });
  
  test('renders empty state when no messages', async () => {
    renderWithRouterAndStore(<ChatbotPage />, { messages: [] });
    
    // Verify empty state is rendered
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
    expect(screen.getByText('Ask me anything about immigration, visa processes, or settlement.')).toBeInTheDocument();
  });
  
  test('renders loading state when isLoading is true', async () => {
    renderWithRouterAndStore(<ChatbotPage />, { isLoading: true });
    
    // Type a message
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hello' }
    });
    
    // Click send button
    fireEvent.click(screen.getByRole('button', { name: '' })); // Send button has no accessible name
    
    // Verify loading indicator is rendered
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  test('handles keyboard shortcut (Enter) to send message', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithRouterAndStore(<ChatbotPage />);
    
    // Type a message
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hello' }
    });
    
    // Press Enter
    fireEvent.keyPress(screen.getByPlaceholderText('Type your message...'), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    });
    
    // Verify dispatch was called
    expect(mockDispatch).toHaveBeenCalled();
  });
});
