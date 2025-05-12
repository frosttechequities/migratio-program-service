import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import DocumentSelector from '../DocumentSelector';

// Mock axios
jest.mock('axios');

// Mock data
const mockRoadmapId = '123456789012345678901234';
const mockPhaseIndex = 0;
const mockMilestoneIndex = 0;
const mockMilestone = {
  title: 'Test Milestone',
  documents: [
    { documentId: 'doc1', status: 'pending' }
  ]
};
const mockDocuments = [
  { _id: 'doc1', originalName: 'passport.pdf', documentType: 'Identification', category: 'Personal', createdAt: new Date() },
  { _id: 'doc2', originalName: 'resume.pdf', documentType: 'Professional', category: 'Employment', createdAt: new Date() }
];

describe('DocumentSelector Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('renders the component correctly', async () => {
    // Mock axios.get to return documents
    axios.get.mockResolvedValueOnce({ data: { data: mockDocuments } });

    render(
      <DocumentSelector
        show={true}
        onHide={() => {}}
        roadmapId={mockRoadmapId}
        phaseIndex={mockPhaseIndex}
        milestoneIndex={mockMilestoneIndex}
        milestone={mockMilestone}
        onDocumentAssigned={() => {}}
      />
    );

    // Check if the modal title is rendered
    expect(screen.getByText('Assign Documents to Milestone')).toBeInTheDocument();

    // Wait for documents to load
    await waitFor(() => {
      expect(screen.getByText('passport.pdf')).toBeInTheDocument();
      expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });

    // Check if the document that's already assigned has a badge
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('handles document selection correctly', async () => {
    // Mock axios.get to return documents
    axios.get.mockResolvedValueOnce({ data: { data: mockDocuments } });

    render(
      <DocumentSelector
        show={true}
        onHide={() => {}}
        roadmapId={mockRoadmapId}
        phaseIndex={mockPhaseIndex}
        milestoneIndex={mockMilestoneIndex}
        milestone={mockMilestone}
        onDocumentAssigned={() => {}}
      />
    );

    // Wait for documents to load
    await waitFor(() => {
      expect(screen.getByText('passport.pdf')).toBeInTheDocument();
    });

    // Click on the second document to select it
    fireEvent.click(screen.getByText('resume.pdf'));

    // Check if the save button is enabled
    expect(screen.getByText('Save Document Assignments')).not.toBeDisabled();
  });

  it('handles document assignment correctly', async () => {
    // Mock axios.get to return documents
    axios.get.mockResolvedValueOnce({ data: { data: mockDocuments } });
    
    // Mock axios.put for document assignment
    axios.put.mockResolvedValueOnce({ data: { success: true } });

    const mockOnDocumentAssigned = jest.fn();

    render(
      <DocumentSelector
        show={true}
        onHide={() => {}}
        roadmapId={mockRoadmapId}
        phaseIndex={mockPhaseIndex}
        milestoneIndex={mockMilestoneIndex}
        milestone={mockMilestone}
        onDocumentAssigned={mockOnDocumentAssigned}
      />
    );

    // Wait for documents to load
    await waitFor(() => {
      expect(screen.getByText('passport.pdf')).toBeInTheDocument();
    });

    // Click on the second document to select it
    fireEvent.click(screen.getByText('resume.pdf'));

    // Click the save button
    fireEvent.click(screen.getByText('Save Document Assignments'));

    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText('Documents successfully assigned to milestone!')).toBeInTheDocument();
    });

    // Check if the API was called with the correct parameters
    expect(axios.put).toHaveBeenCalledWith(
      `/api/roadmaps/${mockRoadmapId}/phases/${mockPhaseIndex}/milestones/${mockMilestoneIndex}/documents`,
      {
        documents: expect.arrayContaining([
          expect.objectContaining({
            documentId: 'doc1',
            status: 'pending'
          }),
          expect.objectContaining({
            documentId: 'doc2',
            status: 'pending'
          })
        ])
      }
    );

    // Check if the callback was called
    expect(mockOnDocumentAssigned).toHaveBeenCalled();
  });

  it('handles errors correctly', async () => {
    // Mock axios.get to return an error
    axios.get.mockRejectedValueOnce(new Error('Failed to load documents'));

    render(
      <DocumentSelector
        show={true}
        onHide={() => {}}
        roadmapId={mockRoadmapId}
        phaseIndex={mockPhaseIndex}
        milestoneIndex={mockMilestoneIndex}
        milestone={mockMilestone}
        onDocumentAssigned={() => {}}
      />
    );

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load documents. Please try again.')).toBeInTheDocument();
    });
  });

  it('handles empty document list correctly', async () => {
    // Mock axios.get to return empty documents array
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    render(
      <DocumentSelector
        show={true}
        onHide={() => {}}
        roadmapId={mockRoadmapId}
        phaseIndex={mockPhaseIndex}
        milestoneIndex={mockMilestoneIndex}
        milestone={mockMilestone}
        onDocumentAssigned={() => {}}
      />
    );

    // Wait for the empty state message
    await waitFor(() => {
      expect(screen.getByText('You don\'t have any documents yet. Upload documents first to assign them to milestones.')).toBeInTheDocument();
    });

    // Check if the upload button is rendered
    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
  });
});
