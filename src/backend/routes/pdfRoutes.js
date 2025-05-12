/**
 * PDF Routes
 * 
 * API routes for PDF generation.
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const pdfController = require('../controllers/pdf.controller');

/**
 * @route GET /api/pdf/roadmaps/:roadmapId
 * @desc Generate a PDF for a roadmap
 * @access Private
 */
router.get('/roadmaps/:roadmapId', auth, pdfController.generateRoadmapPDF);

/**
 * @route GET /api/pdf/documents/:documentId
 * @desc Generate a PDF for a document
 * @access Private
 */
router.get('/documents/:documentId', auth, pdfController.generateDocumentPDF);

module.exports = router;
