const mongoose = require('mongoose');

const VerificationDetailsSchema = new mongoose.Schema({
    verifiedBy: { type: String, enum: ['system_automated', 'agent_manual', 'third_party_api'] },
    verifiedAt: Date,
    verifierId: String, // Agent ID or System ID
    rejectionReason: String,
    verificationNotes: String,
    // Workflow related fields
    workflowState: { type: String, enum: ['none', 'pending_review', 'under_review', 'escalated', 'completed'], default: 'none' },
    assignedTo: { type: mongoose.Schema.ObjectId, ref: 'User' }, // Optional: Assign to specific admin/agent
    lastWorkflowUpdate: Date
}, { _id: false });

const AnalysisSchema = new mongoose.Schema({
    qualityScore: Number, // 0-100
    analysisDate: Date,
    hasOptimizationSuggestions: Boolean,
    optimizationSuggestions: [String],
    extractedFields: mongoose.Schema.Types.Mixed, // Store as flexible object { fieldName: { value: '...', confidence: 0.95 }, ... }
    extractionConfidence: Number // 0-1
}, { _id: false });

const ProgramAssociationSchema = new mongoose.Schema({
    programId: { type: mongoose.Schema.ObjectId, ref: 'Program' }, // Ref to Program model (likely managed elsewhere)
    requirementId: { type: mongoose.Schema.ObjectId, ref: 'DocumentRequirement' },
    checklistId: { type: mongoose.Schema.ObjectId, ref: 'DocumentChecklist' },
    status: { type: String, enum: ['pending', 'submitted', 'accepted', 'rejected'] }
}, { _id: false });

const SharingDetailsSchema = new mongoose.Schema({
    sharedWith: String, // email or userId
    sharedAt: { type: Date, default: Date.now },
    expiresAt: Date,
    accessLevel: { type: String, enum: ['view', 'download'], default: 'view' },
    accessCount: { type: Number, default: 0 },
    lastAccessed: Date,
    accessToken: { type: String, index: true } // Secure token for sharing link
}, { _id: false });

const VersionSchema = new mongoose.Schema({
    versionNumber: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    fileSize: Number,
    storageLocation: String,
    uploadedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }, // Ref to User model (managed elsewhere)
    notes: String
}, { _id: false });

const AuditTrailSchema = new mongoose.Schema({
    action: { type: String, enum: ['upload', 'view', 'download', 'share', 'verify', 'delete', 'update', 'analyze'], required: true },
    performedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }, // Or system identifier string
    performedAt: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    details: String
}, { _id: false });


const DocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Ref to User model (managed elsewhere)
    required: true,
    index: true
  },
  documentTypeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'DocumentType',
    required: true
  },
  filename: { type: String, required: true }, // Stored filename (e.g., UUID or hash + extension)
  originalFilename: { type: String, required: true }, // User's original filename
  fileSize: { type: Number, required: true }, // bytes
  mimeType: { type: String, required: true },
  fileExtension: { type: String, required: true },
  storageLocation: { type: String, required: true }, // path/key in S3
  thumbnailUrl: String, // path/key in S3
  uploadDate: { type: Date, default: Date.now },
  status: { // Primary status of the document record itself
    type: String,
    enum: ['needed', 'uploaded', 'replaced', 'archived', 'deleted'],
    default: 'uploaded',
    index: true
  },
  expiryDate: Date,
  issuedDate: Date,
  issuedBy: String,
  documentNumber: String,
  verificationStatus: {
    type: String,
    enum: ['not_required', 'pending_submission', 'pending_verification', 'verification_in_progress', 'verified', 'rejected', 'unable_to_verify'],
    default: 'pending_submission', // Or 'not_required' based on type
    index: true
  },
  verificationDetails: VerificationDetailsSchema,
  analysis: AnalysisSchema,
  tags: [String],
  notes: String,
  programAssociations: [ProgramAssociationSchema],
  sharingDetails: [SharingDetailsSchema],
  versions: [VersionSchema],
  auditTrail: [AuditTrailSchema]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes
DocumentSchema.index({ userId: 1, uploadDate: -1 });
DocumentSchema.index({ userId: 1, documentTypeId: 1 });
DocumentSchema.index({ userId: 1, verificationStatus: 1 });
DocumentSchema.index({ expiryDate: 1 });


const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;
