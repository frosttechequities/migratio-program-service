import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RoadmapWidget from '../RoadmapWidget';

// Wrap component with BrowserRouter for Link components
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('RoadmapWidget', () => {
  const mockRoadmaps = [
    {
      _id: 'roadmap1',
      title: 'Canada Express Entry',
      status: 'active',
      completionPercentage: 30,
      updatedAt: '2023-01-15T12:00:00Z',
      phases: [
        {
          title: 'Preparation Phase',
          status: 'in_progress',
          milestones: [
            {
              title: 'Language Test',
              status: 'completed',
              dueDate: '2023-01-01T12:00:00Z'
            },
            {
              title: 'Education Assessment',
              status: 'in_progress',
              dueDate: '2023-02-15T12:00:00Z'
            }
          ]
        },
        {
          title: 'Application Phase',
          status: 'not_started',
          milestones: [
            {
              title: 'Submit Application',
              status: 'not_started',
              dueDate: '2023-03-15T12:00:00Z'
            }
          ]
        }
      ]
    },
    {
      _id: 'roadmap2',
      title: 'Australia Skilled Worker',
      status: 'draft',
      completionPercentage: 10,
      updatedAt: '2023-01-10T12:00:00Z',
      phases: [
        {
          title: 'Preparation Phase',
          status: 'in_progress',
          milestones: [
            {
              title: 'Language Test',
              status: 'not_started',
              dueDate: '2023-02-01T12:00:00Z'
            }
          ]
        }
      ]
    }
  ];

  it('renders without crashing', () => {
    renderWithRouter(<RoadmapWidget data={mockRoadmaps} />);
    expect(screen.getByText('Your Roadmaps')).toBeInTheDocument();
  });

  it('displays the latest roadmap correctly', () => {
    renderWithRouter(<RoadmapWidget data={mockRoadmaps} />);
    
    expect(screen.getByText('Canada Express Entry')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('Current Phase: Preparation Phase')).toBeInTheDocument();
  });

  it('displays next milestones correctly', () => {
    renderWithRouter(<RoadmapWidget data={mockRoadmaps} />);
    
    expect(screen.getByText('Next Milestones')).toBeInTheDocument();
    expect(screen.getByText('Education Assessment')).toBeInTheDocument();
  });

  it('displays other roadmaps correctly', () => {
    renderWithRouter(<RoadmapWidget data={mockRoadmaps} />);
    
    expect(screen.getByText('Other Roadmaps')).toBeInTheDocument();
    expect(screen.getByText('Australia Skilled Worker')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    renderWithRouter(<RoadmapWidget data={[]} />);
    
    expect(screen.getByText('Your Roadmaps')).toBeInTheDocument();
    expect(screen.getByText('You don\'t have any roadmaps yet')).toBeInTheDocument();
    expect(screen.getByText('Create Your First Roadmap')).toBeInTheDocument();
  });

  it('handles null data gracefully', () => {
    renderWithRouter(<RoadmapWidget data={null} />);
    
    expect(screen.getByText('Your Roadmaps')).toBeInTheDocument();
    expect(screen.getByText('You don\'t have any roadmaps yet')).toBeInTheDocument();
  });

  it('displays create new roadmap button', () => {
    renderWithRouter(<RoadmapWidget data={mockRoadmaps} />);
    
    expect(screen.getByText('Create New Roadmap')).toBeInTheDocument();
  });
});
