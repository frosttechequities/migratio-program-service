/**
 * OCR Service
 * Handles document OCR processing using multiple engines
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * OCR Service class
 */
class OCRService {
  /**
   * Process document with OCR
   * @param {string} filePath - Path to the document file
   * @param {string} documentType - Type of document
   * @param {string} engineType - OCR engine to use (tesseract, azure)
   * @returns {Promise<Object>} - OCR results
   */
  async processDocument(filePath, documentType, engineType = 'tesseract') {
    try {
      logger.info(`[OCR_SVC] Processing document with ${engineType}: ${filePath}`);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Validate engine type - default to free option (Tesseract) if invalid
      const validEngines = ['tesseract', 'azure'];
      if (!validEngines.includes(engineType.toLowerCase())) {
        logger.warn(`[OCR_SVC] Invalid engine type: ${engineType}. Defaulting to tesseract.`);
        engineType = 'tesseract';
      }

      // Process with selected engine
      let result;
      switch (engineType.toLowerCase()) {
        case 'azure':
          // Check if Azure credentials are configured before attempting to use it
          if (!config.azure.endpoint || !config.azure.apiKey) {
            logger.warn('[OCR_SVC] Azure credentials not configured. Falling back to Tesseract.');
            result = await this.processWithTesseract(filePath, documentType);
          } else {
            result = await this.processWithAzure(filePath, documentType);
          }
          break;
        case 'tesseract':
        default:
          result = await this.processWithTesseract(filePath, documentType);
          break;
      }

      return result;
    } catch (error) {
      logger.error(`[OCR_SVC] Error processing document: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process document with Tesseract OCR
   * @param {string} filePath - Path to the document file
   * @param {string} documentType - Type of document
   * @returns {Promise<Object>} - OCR results
   */
  async processWithTesseract(filePath, documentType) {
    try {
      logger.info(`[OCR_SVC] Processing with Tesseract: ${filePath}`);

      // Create Tesseract worker
      const worker = await createWorker();

      // Determine language based on document type
      // This is a simple example - in a real implementation, you would have a more
      // sophisticated mapping of document types to languages
      let language = 'eng';
      if (documentType === 'passport_chinese' || documentType === 'document_chinese') {
        language = 'chi_sim+chi_tra+eng';
      } else if (documentType === 'passport_russian' || documentType === 'document_russian') {
        language = 'rus+eng';
      }

      // Initialize worker with language
      await worker.loadLanguage(language);
      await worker.initialize(language);

      // Recognize text
      const { data } = await worker.recognize(filePath);

      // Terminate worker
      await worker.terminate();

      return {
        text: data.text,
        confidence: data.confidence,
        words: data.words,
        engineType: 'tesseract',
        language
      };
    } catch (error) {
      logger.error(`[OCR_SVC] Tesseract error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process document with Azure Document Intelligence
   * @param {string} filePath - Path to the document file
   * @param {string} documentType - Type of document
   * @returns {Promise<Object>} - OCR results
   */
  async processWithAzure(filePath, documentType) {
    try {
      logger.info(`[OCR_SVC] Processing with Azure: ${filePath}`);

      // Check if Azure credentials are configured
      if (!config.azure.endpoint || !config.azure.apiKey) {
        throw new Error('Azure Document Intelligence credentials not configured');
      }

      // Read file as binary
      const fileBuffer = fs.readFileSync(filePath);

      // Prepare request to Azure Document Intelligence
      const url = `${config.azure.endpoint}/formrecognizer/documentModels/prebuilt-read:analyze?api-version=2023-07-31`;

      // Send request to Azure
      const response = await axios.post(url, fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': config.azure.apiKey
        }
      });

      // Get operation ID from response headers
      const operationLocation = response.headers['operation-location'];
      if (!operationLocation) {
        throw new Error('Operation location not found in Azure response');
      }

      // Poll for results
      const result = await this.pollForAzureResults(operationLocation);

      // Process and format results
      const processedResult = this.processAzureResults(result);

      return {
        ...processedResult,
        engineType: 'azure'
      };
    } catch (error) {
      logger.error(`[OCR_SVC] Azure error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Poll for Azure Document Intelligence results
   * @param {string} operationLocation - Azure operation URL
   * @returns {Promise<Object>} - Azure results
   */
  async pollForAzureResults(operationLocation) {
    try {
      // Maximum number of polling attempts
      const maxAttempts = 10;
      // Delay between polling attempts (in milliseconds)
      const pollingDelay = 1000;

      let attempts = 0;
      while (attempts < maxAttempts) {
        // Wait for polling delay
        await new Promise(resolve => setTimeout(resolve, pollingDelay));

        // Request results
        const response = await axios.get(operationLocation, {
          headers: {
            'Ocp-Apim-Subscription-Key': config.azure.apiKey
          }
        });

        // Check status
        const status = response.data.status;
        if (status === 'succeeded') {
          return response.data;
        } else if (status === 'failed') {
          throw new Error(`Azure processing failed: ${JSON.stringify(response.data.error)}`);
        }

        attempts++;
      }

      throw new Error('Azure processing timed out');
    } catch (error) {
      logger.error(`[OCR_SVC] Error polling Azure results: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process Azure Document Intelligence results
   * @param {Object} result - Azure results
   * @returns {Object} - Processed results
   */
  processAzureResults(result) {
    try {
      // Extract text content
      const pages = result.analyzeResult.pages || [];
      const content = result.analyzeResult.content || '';

      // Extract words with positions
      const words = [];
      pages.forEach(page => {
        const pageWords = page.words || [];
        pageWords.forEach(word => {
          words.push({
            text: word.content,
            confidence: word.confidence,
            boundingBox: word.boundingBox,
            page: page.pageNumber
          });
        });
      });

      return {
        text: content,
        words,
        confidence: pages.length > 0 ? 0.9 : 0, // Placeholder confidence
        language: result.analyzeResult.languages || ['en']
      };
    } catch (error) {
      logger.error(`[OCR_SVC] Error processing Azure results: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new OCRService();
