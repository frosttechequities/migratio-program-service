const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
    amount: Number,
    currency: String,
    description: String
}, { _id: false });

const AlternativeDocumentSchema = new mongoose.Schema({
    documentTypeId: { type: mongoose.Schema.ObjectId, ref: 'DocumentType', required: true },
    conditions: String // e.g., "If primary document is unavailable"
}, { _id: false });

const ConditionalRequirementSchema = new mongoose.Schema({
    condition: { type: String, required: true }, // e.g., "userProfile.age > 40", "userProfile.dependents > 0"
    dependsOn: String // Optional: Field or other requirement this depends on
}, { _id: false });

const DocumentRequirementSchema = new mongoose.Schema({
  programId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Program', // Ref to Program model (managed by Program Service)
    required: true,
    index: true
  },
  documentTypeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'DocumentType', // The type of document needed
    required: true
  },
  name: { // Specific name for this requirement in the context of the program
    type: String,
    required: true,
    trim: true
  },
  description: String, // More details about this specific requirement
  isRequired: { type: Boolean, default: true },
  stage: { // When in the process is this document typically needed?
    type: String,
    enum: ['pre_application', 'application', 'post_application', 'interview', 'arrival', 'settlement'],
    required: true,
    index: true
  },
  deadline: String, // Description of deadline, e.g., "Within 60 days of ITA", "Before landing"
  submissionMethod: {
      type: String,
      enum: ['online_portal', 'mail', 'in_person', 'email', 'not_applicable'],
      default: 'online_portal'
  },
  processingTime: String, // Estimated time for authorities to process this specific doc, if applicable
  fees: FeeSchema, // Any fees associated specifically with this document submission
  alternativeDocuments: [AlternativeDocumentSchema], // Acceptable alternatives
  conditionalRequirement: ConditionalRequirementSchema, // Is this requirement conditional?
  specialInstructions: String, // Specific instructions from the immigration authority for this program
  officialReference: String, // e.g., Section number in official guide
  officialUrl: String, // Link to official source detailing this requirement
  order: Number, // Display order within a checklist category
  isActive: { type: Boolean, default: true }, // Is this requirement currently active for the program?
  lastVerified: Date // When was this requirement last checked against official sources?
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes
DocumentRequirementSchema.index({ programId: 1, stage: 1, order: 1 });
DocumentRequirementSchema.index({ documentTypeId: 1 });


const DocumentRequirement = mongoose.model('DocumentRequirement', DocumentRequirementSchema);

module.exports = DocumentRequirement;
