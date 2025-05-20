import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Mock the components that cause import issues
jest.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
  AdapterDateFns: jest.fn()
}));

jest.mock('@mui/x-date-pickers', () => ({
  LocalizationProvider: ({ children }) => <div>{children}</div>,
  DatePicker: ({ label, value, onChange, renderInput }) => {
    const params = { placeholder: label };
    return (
      <div>
        <input
          aria-label={label}
          placeholder={label}
          data-testid="date-picker"
        />
      </div>
    );
  }
}));

// Import the component after mocking its dependencies
import DocumentUploader from '../DocumentUploader';

// Mock Redux store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock file
const createMockFile = (name, size, type) => {
  const file = new File(['dummy content'], name, { type });
  Object.defineProperty(file, 'size', {
    get() {
      return size;
    }
  });
  return file;
};

describe('DocumentUploader', () => {
  let store;
  const mockOnClose = jest.fn();

  beforeEach(() => {
    store = mockStore({
      documents: {
        isLoading: false,
        uploadProgress: 0
      }
    });

    // Mock dispatch
    store.dispatch = jest.fn();

    // Reset mock function
    mockOnClose.mockClear();
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
  });

  test('displays file upload area', () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );
    expect(screen.getByText('Drag and drop a file here or click to browse')).toBeInTheDocument();
    expect(screen.getByText('Supported formats: PDF, JPEG, PNG, TIFF, Word, Excel')).toBeInTheDocument();
    expect(screen.getByText('Document processing is completely free')).toBeInTheDocument();
  });

  test('displays document metadata fields', () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );
    expect(screen.getByLabelText('Document Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Document Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Expiry Date (if applicable)')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes (optional)')).toBeInTheDocument();
  });

  test('displays document type options', () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );

    // Open the select dropdown
    fireEvent.mouseDown(screen.getByLabelText('Document Type'));

    // Check that document type options are displayed
    expect(screen.getByText('Passport')).toBeInTheDocument();
    expect(screen.getByText('Language Test Result')).toBeInTheDocument();
    expect(screen.getByText('Education Credential')).toBeInTheDocument();
    expect(screen.getByText('Employment Letter')).toBeInTheDocument();
  });

  test('handles file selection', async () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );

    // Create a mock file
    const file = createMockFile('test.pdf', 1024 * 1024, 'application/pdf');

    // Get the file input (it's hidden, so we need to access it directly)
    const fileInput = document.querySelector('input[type="file"]');

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check that the file name is displayed
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByText('1.00 MB')).toBeInTheDocument();
    });
  });

  test('validates file type', async () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );

    // Create an invalid file type
    const file = createMockFile('test.exe', 1024 * 1024, 'application/x-msdownload');

    // Get the file input
    const fileInput = document.querySelector('input[type="file"]');

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check that an error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid file type. Please upload a PDF, image, or Office document.')).toBeInTheDocument();
    });
  });

  test('validates file size', async () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );

    // Create a file that's too large (11MB)
    const file = createMockFile('large.pdf', 11 * 1024 * 1024, 'application/pdf');

    // Get the file input
    const fileInput = document.querySelector('input[type="file"]');

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check that an error message is displayed
    await waitFor(() => {
      expect(screen.getByText('File too large. Maximum size is 10MB.')).toBeInTheDocument();
    });
  });

  test('validates required fields before submission', async () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );

    // Click the upload button without selecting a file or document type
    fireEvent.click(screen.getByText('Upload'));

    // Check that error messages are displayed
    await waitFor(() => {
      expect(screen.getByText('Please select a file to upload')).toBeInTheDocument();
      expect(screen.getByText('Please select a document type')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );

    // Create a valid file
    const file = createMockFile('test.pdf', 1024 * 1024, 'application/pdf');

    // Get the file input
    const fileInput = document.querySelector('input[type="file"]');

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Fill in document name
    fireEvent.change(screen.getByLabelText('Document Name'), { target: { value: 'Test Document' } });

    // Select document type
    fireEvent.mouseDown(screen.getByLabelText('Document Type'));
    fireEvent.click(screen.getByText('Passport'));

    // Click the upload button
    fireEvent.click(screen.getByText('Upload'));

    // Check that the upload action was dispatched
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  test('displays upload progress', async () => {
    // Create store with upload in progress
    const loadingStore = mockStore({
      documents: {
        isLoading: true,
        uploadProgress: 50
      }
    });
    loadingStore.dispatch = jest.fn();

    render(
      <Provider store={loadingStore}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );

    // Check that progress is displayed
    expect(screen.getByText('50% Uploaded')).toBeInTheDocument();

    // Check that buttons are disabled during upload
    expect(screen.getByText('Cancel')).toBeDisabled();
    expect(screen.getByText('Upload')).toBeDisabled();
  });

  test('closes dialog when cancel button is clicked', () => {
    render(
      <Provider store={store}>
        <DocumentUploader open={true} onClose={mockOnClose} />
      </Provider>
    );

    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Check that onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});
