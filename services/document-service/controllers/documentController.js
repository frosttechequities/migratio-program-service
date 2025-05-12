const Document = require('../models/Document');
const DocumentType = require('../models/DocumentType'); // Import DocumentType model
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios'); // Import axios
// TODO: Import error handling utilities

// --- AWS S3 Configuration ---
// Ensure AWS SDK is configured (e.g., via environment variables AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION)
// or via IAM role if running on EC2/ECS.
const s3 = new AWS.S3();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const DOCUMENT_ANALYSIS_SERVICE_URL = process.env.DOCUMENT_ANALYSIS_SERVICE_URL || 'http://document-analysis:5002'; // Docker service name
// --- End S3 Config ---


// Configure Multer for memory storage
const multerStorage = multer.memoryStorage();

// Filter files
const multerFilter = (req, file, cb) => {
  // TODO: Dynamically get allowed types based on documentTypeCode in req.body
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Use proper error handling
    cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF, JPG, PNG, HEIC allowed.`), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // Example: 15MB limit
});

// Middleware to handle single file upload named 'documentFile'
exports.uploadSingleDocument = upload.single('documentFile');

// --- S3 Upload Helper ---
const uploadToS3 = async (file, userId, documentTypeCode) => {
    if (!S3_BUCKET_NAME) {
        console.error("S3_BUCKET_NAME environment variable not set.");
        throw new Error('S3 bucket name is not configured.');
    }
    // Generate a unique key/filename for S3 storage
    const fileExtension = file.originalname.split('.').pop();
    // Use UUID for uniqueness + timestamp + original name fragment for context
    const s3Key = `user_docs/${userId}/${documentTypeCode || 'uncategorized'}/${Date.now()}_${uuidv4()}.${fileExtension}`;

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: 'private', // Manage permissions via bucket policy or IAM roles preferably
        // ServerSideEncryption: 'AES256' // Enable server-side encryption if desired
    };

    console.log(`[DOC_SVC] Uploading ${file.originalname} to S3 bucket ${S3_BUCKET_NAME} with key ${s3Key}`);
    try {
        const data = await s3.upload(params).promise();
        console.log(`[DOC_SVC] Successfully uploaded to S3 at ${data.Location}`);
        return data; // data contains ETag, Location, Key, Bucket
    } catch (error) {
        console.error(`[DOC_SVC] S3 Upload Error for key ${s3Key}:`, error);
        throw new Error('Failed to upload document to storage.'); // Throw a generic error
    }
};

// --- S3 Get Signed URL Helper ---
const getPresignedDownloadUrl = async (s3Key, originalFilename) => {
    if (!S3_BUCKET_NAME) {
        console.error("S3_BUCKET_NAME environment variable not set.");
        throw new Error('S3 bucket name is not configured.');
    }
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Expires: 60 * 5, // URL expires in 5 minutes (adjust as needed)
        ResponseContentDisposition: `attachment; filename="${originalFilename}"` // Suggest download filename
    };
    console.log(`[DOC_SVC] Generating pre-signed URL for key ${s3Key}`);
    try {
        const url = await s3.getSignedUrlPromise('getObject', params);
        console.log(`[DOC_SVC] Generated pre-signed URL successfully.`);
        return url;
    } catch (error) {
        console.error(`[DOC_SVC] Error generating pre-signed URL for key ${s3Key}:`, error);
        throw new Error('Failed to generate secure download link.');
    }
};
// --- End S3 Helpers ---


// Controller function to process the upload after Multer middleware
exports.processDocumentUpload = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID from auth middleware
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No document file uploaded.' });
    }

    const { documentTypeCode, expiryDate, issuedDate, issuedBy, documentNumber, notes, tags } = req.body;

    // 1. Validate required metadata (documentTypeCode is crucial)
    if (!documentTypeCode) {
        return res.status(400).json({ status: 'fail', message: 'Document type code is required.' });
    }

    // 2. Find the corresponding DocumentType ObjectId
    const docType = await DocumentType.findOne({ code: documentTypeCode });
    if (!docType) {
        return res.status(400).json({ status: 'fail', message: `Invalid document type code: ${documentTypeCode}` });
    }

    // 3. Upload file buffer to S3 storage service
    const s3UploadResult = await uploadToS3(req.file, userId, documentTypeCode);
    const s3Location = s3UploadResult.Location;
    const s3Key = s3UploadResult.Key;

    // 4. Create Document metadata record in DB
    const documentData = {
      userId,
      documentTypeId: docType._id, // Use the ObjectId found
      filename: s3Key, // Store S3 Key
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileExtension: req.file.originalname.split('.').pop()?.toLowerCase(),
      storageLocation: s3Location, // Store S3 URL
      uploadDate: new Date(),
      status: 'uploaded',
      expiryDate: expiryDate || null,
      issuedDate: issuedDate || null,
      issuedBy: issuedBy || null,
      documentNumber: documentNumber || null,
      // Set initial verification status based on DocumentType config
      verificationStatus: docType.isVerificationRequired ? 'pending_submission' : 'not_required',
      notes: notes || null,
      tags: tags ? JSON.parse(tags) : [],
      versions: [{
          versionNumber: 1,
          uploadDate: new Date(),
          fileSize: req.file.size,
          storageLocation: s3Location,
          uploadedBy: userId
      }],
      auditTrail: [{
          action: 'upload',
          performedBy: userId,
          performedAt: new Date(),
          details: `Uploaded file ${req.file.originalname} to ${s3Location}`
      }]
      // analysis field will be populated by async processing later
    };

    const newDocument = await Document.create(documentData);

    // 5. Trigger document analysis (async - fire and forget for now, or await if critical)
    try {
        console.log(`[DOC_SVC] Triggering analysis for document ${newDocument._id}`);
        const analysisPayload = {
            metadata: {
                documentId: newDocument._id.toString(),
                documentType: docType.code, // Pass the code or name
                expiryDate: newDocument.expiryDate?.toISOString(),
                issueDate: newDocument.issuedDate?.toISOString(),
                language: 'english', // TODO: Get language from metadata if available
                originalFilename: newDocument.originalFilename,
                mimeType: newDocument.mimeType,
                // Add other relevant fields from newDocument or docType
            }
        };
        // Make the call but don't necessarily wait for it to finish before responding to user
        axios.post(`${DOCUMENT_ANALYSIS_SERVICE_URL}/analyze`, analysisPayload)
            .then(async (analysisResponse) => {
                if (analysisResponse.data?.status === 'success' && analysisResponse.data?.suggestions) {
                    console.log(`[DOC_SVC] Received ${analysisResponse.data.suggestions.length} suggestions for doc ${newDocument._id}. Updating DB.`);
                    // Update the document record with analysis results
                    await Document.findByIdAndUpdate(newDocument._id, {
                        $set: {
                            'analysis.analysisDate': new Date(),
                            'analysis.optimizationSuggestions': analysisResponse.data.suggestions.map(s => s.message), // Store just the message for now
                            'analysis.hasOptimizationSuggestions': analysisResponse.data.suggestions.length > 0,
                            // TODO: Store suggestion codes/severity if needed
                        }
                    });
                    console.log(`[DOC_SVC] Successfully updated doc ${newDocument._id} with analysis suggestions.`);
                } else {
                     console.warn(`[DOC_SVC] Document analysis for ${newDocument._id} returned non-success or no suggestions.`);
                }
            })
            .catch(analysisError => {
                // Log error but don't fail the upload request
                console.error(`[DOC_SVC] Error calling document analysis service for ${newDocument._id}:`, analysisError.message);
            });

    } catch (analysisTriggerError) {
         // Log error but don't fail the upload request
         console.error(`[DOC_SVC] Error triggering document analysis for ${newDocument._id}:`, analysisTriggerError.message);
    }


    res.status(201).json({
      status: 'success',
      data: {
        document: newDocument // Consider filtering sensitive fields before sending response
      }
    });

  } catch (err) {
    console.error("DOCUMENT UPLOAD ERROR:", err);
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return res.status(400).json({ status: 'fail', message });
    }
    // Handle specific errors like Multer errors or S3 errors
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ status: 'fail', message: `File upload error: ${err.message}` });
    }
    if (err.message.includes('S3')) { // Basic check for S3 errors
         return res.status(500).json({ status: 'error', message: 'Failed to store document.' });
    }
    res.status(500).json({ status: 'error', message: err.message || 'Error uploading document' });
  }
};

exports.getAllDocuments = async (req, res, next) => {
  try {
    const userId = req.user?.id;
     if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }
    // TODO: Add filtering (by type, status, tag), sorting, pagination
    console.log(`[DOC_SVC] Fetching documents for user ${userId}`);
    const documents = await Document.find({ userId: userId }).populate('documentTypeId', 'name code category'); // Populate basic type info

     res.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        documents
      }
    });

  } catch (error) {
     console.error("GET ALL DOCUMENTS ERROR:", error);
     res.status(500).json({ status: 'error', message: 'Error fetching documents' });
  }
};

exports.getDocument = async (req, res, next) => {
  try {
     const userId = req.user?.id;
     if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }
    const documentId = req.params.id;
    console.log(`[DOC_SVC] Fetching document ${documentId} for user ${userId}`);

    const doc = await Document.findOne({ _id: documentId, userId: userId }).populate('documentTypeId');

    if (!doc) {
       return res.status(404).json({ status: 'fail', message: 'Document not found or access denied.' });
    }

    // Generate secure, time-limited S3 download URL if requested
    let downloadUrl = null;
    if (req.query.download === 'true') {
       // doc.filename stores the S3 Key
       downloadUrl = await getPresignedDownloadUrl(doc.filename, doc.originalFilename);
    }

    res.status(200).json({
      status: 'success',
      data: {
        document: doc,
        downloadUrl: downloadUrl // Include download URL if generated
      }
    });

  } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ status: 'fail', message: `Invalid document ID format: ${req.params.id}` });
     }
     console.error("GET DOCUMENT ERROR:", error);
     res.status(500).json({ status: 'error', message: 'Error fetching document' });
  }
};

exports.updateDocument = async (req, res, next) => {
  try {
     const userId = req.user?.id;
     if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }
    const documentId = req.params.id;
    // Allow updating specific fields like notes, tags, maybe status (with validation)
    const allowedUpdates = ['notes', 'tags', 'expiryDate', 'issuedDate', 'issuedBy', 'documentNumber'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = req.body[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ status: 'fail', message: 'No valid fields provided for update.' });
    }

    console.log(`[DOC_SVC] Updating document ${documentId} for user ${userId}`);
    const updatedDoc = await Document.findOneAndUpdate(
        { _id: documentId, userId: userId },
        { $set: updates, $push: { auditTrail: { action: 'update', performedBy: userId, details: `Updated fields: ${Object.keys(updates).join(', ')}` } } },
        { new: true, runValidators: true }
    );

     if (!updatedDoc) {
       return res.status(404).json({ status: 'fail', message: 'Document not found or access denied.' });
    }

     res.status(200).json({
      status: 'success',
      data: {
        document: updatedDoc
      }
    });

  } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ status: 'fail', message: `Invalid document ID format: ${req.params.id}` });
     }
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return res.status(400).json({ status: 'fail', message });
    }
     console.error("UPDATE DOCUMENT ERROR:", error);
     res.status(500).json({ status: 'error', message: 'Error updating document' });
  }
};

exports.deleteDocument = async (req, res, next) => {
   try {
     const userId = req.user?.id;
     if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }
    const documentId = req.params.id;
    console.log(`[DOC_SVC] Deleting document ${documentId} for user ${userId}`);

    // Option 1: Soft delete (mark as deleted) - Preferred
    const deletedDoc = await Document.findOneAndUpdate(
        { _id: documentId, userId: userId },
        { $set: { status: 'deleted' }, $push: { auditTrail: { action: 'delete', performedBy: userId, details: 'Marked as deleted' } } },
        { new: true }
    );

    // Option 2: Hard delete (remove from DB and S3) - Use with caution
    /*
    const docToDelete = await Document.findOneAndDelete({ _id: documentId, userId: userId });
    if (docToDelete) {
       // Delete file from S3 using docToDelete.filename (S3 Key)
       console.log(`[DOC_SVC] Deleting S3 object: ${docToDelete.filename}`);
       try {
           await s3.deleteObject({ Bucket: S3_BUCKET_NAME, Key: docToDelete.filename }).promise();
           console.log(`[DOC_SVC] S3 object deleted successfully.`);
       } catch (s3Error) {
            console.error(`[DOC_SVC] Failed to delete S3 object ${docToDelete.filename}:`, s3Error);
            // Decide how to handle: log error, maybe try again later?
            // For now, we proceed with DB deletion even if S3 fails, but log it.
       }
    }
    */

     if (!deletedDoc) { // Check if document was found and updated/deleted (for soft delete)
       return res.status(404).json({ status: 'fail', message: 'Document not found or access denied.' });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
     if (err.name === 'CastError') {
        return res.status(400).json({ status: 'fail', message: `Invalid document ID format: ${req.params.id}` });
     }
     console.error("DELETE DOCUMENT ERROR:", err);
     res.status(500).json({ status: 'error', message: 'Error deleting document' });
  }
};

exports.updateDocumentVerification = async (req, res, next) => {
    try {
        // TODO: Add authorization check - only admins/verifiers should do this
        const documentId = req.params.id;
        const { verificationStatus, verifiedBy, verifierId, rejectionReason, verificationNotes } = req.body;

        // Validate required status
        if (!verificationStatus) {
            return res.status(400).json({ status: 'fail', message: 'Missing verificationStatus in request body.' });
        }
        // Validate status against enum
        const validStatuses = ['not_required', 'pending_submission', 'pending_verification', 'verification_in_progress', 'verified', 'rejected', 'unable_to_verify'];
        if (!validStatuses.includes(verificationStatus)) {
             return res.status(400).json({ status: 'fail', message: `Invalid verificationStatus value: ${verificationStatus}.` });
        }

        console.log(`[DOC_SVC] Updating verification status for document ${documentId} to ${verificationStatus}`);

        const updates = {
            verificationStatus: verificationStatus,
            'verificationDetails.verifiedAt': new Date(),
            'verificationDetails.verifiedBy': verifiedBy || 'system_automated', // Default or require
            'verificationDetails.verifierId': verifierId || 'SYSTEM', // Default or require
            'verificationDetails.rejectionReason': rejectionReason || null,
            'verificationDetails.verificationNotes': verificationNotes || null,
        };

        // Clear rejection reason if status is not 'rejected'
        if (verificationStatus !== 'rejected') {
            updates['verificationDetails.rejectionReason'] = null;
        }

        const updatedDoc = await Document.findByIdAndUpdate(
            documentId,
            {
                $set: updates,
                $push: { auditTrail: { action: 'verify', performedBy: verifierId || 'SYSTEM', details: `Verification status set to ${verificationStatus}` } }
            },
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            return res.status(404).json({ status: 'fail', message: 'Document not found.' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                document: updatedDoc
            }
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ status: 'fail', message: `Invalid document ID format: ${req.params.id}` });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            return res.status(400).json({ status: 'fail', message });
        }
        console.error("UPDATE DOCUMENT VERIFICATION ERROR:", error);
        res.status(500).json({ status: 'error', message: 'Error updating document verification status' });
    }
};

exports.startDocumentVerificationWorkflow = async (req, res, next) => {
    try {
        // TODO: Add authorization check (e.g., user initiating for their own doc, or admin)
        const documentId = req.params.id;
        const { assignedTo } = req.body; // Optional: Assign to a specific reviewer (userId)

        console.log(`[DOC_SVC] Starting verification workflow for document ${documentId}`);

        const updates = {
            'verificationDetails.workflowState': 'pending_review', // Set initial state
            'verificationDetails.lastWorkflowUpdate': new Date(),
            'verificationDetails.assignedTo': assignedTo || null, // Assign if provided
            // Optionally clear previous rejection reasons if restarting
            // 'verificationDetails.rejectionReason': null,
            // 'verificationDetails.verificationNotes': null,
        };

        // Ensure verification status is appropriate to start workflow
        const updatedDoc = await Document.findByIdAndUpdate(
            documentId,
            // { _id: documentId, verificationStatus: { $in: ['pending_submission', 'rejected'] } }, // Only allow starting if pending or rejected?
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            // Could be not found, or status not eligible for workflow start
            return res.status(404).json({ status: 'fail', message: 'Document not found or not eligible to start verification workflow.' });
        }

        // TODO: Trigger notification to assigned reviewer if applicable

        res.status(200).json({
            status: 'success',
            message: 'Document verification workflow initiated.',
            data: {
                document: updatedDoc // Return updated document
            }
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ status: 'fail', message: `Invalid document ID format: ${req.params.id}` });
        }
        console.error("START DOCUMENT VERIFICATION WORKFLOW ERROR:", error);
        res.status(500).json({ status: 'error', message: 'Error starting document verification workflow' });
    }
};


// TODO: Add controllers for DocumentType, DocumentRequirement, DocumentChecklist
