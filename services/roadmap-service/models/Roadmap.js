const mongoose = require('mongoose');

// --- Embedded Schemas ---

const TaskSchema = new mongoose.Schema({
    taskId: { type: String, required: true }, // Could be auto-generated or defined by template
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['pending', 'inProgress', 'completed', 'blocked'], default: 'pending' },
    dueDate: Date,
    completedDate: Date,
    reminderSet: { type: Boolean, default: false },
    reminderDate: Date,
    notes: String,
    // Potential link to related documents or resources
    relatedDocumentIds: [{ type: mongoose.Schema.ObjectId, ref: 'Document' }],
    relatedResourceIds: [{ type: mongoose.Schema.ObjectId, ref: 'Resource' }]
}, { _id: true }); // Use default _id

const DocumentRequirementStatusSchema = new mongoose.Schema({
    requirementId: { type: mongoose.Schema.ObjectId, ref: 'DocumentRequirement', required: true },
    documentTypeId: { type: mongoose.Schema.ObjectId, ref: 'DocumentType', required: true }, // Denormalized
    name: { type: String, required: true }, // Denormalized name for display
    status: { type: String, enum: ['needed', 'in_progress', 'uploaded', 'submitted', 'verified', 'rejected', 'not_applicable'], default: 'needed' },
    documentId: { type: mongoose.Schema.ObjectId, ref: 'Document' }, // Link to uploaded document
    notes: String
}, { _id: true });

const MilestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    targetDate: Date,
    achievedDate: Date,
    isAchieved: { type: Boolean, default: false }
}, { _id: true });

const PhaseSchema = new mongoose.Schema({
    phaseName: {
        type: String,
        enum: ['Planning', 'ApplicationPrep', 'SubmissionWaiting', 'PostArrival', 'Integration'],
        required: true
    },
    status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
    startDate: Date, // Actual or estimated
    endDate: Date, // Actual or estimated
    tasks: [TaskSchema],
    documents: [DocumentRequirementStatusSchema], // Tracks status of required docs for this phase
    milestones: [MilestoneSchema]
}, { _id: true });

const PlanningAssessmentResultsSchema = new mongoose.Schema({
    readinessScore: Number,
    financialPlanSummary: Object, // Could be more structured
    notes: String
}, { _id: false });

const SettlementProgressSchema = new mongoose.Schema({
    housingStatus: String,
    bankingSetup: Boolean,
    communityConnectionsMade: Number,
    notes: String
}, { _id: false });

const PdfExportSchema = new mongoose.Schema({
    lastGeneratedAt: Date,
    storageUrl: String,
    version: Number
}, { _id: false });

const SharingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    email: String,
    sharedAt: { type: Date, default: Date.now },
    accessLevel: { type: String, enum: ['view', 'edit'], default: 'view' }
}, { _id: false });


// --- Main Roadmap Schema ---

const RoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Ref to User model (managed elsewhere)
    required: true,
    index: true
  },
  recommendationId: { // Link back to the specific recommendation this roadmap is based on
    type: mongoose.Schema.ObjectId,
    // ref: 'Recommendations.recommendationSet' // Cannot directly ref subdoc, handle relation in service layer
    required: true
  },
  programId: { // Denormalized for easier querying
    type: mongoose.Schema.ObjectId,
    ref: 'Program', // Ref to Program model (managed elsewhere)
    required: true,
    index: true
  },
  title: { // User-defined or generated name, e.g., "My Express Entry Roadmap"
    type: String,
    required: true,
    trim: true
  },
  description: String,
  status: {
    type: String,
    enum: ['draft', 'active', 'on_hold', 'completed', 'abandoned'],
    default: 'active',
    index: true
  },
  phases: [PhaseSchema], // Embed phases, tasks, docs, milestones
  planningAssessmentResults: PlanningAssessmentResultsSchema,
  settlementProgress: SettlementProgressSchema,
  notes: String, // General roadmap notes
  pdfExport: PdfExportSchema,
  sharedWith: [SharingSchema]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Method to calculate overall completion (example)
RoadmapSchema.methods.calculateOverallCompletion = function() {
    let totalTasks = 0;
    let completedTasks = 0;
    this.phases.forEach(phase => {
        phase.tasks.forEach(task => {
            totalTasks++;
            if (task.status === 'completed') {
                completedTasks++;
            }
        });
    });
    return totalTasks === 0 ? 100 : Math.round((completedTasks / totalTasks) * 100);
};

// Add indexes
RoadmapSchema.index({ userId: 1, status: 1 });
RoadmapSchema.index({ userId: 1, programId: 1 });


const Roadmap = mongoose.model('Roadmap', RoadmapSchema);

module.exports = Roadmap;
