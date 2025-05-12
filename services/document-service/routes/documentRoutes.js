const express = require('express');
const documentController = require('../controllers/documentController');
// Placeholder for auth middleware
// const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all document routes below
// router.use(protect); // Uncomment when auth middleware is ready

// POST /api/documents - Upload a new document
// Uses Multer middleware first, then the controller to process
router.post(
    '/',
    documentController.uploadSingleDocument, // 1. Multer handles file upload first
    documentController.processDocumentUpload // 2. Controller processes metadata and saves record
);

// GET /api/documents - Get all documents for the authenticated user
router.get('/', documentController.getAllDocuments); // Placeholder controller

// GET /api/documents/:id - Get a specific document's details (and potentially download link)
router.get('/:id', documentController.getDocument); // Placeholder controller

// PATCH /api/documents/:id - Update document metadata (e.g., status, notes, tags)
router.patch('/:id', documentController.updateDocument); // Placeholder controller

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', documentController.deleteDocument); // Placeholder controller

// PATCH /api/documents/:id/verification - Update document verification status and details
router.patch('/:id/verification', documentController.updateDocumentVerification);

// POST /api/documents/:id/verification/start - Initiate verification workflow (e.g., assign for review)
router.post('/:id/verification/start', documentController.startDocumentVerificationWorkflow); // To be implemented


// --- Routes for Document Types, Requirements, Checklists (might live here or have own files) ---
// Example:
// const docTypeController = require('../controllers/docTypeController');
// router.route('/types').get(docTypeController.getAllTypes).post(docTypeController.createType);
// router.route('/types/:id').get(docTypeController.getType).patch(docTypeController.updateType).delete(docTypeController.deleteType);

module.exports = router;
