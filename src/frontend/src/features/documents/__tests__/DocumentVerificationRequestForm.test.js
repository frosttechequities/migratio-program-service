import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentVerificationRequestForm from '../components/DocumentVerificationRequestForm';

describe('DocumentVerificationRequestForm', () => {
  // Mock functions
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();
  
  // Mock document
  const mockDocument = {
    id: 'doc123',
    document_name: 'Test Document',
    document_type: 'passport',
    originalFilename: 'passport.pdf',
    created_at: new Date().toISOString()
  };

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders with no document', () => {
    render(
      <DocumentVerificationRequestForm
        document={null}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );
    
    expect(screen.getByText('Request Document Verification')).toBeInTheDocument();
    expect(screen.getByText('No document information available')).toBeInTheDocument();
  });

  test('renders with document information', () => {
    render(
      <DocumentVerificationRequestForm
        document={mockDocument}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );
    
    // Check title and info alert
    expect(screen.getByText('Request Document Verification')).toBeInTheDocument();
    expect(screen.getByText('Verification Information')).toBeInTheDocument();
    
    // Check document information section
    expect(screen.getByText('Document Information')).toBeInTheDocument();
    expect(screen.getByText('Document Type:')).toBeInTheDocument();
    expect(screen.getByText('passport')).toBeInTheDocument();
    expect(screen.getByText('File Name:')).toBeInTheDocument();
    expect(screen.getByText('passport.pdf')).toBeInTheDocument();
    
    // Check verification method options
    expect(screen.getByText('Verification Method')).toBeInTheDocument();
    expect(screen.getByText('Standard Verification')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Verification')).toBeInTheDocument();
    expect(screen.getByText('Third-Party Verification')).toBeInTheDocument();
    
    // Check additional options
    expect(screen.getByText('Expedited Processing')).toBeInTheDocument();
    
    // Check additional notes field
    expect(screen.getByLabelText('Additional Notes')).toBeInTheDocument();
    
    // Check benefits section
    expect(screen.getByText('Benefits of Document Verification')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Security')).toBeInTheDocument();
    expect(screen.getByText('Faster Processing')).toBeInTheDocument();
    expect(screen.getByText('Higher Acceptance Rate')).toBeInTheDocument();
    
    // Check terms and conditions
    expect(screen.getByText(/I understand that document verification may require additional information/)).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit Verification Request')).toBeInTheDocument();
    
    // Submit button should be disabled initially (terms not accepted)
    expect(screen.getByText('Submit Verification Request')).toBeDisabled();
  });

  test('enables submit button when terms are accepted', () => {
    render(
      <DocumentVerificationRequestForm
        document={mockDocument}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );
    
    // Submit button should be disabled initially
    const submitButton = screen.getByText('Submit Verification Request');
    expect(submitButton).toBeDisabled();
    
    // Accept terms
    const termsCheckbox = screen.getByLabelText(/I understand that document verification may require additional information/);
    fireEvent.click(termsCheckbox);
    
    // Submit button should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  test('calls onSubmit with correct data when form is submitted', async () => {
    render(
      <DocumentVerificationRequestForm
        document={mockDocument}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );
    
    // Select verification method
    const enhancedVerificationOption = screen.getByLabelText(/Enhanced Verification/);
    fireEvent.click(enhancedVerificationOption);
    
    // Select expedited processing
    const expeditedCheckbox = screen.getByLabelText(/Expedited Processing/);
    fireEvent.click(expeditedCheckbox);
    
    // Add additional notes
    const notesField = screen.getByLabelText('Additional Notes');
    fireEvent.change(notesField, { target: { value: 'Urgent verification needed' } });
    
    // Accept terms
    const termsCheckbox = screen.getByLabelText(/I understand that document verification may require additional information/);
    fireEvent.click(termsCheckbox);
    
    // Submit form
    const submitButton = screen.getByText('Submit Verification Request');
    fireEvent.click(submitButton);
    
    // Check if onSubmit was called with correct data
    expect(mockSubmit).toHaveBeenCalledWith({
      documentId: 'doc123',
      verificationMethod: 'enhanced',
      additionalNotes: 'Urgent verification needed',
      expedited: true,
      termsAccepted: true
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <DocumentVerificationRequestForm
        document={mockDocument}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );
    
    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Check if onCancel was called
    expect(mockCancel).toHaveBeenCalled();
  });

  test('disables buttons when isSubmitting is true', () => {
    render(
      <DocumentVerificationRequestForm
        document={mockDocument}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isSubmitting={true}
      />
    );
    
    // Both buttons should be disabled
    expect(screen.getByText('Cancel')).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(screen.getByText('Submitting...')).toBeDisabled();
  });

  test('shows different verification method descriptions', () => {
    render(
      <DocumentVerificationRequestForm
        document={mockDocument}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );
    
    // Standard verification description
    expect(screen.getByText(/Basic verification of document authenticity and content/)).toBeInTheDocument();
    expect(screen.getByText(/Processing time: 2-3 business days/)).toBeInTheDocument();
    
    // Enhanced verification description
    expect(screen.getByText(/Detailed verification with additional security checks/)).toBeInTheDocument();
    expect(screen.getByText(/Processing time: 3-5 business days/)).toBeInTheDocument();
    
    // Third-party verification description
    expect(screen.getByText(/Verification through an accredited third-party service/)).toBeInTheDocument();
    expect(screen.getByText(/Processing time: 5-7 business days/)).toBeInTheDocument();
  });

  test('shows expedited processing description', () => {
    render(
      <DocumentVerificationRequestForm
        document={mockDocument}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );
    
    // Expedited processing description
    expect(screen.getByText(/Request expedited processing for urgent cases/)).toBeInTheDocument();
    expect(screen.getByText(/Processing time: 1 business day/)).toBeInTheDocument();
  });
});
