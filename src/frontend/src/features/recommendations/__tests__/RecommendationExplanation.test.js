import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RecommendationExplanation from '../components/RecommendationExplanation';

// Create a theme for testing
const theme = createTheme();

// Mock data
const mockProgram = {
  programName: 'Express Entry',
  countryName: 'Canada',
  matchScore: 85,
  successProbability: 75,
  detailedExplanation: 'This is a detailed explanation of the program recommendation.'
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

const mockMatchFactors = [
  { name: 'Education', type: 'education', contribution: 25, explanation: 'Your education level meets the program requirements.' },
  { name: 'Work Experience', type: 'work', contribution: 15, explanation: 'You have relevant work experience in the required field.' },
  { name: 'Language Proficiency', type: 'language', contribution: 20, explanation: 'Your language skills meet the minimum requirements.' },
  { name: 'Age', type: 'personal', contribution: -5, explanation: 'Your age is slightly outside the preferred range.' }
];

const mockSuccessFactors = [
  { name: 'Education Level', type: 'education', impact: 20, description: 'Your education level meets the requirements for most programs.' },
  { name: 'Language Proficiency', type: 'language', impact: 15, description: 'Your language skills are sufficient for many immigration pathways.' },
  { name: 'Work Experience', type: 'work', impact: -10, description: 'Additional work experience would improve your eligibility for skilled worker programs.' }
];

// Wrapper component with theme
const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('RecommendationExplanation Component', () => {
  test('renders with minimal props', () => {
    renderWithTheme(<RecommendationExplanation />);
    
    // Check if the component renders without crashing
    expect(screen.getByText('Detailed Explanation')).toBeInTheDocument();
  });
  
  test('renders with program data', () => {
    renderWithTheme(<RecommendationExplanation program={mockProgram} />);
    
    // Check if program details are displayed
    expect(screen.getByText(/Express Entry/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a detailed explanation/i)).toBeInTheDocument();
  });
  
  test('renders match factors correctly', () => {
    renderWithTheme(
      <RecommendationExplanation 
        program={mockProgram} 
        matchFactors={mockMatchFactors} 
        isDetailed={true}
      />
    );
    
    // Check if match factors are displayed
    expect(screen.getByText('Match Factors Analysis')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Language Proficiency')).toBeInTheDocument();
    expect(screen.getByText('Your education level meets the program requirements.')).toBeInTheDocument();
  });
  
  test('renders strengths and weaknesses correctly', () => {
    renderWithTheme(
      <RecommendationExplanation 
        program={mockProgram} 
        successFactors={mockSuccessFactors} 
        isDetailed={true}
      />
    );
    
    // Check if strengths and weaknesses are displayed
    expect(screen.getByText('Key Strengths')).toBeInTheDocument();
    expect(screen.getByText('Areas for Improvement')).toBeInTheDocument();
    expect(screen.getByText('Education Level')).toBeInTheDocument();
    expect(screen.getByText('Additional work experience would improve your eligibility for skilled worker programs.')).toBeInTheDocument();
  });
  
  test('renders in detailed mode correctly', () => {
    renderWithTheme(
      <RecommendationExplanation 
        program={mockProgram} 
        matchFactors={mockMatchFactors}
        successFactors={mockSuccessFactors}
        isDetailed={true}
      />
    );
    
    // In detailed mode, the accordion should be expanded by default
    expect(screen.getByText('Based on your profile, you have a 85% match with the Express Entry program and a 75% estimated probability of success if you apply.')).toBeInTheDocument();
  });
  
  test('handles empty arrays gracefully', () => {
    renderWithTheme(
      <RecommendationExplanation 
        program={mockProgram} 
        matchFactors={[]}
        successFactors={[]}
        isDetailed={true}
      />
    );
    
    // Should still render without errors
    expect(screen.getByText('Based on your profile, you have a 85% match with the Express Entry program and a 75% estimated probability of success if you apply.')).toBeInTheDocument();
    expect(screen.queryByText('Match Factors Analysis')).not.toBeInTheDocument();
  });
});
