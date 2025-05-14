import supabase, { getAuthenticatedClient } from '../../utils/supabaseClient';

/**
 * Get all documents for the current user
 * @returns {Promise<Object>} Documents data
 */
const getDocuments = async () => {
  try {
    console.log('[documentService] Fetching all documents...');

    // Get authenticated client
    const client = await getAuthenticatedClient();

    // Get the current user
    const { data: { user }, error: userError } = await client.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch user documents
    let documentsData = [];
    try {
      const { data, error } = await client
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      if (!error) {
        documentsData = data;
      } else {
        console.error('Error fetching documents:', error);
        // Return empty array instead of throwing
      }
    } catch (error) {
      console.error('Exception fetching documents:', error);
      // Return empty array instead of throwing
    }

    console.log('[documentService] Received documents:', documentsData);
    return {
      status: 'success',
      data: documentsData || []
    };
  } catch (error) {
    console.error('Get All Documents Service Error:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Get a document by ID
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Document data
 */
const getDocumentById = async (documentId) => {
  try {
    console.log(`[documentService] Fetching document ${documentId}...`);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch the document
    const { data: document, error: documentError } = await supabase
      .from('user_documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (documentError) throw documentError;

    console.log('[documentService] Received document:', document);
    return {
      status: 'success',
      data: document
    };
  } catch (error) {
    console.error(`Get Document By ID Service Error (${documentId}):`, error.message);
    throw new Error(error.message);
  }
};

/**
 * Upload a document
 * @param {File} file - File to upload
 * @param {Object} metadata - Document metadata
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise<Object>} Uploaded document data
 */
const uploadDocument = async (file, metadata, onUploadProgress) => {
  try {
    console.log('[documentService] Uploading document...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Call progress callback if provided
    if (onUploadProgress) {
      onUploadProgress({ loaded: 10, total: 100 }); // Initial progress
    }

    // Upload the file to storage
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `documents/${user.id}/${fileName}`;

    const { error: fileError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (fileError) throw fileError;

    // Call progress callback if provided
    if (onUploadProgress) {
      onUploadProgress({ loaded: 50, total: 100 }); // Mid progress
    }

    // Create a record in the user_documents table
    const { data: document, error: documentError } = await supabase
      .from('user_documents')
      .insert([
        {
          user_id: user.id,
          name: metadata.name || file.name,
          file_path: filePath,
          file_type: file.type,
          document_type: metadata.documentType || 'other',
          status: 'pending',
          upload_date: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (documentError) throw documentError;

    // Call progress callback if provided
    if (onUploadProgress) {
      onUploadProgress({ loaded: 100, total: 100 }); // Complete
    }

    console.log('[documentService] Document uploaded successfully:', document);
    return {
      status: 'success',
      data: document
    };
  } catch (error) {
    console.error('Upload Document Service Error:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Update a document
 * @param {string} documentId - Document ID
 * @param {Object} data - Updated document data
 * @returns {Promise<Object>} Updated document data
 */
const updateDocument = async (documentId, data) => {
  try {
    console.log(`[documentService] Updating document ${documentId}...`);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update the document
    const { data: updatedDocument, error: updateError } = await supabase
      .from('user_documents')
      .update(data)
      .eq('id', documentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('[documentService] Document updated successfully:', updatedDocument);
    return {
      status: 'success',
      data: updatedDocument
    };
  } catch (error) {
    console.error(`Update Document Service Error (${documentId}):`, error.message);
    throw new Error(error.message);
  }
};

/**
 * Delete a document
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Success status
 */
const deleteDocument = async (documentId) => {
  try {
    console.log(`[documentService] Deleting document ${documentId}...`);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the document to find the file path
    const { data: document, error: documentError } = await supabase
      .from('user_documents')
      .select('file_path')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (documentError) throw documentError;

    // Delete the file from storage
    if (document.file_path) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;
    }

    // Delete the document record
    const { error: deleteError } = await supabase
      .from('user_documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', user.id);

    if (deleteError) throw deleteError;

    console.log(`[documentService] Document ${documentId} deleted successfully`);
    return {
      success: true,
      documentId
    };
  } catch (error) {
    console.error(`Delete Document Service Error (${documentId}):`, error.message);
    throw new Error(error.message);
  }
};

/**
 * Get document categories/types
 * @returns {Promise<Object>} Document categories data
 */
const getDocumentCategories = async () => {
  try {
    console.log('[documentService] Fetching document categories...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Define standard document categories
    const documentCategories = [
      { id: 1, name: 'Identification', code: 'identification' },
      { id: 2, name: 'Education', code: 'education' },
      { id: 3, name: 'Employment', code: 'employment' },
      { id: 4, name: 'Financial', code: 'financial' },
      { id: 5, name: 'Medical', code: 'medical' },
      { id: 6, name: 'Legal', code: 'legal' },
      { id: 7, name: 'Other', code: 'other' }
    ];

    return {
      status: 'success',
      data: documentCategories
    };
  } catch (error) {
    console.error('Get Document Categories Service Error:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Update document verification status
 * @param {string} documentId - Document ID
 * @param {Object} verificationData - Verification data
 * @returns {Promise<Object>} Updated document data
 */
const updateDocumentVerification = async (documentId, verificationData) => {
  try {
    console.log(`[documentService] Updating document verification ${documentId}...`);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update the document verification status
    const { data: updatedDocument, error: updateError } = await supabase
      .from('user_documents')
      .update({
        status: verificationData.verificationStatus,
        verified_at: verificationData.verificationStatus === 'verified' ? new Date().toISOString() : null
      })
      .eq('id', documentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('[documentService] Document verification updated successfully:', updatedDocument);
    return {
      status: 'success',
      data: updatedDocument
    };
  } catch (error) {
    console.error(`Update Document Verification Service Error (${documentId}):`, error.message);
    throw new Error(error.message);
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
  updateDocumentVerification
};

export default documentService;
