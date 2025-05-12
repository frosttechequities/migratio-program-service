const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');
const config = require('../config');

/**
 * PDF Generation Service
 * Handles generation of PDF documents from roadmap data
 */
class PDFGenerationService {
  /**
   * Generate a PDF from roadmap data
   * @param {Object} roadmap - Roadmap data
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} - Generated PDF info
   */
  async generateRoadmapPDF(roadmap, options = {}) {
    try {
      logger.info(`Generating PDF for roadmap ${roadmap._id}`);

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `${roadmap.title} - Immigration Roadmap`,
          Author: 'Migratio',
          Subject: 'Immigration Roadmap',
          Keywords: 'immigration, roadmap, migratio'
        }
      });

      // Set up file paths
      const pdfDirectory = path.join(config.uploadDir, 'pdfs');

      // Create directory if it doesn't exist
      if (!fs.existsSync(pdfDirectory)) {
        fs.mkdirSync(pdfDirectory, { recursive: true });
      }

      // Generate unique filename
      const timestamp = new Date().getTime();
      const filename = `roadmap-${roadmap._id}-${timestamp}.pdf`;
      const filePath = path.join(pdfDirectory, filename);

      // Create write stream
      const stream = fs.createWriteStream(filePath);

      // Pipe PDF document to write stream
      doc.pipe(stream);

      // Generate PDF content
      this._generatePDFContent(doc, roadmap, options);

      // Finalize PDF
      doc.end();

      // Return promise that resolves when PDF is written
      return new Promise((resolve, reject) => {
        stream.on('finish', () => {
          logger.info(`PDF generated successfully for roadmap ${roadmap._id}`);

          // Return PDF info
          resolve({
            filename,
            filePath,
            url: `/api/uploads/pdfs/${filename}`,
            contentType: 'application/pdf',
            size: fs.statSync(filePath).size
          });
        });

        stream.on('error', (error) => {
          logger.error(`Error generating PDF: ${error.message}`, { error });
          reject(error);
        });
      });
    } catch (error) {
      logger.error(`Error generating PDF: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Generate PDF content
   * @param {Object} doc - PDF document
   * @param {Object} roadmap - Roadmap data
   * @param {Object} options - Generation options
   * @private
   */
  _generatePDFContent(doc, roadmap, options) {
    // Add logo
    this._addLogo(doc);

    // Add title
    this._addTitle(doc, roadmap);

    // Add summary
    this._addSummary(doc, roadmap);

    // Add timeline
    this._addTimeline(doc, roadmap);

    // Add phases
    this._addPhases(doc, roadmap);

    // Add cost breakdown
    this._addCostBreakdown(doc, roadmap);

    // Add footer
    this._addFooter(doc, roadmap);
  }

  /**
   * Add logo to PDF
   * @param {Object} doc - PDF document
   * @private
   */
  _addLogo(doc) {
    try {
      const logoPath = path.join(__dirname, '..', '..', 'public', 'images', 'logo.png');

      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 150 });
      }

      doc.moveDown(2);
    } catch (error) {
      logger.warn(`Could not add logo to PDF: ${error.message}`);
      doc.moveDown(2);
    }
  }

  /**
   * Add title to PDF
   * @param {Object} doc - PDF document
   * @param {Object} roadmap - Roadmap data
   * @private
   */
  _addTitle(doc, roadmap) {
    doc.font('Helvetica-Bold')
       .fontSize(24)
       .text(roadmap.title, { align: 'center' });

    doc.moveDown(0.5);

    doc.font('Helvetica')
       .fontSize(14)
       .text(roadmap.description || 'Your personalized immigration roadmap', { align: 'center' });

    doc.moveDown(2);
  }

  /**
   * Add summary to PDF
   * @param {Object} doc - PDF document
   * @param {Object} roadmap - Roadmap data
   * @private
   */
  _addSummary(doc, roadmap) {
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .text('Summary', { underline: true });

    doc.moveDown(0.5);

    // Format dates
    const startDate = new Date(roadmap.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const targetDate = new Date(roadmap.targetCompletionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Add summary table
    doc.font('Helvetica')
       .fontSize(12)
       .text(`Program: ${roadmap.programId}`, { continued: false })
       .text(`Start Date: ${startDate}`, { continued: false })
       .text(`Target Completion: ${targetDate}`, { continued: false })
       .text(`Status: ${this._formatStatus(roadmap.status)}`, { continued: false })
       .text(`Completion: ${roadmap.completionPercentage}%`, { continued: false });

    if (roadmap.estimatedCost && roadmap.estimatedCost.total) {
      doc.text(`Estimated Cost: ${roadmap.estimatedCost.total} ${roadmap.estimatedCost.currency}`, { continued: false });
    }

    doc.moveDown(2);
  }

  /**
   * Add timeline to PDF
   * @param {Object} doc - PDF document
   * @param {Object} roadmap - Roadmap data
   * @private
   */
  _addTimeline(doc, roadmap) {
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .text('Timeline', { underline: true });

    doc.moveDown(0.5);

    // Draw timeline
    const startX = 100;
    const endX = doc.page.width - 100;
    const y = doc.y + 30;

    // Draw timeline line
    doc.moveTo(startX, y)
       .lineTo(endX, y)
       .stroke();

    // Calculate phase positions
    const timelineWidth = endX - startX;
    const totalDuration = new Date(roadmap.targetCompletionDate) - new Date(roadmap.startDate);

    // Sort phases by order
    const sortedPhases = [...roadmap.phases].sort((a, b) => a.order - b.order);

    // Draw phase markers
    sortedPhases.forEach((phase, index) => {
      const phaseStart = new Date(phase.startDate);
      const phasePosition = startX + ((phaseStart - new Date(roadmap.startDate)) / totalDuration) * timelineWidth;

      // Draw marker
      doc.circle(phasePosition, y, 5)
         .fill('#0066cc');

      // Draw phase name
      const textY = index % 2 === 0 ? y - 25 : y + 15;

      doc.font('Helvetica')
         .fontSize(10)
         .text(phase.title, phasePosition - 30, textY, { width: 60, align: 'center' });
    });

    // Draw end marker
    doc.circle(endX, y, 5)
       .fill('#009900');

    doc.font('Helvetica')
       .fontSize(10)
       .text('Completion', endX - 30, y + 15, { width: 60, align: 'center' });

    doc.moveDown(4);
  }

  /**
   * Add phases to PDF
   * @param {Object} doc - PDF document
   * @param {Object} roadmap - Roadmap data
   * @private
   */
  _addPhases(doc, roadmap) {
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .text('Phases & Milestones', { underline: true });

    doc.moveDown(0.5);

    // Sort phases by order
    const sortedPhases = [...roadmap.phases].sort((a, b) => a.order - b.order);

    // Add each phase
    sortedPhases.forEach((phase, phaseIndex) => {
      // Check if we need a new page
      if (doc.y > doc.page.height - 150) {
        doc.addPage();
      }

      // Format dates
      const phaseStart = new Date(phase.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const phaseEnd = new Date(phase.endDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Add phase header
      doc.font('Helvetica-Bold')
         .fontSize(14)
         .fillColor('#0066cc')
         .text(`Phase ${phaseIndex + 1}: ${phase.title}`, { continued: false });

      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#000000')
         .text(`${phaseStart} to ${phaseEnd}`, { continued: false })
         .text(`Status: ${this._formatStatus(phase.status)}`, { continued: false })
         .text(phase.description, { continued: false });

      doc.moveDown(0.5);

      // Add milestones
      if (phase.milestones && phase.milestones.length > 0) {
        phase.milestones.forEach((milestone, milestoneIndex) => {
          // Check if we need a new page
          if (doc.y > doc.page.height - 150) {
            doc.addPage();
          }

          // Add milestone
          doc.font('Helvetica-Bold')
             .fontSize(12)
             .text(`Milestone ${milestoneIndex + 1}: ${milestone.title}`, { continued: false });

          doc.font('Helvetica')
             .fontSize(11)
             .text(`Status: ${this._formatStatus(milestone.status)}`, { continued: false })
             .text(`Priority: ${milestone.priority || 'Medium'}`, { continued: false })
             .text(milestone.description, { continued: false });

          // Add tasks
          if (milestone.tasks && milestone.tasks.length > 0) {
            doc.moveDown(0.5);

            doc.font('Helvetica-Oblique')
               .fontSize(11)
               .text('Tasks:', { continued: false });

            milestone.tasks.forEach((task, taskIndex) => {
              doc.font('Helvetica')
                 .fontSize(10)
                 .text(`• ${task.title} (${this._formatStatus(task.status)})`, { continued: false, indent: 10 });
            });
          }

          doc.moveDown(1);
        });
      }

      doc.moveDown(1);
    });
  }

  /**
   * Add cost breakdown to PDF
   * @param {Object} doc - PDF document
   * @param {Object} roadmap - Roadmap data
   * @private
   */
  _addCostBreakdown(doc, roadmap) {
    // Check if we need a new page
    if (doc.y > doc.page.height - 200) {
      doc.addPage();
    }

    if (roadmap.estimatedCost && roadmap.estimatedCost.breakdown && roadmap.estimatedCost.breakdown.length > 0) {
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text('Cost Breakdown', { underline: true });

      doc.moveDown(0.5);

      // Add cost breakdown table
      const tableTop = doc.y;
      const tableLeft = 50;
      const tableRight = doc.page.width - 50;
      const rowHeight = 30;

      // Draw table header
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text('Category', tableLeft, tableTop, { width: 200 })
         .text('Amount', tableLeft + 200, tableTop, { width: 100 })
         .text('Description', tableLeft + 300, tableTop, { width: 200 });

      doc.moveTo(tableLeft, tableTop + 20)
         .lineTo(tableRight, tableTop + 20)
         .stroke();

      // Draw table rows
      let currentY = tableTop + 25;

      roadmap.estimatedCost.breakdown.forEach((item, index) => {
        doc.font('Helvetica')
           .fontSize(11)
           .text(item.category, tableLeft, currentY, { width: 200 })
           .text(`${item.amount} ${roadmap.estimatedCost.currency}`, tableLeft + 200, currentY, { width: 100 })
           .text(item.description || '', tableLeft + 300, currentY, { width: 200 });

        currentY += rowHeight;

        // Draw row divider
        doc.moveTo(tableLeft, currentY - 5)
           .lineTo(tableRight, currentY - 5)
           .stroke();
      });

      // Draw total
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text('Total', tableLeft, currentY + 5, { width: 200 })
         .text(`${roadmap.estimatedCost.total} ${roadmap.estimatedCost.currency}`, tableLeft + 200, currentY + 5, { width: 100 });

      doc.moveDown(2);
    }
  }

  /**
   * Add footer to PDF
   * @param {Object} doc - PDF document
   * @param {Object} roadmap - Roadmap data
   * @private
   */
  _addFooter(doc, roadmap) {
    // Add footer to current page only
    const footerTop = doc.page.height - 50;
    const currentPage = doc.bufferedPageRange().start;
    const pageCount = doc.bufferedPageRange().count;

    doc.font('Helvetica')
       .fontSize(10)
       .text(
         `Generated by Migratio | ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
         50,
         footerTop,
         { align: 'center', width: doc.page.width - 100 }
       );

    doc.font('Helvetica')
       .fontSize(10)
       .text(
         `Page ${currentPage + 1} of ${pageCount}`,
         50,
         footerTop + 15,
         { align: 'center', width: doc.page.width - 100 }
       );
  }

  /**
   * Format status for display
   * @param {string} status - Status value
   * @returns {string} - Formatted status
   * @private
   */
  _formatStatus(status) {
    if (!status) return 'Not Started';

    // Convert snake_case to Title Case
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

module.exports = PDFGenerationService;
