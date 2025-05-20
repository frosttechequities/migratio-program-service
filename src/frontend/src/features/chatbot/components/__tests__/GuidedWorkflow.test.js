import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import GuidedWorkflow from '../GuidedWorkflow';
import chatbotReducer, {
  sendMessage,
  addUserMessage,
  resetActiveWorkflow
} from '../../chatbotSlice';

// Create a theme for testing
const theme = createTheme();

// Mock data
const mockExpressEntryWorkflow = {
  id: 'express-entry',
  title: 'Express Entry Guide',
  description: 'Step-by-step guide to applying for Express Entry',
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
    },
    {
      id: 'step3',
      title: 'Language Test',
      description: 'Enter your language test results'
    },
    {
      id: 'step4',
      title: 'Work Experience',
      description: 'Enter your work experience details'
    },
    {
      id: 'step5',
      title: 'Confirmation',
      description: 'Review and confirm your information'
    }
  ]
};

const mockDocumentWorkflow = {
  id: 'document-checklist',
  title: 'Document Checklist',
  description: 'Create a personalized document checklist',
  currentStep: 1,
  totalSteps: 3,
  steps: [
    {
      id: 'step1',
      title: 'Select Program',
      description: 'Choose the immigration program'
    },
    {
      id: 'step2',
      title: 'Personal Information',
      description: 'Enter your personal information'
    },
    {
      id: 'step3',
      title: 'Confirmation',
      description: 'Confirm your information'
    }
  ]
};

// Mock Redux store
const createMockStore = (activeWorkflow = null, isLoading = false) => {
  return configureStore({
    reducer: {
      chatbot: chatbotReducer
    },
    preloadedState: {
      chatbot: {
        activeWorkflow,
        isLoading,
        messages: [],
        conversation: {
          id: 'conv1',
          title: 'Test Conversation'
        }
      }
    }
  });
};

// Mock dispatch function
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn()
}));

describe('GuidedWorkflow', () => {
  test('renders nothing when no active workflow', () => {
    const { container } = render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify component is empty
    expect(container.firstChild).toBeNull();
  });
  
  test('renders Express Entry workflow correctly', () => {
    render(
      <Provider store={createMockStore(mockExpressEntryWorkflow)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify title is rendered
    expect(screen.getByText('Express Entry Guide')).toBeInTheDocument();
    
    // Verify steps are rendered
    expect(screen.getByText('Select Program')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Language Test')).toBeInTheDocument();
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
    
    // Verify first step is active
    expect(screen.getByText('Select Program')).toBeVisible();
    
    // Verify form fields for first step are rendered
    expect(screen.getByLabelText('Express Entry Program')).toBeInTheDocument();
  });
  
  test('renders Document Checklist workflow correctly', () => {
    render(
      <Provider store={createMockStore(mockDocumentWorkflow)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify title is rendered
    expect(screen.getByText('Document Checklist')).toBeInTheDocument();
    
    // Verify steps are rendered
    expect(screen.getByText('Select Program')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
    
    // Verify first step is active
    expect(screen.getByText('Select Program')).toBeVisible();
    
    // Verify form fields for first step are rendered
    expect(screen.getByLabelText('Immigration Program')).toBeInTheDocument();
  });
  
  test('handles next button click', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore(mockExpressEntryWorkflow)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Select a program
    fireEvent.mouseDown(screen.getByLabelText('Express Entry Program'));
    const fswOption = screen.getByText('Federal Skilled Worker');
    fireEvent.click(fswOption);
    
    // Click Next button
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Verify dispatch was called with addUserMessage and sendMessage
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // addUserMessage
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // sendMessage
  });
  
  test('handles back button click', async () => {
    // Create store with workflow at step 2
    const workflow = {
      ...mockExpressEntryWorkflow,
      currentStep: 2
    };
    
    render(
      <Provider store={createMockStore(workflow)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify second step is active
    expect(screen.getByText('Personal Information')).toBeVisible();
    
    // Click Back button
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    
    // Verify first step is now active
    expect(screen.getByText('Select Program')).toBeVisible();
  });
  
  test('handles cancel button click', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore(mockExpressEntryWorkflow)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Click Cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    // Verify dispatch was called with resetActiveWorkflow
    expect(mockDispatch).toHaveBeenCalledWith(resetActiveWorkflow());
  });
  
  test('handles complete button click on last step', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    // Create store with workflow at last step
    const workflow = {
      ...mockExpressEntryWorkflow,
      currentStep: 5
    };
    
    render(
      <Provider store={createMockStore(workflow)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify last step is active
    expect(screen.getByText('Confirmation')).toBeVisible();
    
    // Check the confirmation checkbox
    fireEvent.click(screen.getByLabelText('I confirm that the information provided is accurate'));
    
    // Click Complete button
    fireEvent.click(screen.getByRole('button', { name: /complete/i }));
    
    // Verify dispatch was called with addUserMessage, sendMessage, and resetActiveWorkflow
    expect(mockDispatch).toHaveBeenCalledTimes(3);
  });
  
  test('validates required fields before proceeding', async () => {
    render(
      <Provider store={createMockStore(mockExpressEntryWorkflow)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Click Next button without selecting a program
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Verify error message is displayed
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
  
  test('renders different field types correctly', async () => {
    // Create store with workflow at step 2 (Personal Information)
    const workflow = {
      ...mockExpressEntryWorkflow,
      currentStep: 2
    };
    
    render(
      <Provider store={createMockStore(workflow)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify different field types are rendered
    expect(screen.getByLabelText('Age')).toBeInTheDocument(); // Select
    expect(screen.getByLabelText('Highest Level of Education')).toBeInTheDocument(); // Select
  });
  
  test('shows loading state when isLoading is true', async () => {
    render(
      <Provider store={createMockStore(mockExpressEntryWorkflow, true)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow />
        </ThemeProvider>
      </Provider>
    );
    
    // Select a program
    fireEvent.mouseDown(screen.getByLabelText('Express Entry Program'));
    const fswOption = screen.getByText('Federal Skilled Worker');
    fireEvent.click(fswOption);
    
    // Click Next button
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Verify loading indicator is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  test('calls onComplete callback when workflow is completed', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    const mockOnComplete = jest.fn();
    
    // Create store with workflow at last step
    const workflow = {
      ...mockExpressEntryWorkflow,
      currentStep: 5
    };
    
    render(
      <Provider store={createMockStore(workflow)}>
        <ThemeProvider theme={theme}>
          <GuidedWorkflow onComplete={mockOnComplete} />
        </ThemeProvider>
      </Provider>
    );
    
    // Check the confirmation checkbox
    fireEvent.click(screen.getByLabelText('I confirm that the information provided is accurate'));
    
    // Click Complete button
    fireEvent.click(screen.getByRole('button', { name: /complete/i }));
    
    // Verify onComplete callback was called
    expect(mockOnComplete).toHaveBeenCalled();
  });
});
