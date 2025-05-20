import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import SuggestionSystem from '../SuggestionSystem';
import chatbotReducer, {
  sendMessage,
  addUserMessage
} from '../../chatbotSlice';

// Create a theme for testing
const theme = createTheme();

// Mock data
const mockContext = {
  currentPage: 'dashboard',
  selectedProgram: {
    id: 'program1',
    programName: 'Express Entry'
  },
  userProfile: {
    name: 'Test User',
    email: 'test@example.com',
    profileCompletion: 75
  },
  recentActivity: [
    {
      type: 'document_upload',
      documentId: 'doc1',
      documentName: 'Passport',
      timestamp: '2023-01-01T00:00:00Z'
    }
  ]
};

// Mock Redux store
const createMockStore = (context = mockContext) => {
  return configureStore({
    reducer: {
      chatbot: chatbotReducer
    },
    preloadedState: {
      chatbot: {
        context
      }
    }
  });
};

// Mock dispatch function
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn()
}));

describe('SuggestionSystem', () => {
  test('renders suggestion system correctly', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify component is rendered
    expect(screen.getByText('Personalized Suggestions')).toBeInTheDocument();
    
    // Verify current suggestion is displayed
    expect(screen.getByText('Complete your language test')).toBeInTheDocument();
    expect(screen.getByText('Your profile indicates you haven\'t taken a language test yet. This is required for most immigration programs.')).toBeInTheDocument();
  });
  
  test('expands when expand button is clicked', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Find expand button
    const expandButton = screen.getByRole('button', { name: /expand/i });
    
    // Click expand button
    fireEvent.click(expandButton);
    
    // Verify "All Suggestions" section is visible
    await waitFor(() => {
      expect(screen.getByText('All Suggestions')).toBeInTheDocument();
    });
    
    // Verify all suggestions are listed
    expect(screen.getByText('Complete your language test')).toBeInTheDocument();
    expect(screen.getByText('Upload your education credentials')).toBeInTheDocument();
    expect(screen.getByText('Explore Provincial Nominee Programs')).toBeInTheDocument();
    expect(screen.getByText('Update your work experience')).toBeInTheDocument();
  });
  
  test('dismisses current suggestion when dismiss button is clicked', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify initial suggestion is displayed
    expect(screen.getByText('Complete your language test')).toBeInTheDocument();
    
    // Click Dismiss button
    fireEvent.click(screen.getByRole('button', { name: /dismiss$/i }));
    
    // Verify next suggestion is displayed
    await waitFor(() => {
      expect(screen.getByText('Upload your education credentials')).toBeInTheDocument();
    });
  });
  
  test('accepts suggestion with Go button for navigate action', async () => {
    // Mock window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: jest.fn() };
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify initial suggestion is displayed
    expect(screen.getByText('Complete your language test')).toBeInTheDocument();
    
    // Click Go button
    fireEvent.click(screen.getByRole('button', { name: /go/i }));
    
    // Verify window.location.href was updated
    expect(window.location.href).toBe('/roadmap');
    
    // Restore window.location
    window.location = originalLocation;
  });
  
  test('accepts suggestion with Ask button for message action', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Expand to see all suggestions
    fireEvent.click(screen.getByRole('button', { name: /expand/i }));
    
    // Click on the "Explore Provincial Nominee Programs" suggestion
    fireEvent.click(screen.getByText('Explore Provincial Nominee Programs'));
    
    // Verify this suggestion is now the current one
    await waitFor(() => {
      expect(screen.getByText('Based on your profile, you may be eligible for provincial nomination, which can increase your chances.')).toBeInTheDocument();
    });
    
    // Click Ask button
    fireEvent.click(screen.getByRole('button', { name: /ask/i }));
    
    // Verify dispatch was called with addUserMessage and sendMessage
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(addUserMessage('Tell me about Provincial Nominee Programs'));
    expect(mockDispatch).toHaveBeenCalledWith(sendMessage('Tell me about Provincial Nominee Programs'));
  });
  
  test('closes suggestion system when close button is clicked', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify component is rendered
    expect(screen.getByText('Personalized Suggestions')).toBeInTheDocument();
    
    // Click close button
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    
    // Verify component is no longer visible
    await waitFor(() => {
      expect(screen.queryByText('Personalized Suggestions')).not.toBeInTheDocument();
    });
  });
  
  test('displays priority indicators correctly', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Expand to see all suggestions
    fireEvent.click(screen.getByRole('button', { name: /expand/i }));
    
    // Find all suggestion items
    const suggestionItems = screen.getAllByRole('button')
      .filter(button => button.textContent.includes('Complete your language test') || 
                        button.textContent.includes('Upload your education credentials') ||
                        button.textContent.includes('Explore Provincial Nominee Programs') ||
                        button.textContent.includes('Update your work experience'));
    
    // Verify there are 4 suggestion items
    expect(suggestionItems.length).toBe(4);
    
    // Each suggestion should have an avatar with priority color
    // We can't easily test the color, but we can verify the avatars exist
    const avatars = screen.getAllByRole('img');
    expect(avatars.length).toBeGreaterThanOrEqual(4);
  });
  
  test('dismisses suggestion from all suggestions list', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Expand to see all suggestions
    fireEvent.click(screen.getByRole('button', { name: /expand/i }));
    
    // Find all dismiss buttons in the suggestions list
    const dismissButtons = screen.getAllByRole('button', { name: '' }); // Dismiss buttons have no accessible name
    
    // Click the dismiss button for the second suggestion
    fireEvent.click(dismissButtons[1]);
    
    // Verify the suggestion was removed from the list
    await waitFor(() => {
      const suggestionItems = screen.getAllByRole('button')
        .filter(button => button.textContent.includes('Complete your language test') || 
                          button.textContent.includes('Upload your education credentials') ||
                          button.textContent.includes('Explore Provincial Nominee Programs') ||
                          button.textContent.includes('Update your work experience'));
      
      // Should now be 3 suggestions
      expect(suggestionItems.length).toBe(3);
    });
  });
  
  test('shows empty state when all suggestions are dismissed', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Dismiss all suggestions one by one
    for (let i = 0; i < 4; i++) {
      // Click Dismiss button
      fireEvent.click(screen.getByRole('button', { name: /dismiss$/i }));
    }
    
    // Expand to see all suggestions
    fireEvent.click(screen.getByRole('button', { name: /expand/i }));
    
    // Verify empty state message is displayed
    await waitFor(() => {
      expect(screen.getByText('No more suggestions available.')).toBeInTheDocument();
    });
  });
  
  test('renders nothing when no suggestions are available initially', () => {
    // Mock useState to return empty suggestions
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [[], jest.fn()]);
    
    const { container } = render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SuggestionSystem />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify component is not rendered
    expect(container.firstChild).toBeNull();
  });
});
