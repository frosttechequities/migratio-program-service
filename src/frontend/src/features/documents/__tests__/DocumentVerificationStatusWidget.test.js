import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentVerificationStatusWidget from '../components/DocumentVerificationStatusWidget';

describe('DocumentVerificationStatusWidget', () => {
  // Mock functions
  const mockRequestVerification = jest.fn();
  const mockCancelVerification = jest.fn();
  
  // Mock document with different verification statuses
  const createMockDocument = (status, details = {}) => ({
    id: 'doc123',
    document_name: 'Test Document',
    document_type: 'passport',
    created_at: new Date().toISOString(),
    verificationStatus: status,
    verificationDetails: details,
    workflowState: details.workflowState || 'none'
  });

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders with no document', () => {
    render(
      <DocumentVerificationStatusWidget
        document={null}
        onRequestVerification={mockRequestVerification}
        onCancelVerification={mockCancelVerification}
      />
    );
    
    expect(screen.getByText('Document Verification Status')).toBeInTheDocument();
    expect(screen.getByText('No document information available')).toBeInTheDocument();
  });

  test('renders with pending_submission status', () => {
    const mockDocument = createMockDocument('pending_submission');
    
    render(
      <DocumentVerificationStatusWidget
        document={mockDocument}
        onRequestVerification={mockRequestVerification}
        onCancelVerification={mockCancelVerification}
      />
    );
    
    // Check status display
    expect(screen.getByText('Document Verification Status')).toBeInTheDocument();
    expect(screen.getByText('Current Status:')).toBeInTheDocument();
    expect(screen.getByText('Pending Submission')).toBeInTheDocument();
    
    // Check alert message
    expect(screen.getByText('Verification Required')).toBeInTheDocument();
    expect(screen.getByText(/This document requires verification/)).toBeInTheDocument();
    
    // Check action button
    const requestButton = screen.getByText('Request Verification');
    expect(requestButton).toBeInTheDocument();
    
    // Click the button and check if the function was called
    fireEvent.click(requestButton);
    expect(mockRequestVerification).toHaveBeenCalledWith('doc123');
  });

  test('renders with pending_verification status', () => {
    const mockDocument = createMockDocument('pending_verification', {
      requested_at: new Date().toISOString(),
      workflowState: 'pending_review'
    });
    
    render(
      <DocumentVerificationStatusWidget
        document={mockDocument}
        onRequestVerification={mockRequestVerification}
        onCancelVerification={mockCancelVerification}
      />
    );
    
    // Check status display
    expect(screen.getByText('Document Verification Status')).toBeInTheDocument();
    expect(screen.getByText('Current Status:')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Pending Review')).toBeInTheDocument();
    
    // Check alert message
    expect(screen.getByText('Verification Pending')).toBeInTheDocument();
    expect(screen.getByText(/Your document has been submitted for verification/)).toBeInTheDocument();
    
    // Check action button
    const cancelButton = screen.getByText('Cancel Verification');
    expect(cancelButton).toBeInTheDocument();
    
    // Click the button and check if the function was called
    fireEvent.click(cancelButton);
    expect(mockCancelVerification).toHaveBeenCalledWith('doc123');
  });

  test('renders with verification_in_progress status', () => {
    const mockDocument = createMockDocument('verification_in_progress', {
      requested_at: new Date().toISOString(),
      workflowState: 'under_review'
    });
    
    render(
      <DocumentVerificationStatusWidget
        document={mockDocument}
        onRequestVerification={mockRequestVerification}
        onCancelVerification={mockCancelVerification}
      />
    );
    
    // Check status display
    expect(screen.getByText('Document Verification Status')).toBeInTheDocument();
    expect(screen.getByText('Current Status:')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    
    // Check alert message
    expect(screen.getByText('Verification in Progress')).toBeInTheDocument();
    expect(screen.getByText(/Your document is currently being verified/)).toBeInTheDocument();
    
    // Check action button
    const cancelButton = screen.getByText('Cancel Verification');
    expect(cancelButton).toBeInTheDocument();
  });

  test('renders with verified status', () => {
    const mockDocument = createMockDocument('verified', {
      verifiedBy: 'system_automated',
      verifiedAt: new Date().toISOString(),
      workflowState: 'completed'
    });
    
    render(
      <DocumentVerificationStatusWidget
        document={mockDocument}
        onRequestVerification={mockRequestVerification}
        onCancelVerification={mockCancelVerification}
      />
    );
    
    // Check status display
    expect(screen.getByText('Document Verification Status')).toBeInTheDocument();
    expect(screen.getByText('Current Status:')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    
    // Check alert message
    expect(screen.getByText('Document Verified')).toBeInTheDocument();
    expect(screen.getByText(/This document has been successfully verified/)).toBeInTheDocument();
    
    // Check verification details
    expect(screen.getByText('Verification Details')).toBeInTheDocument();
    expect(screen.getByText('Verified By')).toBeInTheDocument();
    expect(screen.getByText('Automated System')).toBeInTheDocument();
    expect(screen.getByText('Verification Date')).toBeInTheDocument();
    
    // No action buttons should be present
    expect(screen.queryByText('Request Verification')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel Verification')).not.toBeInTheDocument();
  });

  test('renders with rejected status', () => {
    const mockDocument = createMockDocument('rejected', {
      verifiedBy: 'agent_manual',
      verifiedAt: new Date().toISOString(),
      rejectionReason: 'Document is expired',
      workflowState: 'completed'
    });
    
    render(
      <DocumentVerificationStatusWidget
        document={mockDocument}
        onRequestVerification={mockRequestVerification}
        onCancelVerification={mockCancelVerification}
      />
    );
    
    // Check status display
    expect(screen.getByText('Document Verification Status')).toBeInTheDocument();
    expect(screen.getByText('Current Status:')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
    
    // Check alert message
    expect(screen.getByText('Verification Rejected')).toBeInTheDocument();
    expect(screen.getByText('Document is expired')).toBeInTheDocument();
    
    // Check verification details
    expect(screen.getByText('Verification Details')).toBeInTheDocument();
    expect(screen.getByText('Verified By')).toBeInTheDocument();
    expect(screen.getByText('Manual Review')).toBeInTheDocument();
    
    // Check action button
    const requestButton = screen.getByText('Request Re-Verification');
    expect(requestButton).toBeInTheDocument();
    
    // Click the button and check if the function was called
    fireEvent.click(requestButton);
    expect(mockRequestVerification).toHaveBeenCalledWith('doc123');
  });

  test('renders with unable_to_verify status', () => {
    const mockDocument = createMockDocument('unable_to_verify', {
      verifiedBy: 'third_party_api',
      verifiedAt: new Date().toISOString(),
      verificationNotes: 'Unable to verify due to poor image quality',
      workflowState: 'completed'
    });
    
    render(
      <DocumentVerificationStatusWidget
        document={mockDocument}
        onRequestVerification={mockRequestVerification}
        onCancelVerification={mockCancelVerification}
      />
    );
    
    // Check status display
    expect(screen.getByText('Document Verification Status')).toBeInTheDocument();
    expect(screen.getByText('Current Status:')).toBeInTheDocument();
    expect(screen.getByText('Unable to Verify')).toBeInTheDocument();
    
    // Check alert message
    expect(screen.getByText('Unable to Verify')).toBeInTheDocument();
    expect(screen.getByText(/We were unable to verify this document/)).toBeInTheDocument();
    
    // Check verification details
    expect(screen.getByText('Verification Details')).toBeInTheDocument();
    expect(screen.getByText('Verified By')).toBeInTheDocument();
    expect(screen.getByText('Third-Party Service')).toBeInTheDocument();
    expect(screen.getByText('Verification Notes')).toBeInTheDocument();
    expect(screen.getByText('Unable to verify due to poor image quality')).toBeInTheDocument();
    
    // Check action button
    const requestButton = screen.getByText('Request Re-Verification');
    expect(requestButton).toBeInTheDocument();
  });

  test('renders with not_required status', () => {
    const mockDocument = createMockDocument('not_required');
    
    render(
      <DocumentVerificationStatusWidget
        document={mockDocument}
        onRequestVerification={mockRequestVerification}
        onCancelVerification={mockCancelVerification}
      />
    );
    
    // Check status display
    expect(screen.getByText('Document Verification Status')).toBeInTheDocument();
    expect(screen.getByText('Current Status:')).toBeInTheDocument();
    expect(screen.getByText('Not Required')).toBeInTheDocument();
    
    // Check alert message
    expect(screen.getByText('Verification Not Required')).toBeInTheDocument();
    expect(screen.getByText(/This document type does not require verification/)).toBeInTheDocument();
    
    // No action buttons should be present
    expect(screen.queryByText('Request Verification')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel Verification')).not.toBeInTheDocument();
  });

  test('renders verification timeline correctly', () => {
    const mockDocument = createMockDocument('verification_in_progress', {
      requested_at: new Date().toISOString(),
      workflowState: 'under_review'
    });
    
    render(
      <DocumentVerificationStatusWidget
        document={mockDocument}
        onRequestVerification={mockRequestVerification}
        onCancelVerification={mockCancelVerification}
      />
    );
    
    // Check timeline section
    expect(screen.getByText('Verification Timeline')).toBeInTheDocument();
    
    // Check steps
    expect(screen.getByText('Document Submission')).toBeInTheDocument();
    expect(screen.getByText('Initial Review')).toBeInTheDocument();
    expect(screen.getByText('Detailed Verification')).toBeInTheDocument();
    expect(screen.getByText('Verification Complete')).toBeInTheDocument();
  });
});
