import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import VisualExplanation from '../components/VisualExplanation';

// Create a theme for testing
const theme = createTheme();

// Mock Recharts components
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    RadarChart: ({ children }) => <div data-testid="radar-chart">{children}</div>,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
    Radar: () => <div data-testid="radar" />,
    Bar: () => <div data-testid="bar" />,
    Pie: () => <div data-testid="pie" />,
    PolarGrid: () => <div data-testid="polar-grid" />,
    PolarAngleAxis: () => <div data-testid="polar-angle-axis" />,
    PolarRadiusAxis: () => <div data-testid="polar-radius-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Cell: () => <div data-testid="cell" />
  };
});

// Mock data
const mockProgram = {
  programName: 'Express Entry',
  countryName: 'Canada',
  matchScore: 85,
  successProbability: 75
};

const mockMatchFactors = [
  { name: 'Education', type: 'education', contribution: 25 },
  { name: 'Work Experience', type: 'work', contribution: 15 },
  { name: 'Language Proficiency', type: 'language', contribution: 20 },
  { name: 'Age', type: 'personal', contribution: -5 }
];

const mockSuccessFactors = [
  { name: 'Education Level', type: 'education', impact: 20 },
  { name: 'Language Proficiency', type: 'language', impact: 15 },
  { name: 'Work Experience', type: 'work', impact: -10 }
];

const mockComparisonPrograms = [
  {
    programName: 'Skilled Independent Visa',
    countryName: 'Australia',
    matchScore: 78,
    successProbability: 68
  },
  {
    programName: 'Skilled Migrant Category',
    countryName: 'New Zealand',
    matchScore: 72,
    successProbability: 65
  }
];

// Wrapper component with theme
const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('VisualExplanation Component', () => {
  test('renders with minimal props', () => {
    renderWithTheme(<VisualExplanation />);
    
    // Check if the component renders without crashing
    expect(screen.getByText('Visual Explanation')).toBeInTheDocument();
    expect(screen.getByText('No data available for visualization')).toBeInTheDocument();
  });
  
  test('renders radar chart by default', () => {
    renderWithTheme(
      <VisualExplanation 
        program={mockProgram} 
        matchFactors={mockMatchFactors}
        chartType="radar"
      />
    );
    
    // Check if radar chart is displayed
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    expect(screen.getByText('This chart shows how well your profile matches the program requirements in different areas.')).toBeInTheDocument();
  });
  
  test('renders bar chart when selected', () => {
    renderWithTheme(
      <VisualExplanation 
        program={mockProgram} 
        matchFactors={mockMatchFactors}
        chartType="bar"
      />
    );
    
    // Click on the Impact Analysis tab
    fireEvent.click(screen.getByText('Impact Analysis'));
    
    // Check if bar chart is displayed
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByText('This chart shows the positive and negative impacts of different factors on your match score.')).toBeInTheDocument();
  });
  
  test('renders pie chart when selected', () => {
    renderWithTheme(
      <VisualExplanation 
        program={mockProgram} 
        successFactors={mockSuccessFactors}
      />
    );
    
    // Click on the Success Factors tab
    fireEvent.click(screen.getByText('Success Factors'));
    
    // Check if pie chart is displayed
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByText('This chart shows the factors that contribute to your success probability.')).toBeInTheDocument();
  });
  
  test('renders comparison chart when comparison programs are provided', () => {
    renderWithTheme(
      <VisualExplanation 
        program={mockProgram} 
        matchFactors={mockMatchFactors}
        successFactors={mockSuccessFactors}
        comparisonPrograms={mockComparisonPrograms}
      />
    );
    
    // Check if comparison tab is available
    expect(screen.getByText('Comparison')).toBeInTheDocument();
    
    // Click on the Comparison tab
    fireEvent.click(screen.getByText('Comparison'));
    
    // Check if comparison chart is displayed
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByText('This chart compares your match score and success probability across different programs.')).toBeInTheDocument();
  });
  
  test('handles loading state correctly', () => {
    renderWithTheme(
      <VisualExplanation 
        program={mockProgram} 
        matchFactors={mockMatchFactors}
        isLoading={true}
      />
    );
    
    // Check if loading indicator is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  test('handles empty data gracefully', () => {
    renderWithTheme(
      <VisualExplanation 
        program={mockProgram} 
        matchFactors={[]}
        successFactors={[]}
      />
    );
    
    // Should display no data message
    expect(screen.getByText('No data available for visualization')).toBeInTheDocument();
  });
});
