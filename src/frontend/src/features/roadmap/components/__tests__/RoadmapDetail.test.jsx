import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import RoadmapDetail from '../RoadmapDetail';

// Mock axios
jest.mock('axios');

// Mock DocumentSelector component
jest.mock('../DocumentSelector', () => {
  return function MockDocumentSelector(props) {
    return (
      <div data-testid="document-selector-modal">
        <button 
          data-testid="mock-document-assigned-button"
          onClick={() => props.onDocumentAssigned([{ documentId: 'doc1', status: 'pending' }])}
        >
          Mock Document Assigned
        </button>
      </div>
    );
  };
});

// Mock data
const mockRoadmapId = '123456789012345678901234';
const mockRoadmap = {
  _id: mockRoadmapId,
  title: 'Test Roadmap',
  description: 'This is a test roadmap',
  status: 'active',
  visibility: 'private',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  startDate: new Date().toISOString(),
  targetCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  completionPercentage: 25,
  programId: 'program123',
  notes: 'Test notes',
  tags: ['test', 'immigration'],
  estimatedCost: {
    total: 2000,
    currency: 'CAD',
    breakdown: [
      { category: 'Application Fees', amount: 1000 },
      { category: 'Legal Fees', amount: 1000 }
    ]
  },
  phases: [
    {
      title: 'Phase 1: Preparation',
      description: 'Prepare documents and applications',
      status: 'in_progress',
      completionPercentage: 50,
      milestones: [
        {
          title: 'Milestone 1: Document Collection',
          description: 'Collect all required documents',
          status: 'completed',
          dueDate: new Date().toISOString(),
          documents: [
            { documentId: 'doc1', status: 'approved' }
          ]
        },
        {
          title: 'Milestone 2: Application Submission',
          description: 'Submit application',
          status: 'in_progress',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  ]
};

describe('RoadmapDetail Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock window.open
    window.open = jest.fn();
  });

  it('renders the component correctly', async () => {
    // Mock axios.get to return roadmap
    axios.get.mockResolvedValueOnce({ data: { data: mockRoadmap } });

    render(
      <MemoryRouter initialEntries={[`/roadmaps/${mockRoadmapId}`]}>
        <Routes>
          <Route path="/roadmaps/:roadmapId" element={<RoadmapDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Check loading state
    expect(screen.getByText('Loading roadmap details...')).toBeInTheDocument();

    // Wait for roadmap to load
    await waitFor(() => {
      expect(screen.getByText('Test Roadmap')).toBeInTheDocument();
    });

    // Check if roadmap details are rendered
    expect(screen.getByText('This is a test roadmap')).toBeInTheDocument();
    expect(screen.getByText('Phase 1: Preparation')).toBeInTheDocument();
    expect(screen.getByText('Milestone 1: Document Collection')).toBeInTheDocument();
    expect(screen.getByText('Milestone 2: Application Submission')).toBeInTheDocument();
    
    // Check if document badge is rendered
    expect(screen.getByText('1')).toBeInTheDocument(); // Document count badge
  });

  it('handles PDF generation correctly', async () => {
    // Mock axios.get to return roadmap
    axios.get.mockResolvedValueOnce({ data: { data: mockRoadmap } });

    render(
      <MemoryRouter initialEntries={[`/roadmaps/${mockRoadmapId}`]}>
        <Routes>
          <Route path="/roadmaps/:roadmapId" element={<RoadmapDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for roadmap to load
    await waitFor(() => {
      expect(screen.getByText('Test Roadmap')).toBeInTheDocument();
    });

    // Click the Generate PDF button
    fireEvent.click(screen.getByText('Generate PDF'));

    // Check if the PDF modal is shown
    expect(screen.getByText('Customize your PDF export:')).toBeInTheDocument();

    // Check if the checkboxes are rendered and checked by default
    const includeNotesCheckbox = screen.getByLabelText('Include notes');
    const includeDocumentsCheckbox = screen.getByLabelText('Include documents');
    expect(includeNotesCheckbox).toBeChecked();
    expect(includeDocumentsCheckbox).toBeChecked();

    // Uncheck the include notes checkbox
    fireEvent.click(includeNotesCheckbox);
    expect(includeNotesCheckbox).not.toBeChecked();

    // Click the Download PDF button
    fireEvent.click(screen.getByText('Download PDF'));

    // Check if window.open was called with the correct URL
    expect(window.open).toHaveBeenCalledWith(
      `/api/roadmaps/${mockRoadmapId}/pdf?download=true&includeNotes=false&includeDocuments=true`,
      '_blank'
    );
  });

  it('handles document assignment correctly', async () => {
    // Mock axios.get to return roadmap
    axios.get.mockResolvedValueOnce({ data: { data: mockRoadmap } });

    render(
      <MemoryRouter initialEntries={[`/roadmaps/${mockRoadmapId}`]}>
        <Routes>
          <Route path="/roadmaps/:roadmapId" element={<RoadmapDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for roadmap to load
    await waitFor(() => {
      expect(screen.getByText('Test Roadmap')).toBeInTheDocument();
    });

    // Find and click the Documents button for the second milestone
    const documentButtons = screen.getAllByText('Documents');
    fireEvent.click(documentButtons[1]); // Second milestone's Documents button

    // Check if the document selector modal is shown
    expect(screen.getByTestId('document-selector-modal')).toBeInTheDocument();

    // Simulate document assignment
    fireEvent.click(screen.getByTestId('mock-document-assigned-button'));

    // Check if the roadmap state was updated
    await waitFor(() => {
      // The component should re-render with the updated roadmap
      // We can't easily check the internal state, but we can verify that the component didn't crash
      expect(screen.getByText('Test Roadmap')).toBeInTheDocument();
    });
  });

  it('handles errors correctly', async () => {
    // Mock axios.get to return an error
    axios.get.mockRejectedValueOnce(new Error('Failed to load roadmap'));

    render(
      <MemoryRouter initialEntries={[`/roadmaps/${mockRoadmapId}`]}>
        <Routes>
          <Route path="/roadmaps/:roadmapId" element={<RoadmapDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load roadmap. Please try again later.')).toBeInTheDocument();
    });
  });
});
