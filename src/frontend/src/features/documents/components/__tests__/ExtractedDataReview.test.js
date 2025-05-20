import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ExtractedDataReview from '../ExtractedDataReview';

// Mock Redux store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock document data for passport
const mockPassportDocument = {
  id: 1,
  name: 'Test Passport',
  document_type: 'passport',
  extracted_data: {
    passportNumber: 'AB123456',
    name: 'JOHN DOE',
    dateOfBirth: '01/01/1980',
    nationality: 'UNITED STATES',
    expiryDate: '01/01/2030',
    confidence: 0.85
  }
};

// Mock document data for language test
const mockLanguageTestDocument = {
  id: 2,
  name: 'Test Language Test',
  document_type: 'language_test',
  extracted_data: {
    testType: 'IELTS',
    candidateName: 'JOHN DOE',
    testDate: '01/01/2023',
    scores: {
      listening: 8.5,
      reading: 7.5,
      writing: 7.0,
      speaking: 8.0,
      overall: 7.5
    },
    confidence: 0.9
  }
};

// Mock document data for education credential
const mockEducationDocument = {
  id: 3,
  name: 'Test Education Credential',
  document_type: 'education_credential',
  extracted_data: {
    institution: 'HARVARD UNIVERSITY',
    degree: 'BACHELOR OF SCIENCE',
    graduationDate: '05/15/2020',
    studentName: 'JOHN DOE',
    confidence: 0.8
  }
};

// Mock document with generic data
const mockGenericDocument = {
  id: 4,
  name: 'Test Generic Document',
  document_type: 'other',
  extracted_data: {
    dates: ['01/01/2023', '02/15/2023'],
    names: ['JOHN DOE', 'JANE SMITH'],
    numbers: ['AB123456', 'CD789012'],
    confidence: 0.7
  }
};

describe('ExtractedDataReview', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      documents: {
        isLoading: false,
        isError: false,
        error: null
      }
    });
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <ExtractedDataReview document={mockPassportDocument} />
      </Provider>
    );
    expect(screen.getByText('Extracted Data')).toBeInTheDocument();
  });

  test('displays passport data correctly', () => {
    render(
      <Provider store={store}>
        <ExtractedDataReview document={mockPassportDocument} />
      </Provider>
    );
    expect(screen.getByText('Passport Number')).toBeInTheDocument();
    expect(screen.getByText('AB123456')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('01/01/1980')).toBeInTheDocument();
    expect(screen.getByText('Nationality')).toBeInTheDocument();
    expect(screen.getByText('UNITED STATES')).toBeInTheDocument();
    expect(screen.getByText('Expiry Date')).toBeInTheDocument();
    expect(screen.getByText('01/01/2030')).toBeInTheDocument();
    expect(screen.getByText(/Extraction Confidence: 85%/)).toBeInTheDocument();
  });

  test('displays language test data correctly', () => {
    render(
      <Provider store={store}>
        <ExtractedDataReview document={mockLanguageTestDocument} />
      </Provider>
    );
    expect(screen.getByText('Test Type')).toBeInTheDocument();
    expect(screen.getByText('IELTS')).toBeInTheDocument();
    expect(screen.getByText('Candidate Name')).toBeInTheDocument();
    expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
    expect(screen.getByText('Test Date')).toBeInTheDocument();
    expect(screen.getByText('01/01/2023')).toBeInTheDocument();
    expect(screen.getByText('Scores')).toBeInTheDocument();
    expect(screen.getByText(/Extraction Confidence: 90%/)).toBeInTheDocument();
  });

  test('displays education credential data correctly', () => {
    render(
      <Provider store={store}>
        <ExtractedDataReview document={mockEducationDocument} />
      </Provider>
    );
    expect(screen.getByText('Institution')).toBeInTheDocument();
    expect(screen.getByText('HARVARD UNIVERSITY')).toBeInTheDocument();
    expect(screen.getByText('Degree')).toBeInTheDocument();
    expect(screen.getByText('BACHELOR OF SCIENCE')).toBeInTheDocument();
    expect(screen.getByText('Graduation Date')).toBeInTheDocument();
    expect(screen.getByText('05/15/2020')).toBeInTheDocument();
    expect(screen.getByText('Student Name')).toBeInTheDocument();
    expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
    expect(screen.getByText(/Extraction Confidence: 80%/)).toBeInTheDocument();
  });

  test('displays generic document data correctly', () => {
    render(
      <Provider store={store}>
        <ExtractedDataReview document={mockGenericDocument} />
      </Provider>
    );
    expect(screen.getByText('Field')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Dates')).toBeInTheDocument();
    expect(screen.getByText('Names')).toBeInTheDocument();
    expect(screen.getByText('Numbers')).toBeInTheDocument();
    expect(screen.getByText(/Extraction Confidence: 70%/)).toBeInTheDocument();
  });

  test('enters edit mode when edit button is clicked', () => {
    render(
      <Provider store={store}>
        <ExtractedDataReview document={mockPassportDocument} />
      </Provider>
    );
    
    // Find and click the edit button
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    
    // Check that we're in edit mode (save and cancel buttons are visible)
    expect(screen.getByTitle('Save')).toBeInTheDocument();
    expect(screen.getByTitle('Cancel')).toBeInTheDocument();
    
    // Check that text fields are present for editable data
    const textFields = screen.getAllByRole('textbox');
    expect(textFields.length).toBeGreaterThan(0);
  });

  test('exits edit mode when cancel button is clicked', () => {
    render(
      <Provider store={store}>
        <ExtractedDataReview document={mockPassportDocument} />
      </Provider>
    );
    
    // Enter edit mode
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    
    // Cancel editing
    const cancelButton = screen.getByTitle('Cancel');
    fireEvent.click(cancelButton);
    
    // Check that we're back in view mode
    expect(screen.getByTitle('Edit')).toBeInTheDocument();
    expect(screen.queryByTitle('Save')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Cancel')).not.toBeInTheDocument();
  });

  test('handles missing extracted data gracefully', () => {
    const documentWithoutExtractedData = {
      id: 5,
      name: 'Test Document',
      document_type: 'passport'
    };
    
    render(
      <Provider store={store}>
        <ExtractedDataReview document={documentWithoutExtractedData} />
      </Provider>
    );
    
    expect(screen.getByText('No data extracted from this document')).toBeInTheDocument();
  });

  test('handles null document gracefully', () => {
    render(
      <Provider store={store}>
        <ExtractedDataReview document={null} />
      </Provider>
    );
    
    expect(screen.getByText('No data extracted from this document')).toBeInTheDocument();
  });
});
