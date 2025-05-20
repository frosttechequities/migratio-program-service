const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');
const documentController = require('../controllers/document.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Configure multer for file uploads
const upload = multer({
  dest: 'temp/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * @route POST /api/documents
 * @desc Upload a document
 * @access Private
 */
router.post(
  '/',
  authenticate,
  upload.single('file'),
  [
    body('category')
      .isIn(['identity', 'education', 'work', 'language', 'financial', 'other'])
      .withMessage('Invalid document category'),
    body('documentType')
      .isIn([
        'passport',
        'national_id',
        'birth_certificate',
        'marriage_certificate',
        'diploma',
        'degree',
        'transcript',
        'employment_letter',
        'reference_letter',
        'pay_stub',
        'tax_return',
        'language_test',
        'bank_statement',
        'property_document',
        'medical_report',
        'police_clearance',
        'other'
      ])
      .withMessage('Invalid document type'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Expiry date must be a valid date'),
    body('issuedDate')
      .optional()
      .isISO8601()
      .withMessage('Issued date must be a valid date'),
    validate
  ],
  documentController.uploadDocument
);

/**
 * @route GET /api/documents
 * @desc Get all documents for the authenticated user
 * @access Private
 */
router.get('/', authenticate, documentController.getDocumentsByUser);

/**
 * @route GET /api/documents/:documentId
 * @desc Get a document by ID
 * @access Private
 */
router.get('/:documentId', authenticate, documentController.getDocument);

/**
 * @route GET /api/documents/:documentId/file
 * @desc Get a document file
 * @access Private
 */
router.get('/:documentId/file', authenticate, documentController.getDocumentFile);

/**
 * @route PUT /api/documents/:documentId
 * @desc Update a document
 * @access Private
 */
router.put(
  '/:documentId',
  authenticate,
  [
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Expiry date must be a valid date'),
    body('issuedDate')
      .optional()
      .isISO8601()
      .withMessage('Issued date must be a valid date'),
    validate
  ],
  documentController.updateDocument
);

/**
 * @route DELETE /api/documents/:documentId
 * @desc Delete a document
 * @access Private
 */
router.delete('/:documentId', authenticate, documentController.deleteDocument);

/**
 * @route PUT /api/documents/:documentId/verify
 * @desc Verify a document (admin only)
 * @access Private (Admin)
 */
router.put(
  '/:documentId/verify',
  authenticate,
  authorize(['admin']),
  documentController.verifyDocument
);

/**
 * @route PUT /api/documents/:documentId/reject
 * @desc Reject a document (admin only)
 * @access Private (Admin)
 */
router.put(
  '/:documentId/reject',
  authenticate,
  authorize(['admin']),
  documentController.rejectDocument
);

/**
 * @route POST /api/documents/:documentId/ocr
 * @desc Process a document with OCR
 * @access Private
 */
router.post(
  '/:documentId/ocr',
  authenticate,
  [
    body('engine')
      .optional()
      .isIn(['tesseract', 'google', 'azure', 'aws'])
      .withMessage('Invalid OCR engine'),
    validate
  ],
  documentController.processDocumentOcr
);

module.exports = router;
