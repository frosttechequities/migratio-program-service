import { supabaseClient } from '../../../services/supabaseClient';

/**
 * Document Verification Service
 * Handles document verification operations
 */
export const documentVerificationService = {
  /**
   * Get document verification status
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} - Verification status and details
   */
  getVerificationStatus: async (documentId) => {
    try {
      console.log(`[documentVerificationService] Getting verification status for document: ${documentId}`);
      
      // Get document from Supabase
      const { data: document, error } = await supabaseClient
        .from('user_documents')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (error) {
        console.error(`[documentVerificationService] Error fetching document: ${error.message}`);
        throw error;
      }
      
      if (!document) {
        console.error(`[documentVerificationService] Document not found: ${documentId}`);
        throw new Error('Document not found');
      }
      
      // Return verification status and details
      return {
        verificationStatus: document.verification_status || 'pending_submission',
        verificationDetails: document.verification_details || {},
        workflowState: document.verification_details?.workflow_state || 'none'
      };
    } catch (error) {
      console.error(`[documentVerificationService] Error getting verification status: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Request document verification
   * @param {string} documentId - Document ID
   * @param {Object} verificationRequest - Verification request data
   * @returns {Promise<Object>} - Updated document
   */
  requestVerification: async (documentId, verificationRequest) => {
    try {
      console.log(`[documentVerificationService] Requesting verification for document: ${documentId}`);
      
      // Update document verification status
      const { data: updatedDocument, error } = await supabaseClient
        .from('user_documents')
        .update({
          verification_status: 'pending_verification',
          verification_details: {
            requested_at: new Date().toISOString(),
            verification_method: verificationRequest.verificationMethod,
            expedited: verificationRequest.expedited,
            additional_notes: verificationRequest.additionalNotes,
            workflow_state: 'pending_review'
          }
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) {
        console.error(`[documentVerificationService] Error requesting verification: ${error.message}`);
        throw error;
      }
      
      // In a real implementation, this would trigger a notification to verifiers
      
      return updatedDocument;
    } catch (error) {
      console.error(`[documentVerificationService] Error requesting verification: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Cancel document verification
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} - Updated document
   */
  cancelVerification: async (documentId) => {
    try {
      console.log(`[documentVerificationService] Canceling verification for document: ${documentId}`);
      
      // Update document verification status
      const { data: updatedDocument, error } = await supabaseClient
        .from('user_documents')
        .update({
          verification_status: 'pending_submission',
          verification_details: {
            canceled_at: new Date().toISOString(),
            workflow_state: 'none'
          }
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) {
        console.error(`[documentVerificationService] Error canceling verification: ${error.message}`);
        throw error;
      }
      
      return updatedDocument;
    } catch (error) {
      console.error(`[documentVerificationService] Error canceling verification: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Submit additional information for verification
   * @param {string} documentId - Document ID
   * @param {Object} additionalInfo - Additional information
   * @returns {Promise<Object>} - Updated document
   */
  submitAdditionalInfo: async (documentId, additionalInfo) => {
    try {
      console.log(`[documentVerificationService] Submitting additional info for document: ${documentId}`);
      
      // Get current document
      const { data: document, error: fetchError } = await supabaseClient
        .from('user_documents')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (fetchError) {
        console.error(`[documentVerificationService] Error fetching document: ${fetchError.message}`);
        throw fetchError;
      }
      
      // Update document with additional info
      const currentDetails = document.verification_details || {};
      const updatedDetails = {
        ...currentDetails,
        additional_info: additionalInfo,
        additional_info_submitted_at: new Date().toISOString()
      };
      
      // Update document
      const { data: updatedDocument, error } = await supabaseClient
        .from('user_documents')
        .update({
          document_number: additionalInfo.documentNumber || document.document_number,
          issued_by: additionalInfo.issuedBy || document.issued_by,
          issued_date: additionalInfo.issuedDate || document.issued_date,
          expiry_date: additionalInfo.expiryDate || document.expiry_date,
          verification_details: updatedDetails
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) {
        console.error(`[documentVerificationService] Error submitting additional info: ${error.message}`);
        throw error;
      }
      
      return updatedDocument;
    } catch (error) {
      console.error(`[documentVerificationService] Error submitting additional info: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Upload supporting document for verification
   * @param {string} documentId - Document ID
   * @param {File} file - Supporting document file
   * @returns {Promise<Object>} - Updated document
   */
  uploadSupportingDocument: async (documentId, file) => {
    try {
      console.log(`[documentVerificationService] Uploading supporting document for: ${documentId}`);
      
      // In a real implementation, this would upload the file to storage
      // and update the document record with the supporting document reference
      
      // For demo purposes, we'll just update the verification details
      const { data: document, error: fetchError } = await supabaseClient
        .from('user_documents')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (fetchError) {
        console.error(`[documentVerificationService] Error fetching document: ${fetchError.message}`);
        throw fetchError;
      }
      
      // Update document with supporting document info
      const currentDetails = document.verification_details || {};
      const updatedDetails = {
        ...currentDetails,
        supporting_documents: [
          ...(currentDetails.supporting_documents || []),
          {
            filename: file.name,
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString()
          }
        ]
      };
      
      // Update document
      const { data: updatedDocument, error } = await supabaseClient
        .from('user_documents')
        .update({
          verification_details: updatedDetails
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) {
        console.error(`[documentVerificationService] Error updating supporting document info: ${error.message}`);
        throw error;
      }
      
      return updatedDocument;
    } catch (error) {
      console.error(`[documentVerificationService] Error uploading supporting document: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get verification providers
   * @returns {Promise<Array>} - List of verification providers
   */
  getVerificationProviders: async () => {
    try {
      console.log(`[documentVerificationService] Getting verification providers`);
      
      // In a real implementation, this would fetch providers from the API
      // For demo purposes, we'll return mock data
      
      const mockProviders = [
        {
          id: 'idv_global',
          name: 'IDV Global',
          description: 'Global document verification service with support for over 150 countries.',
          logo: '/logos/idv-global.png',
          processingTime: '2-3 business days',
          cost: 'Included in your plan',
          supportedDocumentTypes: ['passport', 'national_id', 'driver_license', 'birth_certificate'],
          rating: 4.8
        },
        {
          id: 'verify_plus',
          name: 'VerifyPlus',
          description: 'Advanced verification with biometric matching and fraud detection.',
          logo: '/logos/verify-plus.png',
          processingTime: '1-2 business days',
          cost: 'Included in your plan',
          supportedDocumentTypes: ['passport', 'national_id', 'driver_license'],
          rating: 4.5
        },
        {
          id: 'doc_verify',
          name: 'DocVerify',
          description: 'Specialized in legal and educational document verification.',
          logo: '/logos/doc-verify.png',
          processingTime: '3-5 business days',
          cost: 'Included in your plan',
          supportedDocumentTypes: ['diploma', 'degree', 'transcript', 'marriage_certificate', 'birth_certificate'],
          rating: 4.2
        }
      ];
      
      return mockProviders;
    } catch (error) {
      console.error(`[documentVerificationService] Error getting verification providers: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Submit document to third-party provider
   * @param {string} documentId - Document ID
   * @param {string} providerId - Provider ID
   * @param {string} reference - Verification reference
   * @returns {Promise<Object>} - Updated document
   */
  submitToProvider: async (documentId, providerId, reference) => {
    try {
      console.log(`[documentVerificationService] Submitting document ${documentId} to provider ${providerId}`);
      
      // Update document with provider info
      const { data: updatedDocument, error } = await supabaseClient
        .from('user_documents')
        .update({
          verification_status: 'verification_in_progress',
          verification_details: {
            provider_id: providerId,
            reference: reference,
            submitted_to_provider_at: new Date().toISOString(),
            workflow_state: 'under_review'
          }
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) {
        console.error(`[documentVerificationService] Error submitting to provider: ${error.message}`);
        throw error;
      }
      
      return updatedDocument;
    } catch (error) {
      console.error(`[documentVerificationService] Error submitting to provider: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Check verification status with provider
   * @param {string} documentId - Document ID
   * @param {string} reference - Verification reference
   * @returns {Promise<Object>} - Verification status
   */
  checkProviderStatus: async (documentId, reference) => {
    try {
      console.log(`[documentVerificationService] Checking status for document ${documentId} with reference ${reference}`);
      
      // In a real implementation, this would check the status with the provider API
      // For demo purposes, we'll return mock data
      
      return {
        status: 'in_progress',
        message: 'Verification is in progress. Please check back later.',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[documentVerificationService] Error checking provider status: ${error.message}`);
      throw error;
    }
  }
};

export default documentVerificationService;
