import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import ProgramInfoCard from '../components/ProgramInfoCard';

// Create a theme for testing
const theme = createTheme();

// Mock the explanation components
jest.mock('../components/RecommendationExplanation', () => {
  return function MockRecommendationExplanation(props) {
    return (
      <div data-testid="recommendation-explanation">
        <div>Mock Recommendation Explanation</div>
        <div>Program: {props.program?.programName}</div>
        <div>Match Factors: {props.matchFactors?.length || 0}</div>
        <div>Success Factors: {props.successFactors?.length || 0}</div>
      </div>
    );
  };
});

jest.mock('../components/VisualExplanation', () => {
  return function MockVisualExplanation(props) {
    return (
      <div data-testid="visual-explanation">
        <div>Mock Visual Explanation</div>
        <div>Program: {props.program?.programName}</div>
        <div>Chart Type: {props.chartType}</div>
        <div>Comparison Programs: {props.comparisonPrograms?.length || 0}</div>
      </div>
    );
  };
});

jest.mock('../components/ComparisonExplanation', () => {
  return function MockComparisonExplanation(props) {
    return (
      <div data-testid="comparison-explanation">
        <div>Mock Comparison Explanation</div>
        <div>Programs: {props.programs?.length || 0}</div>
      </div>
    );
  };
});

// Mock data
const mockProgram = {
  _id: 'program-1',
  programName: 'Express Entry',
  countryName: 'Canada',
  countryFlagUrl: 'https://example.com/flag.png',
  programType: 'Skilled Worker',
  tags: ['Federal', 'Points-based'],
  successProbability: 75,
  matchScore: 85,
  estimatedProcessingTime: {
    min: 6,
    max: 12
  },
  estimatedCost: {
    min: 2000,
    max: 3000,
    currency: 'CAD'
  },
  shortDescription: 'A points-based immigration system for skilled workers.',
  description: 'The Express Entry system is used to manage applications for permanent residence under the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class.',
  requirements: {
    language: 'CLB 7 or higher',
    education: 'Post-secondary degree',
    workExperience: 'At least 1 year of skilled work experience',
    investmentRequired: false
  },
  officialLinks: [
    {
      title: 'Official Website',
      url: 'https://example.com/express-entry',
      type: 'link'
    }
  ],
  isEligible: true,
  isSaved: false,
  matchFactors: [
    { name: 'Education', type: 'education', contribution: 25, explanation: 'Your education level meets the program requirements.' },
    { name: 'Work Experience', type: 'work', contribution: 15, explanation: 'You have relevant work experience in the required field.' }
  ],
  successFactors: [
    { name: 'Education Level', type: 'education', impact: 20, description: 'Your education level meets the requirements for most programs.' },
    { name: 'Language Proficiency', type: 'language', impact: 15, description: 'Your language skills are sufficient for many immigration pathways.' }
  ]
};

const mockProfile = {
  first_name: 'John',
  last_name: 'Doe',
  personal_info: {
    nationality: 'United States',
    current_country: 'United States'
  },
  education: [
    { degree: 'Bachelor', field: 'Computer Science', institution: 'University of Example' }
  ],
  language_proficiency: [
    { language: 'English', level: 'Fluent' }
  ]
};

const mockComparisonPrograms = [
  {
    _id: 'program-2',
    programName: 'Skilled Independent Visa',
    countryName: 'Australia',
    matchScore: 78,
    successProbability: 68
  }
];

// Wrapper component with theme and router
const renderWithThemeAndRouter = (ui) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('ProgramInfoCard Integration Tests', () => {
  test('renders with minimal props', () => {
    renderWithThemeAndRouter(<ProgramInfoCard />);
    
    // Check if the component renders without crashing
    expect(screen.getByText('Success Probability:')).toBeInTheDocument();
  });
  
  test('renders with program data', () => {
    renderWithThemeAndRouter(
      <ProgramInfoCard 
        program={mockProgram}
        profile={mockProfile}
      />
    );
    
    // Check if program details are displayed
    expect(screen.getByText('Express Entry')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('6-12 months')).toBeInTheDocument();
    expect(screen.getByText('Skilled Worker')).toBeInTheDocument();
  });
  
  test('expands to show detailed content', () => {
    renderWithThemeAndRouter(
      <ProgramInfoCard 
        program={mockProgram}
        profile={mockProfile}
      />
    );
    
    // Click expand button
    fireEvent.click(screen.getByLabelText('show more'));
    
    // Check if expanded content is displayed
    expect(screen.getByText('Program Description')).toBeInTheDocument();
    expect(screen.getByText('The Express Entry system is used to manage applications for permanent residence under the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class.')).toBeInTheDocument();
  });
  
  test('shows tabs in expanded view', () => {
    renderWithThemeAndRouter(
      <ProgramInfoCard 
        program={mockProgram}
        profile={mockProfile}
      />
    );
    
    // Click expand button
    fireEvent.click(screen.getByLabelText('show more'));
    
    // Check if tabs are displayed
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Explanation')).toBeInTheDocument();
  });
  
  test('switches between tabs correctly', () => {
    renderWithThemeAndRouter(
      <ProgramInfoCard 
        program={mockProgram}
        profile={mockProfile}
      />
    );
    
    // Click expand button
    fireEvent.click(screen.getByLabelText('show more'));
    
    // Initially should show Details tab
    expect(screen.getByText('Program Description')).toBeInTheDocument();
    
    // Click on Explanation tab
    fireEvent.click(screen.getByText('Explanation'));
    
    // Should show explanation components
    expect(screen.getByTestId('recommendation-explanation')).toBeInTheDocument();
    expect(screen.getByTestId('visual-explanation')).toBeInTheDocument();
  });
  
  test('integrates with RecommendationExplanation component', () => {
    renderWithThemeAndRouter(
      <ProgramInfoCard 
        program={mockProgram}
        profile={mockProfile}
      />
    );
    
    // Click expand button
    fireEvent.click(screen.getByLabelText('show more'));
    
    // Click on Explanation tab
    fireEvent.click(screen.getByText('Explanation'));
    
    // Check if RecommendationExplanation is rendered with correct props
    expect(screen.getByTestId('recommendation-explanation')).toBeInTheDocument();
    expect(screen.getByText('Program: Express Entry')).toBeInTheDocument();
    expect(screen.getByText('Match Factors: 2')).toBeInTheDocument();
    expect(screen.getByText('Success Factors: 2')).toBeInTheDocument();
  });
  
  test('integrates with VisualExplanation component', () => {
    renderWithThemeAndRouter(
      <ProgramInfoCard 
        program={mockProgram}
        profile={mockProfile}
      />
    );
    
    // Click expand button
    fireEvent.click(screen.getByLabelText('show more'));
    
    // Click on Explanation tab
    fireEvent.click(screen.getByText('Explanation'));
    
    // Check if VisualExplanation is rendered with correct props
    expect(screen.getByTestId('visual-explanation')).toBeInTheDocument();
    expect(screen.getByText('Program: Express Entry')).toBeInTheDocument();
    expect(screen.getByText('Chart Type: radar')).toBeInTheDocument();
  });
  
  test('shows comparison tab when comparison programs are provided', () => {
    renderWithThemeAndRouter(
      <ProgramInfoCard 
        program={mockProgram}
        profile={mockProfile}
        comparisonPrograms={mockComparisonPrograms}
      />
    );
    
    // Click expand button
    fireEvent.click(screen.getByLabelText('show more'));
    
    // Check if Comparison tab is displayed
    expect(screen.getByText('Comparison')).toBeInTheDocument();
    
    // Click on Comparison tab
    fireEvent.click(screen.getByText('Comparison'));
    
    // Check if ComparisonExplanation is rendered with correct props
    expect(screen.getByTestId('comparison-explanation')).toBeInTheDocument();
    expect(screen.getByText('Programs: 2')).toBeInTheDocument();
  });
  
  test('renders in detailed mode correctly', () => {
    renderWithThemeAndRouter(
      <ProgramInfoCard 
        program={mockProgram}
        profile={mockProfile}
        isDetailed={true}
      />
    );
    
    // In detailed mode, the card should be expanded by default
    expect(screen.getByText('Program Description')).toBeInTheDocument();
  });
});
