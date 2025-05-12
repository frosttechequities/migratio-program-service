/**
 * Roadmap PDF Generator
 * 
 * Generates PDF documents for immigration roadmaps.
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { logger } = require('../../utils/logger');

/**
 * Generate a PDF for a roadmap
 * @param {Object} roadmap - Roadmap object
 * @param {string} outputPath - Path to save the PDF
 * @returns {Promise<string>} - Path to the generated PDF
 */
async function generateRoadmapPDF(roadmap, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      logger.info(`Generating PDF for roadmap ${roadmap._id}`);
      
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `${roadmap.title} - Immigration Roadmap`,
          Author: 'Visafy',
          Subject: 'Immigration Roadmap',
          Keywords: 'immigration, roadmap, visa, migration'
        }
      });
      
      // Pipe the PDF to a file
      const pdfPath = path.join(outputPath, `roadmap-${roadmap._id}.pdf`);
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);
      
      // Add content to the PDF
      addHeader(doc, roadmap);
      addSummary(doc, roadmap);
      addPhases(doc, roadmap);
      
      // Finalize the PDF
      doc.end();
      
      // Wait for the stream to finish
      stream.on('finish', () => {
        logger.info(`PDF generated successfully: ${pdfPath}`);
        resolve(pdfPath);
      });
      
      stream.on('error', (error) => {
        logger.error(`Error generating PDF: ${error.message}`);
        reject(error);
      });
    } catch (error) {
      logger.error(`Error generating PDF: ${error.message}`);
      reject(error);
    }
  });
}

/**
 * Add header to the PDF
 * @param {Object} doc - PDF document
 * @param {Object} roadmap - Roadmap object
 */
function addHeader(doc, roadmap) {
  // Add logo
  try {
    const logoPath = path.join(__dirname, '../../public/images/logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 150 });
    }
  } catch (error) {
    logger.warn(`Could not add logo to PDF: ${error.message}`);
  }
  
  // Add title
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .text('Immigration Roadmap', { align: 'right' })
     .moveDown(0.5);
  
  // Add roadmap details
  doc.fontSize(16)
     .font('Helvetica')
     .text(roadmap.title, { align: 'right' })
     .fontSize(12)
     .text(`Country: ${roadmap.country}`, { align: 'right' })
     .text(`Program: ${roadmap.programName}`, { align: 'right' })
     .text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'right' })
     .moveDown(1);
  
  // Add horizontal line
  doc.moveTo(50, 180)
     .lineTo(550, 180)
     .stroke()
     .moveDown(1);
}

/**
 * Add summary to the PDF
 * @param {Object} doc - PDF document
 * @param {Object} roadmap - Roadmap object
 */
function addSummary(doc, roadmap) {
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('Roadmap Summary', { underline: true })
     .moveDown(0.5);
  
  doc.fontSize(12)
     .font('Helvetica')
     .text(roadmap.description)
     .moveDown(0.5);
  
  // Add progress information
  doc.text(`Current Status: ${roadmap.status.charAt(0).toUpperCase() + roadmap.status.slice(1)}`)
     .text(`Progress: ${roadmap.progress}%`)
     .moveDown(0.5);
  
  // Add timeline information
  if (roadmap.startDate) {
    doc.text(`Start Date: ${new Date(roadmap.startDate).toLocaleDateString()}`);
  }
  
  if (roadmap.targetCompletionDate) {
    doc.text(`Estimated Completion: ${new Date(roadmap.targetCompletionDate).toLocaleDateString()}`);
  }
  
  doc.moveDown(1);
}

/**
 * Add phases to the PDF
 * @param {Object} doc - PDF document
 * @param {Object} roadmap - Roadmap object
 */
function addPhases(doc, roadmap) {
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('Immigration Journey Phases', { underline: true })
     .moveDown(0.5);
  
  // Add each phase
  roadmap.phases.forEach((phase, phaseIndex) => {
    // Check if we need a new page
    if (doc.y > 650) {
      doc.addPage();
    }
    
    // Add phase header
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#1a73e8')
       .text(`Phase ${phaseIndex + 1}: ${phase.title}`)
       .moveDown(0.2);
    
    // Add phase description
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('black')
       .text(phase.description)
       .moveDown(0.5);
    
    // Add phase status
    const statusColor = getStatusColor(phase.status);
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor(statusColor)
       .text(`Status: ${formatStatus(phase.status)}`)
       .fillColor('black')
       .moveDown(0.5);
    
    // Add key milestones
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Key Milestones:')
       .moveDown(0.2);
    
    // Add each milestone (limited to save space)
    const topMilestones = phase.milestones.slice(0, 5);
    topMilestones.forEach((milestone, milestoneIndex) => {
      const bulletColor = getStatusColor(milestone.status);
      
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor(bulletColor)
         .text(`• ${milestone.title}`, { continued: true })
         .fillColor('black')
         .font('Helvetica-Oblique')
         .text(` (${formatStatus(milestone.status)})`)
         .moveDown(0.2);
    });
    
    // Add note if there are more milestones
    if (phase.milestones.length > 5) {
      doc.fontSize(10)
         .font('Helvetica-Oblique')
         .text(`... and ${phase.milestones.length - 5} more milestones`)
         .moveDown(0.5);
    }
    
    doc.moveDown(1);
  });
  
  // Add footer
  addFooter(doc, roadmap);
}

/**
 * Add footer to the PDF
 * @param {Object} doc - PDF document
 * @param {Object} roadmap - Roadmap object
 */
function addFooter(doc, roadmap) {
  // Add horizontal line
  doc.moveTo(50, doc.page.height - 100)
     .lineTo(550, doc.page.height - 100)
     .stroke()
     .moveDown(1);
  
  // Add footer text
  doc.fontSize(10)
     .font('Helvetica')
     .text('This roadmap is a personalized guide for your immigration journey. The actual process may vary based on your specific circumstances and changes in immigration policies.', {
       width: 500,
       align: 'center',
       height: 50
     })
     .moveDown(0.5);
  
  // Add page number
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Page ${i + 1} of ${pageCount}`, {
         width: 500,
         align: 'center',
         height: 50
       }, doc.page.height - 50);
  }
}

/**
 * Get color for status
 * @param {string} status - Status
 * @returns {string} - Color
 */
function getStatusColor(status) {
  switch (status) {
    case 'completed':
      return '#34a853'; // Green
    case 'in_progress':
      return '#1a73e8'; // Blue
    case 'not_started':
      return '#5f6368'; // Gray
    case 'delayed':
      return '#fbbc04'; // Yellow
    case 'blocked':
      return '#ea4335'; // Red
    default:
      return 'black';
  }
}

/**
 * Format status for display
 * @param {string} status - Status
 * @returns {string} - Formatted status
 */
function formatStatus(status) {
  switch (status) {
    case 'not_started':
      return 'Not Started';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'delayed':
      return 'Delayed';
    case 'blocked':
      return 'Blocked';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

module.exports = {
  generateRoadmapPDF
};
