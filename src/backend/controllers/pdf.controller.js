/**
 * PDF Controller
 * 
 * Handles PDF generation requests.
 */

const path = require('path');
const fs = require('fs');
const { Roadmap } = require('../models/roadmap.model');
const { generateRoadmapPDF } = require('../services/pdf-generator/roadmap-pdf');
const { logger } = require('../utils/logger');

/**
 * Generate a PDF for a roadmap
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateRoadmapPDF = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user._id;
    
    // Get roadmap
    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    
    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Generate PDF
    const pdfPath = await generateRoadmapPDF(roadmap, tempDir);
    
    // Send PDF
    res.download(pdfPath, `${roadmap.title.replace(/\s+/g, '_')}.pdf`, (err) => {
      if (err) {
        logger.error(`Error sending PDF: ${err.message}`);
        return res.status(500).json({ message: 'Error sending PDF', error: err.message });
      }
      
      // Delete the temporary file after sending
      fs.unlink(pdfPath, (unlinkErr) => {
        if (unlinkErr) {
          logger.warn(`Error deleting temporary PDF file: ${unlinkErr.message}`);
        }
      });
    });
  } catch (error) {
    logger.error(`Error generating roadmap PDF: ${error.message}`);
    res.status(500).json({ message: 'Error generating roadmap PDF', error: error.message });
  }
};

/**
 * Generate a PDF for a document
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateDocumentPDF = async (req, res) => {
  try {
    // This will be implemented in the future
    res.status(501).json({ message: 'Document PDF generation not implemented yet' });
  } catch (error) {
    logger.error(`Error generating document PDF: ${error.message}`);
    res.status(500).json({ message: 'Error generating document PDF', error: error.message });
  }
};
