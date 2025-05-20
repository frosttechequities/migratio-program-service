import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import EnhancedChatbotWidget from '../EnhancedChatbotWidget';
import chatbotReducer, {
  addUserMessage,
  sendMessage,
  setTyping
} from '../../chatbotSlice';

// Create a theme for testing
const theme = createTheme();

// Mock data
const mockMessages = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'assistant',
    timestamp: '2023-06-01T12:00:00Z'
  },
  {
    id: '2',
    content: 'I need help with my visa application.',
    sender: 'user',
    timestamp: '2023-06-01T12:01:00Z'
  }
];

const mockSuggestions = [
  'What documents do I need?',
  'How long does the process take?',
  'What are the eligibility requirements?'
];

const mockConversation = {
  id: 'conv-1',
  title: 'Visa Application Help',
  createdAt: '2023-06-01T12:00:00Z',
  updatedAt: '2023-06-01T12:01:00Z'
};

const mockConversations = [
  {
    id: 'conv-1',
    title: 'Visa Application Help',
    createdAt: '2023-06-01T12:00:00Z',
    updatedAt: '2023-06-01T12:01:00Z'
  },
  {
    id: 'conv-2',
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

describe('EnhancedChatbotWidget', () => {
  test('renders chat button when collapsed', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <EnhancedChatbotWidget />
        </ThemeProvider>
      </Provider>
    );
    
    const chatButton = screen.getByRole('button', { name: /chat with ai assistant/i });
    expect(chatButton).toBeInTheDocument();
  });
  
  test('expands chat widget when button is clicked', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <EnhancedChatbotWidget />
        </ThemeProvider>
      </Provider>
    );
    
    const chatButton = screen.getByRole('button', { name: /chat with ai assistant/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    });
  });
  
  test('displays messages when expanded', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <EnhancedChatbotWidget />
        </ThemeProvider>
      </Provider>
    );
    
    const chatButton = screen.getByRole('button', { name: /chat with ai assistant/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
      expect(screen.getByText('I need help with my visa application.')).toBeInTheDocument();
    });
  });
  
  test('displays suggestions when available', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <EnhancedChatbotWidget />
        </ThemeProvider>
      </Provider>
    );
    
    const chatButton = screen.getByRole('button', { name: /chat with ai assistant/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      expect(screen.getByText('What documents do I need?')).toBeInTheDocument();
      expect(screen.getByText('How long does the process take?')).toBeInTheDocument();
      expect(screen.getByText('What are the eligibility requirements?')).toBeInTheDocument();
    });
  });
  
  test('shows typing indicator when isTyping is true', async () => {
    render(
      <Provider store={createMockStore({ isTyping: true })}>
        <ThemeProvider theme={theme}>
          <EnhancedChatbotWidget />
        </ThemeProvider>
      </Provider>
    );
    
    const chatButton = screen.getByRole('button', { name: /chat with ai assistant/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      expect(screen.getByText('Typing...')).toBeInTheDocument();
    });
  });
  
  test('shows conversation history when history tab is clicked', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <EnhancedChatbotWidget />
        </ThemeProvider>
      </Provider>
    );
    
    const chatButton = screen.getByRole('button', { name: /chat with ai assistant/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      const historyButton = screen.getByRole('button', { name: /conversation history/i });
      fireEvent.click(historyButton);
      
      expect(screen.getByText('Visa Application Help')).toBeInTheDocument();
      expect(screen.getByText('Express Entry Questions')).toBeInTheDocument();
    });
  });
  
  test('allows sending a message', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <EnhancedChatbotWidget />
        </ThemeProvider>
      </Provider>
    );
    
    const chatButton = screen.getByRole('button', { name: /chat with ai assistant/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello, I need help' } });
      
      const sendButton = screen.getByRole('button', { name: '' }); // Send button has no accessible name
      fireEvent.click(sendButton);
      
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // addUserMessage
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // sendMessage
    });
  });
});
