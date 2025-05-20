import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import components to test
import ProgramComparisonView from '../components/ProgramComparisonView';
import RecommendationSummaryWidget from '../../dashboard/components/RecommendationSummaryWidget';
import SuccessProbabilityWidget from '../components/SuccessProbabilityWidget';
import ActionRecommendations from '../components/ActionRecommendations';
import GapAnalysisWidget from '../components/GapAnalysisWidget';

// Import reducers
import recommendationReducer from '../recommendationSlice';
import uiReducer from '../../ui/uiSlice';

// Mock data
const mockRecommendations = [
  {
    programId: 'program-1',
    programName: 'Express Entry - Federal Skilled Worker',
    country: 'Canada',
    category: 'Skilled Worker',
    scores: {
      mlMatchScore: 0.85,
      mlSuccessProbability: 0.75
    },
    explanation: {
      summary: 'Strong match based on education and work experience',
      factors: [
        { name: 'Education', impact: 'positive', description: 'Master\'s degree is highly valued' },
        { name: 'Work Experience', impact: 'positive', description: '5+ years in skilled occupation' },
        { name: 'Age', impact: 'positive', description: 'Within optimal age range' },
        { name: 'Language', impact: 'neutral', description: 'Good but could be improved' }
      ]
    }
  },
  {
    programId: 'program-2',
    programName: 'Provincial Nominee Program - Ontario',
    country: 'Canada',
    category: 'Provincial Nominee',
    scores: {
      mlMatchScore: 0.78,
      mlSuccessProbability: 0.82
    },
    explanation: {
      summary: 'Good match for Ontario PNP based on in-demand skills',
      factors: [
        { name: 'In-demand Skills', impact: 'positive', description: 'Your skills are in high demand in Ontario' },
        { name: 'Education', impact: 'positive', description: 'Relevant education for Ontario job market' },
        { name: 'Canadian Experience', impact: 'negative', description: 'No previous Canadian experience' }
      ]
    }
  },
  {
    programId: 'program-3',
    programName: 'Global Talent Stream',
    country: 'Canada',
    category: 'Work Permit',
    scores: {
      mlMatchScore: 0.72,
      mlSuccessProbability: 0.68
    },
    explanation: {
      summary: 'Potential match for tech workers with job offer',
      factors: [
        { name: 'Tech Experience', impact: 'positive', description: 'Experience in eligible tech occupation' },
        { name: 'Job Offer', impact: 'negative', description: 'No Canadian job offer yet' }
      ]
    }
  }
];

const mockProbabilityData = {
  overallScore: 75,
  positiveFactors: [
    { name: 'Education Level', description: 'Your education level meets the requirements for most programs.' },
    { name: 'Language Proficiency', description: 'Your language skills are sufficient for many immigration pathways.' },
    { name: 'Age', description: 'Your age is within the optimal range for immigration programs.' }
  ],
  negativeFactors: [
    { name: 'Work Experience', description: 'Additional work experience would improve your eligibility for skilled worker programs.' },
    { name: 'Canadian Experience', description: 'No previous Canadian work or study experience.' }
  ],
  recommendations: [
    {
      title: 'Complete language test',
      description: 'Take an approved language test to verify your proficiency.',
      category: 'High',
      type: 'language',
      estimatedImpact: 15
    },
    {
      title: 'Obtain Education Credential Assessment',
      description: 'Get your education credentials assessed by an approved organization.',
      category: 'Medium',
      type: 'education',
      estimatedImpact: 10
    }
  ]
};

const mockGapAnalysisData = {
  gaps: [
    {
      name: 'Language Proficiency',
      category: 'language',
      severity: 'moderate',
      currentValue: 'CLB 7',
      requiredValue: 'CLB 9',
      description: 'Your current language scores are below the optimal level for Express Entry.'
    },
    {
      name: 'Canadian Work Experience',
      category: 'work',
      severity: 'high',
      currentValue: '0 years',
      requiredValue: '1+ years',
      description: 'You have no Canadian work experience, which is valuable for many programs.'
    }
  ],
  recommendations: [
    {
      title: 'Improve language scores',
      description: 'Take language preparation courses and retake the test to achieve CLB 9.',
      estimatedTime: 3,
      difficulty: 'moderate'
    },
    {
      title: 'Explore Canadian work opportunities',
      description: 'Look for temporary work permits or internships to gain Canadian experience.',
      estimatedTime: 6,
      difficulty: 'high'
    }
  ],
  timeline: {
    minMonths: 3,
    maxMonths: 12,
    optimalPath: 'Focus on improving language scores first, then pursue Canadian work experience.'
  }
};

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      recommendations: recommendationReducer,
      ui: uiReducer,
    },
    preloadedState: {
      recommendations: {
        programRecommendations: mockRecommendations,
        successProbability: mockProbabilityData,
        gapAnalysis: mockGapAnalysisData,
        isLoading: false,
        error: null,
      },
      ui: {
        theme: 'light',
      },
    },
  });
};

// Create a theme for testing
const theme = createTheme();

// Test wrapper component
const TestWrapper = ({ children }) => {
  return (
    <Provider store={createMockStore()}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('Improved Recommendation Display Components', () => {
  describe('RecommendationSummaryWidget Component', () => {
    test('renders top recommendations correctly', () => {
      render(
        <TestWrapper>
          <RecommendationSummaryWidget recommendations={mockRecommendations} />
        </TestWrapper>
      );

      // Check if program names are displayed
      expect(screen.getByText('Express Entry - Federal Skilled Worker')).toBeInTheDocument();
      expect(screen.getByText('Provincial Nominee Program - Ontario')).toBeInTheDocument();
      expect(screen.getByText('Global Talent Stream')).toBeInTheDocument();

      // Check if view buttons are displayed
      expect(screen.getByTestId('view-all-button')).toBeInTheDocument();
      expect(screen.getByTestId('view-details-button-0')).toBeInTheDocument();

      // Check if explanations are displayed
      expect(screen.getByText('Strong match based on education and work experience')).toBeInTheDocument();
      expect(screen.getByText('Good match for Ontario PNP based on in-demand skills')).toBeInTheDocument();
      expect(screen.getByText('Potential match for tech workers with job offer')).toBeInTheDocument();
    });
  });

  describe('ProgramComparisonView Component', () => {
    test('renders comparison table correctly', () => {
      render(
        <TestWrapper>
          <ProgramComparisonView programs={mockRecommendations} />
        </TestWrapper>
      );

      // Check if table headers are displayed
      expect(screen.getByText('Program')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();
      expect(screen.getByText('Success Probability')).toBeInTheDocument();

      // Check if program names are displayed in the table
      expect(screen.getByText('Express Entry - Federal Skilled Worker')).toBeInTheDocument();
      expect(screen.getByText('Provincial Nominee Program - Ontario')).toBeInTheDocument();
      expect(screen.getByText('Global Talent Stream')).toBeInTheDocument();
    });

    test('handles sorting correctly', () => {
      render(
        <TestWrapper>
          <ProgramComparisonView programs={mockRecommendations} />
        </TestWrapper>
      );

      // Find and click a column header to sort
      const programHeader = screen.getByText('Program');
      fireEvent.click(programHeader);

      // Check if action buttons are displayed
      expect(screen.getByTestId('view-details-program-0')).toBeInTheDocument();
      expect(screen.getByTestId('save-program-program-0')).toBeInTheDocument();
      expect(screen.getByTestId('remove-program-program-0')).toBeInTheDocument();

      // Click again to reverse sort
      fireEvent.click(programHeader);
    });
  });

  describe('SuccessProbabilityWidget Component', () => {
    test('renders success probability score and factors correctly', () => {
      render(
        <TestWrapper>
          <SuccessProbabilityWidget
            probability={mockProbabilityData.overallScore}
            positiveFactors={mockProbabilityData.positiveFactors}
            negativeFactors={mockProbabilityData.negativeFactors}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Check if score is displayed
      expect(screen.getByText('75%')).toBeInTheDocument();

      // Check if positive factors are displayed
      expect(screen.getByText('Education Level')).toBeInTheDocument();
      expect(screen.getByText('Language Proficiency')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();

      // Check if negative factors are displayed
      expect(screen.getByText('Work Experience')).toBeInTheDocument();
      expect(screen.getByText('Canadian Experience')).toBeInTheDocument();
    });
  });

  describe('ActionRecommendations Component', () => {
    test('renders action recommendations correctly', () => {
      render(
        <TestWrapper>
          <ActionRecommendations
            recommendations={mockProbabilityData.recommendations}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Check if category headers are displayed
      expect(screen.getByText('High Actions')).toBeInTheDocument();
      expect(screen.getByText('Medium Actions')).toBeInTheDocument();

      // Check if buttons are displayed
      expect(screen.getByText('View Roadmap')).toBeInTheDocument();
      expect(screen.getByText('Add All to Roadmap')).toBeInTheDocument();

      // Check if impact information is displayed
      expect(screen.getByText('15%')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
    });
  });

  describe('GapAnalysisWidget Component', () => {
    test('renders gap analysis correctly', () => {
      render(
        <TestWrapper>
          <GapAnalysisWidget
            gaps={mockGapAnalysisData.gaps}
            recommendations={mockGapAnalysisData.recommendations}
            timeline={mockGapAnalysisData.timeline}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Check if gap names are displayed
      expect(screen.getByText('Language Proficiency')).toBeInTheDocument();
      expect(screen.getByText('Canadian Work Experience')).toBeInTheDocument();

      // Check if gap details are displayed
      expect(screen.getByText('CLB 7')).toBeInTheDocument();
      expect(screen.getByText('CLB 9')).toBeInTheDocument();
      expect(screen.getByText('0 years')).toBeInTheDocument();
      expect(screen.getByText('1+ years')).toBeInTheDocument();

      // Check if recommendations are displayed
      expect(screen.getByText('Improve language scores')).toBeInTheDocument();
      expect(screen.getByText('Explore Canadian work opportunities')).toBeInTheDocument();

      // Check if timeline information is displayed
      expect(screen.getByText(/3-12 months/)).toBeInTheDocument();
    });
  });
});
