import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardOverview from '../DashboardOverview';

describe('DashboardOverview', () => {
  const mockData = {
    profileCompletion: 75,
    assessmentCompletion: 100,
    roadmapProgress: 30,
    documentsUploaded: 5,
    documentsRequired: 10,
    tasksCompleted: 8,
    totalTasks: 15,
    daysActive: 30,
    nextDeadline: '2023-12-31'
  };

  it('renders without crashing', () => {
    render(<DashboardOverview data={mockData} />);
    expect(screen.getByText('Your Progress')).toBeInTheDocument();
  });

  it('displays progress bars correctly', () => {
    render(<DashboardOverview data={mockData} />);
    
    // Check profile completion
    expect(screen.getByText('Profile Completion')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    
    // Check assessment completion
    expect(screen.getByText('Assessment Completion')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // Check roadmap progress
    expect(screen.getByText('Roadmap Progress')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    
    // Check documents
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('displays stats chips correctly', () => {
    render(<DashboardOverview data={mockData} />);
    
    expect(screen.getByText('30 Days Active')).toBeInTheDocument();
    expect(screen.getByText('8/15 Tasks Completed')).toBeInTheDocument();
    expect(screen.getByText('5/10 Documents Uploaded')).toBeInTheDocument();
    expect(screen.getByText('Next Deadline: 12/31/2023')).toBeInTheDocument();
  });

  it('handles missing data gracefully', () => {
    render(<DashboardOverview data={null} />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('handles partial data gracefully', () => {
    const partialData = {
      profileCompletion: 50,
      // Missing other fields
    };
    
    render(<DashboardOverview data={partialData} />);
    
    expect(screen.getByText('Your Progress')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument(); // Default for missing fields
  });
});
