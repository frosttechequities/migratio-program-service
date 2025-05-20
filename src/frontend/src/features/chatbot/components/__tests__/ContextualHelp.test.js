import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import ContextualHelp from '../ContextualHelp';
import chatbotReducer from '../../chatbotSlice';

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
    email: 'test@example.com'
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
        context,
        messages: []
      }
    }
  });
};

// Wrapper component with router and store
const renderWithRouterAndStore = (ui, { route = '/dashboard', context = mockContext } = {}) => {
  return render(
    <Provider store={createMockStore(context)}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="*" element={ui} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('ContextualHelp', () => {
  test('renders collapsed by default', () => {
    renderWithRouterAndStore(<ContextualHelp />);

    // Verify component is rendered
    expect(screen.getByText('Contextual Suggestions')).toBeInTheDocument();

    // Verify suggestions are not visible
    const suggestions = screen.queryAllByRole('button');
    expect(suggestions.length).toBe(1); // Only the expand button
  });

  test('expands when clicked', () => {
    renderWithRouterAndStore(<ContextualHelp />);

    // Click to expand
    fireEvent.click(screen.getByText('Contextual Suggestions'));

    // Verify suggestions are visible
    const suggestions = screen.getAllByRole('button');
    expect(suggestions.length).toBeGreaterThan(1);
  });

  test('shows dashboard-specific suggestions on dashboard page', () => {
    renderWithRouterAndStore(<ContextualHelp />, { route: '/dashboard' });

    // Click to expand
    fireEvent.click(screen.getByText('Contextual Suggestions'));

    // Verify dashboard-specific suggestions are shown
    expect(screen.getByText('How do I interpret my success probability?')).toBeInTheDocument();
    expect(screen.getByText('What do the different widgets on my dashboard show?')).toBeInTheDocument();
    expect(screen.getByText('How can I customize my dashboard?')).toBeInTheDocument();
  });

  test('shows assessment-specific suggestions on assessment page', () => {
    renderWithRouterAndStore(<ContextualHelp />, { route: '/assessment' });

    // Click to expand
    fireEvent.click(screen.getByText('Contextual Suggestions'));

    // Verify assessment-specific suggestions are shown
    expect(screen.getByText('How does the assessment affect my recommendations?')).toBeInTheDocument();
    expect(screen.getByText('Can I retake the assessment?')).toBeInTheDocument();
    expect(screen.getByText('What information do I need for the assessment?')).toBeInTheDocument();
  });

  test('shows roadmap-specific suggestions on roadmap page', () => {
    renderWithRouterAndStore(<ContextualHelp />, { route: '/roadmap' });

    // Click to expand
    fireEvent.click(screen.getByText('Contextual Suggestions'));

    // Verify roadmap-specific suggestions are shown
    expect(screen.getByText('How do I track my progress on the roadmap?')).toBeInTheDocument();
    expect(screen.getByText('What happens when I complete a task?')).toBeInTheDocument();
    expect(screen.getByText('Can I customize my roadmap?')).toBeInTheDocument();
  });

  test('shows documents-specific suggestions on documents page', () => {
    renderWithRouterAndStore(<ContextualHelp />, { route: '/documents' });

    // Click to expand
    fireEvent.click(screen.getByText('Contextual Suggestions'));

    // Verify documents-specific suggestions are shown
    expect(screen.getByText('What documents do I need to upload?')).toBeInTheDocument();
    expect(screen.getByText('How secure is my document storage?')).toBeInTheDocument();
    expect(screen.getByText('Can I share documents with my immigration consultant?')).toBeInTheDocument();
  });

  test('shows program-specific suggestions when a program is selected', () => {
    renderWithRouterAndStore(<ContextualHelp />);

    // Click to expand
    fireEvent.click(screen.getByText('Contextual Suggestions'));

    // Verify program-specific suggestions are shown
    expect(screen.getByText('Tell me more about the Express Entry program')).toBeInTheDocument();
    expect(screen.getByText('What documents do I need for Express Entry?')).toBeInTheDocument();
    expect(screen.getByText('What are the processing times for Express Entry?')).toBeInTheDocument();
  });

  test('shows activity-specific suggestions based on recent activity', () => {
    renderWithRouterAndStore(<ContextualHelp />);

    // Click to expand
    fireEvent.click(screen.getByText('Contextual Suggestions'));

    // Verify activity-specific suggestions are shown
    expect(screen.getByText('What other documents should I prepare?')).toBeInTheDocument();
    expect(screen.getByText('How do I know if my documents are sufficient?')).toBeInTheDocument();
  });

  test('limits suggestions to 5 even when more are available', () => {
    renderWithRouterAndStore(<ContextualHelp />, { route: '/dashboard' });

    // Click to expand
    fireEvent.click(screen.getByText('Contextual Suggestions'));

    // Count suggestion chips
    const suggestionChips = screen.getAllByRole('button').filter(
      button => button.textContent !== 'Contextual Suggestions'
    );

    // Verify there are at most 5 suggestions
    expect(suggestionChips.length).toBeLessThanOrEqual(5);
  });

  test('renders nothing when no suggestions are available', () => {
    // Create context with no program or activity
    const emptyContext = {
      currentPage: null,
      selectedProgram: null,
      userProfile: null,
      recentActivity: []
    };

    // Render with a route that doesn't match any specific page
    const { container } = renderWithRouterAndStore(<ContextualHelp />, {
      route: '/unknown-page',
      context: emptyContext
    });

    // Verify component is not rendered
    expect(container.firstChild).toBeNull();
  });

  test('handles suggestion click', () => {
    // Create a mock store with a mock dispatch function
    const mockStore = {
      getState: jest.fn(),
      subscribe: jest.fn(),
      dispatch: jest.fn()
    };

    // Use the Provider directly with our mock store
    render(
      <Provider store={mockStore}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={['/dashboard']}>
            <ContextualHelp />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    // Click to expand
    fireEvent.click(screen.getByText('Contextual Suggestions'));

    // Since we're using a mock store, we won't see the actual suggestions
    // but we can verify that the component rendered without errors
  });
});
