import axios from 'axios';
import { getTokenFromLocalStorage } from '../../utils/authUtils';

// Pointing to Document Service directly
const API_URL = process.env.REACT_APP_DOCUMENT_SERVICE_URL || 'http://localhost:3005/api';

const getAuthHeaders = () => {
  const token = getTokenFromLocalStorage();
  const headers = {
    'Content-Type': 'application/json', // Default, will be overridden for multipart
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Get all documents
const getDocuments = async () => {
  try {
    const response = await axios.get(`${API_URL}/documents`, { headers: getAuthHeaders() });
    // Expect backend to return { status: 'success', results: number, data: { documents: [] } }
    if (response.data?.status === 'success') {
        return response.data; // Return the full response object
    } else {
        throw new Error(response.data?.message || 'Failed to fetch documents');
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch documents';
    console.error('Get Documents Service Error:', message);
    throw new Error(message); // Re-throw for the slice to handle
  }
};

// Get document by ID
const getDocumentById = async (documentId) => {
  if (!documentId) throw new Error('Document ID is required');
  try {
    const response = await axios.get(`${API_URL}/documents/${documentId}`, { headers: getAuthHeaders() });
     // Expect backend to return { status: 'success', data: { document: {} } }
    if (response.data?.status === 'success') {
        return response.data; // Return the full response object
    } else {
        throw new Error(response.data?.message || `Failed to fetch document ${documentId}`);
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || `Failed to fetch document ${documentId}`;
    console.error(`Get Document By ID Service Error (${documentId}):`, message);
    throw new Error(message);
  }
};

// Upload document
const uploadDocument = async (file, metadata, onUploadProgress) => {
  if (!file) throw new Error('File is required for upload');

  try {
    const formData = new FormData();
    formData.append('documentFile', file); // Match the field name expected by backend (multer)

    // Add metadata fields to formData
    // Ensure metadata keys match backend expectations (e.g., documentTypeCode)
    if (metadata) {
      Object.keys(metadata).forEach(key => {
        // Handle potential objects/arrays in metadata if needed (e.g., JSON.stringify)
        if (typeof metadata[key] === 'object' && metadata[key] !== null) {
             formData.append(key, JSON.stringify(metadata[key]));
        } else {
             formData.append(key, metadata[key]);
        }
      });
    }

    const config = {
      headers: {
        // Interceptor should add Authorization
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress // Pass the progress callback to axios
    };

    const response = await axios.post(`${API_URL}/documents`, formData, config);
     // Expect backend to return { status: 'success', data: { document: {} } }
    if (response.data?.status === 'success') {
        return response.data; // Return the full response object
    } else {
        throw new Error(response.data?.message || 'Failed to upload document');
    }
  } catch (error) {
     const message = error.response?.data?.message || error.message || 'Failed to upload document';
    console.error('Upload Document Service Error:', message);
    throw new Error(message);
  }
};

// Update document
const updateDocument = async (documentId, data) => {
   if (!documentId) throw new Error('Document ID is required for update');
   if (!data || Object.keys(data).length === 0) throw new Error('Update data is required');

  try {
    // Use PATCH for partial updates, PUT could also be used if replacing the whole resource metadata
    const response = await axios.patch(`${API_URL}/documents/${documentId}`, data, { headers: getAuthHeaders() });
     // Expect backend to return { status: 'success', data: { document: {} } }
     if (response.data?.status === 'success') {
        return response.data; // Return the full response object
    } else {
        throw new Error(response.data?.message || `Failed to update document ${documentId}`);
    }
  } catch (error) {
     const message = error.response?.data?.message || error.message || `Failed to update document ${documentId}`;
    console.error(`Update Document Service Error (${documentId}):`, message);
    throw new Error(message);
  }
};

// Delete document
const deleteDocument = async (documentId) => {
   if (!documentId) throw new Error('Document ID is required for deletion');
  try {
    const response = await axios.delete(`${API_URL}/documents/${documentId}`, { headers: getAuthHeaders() });
     // Expect backend to return 204 No Content on success, or maybe { status: 'success', data: null }
     // Check for 204 status or success status in body
     if (response.status === 204 || response.data?.status === 'success') {
        return { success: true, documentId }; // Return ID for slice reducer
    } else {
        throw new Error(response.data?.message || `Failed to delete document ${documentId}`);
    }
  } catch (error) {
     const message = error.response?.data?.message || error.message || `Failed to delete document ${documentId}`;
    console.error(`Delete Document Service Error (${documentId}):`, message);
    throw new Error(message);
  }
};

// Get document categories/types (assuming an endpoint exists)
const getDocumentCategories = async () => {
  try {
    // Assuming an endpoint like /api/document-types exists (needs backend implementation)
    const response = await axios.get(`${API_URL}/document-types`, { headers: getAuthHeaders() }); // Adjust endpoint if needed
     // Expect backend to return { status: 'success', results: number, data: { documentTypes: [] } }
    if (response.data?.status === 'success') {
        return response.data; // Return the full response object
    } else {
        throw new Error(response.data?.message || 'Failed to fetch document types/categories');
    }
  } catch (error) {
     const message = error.response?.data?.message || error.message || 'Failed to fetch document types/categories';
    console.error('Get Document Categories Service Error:', message);
    // Don't throw here? Or let slice handle it? For now, re-throw.
    throw new Error(message);
  }
};

// Update document verification status
const updateDocumentVerification = async (documentId, verificationData) => {
  if (!documentId) throw new Error('Document ID is required for verification update');
  if (!verificationData || !verificationData.verificationStatus) throw new Error('Verification status is required');

  try {
    const response = await axios.patch(`${API_URL}/documents/${documentId}/verification`, verificationData, { headers: getAuthHeaders() });
    // Expect backend to return { status: 'success', data: { document: {} } }
    if (response.data?.status === 'success') {
        return response.data; // Return the full response object
    } else {
        throw new Error(response.data?.message || `Failed to update verification for document ${documentId}`);
    }
  } catch (error) {
     const message = error.response?.data?.message || error.message || `Failed to update verification for document ${documentId}`;
    console.error(`Update Document Verification Service Error (${documentId}):`, message);
    throw new Error(message);
  }
};

// Define the service object including all functions
const documentService = {
  getDocuments,
  getDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentCategories,
  updateDocumentVerification, // Include the function defined above
};

export default documentService; // Export the single service object
