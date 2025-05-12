const mongoose = require('mongoose');

const DataExtractionFieldSchema = new mongoose.Schema({
    fieldName: { type: String, required: true },
    fieldType: { type: String, enum: ['text', 'date', 'number', 'boolean'], required: true },
    isRequiredForVerification: { type: Boolean, default: false },
    validationRegex: String,
    displayName: String,
    description: String,
    ocrHint: String
}, { _id: false });

const QualityCheckSchema = new mongoose.Schema({
    checkType: { type: String, enum: ['resolution', 'blurriness', 'completeness', 'signature_present', 'data_consistency'], required: true },
    threshold: mongoose.Schema.Types.Mixed // e.g., min resolution, max blurriness score
}, { _id: false });

const OptimizationRuleSchema = new mongoose.Schema({
    condition: { type: String, required: true }, // e.g., 'qualityScore < 70', 'extractedFields.expiryDate.confidence < 0.8'
    suggestion: { type: String, required: true } // e.g., 'Re-upload a clearer image.', 'Verify extracted expiry date manually.'
}, { _id: false });

const FormatRequirementsSchema = new mongoose.Schema({
    acceptedFormats: [String], // e.g., ['original', 'certified_copy']
    translationRequired: Boolean,
    certificationRequired: Boolean,
    certificationType: { type: String, enum: ['notarized', 'apostille', 'consular', 'sworn_translation', 'other'] }
}, { _id: false });

const CountrySpecificSchema = new mongoose.Schema({
    countryId: { type: mongoose.Schema.ObjectId, ref: 'Country', required: true },
    name: String, // e.g., "Canadian Passport (5-year)"
    description: String,
    additionalRequirements: String,
    issuingAuthorities: [String],
    sampleUrl: String
}, { _id: false });

const GuidanceSchema = new mongoose.Schema({
    instructions: String,
    commonIssues: [String],
    tips: [String],
    sampleImageUrl: String
}, { _id: false });

const TranslationSchema = new mongoose.Schema({
    name: String,
    description: String,
    guidance: GuidanceSchema
}, { _id: false });


const DocumentTypeSchema = new mongoose.Schema({
  code: { // Unique code for this document type, e.g., 'PASSPORT', 'DEGREE_CERTIFICATE'
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  name: { // User-friendly name
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    enum: ['identification', 'education', 'employment', 'financial', 'language', 'medical', 'legal', 'other'],
    required: true,
    index: true
  },
  subcategory: String,
  acceptedFileTypes: { type: [String], required: true }, // Mime types, e.g., ['application/pdf', 'image/jpeg']
  maxFileSizeBytes: { type: Number, required: true },
  isExpiryRequired: { type: Boolean, default: false },
  isExpiryTracked: { type: Boolean, default: false },
  typicalValidityPeriod: Number, // days
  reminderDays: [Number], // days before expiry
  isVerificationRequired: { type: Boolean, default: false }, // Default verification requirement
  verificationProcess: { type: String, enum: ['automated', 'manual', 'third_party', 'none'], default: 'none' },
  dataExtractionFields: [DataExtractionFieldSchema],
  qualityChecks: [QualityCheckSchema],
  optimizationRules: [OptimizationRuleSchema],
  formatRequirements: FormatRequirementsSchema,
  countrySpecifics: [CountrySpecificSchema],
  guidance: GuidanceSchema,
  tags: [String],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  lastUpdatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  translations: { // Keyed by language code, e.g., 'es', 'fr'
    type: Map,
    of: TranslationSchema
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const DocumentType = mongoose.model('DocumentType', DocumentTypeSchema);

module.exports = DocumentType;
