/**
 * Document Controller
 * Handles document upload, processing, and management
 */
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const ocrService = require('../ocrService');
const extractionService = require('../extractionService');
const analysisService = require('../analysisService');
const Document = require('../models/Document');
const DocumentType = require('../models/DocumentType');
const supabase = require('../../utils/supabaseClient');

/**
 * Document Controller class
 */
class DocumentController {
  /**
   * Upload a document
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async uploadDocument(req, res) {
    try {
      logger.info('[DOC_CTRL] Processing document upload request');

      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        logger.error(`[DOC_CTRL] Authentication error: ${userError.message}`);
        return res.status(401).json({ error: 'Authentication failed' });
      }

      if (!user) {
        logger.error('[DOC_CTRL] User not authenticated');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get document metadata from request
      const { name, documentType, expiryDate } = req.body;

      // Validate required fields
      if (!req.file) {
        logger.error('[DOC_CTRL] No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!documentType) {
        logger.error('[DOC_CTRL] Document type not specified');
        return res.status(400).json({ error: 'Document type is required' });
      }

      // Get file information
      const file = req.file;
      const originalFilename = file.originalname;
      const mimeType = file.mimetype;
      const fileSize = file.size;
      const tempFilePath = file.path;

      // Generate unique filename
      const filename = `${Date.now()}_${uuidv4()}${path.extname(originalFilename)}`;
      const filePath = `documents/${user.id}/${filename}`;

      // Upload file to Supabase Storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('documents')
        .upload(filePath, fs.createReadStream(tempFilePath), {
          contentType: mimeType,
          upsert: false
        });

      if (fileError) {
        logger.error(`[DOC_CTRL] Error uploading file to storage: ${fileError.message}`);
        return res.status(500).json({ error: 'Failed to upload file to storage' });
      }

      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Process document with OCR (using Tesseract by default - free option)
      logger.info(`[DOC_CTRL] Processing document with OCR: ${filePath}`);
      const ocrResults = await ocrService.processDocument(tempFilePath, documentType, 'tesseract');

      // Extract data from OCR results
      logger.info(`[DOC_CTRL] Extracting data from OCR results`);
      const extractionResults = await extractionService.extractData(ocrResults, documentType);

      // Create document record in database
      const documentData = {
        user_id: user.id,
        name: name || originalFilename,
        file_path: filePath,
        file_type: mimeType,
        file_size: fileSize,
        document_type: documentType,
        status: 'processed',
        upload_date: new Date().toISOString(),
        expires_at: expiryDate ? new Date(expiryDate).toISOString() : null,
        ocr_text: ocrResults.text,
        ocr_engine: ocrResults.engineType,
        extracted_data: extractionResults.extractedData
      };

      // Insert document record into Supabase
      const { data: document, error: documentError } = await supabase
        .from('user_documents')
        .insert([documentData])
        .select()
        .single();

      if (documentError) {
        logger.error(`[DOC_CTRL] Error creating document record: ${documentError.message}`);
        return res.status(500).json({ error: 'Failed to create document record' });
      }

      // Analyze document quality and completeness
      logger.info(`[DOC_CTRL] Analyzing document quality and completeness`);
      const analysisResults = await analysisService.analyzeDocument(document, extractionResults.extractedData);

      // Update document with analysis results
      const { data: updatedDocument, error: updateError } = await supabase
        .from('user_documents')
        .update({
          quality_score: analysisResults.qualityAnalysis.overallScore,
          completeness_score: analysisResults.completenessAnalysis.completenessScore,
          has_suggestions: analysisResults.optimizationSuggestions.length > 0,
          analysis_results: analysisResults
        })
        .eq('id', document.id)
        .select()
        .single();

      if (updateError) {
        logger.error(`[DOC_CTRL] Error updating document with analysis: ${updateError.message}`);
        // Continue anyway, as the document was created successfully
      }

      // Clean up temporary file
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          logger.error(`[DOC_CTRL] Error deleting temporary file: ${err.message}`);
        }
      });

      // Return success response
      return res.status(201).json({
        success: true,
        document: updatedDocument || document,
        analysis: analysisResults
      });
    } catch (error) {
      logger.error(`[DOC_CTRL] Error uploading document: ${error.message}`);
      return res.status(500).json({ error: 'Failed to upload document' });
    }
  }

  /**
   * Get all documents for the current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getDocuments(req, res) {
    try {
      logger.info('[DOC_CTRL] Processing get documents request');

      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        logger.error(`[DOC_CTRL] Authentication error: ${userError.message}`);
        return res.status(401).json({ error: 'Authentication failed' });
      }

      if (!user) {
        logger.error('[DOC_CTRL] User not authenticated');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get documents from database
      const { data: documents, error: documentsError } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      if (documentsError) {
        logger.error(`[DOC_CTRL] Error fetching documents: ${documentsError.message}`);
        return res.status(500).json({ error: 'Failed to fetch documents' });
      }

      // Return documents
      return res.status(200).json({
        success: true,
        documents
      });
    } catch (error) {
      logger.error(`[DOC_CTRL] Error getting documents: ${error.message}`);
      return res.status(500).json({ error: 'Failed to get documents' });
    }
  }

  /**
   * Get a document by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getDocumentById(req, res) {
    try {
      logger.info(`[DOC_CTRL] Processing get document request for ID: ${req.params.id}`);

      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        logger.error(`[DOC_CTRL] Authentication error: ${userError.message}`);
        return res.status(401).json({ error: 'Authentication failed' });
      }

      if (!user) {
        logger.error('[DOC_CTRL] User not authenticated');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get document from database
      const { data: document, error: documentError } = await supabase
        .from('user_documents')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', user.id)
        .single();

      if (documentError) {
        logger.error(`[DOC_CTRL] Error fetching document: ${documentError.message}`);
        return res.status(404).json({ error: 'Document not found' });
      }

      // Return document
      return res.status(200).json({
        success: true,
        document
      });
    } catch (error) {
      logger.error(`[DOC_CTRL] Error getting document: ${error.message}`);
      return res.status(500).json({ error: 'Failed to get document' });
    }
  }

  /**
   * Process document with OCR
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async processDocumentOcr(req, res) {
    try {
      logger.info(`[DOC_CTRL] Processing OCR request for document ID: ${req.params.id}`);

      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        logger.error(`[DOC_CTRL] Authentication error: ${userError.message}`);
        return res.status(401).json({ error: 'Authentication failed' });
      }

      if (!user) {
        logger.error('[DOC_CTRL] User not authenticated');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get document from database
      const { data: document, error: documentError } = await supabase
        .from('user_documents')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', user.id)
        .single();

      if (documentError) {
        logger.error(`[DOC_CTRL] Error fetching document: ${documentError.message}`);
        return res.status(404).json({ error: 'Document not found' });
      }

      // Get OCR engine type from request, default to free option (Tesseract)
      const { engineType = 'tesseract' } = req.body;

      // Validate engine type - ensure we're using the free option by default
      const validatedEngineType = engineType.toLowerCase() === 'azure' ? 'azure' : 'tesseract';

      // Log the engine type being used
      logger.info(`[DOC_CTRL] Using OCR engine: ${validatedEngineType} (${validatedEngineType === 'tesseract' ? 'free' : 'premium'})`);

      // Download file from storage
      const tempFilePath = path.join(process.cwd(), 'temp', `${uuidv4()}${path.extname(document.file_path)}`);

      // Ensure temp directory exists
      if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
        fs.mkdirSync(path.join(process.cwd(), 'temp'), { recursive: true });
      }

      // Download file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (downloadError) {
        logger.error(`[DOC_CTRL] Error downloading file: ${downloadError.message}`);
        return res.status(500).json({ error: 'Failed to download file' });
      }

      // Write file to temp directory
      fs.writeFileSync(tempFilePath, Buffer.from(await fileData.arrayBuffer()));

      // Process document with OCR using the validated engine type
      const ocrResults = await ocrService.processDocument(tempFilePath, document.document_type, validatedEngineType);

      // Extract data from OCR results
      const extractionResults = await extractionService.extractData(ocrResults, document.document_type);

      // Analyze document
      const analysisResults = await analysisService.analyzeDocument(document, extractionResults.extractedData);

      // Update document with OCR results
      const { data: updatedDocument, error: updateError } = await supabase
        .from('user_documents')
        .update({
          ocr_text: ocrResults.text,
          ocr_engine: ocrResults.engineType,
          extracted_data: extractionResults.extractedData,
          quality_score: analysisResults.qualityAnalysis.overallScore,
          completeness_score: analysisResults.completenessAnalysis.completenessScore,
          has_suggestions: analysisResults.optimizationSuggestions.length > 0,
          analysis_results: analysisResults
        })
        .eq('id', document.id)
        .select()
        .single();

      if (updateError) {
        logger.error(`[DOC_CTRL] Error updating document with OCR results: ${updateError.message}`);
        return res.status(500).json({ error: 'Failed to update document with OCR results' });
      }

      // Clean up temporary file
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          logger.error(`[DOC_CTRL] Error deleting temporary file: ${err.message}`);
        }
      });

      // Return success response
      return res.status(200).json({
        success: true,
        document: updatedDocument,
        ocrResults,
        extractionResults,
        analysisResults
      });
    } catch (error) {
      logger.error(`[DOC_CTRL] Error processing document OCR: ${error.message}`);
      return res.status(500).json({ error: 'Failed to process document OCR' });
    }
  }

  /**
   * Delete a document
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async deleteDocument(req, res) {
    try {
      logger.info(`[DOC_CTRL] Processing delete document request for ID: ${req.params.id}`);

      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        logger.error(`[DOC_CTRL] Authentication error: ${userError.message}`);
        return res.status(401).json({ error: 'Authentication failed' });
      }

      if (!user) {
        logger.error('[DOC_CTRL] User not authenticated');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get document from database
      const { data: document, error: documentError } = await supabase
        .from('user_documents')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', user.id)
        .single();

      if (documentError) {
        logger.error(`[DOC_CTRL] Error fetching document: ${documentError.message}`);
        return res.status(404).json({ error: 'Document not found' });
      }

      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) {
        logger.error(`[DOC_CTRL] Error deleting file from storage: ${storageError.message}`);
        // Continue anyway, as we still want to delete the database record
      }

      // Delete document record from database
      const { error: deleteError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', user.id);

      if (deleteError) {
        logger.error(`[DOC_CTRL] Error deleting document record: ${deleteError.message}`);
        return res.status(500).json({ error: 'Failed to delete document record' });
      }

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      logger.error(`[DOC_CTRL] Error deleting document: ${error.message}`);
      return res.status(500).json({ error: 'Failed to delete document' });
    }
  }
}

module.exports = new DocumentController();
