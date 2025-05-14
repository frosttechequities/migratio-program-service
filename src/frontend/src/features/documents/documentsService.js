import supabase from '../../utils/supabaseClient';

/**
 * Get all documents for the current user
 * @returns {Promise<Object>} Documents data
 */
const getAllDocuments = async () => {
  try {
    console.log('[documentsService] Fetching all documents...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch user documents
    const { data: documentsData, error: documentsError } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });

    if (documentsError) throw documentsError;

    console.log('[documentsService] Received documents:', documentsData);
    return {
      status: 'success',
      data: documentsData
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
    console.log(`[documentsService] Fetching document ${documentId}...`);

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

    console.log('[documentsService] Received document:', document);
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
 * @param {Object} documentData - Document data
 * @param {File} documentData.file - File to upload
 * @param {string} documentData.name - Document name
 * @param {string} documentData.documentType - Document type
 * @returns {Promise<Object>} Uploaded document data
 */
const uploadDocument = async (documentData) => {
  try {
    console.log('[documentsService] Uploading document...');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Upload the file to storage
    const fileName = `${Date.now()}_${documentData.file.name}`;
    const filePath = `documents/${user.id}/${fileName}`;

    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .upload(filePath, documentData.file);

    if (fileError) throw fileError;

    // Create a record in the user_documents table
    const { data: document, error: documentError } = await supabase
      .from('user_documents')
      .insert([
        {
          user_id: user.id,
          name: documentData.name,
          file_path: filePath,
          file_type: documentData.file.type,
          document_type: documentData.documentType,
          status: 'pending',
          upload_date: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (documentError) throw documentError;

    console.log('[documentsService] Document uploaded successfully:', document);
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
 * Delete a document
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Success status
 */
const deleteDocument = async (documentId) => {
  try {
    console.log(`[documentsService] Deleting document ${documentId}...`);

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

    console.log(`[documentsService] Document ${documentId} deleted successfully`);
    return {
      status: 'success',
      message: 'Document deleted successfully'
    };
  } catch (error) {
    console.error(`Delete Document Service Error (${documentId}):`, error.message);
    throw new Error(error.message);
  }
};

const documentsService = {
  getAllDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument
};

export default documentsService;
