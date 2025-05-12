const mongoose = require('mongoose');

/**
 * Document Schema
 * Represents a user document (passport, certificate, etc.)
 */
const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String
  },
  category: {
    type: String,
    enum: ['identity', 'education', 'work', 'language', 'financial', 'other'],
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: [
      'passport',
      'national_id',
      'birth_certificate',
      'marriage_certificate',
      'diploma',
      'degree',
      'transcript',
      'employment_letter',
      'reference_letter',
      'pay_stub',
      'tax_return',
      'language_test',
      'bank_statement',
      'property_document',
      'medical_report',
      'police_clearance',
      'other'
    ],
    required: true,
    index: true
  },
  description: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationNotes: {
    type: String
  },
  expiryDate: {
    type: Date
  },
  issuedDate: {
    type: Date
  },
  issuedBy: {
    type: String
  },
  documentNumber: {
    type: String
  },
  country: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired'],
    default: 'pending',
    index: true
  },
  tags: [{
    type: String
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
documentSchema.index({ userId: 1, category: 1 });
documentSchema.index({ userId: 1, documentType: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ createdAt: -1 });

// Static method to find documents by user
documentSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find documents by category
documentSchema.statics.findByCategory = function(userId, category) {
  return this.find({ userId, category }).sort({ createdAt: -1 });
};

// Static method to find documents by type
documentSchema.statics.findByType = function(userId, documentType) {
  return this.find({ userId, documentType }).sort({ createdAt: -1 });
};

// Static method to find verified documents
documentSchema.statics.findVerified = function(userId) {
  return this.find({ userId, isVerified: true }).sort({ createdAt: -1 });
};

// Method to mark document as verified
documentSchema.methods.verify = async function(verifiedBy, notes = '') {
  return await mongoose.model('Document').findOneAndUpdate(
    { _id: this._id },
    {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: verifiedBy,
      verificationNotes: notes,
      status: 'approved'
    },
    { new: true }
  );
};

// Method to reject document
documentSchema.methods.reject = async function(verifiedBy, notes = '') {
  return await mongoose.model('Document').findOneAndUpdate(
    { _id: this._id },
    {
      isVerified: false,
      verifiedAt: new Date(),
      verifiedBy: verifiedBy,
      verificationNotes: notes,
      status: 'rejected'
    },
    { new: true }
  );
};

// Method to check if document is expired
documentSchema.methods.isExpired = function() {
  if (!this.expiryDate) {
    return false;
  }
  return new Date() > this.expiryDate;
};

// Method to update document status based on expiry
documentSchema.methods.updateStatus = async function() {
  if (this.isExpired()) {
    return await mongoose.model('Document').findOneAndUpdate(
      { _id: this._id },
      { status: 'expired' },
      { new: true }
    );
  }
  return this;
};

const Document = mongoose.model('Document', documentSchema);

module.exports = { Document };
