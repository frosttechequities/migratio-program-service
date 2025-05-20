import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ComparisonExplanation from '../components/ComparisonExplanation';

// Create a theme for testing
const theme = createTheme();

// Mock data
const mockPrograms = [
  {
    id: 'program-1',
    programName: 'Express Entry',
    countryName: 'Canada',
    matchScore: 85,
    successProbability: 75,
    requirements: [
      { name: 'Language Proficiency', met: true },
      { name: 'Education', met: true },
      { name: 'Work Experience', met: false }
    ]
  },
  {
    id: 'program-2',
    programName: 'Skilled Independent Visa',
    countryName: 'Australia',
    matchScore: 78,
    successProbability: 68,
    requirements: [
      { name: 'Points Test', met: true },
      { name: 'Age', met: true },
      { name: 'English Proficiency', met: false }
    ]
  },
  {
    id: 'program-3',
    programName: 'Skilled Migrant Category',
    countryName: 'New Zealand',
    matchScore: 72,
    successProbability: 65,
    requirements: [
      { name: 'Expression of Interest', met: true },
      { name: 'Points Threshold', met: false },
      { name: 'Job Offer', met: false }
    ]
  }
];

const mockProfile = {
  first_name: 'John',
  last_name: 'Doe',
  personal_info: {
    nationality: 'United States',
    current_country: 'United States'
  }
};

// Wrapper component with theme
const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('ComparisonExplanation Component', () => {
  test('renders with minimal props', () => {
    renderWithTheme(<ComparisonExplanation />);
    
    // Check if the component renders without crashing
    expect(screen.getByText('Program Comparison Explanation')).toBeInTheDocument();
    expect(screen.getByText('Select multiple programs to see a detailed comparison explanation.')).toBeInTheDocument();
  });
  
  test('renders with program data', () => {
    renderWithTheme(
      <ComparisonExplanation 
        programs={mockPrograms}
        profile={mockProfile}
      />
    );
    
    // Check if program details are displayed
    expect(screen.getByText('Express Entry')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
    expect(screen.getByText('New Zealand')).toBeInTheDocument();
    
    // Check if comparison explanation is generated
    expect(screen.getByText(/Based on your profile, Express Entry \(Canada\) is your top recommendation/i)).toBeInTheDocument();
  });
  
  test('renders comparison table correctly', () => {
    renderWithTheme(
      <ComparisonExplanation 
        programs={mockPrograms}
        profile={mockProfile}
      />
    );
    
    // Check if table headers are displayed
    expect(screen.getByText('Program')).toBeInTheDocument();
    expect(screen.getByText('Match Score')).toBeInTheDocument();
    expect(screen.getByText('Success Probability')).toBeInTheDocument();
    expect(screen.getByText('Key Requirements')).toBeInTheDocument();
    
    // Check if program scores are displayed
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
  });
  
  test('sorts programs by match score by default', () => {
    renderWithTheme(
      <ComparisonExplanation 
        programs={mockPrograms}
        profile={mockProfile}
      />
    );
    
    // The first row should be Express Entry with 85% match score
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Express Entry');
    expect(rows[1]).toHaveTextContent('85%');
  });
  
  test('allows sorting by success probability', () => {
    renderWithTheme(
      <ComparisonExplanation 
        programs={mockPrograms}
        profile={mockProfile}
      />
    );
    
    // Click on Success Probability header to sort
    fireEvent.click(screen.getByText('Success Probability'));
    
    // The first row should still be Express Entry with 75% success probability
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Express Entry');
    expect(rows[1]).toHaveTextContent('75%');
  });
  
  test('renders in detailed mode correctly', () => {
    renderWithTheme(
      <ComparisonExplanation 
        programs={mockPrograms}
        profile={mockProfile}
        isDetailed={true}
      />
    );
    
    // In detailed mode, the View Full Comparison button should be visible
    expect(screen.getByText('View Full Comparison')).toBeInTheDocument();
  });
  
  test('handles empty programs array gracefully', () => {
    renderWithTheme(
      <ComparisonExplanation 
        programs={[]}
        profile={mockProfile}
      />
    );
    
    // Should display message for no programs
    expect(screen.getByText('Select multiple programs to see a detailed comparison explanation.')).toBeInTheDocument();
  });
  
  test('handles single program gracefully', () => {
    renderWithTheme(
      <ComparisonExplanation 
        programs={[mockPrograms[0]]}
        profile={mockProfile}
      />
    );
    
    // Should display message for single program
    expect(screen.getByText('Select multiple programs to see a detailed comparison explanation.')).toBeInTheDocument();
  });
});
