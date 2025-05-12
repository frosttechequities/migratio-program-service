const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { Document } = require('../models/document.model');
const { logger } = require('../utils/logger');

// Promisify fs functions
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

/**
 * Document Service
 * Handles document storage, retrieval, and management
 */
class DocumentService {
  /**
   * Upload a document
   * @param {Object} file - Uploaded file
   * @param {string} userId - User ID
   * @param {Object} documentInfo - Document information
   * @returns {Promise<Object>} - Uploaded document
   */
  async uploadDocument(file, userId, documentInfo) {
    try {
      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'uploads', userId.toString());
      await this._ensureDirectoryExists(uploadDir);

      // Generate unique filename
      const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);

      // Move file to upload directory
      await this._saveFile(file.path, filePath);

      // Create document record
      const document = new Document({
        userId,
        fileName,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath,
        fileUrl: `/api/documents/${userId}/${fileName}`,
        category: documentInfo.category,
        documentType: documentInfo.documentType,
        description: documentInfo.description,
        expiryDate: documentInfo.expiryDate,
        issuedDate: documentInfo.issuedDate,
        issuedBy: documentInfo.issuedBy,
        documentNumber: documentInfo.documentNumber,
        country: documentInfo.country,
        tags: documentInfo.tags,
        metadata: documentInfo.metadata
      });

      // Save document
      await document.save();

      return document;
    } catch (error) {
      logger.error('Error uploading document:', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Document
   */
  async getDocument(documentId, userId) {
    try {
      const document = await Document.findOne({ _id: documentId, userId });

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    } catch (error) {
      logger.error('Error getting document:', error);
      throw error;
    }
  }

  /**
   * Get document file
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Document file
   */
  async getDocumentFile(documentId, userId) {
    try {
      const document = await this.getDocument(documentId, userId);

      return {
        filePath: document.filePath,
        fileName: document.originalName,
        fileType: document.fileType
      };
    } catch (error) {
      logger.error('Error getting document file:', error);
      throw error;
    }
  }

  /**
   * Get documents by user
   * @param {string} userId - User ID
   * @param {Object} filters - Filters
   * @returns {Promise<Array>} - Documents
   */
  async getDocumentsByUser(userId, filters = {}) {
    try {
      // Build query
      const query = { userId };

      // Add category filter
      if (filters.category) {
        query.category = filters.category;
      }

      // Add document type filter
      if (filters.documentType) {
        query.documentType = filters.documentType;
      }

      // Add verification status filter
      if (filters.isVerified !== undefined) {
        query.isVerified = filters.isVerified;
      }

      // Add status filter
      if (filters.status) {
        query.status = filters.status;
      }

      // Get documents
      const documents = await Document.find(query).sort({ createdAt: -1 });

      return documents;
    } catch (error) {
      logger.error('Error getting documents by user:', error);
      throw error;
    }
  }

  /**
   * Update document
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} - Updated document
   */
  async updateDocument(documentId, userId, updateData) {
    try {
      // Build update object
      const updateObj = {};

      if (updateData.description !== undefined) {
        updateObj.description = updateData.description;
      }

      if (updateData.expiryDate !== undefined) {
        updateObj.expiryDate = updateData.expiryDate;
      }

      if (updateData.issuedDate !== undefined) {
        updateObj.issuedDate = updateData.issuedDate;
      }

      if (updateData.issuedBy !== undefined) {
        updateObj.issuedBy = updateData.issuedBy;
      }

      if (updateData.documentNumber !== undefined) {
        updateObj.documentNumber = updateData.documentNumber;
      }

      if (updateData.country !== undefined) {
        updateObj.country = updateData.country;
      }

      if (updateData.tags !== undefined) {
        updateObj.tags = updateData.tags;
      }

      if (updateData.metadata !== undefined) {
        updateObj.metadata = updateData.metadata;
      }

      // Update document status based on expiry
      if (updateData.expiryDate !== undefined) {
        const now = new Date();
        if (new Date(updateData.expiryDate) < now) {
          updateObj.status = 'expired';
        }
      }

      // Update document
      const document = await Document.findOneAndUpdate(
        { _id: documentId, userId },
        updateObj,
        { new: true }
      );

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    } catch (error) {
      logger.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Delete document
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success
   */
  async deleteDocument(documentId, userId) {
    try {
      // Get document
      const document = await this.getDocument(documentId, userId);

      // Delete file
      await this._deleteFile(document.filePath);

      // Delete document
      await Document.deleteOne({ _id: documentId, userId });

      return true;
    } catch (error) {
      logger.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Verify document
   * @param {string} documentId - Document ID
   * @param {string} verifiedBy - Verifier ID
   * @param {string} notes - Verification notes
   * @returns {Promise<Object>} - Verified document
   */
  async verifyDocument(documentId, verifiedBy, notes = '') {
    try {
      // Get document
      const document = await Document.findById(documentId);

      if (!document) {
        throw new Error('Document not found');
      }

      // Verify document
      await document.verify(verifiedBy, notes);

      return document;
    } catch (error) {
      logger.error('Error verifying document:', error);
      throw error;
    }
  }

  /**
   * Reject document
   * @param {string} documentId - Document ID
   * @param {string} verifiedBy - Verifier ID
   * @param {string} notes - Rejection notes
   * @returns {Promise<Object>} - Rejected document
   */
  async rejectDocument(documentId, verifiedBy, notes = '') {
    try {
      // Get document
      const document = await Document.findById(documentId);

      if (!document) {
        throw new Error('Document not found');
      }

      // Reject document
      await document.reject(verifiedBy, notes);

      return document;
    } catch (error) {
      logger.error('Error rejecting document:', error);
      throw error;
    }
  }

  /**
   * Ensure directory exists
   * @param {string} directory - Directory path
   * @returns {Promise<void>}
   * @private
   */
  async _ensureDirectoryExists(directory) {
    try {
      await mkdirAsync(directory, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * Save file
   * @param {string} sourcePath - Source path
   * @param {string} destinationPath - Destination path
   * @returns {Promise<void>}
   * @private
   */
  async _saveFile(sourcePath, destinationPath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(sourcePath);
      const writeStream = fs.createWriteStream(destinationPath);

      readStream.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);

      readStream.pipe(writeStream);
    });
  }

  /**
   * Delete file
   * @param {string} filePath - File path
   * @returns {Promise<void>}
   * @private
   */
  async _deleteFile(filePath) {
    try {
      await unlinkAsync(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

module.exports = DocumentService;
