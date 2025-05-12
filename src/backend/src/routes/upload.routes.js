const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const config = require('../config');

/**
 * @route GET /api/uploads/pdfs/:filename
 * @desc Get a PDF file
 * @access Private
 */
router.get('/pdfs/:filename', authenticate, (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (!filename || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    // Get file path
    const filePath = path.join(config.uploadDir, 'pdfs', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Send file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    logger.error(`Error serving PDF file: ${error.message}`, { error });
    
    return res.status(500).json({
      success: false,
      message: 'Failed to serve PDF file',
      error: error.message
    });
  }
});

/**
 * @route GET /api/uploads/documents/:filename
 * @desc Get a document file
 * @access Private
 */
router.get('/documents/:filename', authenticate, (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (!filename || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    // Get file path
    const filePath = path.join(config.uploadDir, 'documents', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Determine content type
    let contentType = 'application/octet-stream';
    const ext = path.extname(filename).toLowerCase();
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }
    
    // Send file
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    logger.error(`Error serving document file: ${error.message}`, { error });
    
    return res.status(500).json({
      success: false,
      message: 'Failed to serve document file',
      error: error.message
    });
  }
});

module.exports = router;
