const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

// Mock database for documents
let documents = [
  {
    id: 1,
    name: 'Sample Document 1.pdf',
    document_type: 'Passport',
    upload_date: new Date(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: 'verified',
    user_id: '1e023d5a-6b89-4c3c-a651-6d019265df2c'
  }
];

/**
 * Get all documents for a user
 */
exports.getAllDocuments = async (req, res) => {
  try {
    // In a real app, you would filter by user ID from authentication
    const userId = req.user?.id || '1e023d5a-6b89-4c3c-a651-6d019265df2c';
    const userDocuments = documents.filter(doc => doc.user_id === userId);
    
    res.json(userDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a document by ID
 */
exports.getDocumentById = async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = req.user?.id || '1e023d5a-6b89-4c3c-a651-6d019265df2c';
    
    const document = documents.find(doc => doc.id === documentId && doc.user_id === userId);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    console.error(`Error fetching document ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new document
 */
exports.createDocument = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const userId = req.user?.id || '1e023d5a-6b89-4c3c-a651-6d019265df2c';
    
    // Create a new document
    const newDocument = {
      id: documents.length > 0 ? Math.max(...documents.map(doc => doc.id)) + 1 : 1,
      name: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      document_type: req.body.document_type || 'Unknown',
      upload_date: new Date(),
      expires_at: req.body.expires_at ? new Date(req.body.expires_at) : null,
      status: 'pending',
      user_id: userId
    };
    
    // Add to our mock database
    documents.push(newDocument);
    
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a document
 */
exports.updateDocument = async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = req.user?.id || '1e023d5a-6b89-4c3c-a651-6d019265df2c';
    const updates = req.body;
    
    // Find the document index
    const documentIndex = documents.findIndex(doc => doc.id === documentId && doc.user_id === userId);
    
    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Update the document
    documents[documentIndex] = {
      ...documents[documentIndex],
      ...updates,
      updated_at: new Date()
    };
    
    res.json(documents[documentIndex]);
  } catch (error) {
    console.error(`Error updating document ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a document
 */
exports.deleteDocument = async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = req.user?.id || '1e023d5a-6b89-4c3c-a651-6d019265df2c';
    
    // Find the document index
    const documentIndex = documents.findIndex(doc => doc.id === documentId && doc.user_id === userId);
    
    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Get the document to delete its file
    const documentToDelete = documents[documentIndex];
    
    // Delete the file if it exists
    if (documentToDelete.path && fs.existsSync(documentToDelete.path)) {
      fs.unlinkSync(documentToDelete.path);
    }
    
    // Remove from our mock database
    documents.splice(documentIndex, 1);
    
    res.json({ message: `Document ${documentId} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting document ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Process a document with OCR
 */
exports.processDocumentOcr = async (req, res) => {
  try {
    const documentId = parseInt(req.params.id);
    const userId = req.user?.id || '1e023d5a-6b89-4c3c-a651-6d019265df2c';
    const { engine = 'tesseract' } = req.body;
    
    console.log(`Processing document ${documentId} with OCR engine: ${engine}`);
    
    // Find the document
    const document = documents.find(doc => doc.id === documentId && doc.user_id === userId);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // In a real app, you would:
    // 1. Get the file path from the document
    // 2. Process with OCR using the specified engine
    // 3. Update the document with extracted text
    
    // Simulate OCR processing
    setTimeout(() => {
      // Update the document with OCR results
      const documentIndex = documents.findIndex(doc => doc.id === documentId);
      documents[documentIndex] = {
        ...documents[documentIndex],
        ocr_text: 'Sample extracted text from OCR processing',
        ocr_metadata: {
          engine,
          processing_time: '2.5s',
          confidence: 0.85,
          processed_at: new Date()
        },
        status: 'processed'
      };
      
      res.json(documents[documentIndex]);
    }, 1000); // Simulate processing time
  } catch (error) {
    console.error('Error processing document with OCR:', error);
    res.status(500).json({ error: error.message });
  }
};
