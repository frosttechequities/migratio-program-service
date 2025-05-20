const DocumentService = require('../services/document.service');
const { logger } = require('../utils/logger');

const documentService = new DocumentService();

/**
 * Upload document
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.uploadDocument = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get user ID from authenticated user
    const userId = req.user._id;

    // Get document info from request body
    const documentInfo = {
      category: req.body.category,
      documentType: req.body.documentType,
      description: req.body.description,
      expiryDate: req.body.expiryDate,
      issuedDate: req.body.issuedDate,
      issuedBy: req.body.issuedBy,
      documentNumber: req.body.documentNumber,
      country: req.body.country,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {}
    };

    // Upload document
    const document = await documentService.uploadDocument(req.file, userId, documentInfo);

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });
  } catch (error) {
    logger.error('Error uploading document:', error);

    return res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
};

/**
 * Get document
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user._id;

    // Get document
    const document = await documentService.getDocument(documentId, userId);

    return res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    logger.error('Error getting document:', error);

    return res.status(500).json({
      success: false,
      message: 'Error getting document',
      error: error.message
    });
  }
};

/**
 * Get document file
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getDocumentFile = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user._id;

    // Get document file
    const documentFile = await documentService.getDocumentFile(documentId, userId);

    // Set content type
    res.setHeader('Content-Type', documentFile.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${documentFile.fileName}"`);

    // Send file
    return res.sendFile(documentFile.filePath);
  } catch (error) {
    logger.error('Error getting document file:', error);

    return res.status(500).json({
      success: false,
      message: 'Error getting document file',
      error: error.message
    });
  }
};

/**
 * Get documents by user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getDocumentsByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get filters from query params
    const filters = {
      category: req.query.category,
      documentType: req.query.documentType,
      isVerified: req.query.isVerified === 'true' ? true :
                 req.query.isVerified === 'false' ? false : undefined,
      status: req.query.status
    };

    // Get documents
    const documents = await documentService.getDocumentsByUser(userId, filters);

    return res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error) {
    logger.error('Error getting documents by user:', error);

    return res.status(500).json({
      success: false,
      message: 'Error getting documents',
      error: error.message
    });
  }
};

/**
 * Update document
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user._id;

    // Get update data from request body
    const updateData = {
      description: req.body.description,
      expiryDate: req.body.expiryDate,
      issuedDate: req.body.issuedDate,
      issuedBy: req.body.issuedBy,
      documentNumber: req.body.documentNumber,
      country: req.body.country,
      tags: req.body.tags,
      metadata: req.body.metadata
    };

    // Update document
    const document = await documentService.updateDocument(documentId, userId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: document
    });
  } catch (error) {
    logger.error('Error updating document:', error);

    return res.status(500).json({
      success: false,
      message: 'Error updating document',
      error: error.message
    });
  }
};

/**
 * Delete document
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user._id;

    // Delete document
    await documentService.deleteDocument(documentId, userId);

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting document:', error);

    return res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

/**
 * Verify document (admin only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.verifyDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const verifiedBy = req.user._id;
    const { notes } = req.body;

    // Verify document
    const document = await documentService.verifyDocument(documentId, verifiedBy, notes);

    return res.status(200).json({
      success: true,
      message: 'Document verified successfully',
      data: document
    });
  } catch (error) {
    logger.error('Error verifying document:', error);

    return res.status(500).json({
      success: false,
      message: 'Error verifying document',
      error: error.message
    });
  }
};

/**
 * Reject document (admin only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.rejectDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const verifiedBy = req.user._id;
    const { notes } = req.body;

    // Reject document
    const document = await documentService.rejectDocument(documentId, verifiedBy, notes);

    return res.status(200).json({
      success: true,
      message: 'Document rejected successfully',
      data: document
    });
  } catch (error) {
    logger.error('Error rejecting document:', error);

    return res.status(500).json({
      success: false,
      message: 'Error rejecting document',
      error: error.message
    });
  }
};

/**
 * Process document with OCR
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.processDocumentOcr = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user._id;
    const { engine = 'tesseract' } = req.body;

    logger.info(`Processing document ${documentId} with OCR engine: ${engine}`);

    // Process document with OCR
    const document = await documentService.processDocumentOcr(documentId, userId, engine);

    return res.status(200).json({
      success: true,
      message: 'Document processed successfully with OCR',
      data: document
    });
  } catch (error) {
    logger.error('Error processing document with OCR:', error);

    return res.status(500).json({
      success: false,
      message: 'Error processing document with OCR',
      error: error.message
    });
  }
};
