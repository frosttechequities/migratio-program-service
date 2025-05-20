/**
 * Document Routes
 * API routes for document management
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const documentController = require('../controllers/documentController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueFilename = `${Date.now()}_${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  // Allow PDF, images, and common document formats
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and Office documents are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   GET /api/documents
 * @desc    Get all documents for the current user
 * @access  Private
 */
router.get('/', documentController.getDocuments);

/**
 * @route   GET /api/documents/:id
 * @desc    Get a document by ID
 * @access  Private
 */
router.get('/:id', documentController.getDocumentById);

/**
 * @route   POST /api/documents
 * @desc    Upload a new document
 * @access  Private
 */
router.post('/', upload.single('file'), documentController.uploadDocument);

/**
 * @route   POST /api/documents/:id/ocr
 * @desc    Process document with OCR
 * @access  Private
 */
router.post('/:id/ocr', documentController.processDocumentOcr);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete a document
 * @access  Private
 */
router.delete('/:id', documentController.deleteDocument);

// Error handling for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      error: `Upload error: ${err.message}`
    });
  } else if (err) {
    // Other errors
    return res.status(400).json({
      error: err.message
    });
  }
  next();
});

module.exports = router;
