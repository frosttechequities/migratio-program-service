const express = require('express');
const pdfController = require('../controllers/pdfController');
// Placeholder for auth middleware
// const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all PDF routes below
// router.use(protect); // Uncomment when auth middleware is ready

// POST /api/pdf/request - Request asynchronous generation of a PDF
router.post('/request', pdfController.requestPdfGeneration);

// GET /api/pdf/status/:jobId - Check the status of a generation job (Placeholder)
router.get('/status/:jobId', pdfController.getPdfStatus);

// GET /api/pdf/download/:fileId - Download a completed PDF (Placeholder)
// :fileId might be the document ID or a specific export ID
router.get('/download/:fileId', pdfController.downloadPdf);


module.exports = router;
