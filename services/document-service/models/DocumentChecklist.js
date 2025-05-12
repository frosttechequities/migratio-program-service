const mongoose = require('mongoose');

const ChecklistItemSchema = new mongoose.Schema({
    requirementId: { // Link to the generic requirement definition
        type: mongoose.Schema.ObjectId,
        ref: 'DocumentRequirement'
    },
    documentTypeId: { // Denormalized for easier access
        type: mongoose.Schema.ObjectId,
        ref: 'DocumentType',
        required: true
    },
    name: { type: String, required: true }, // Display name, potentially customized by user or derived from requirement
    description: String,
    status: { // User's status for this specific item
        type: String,
        enum: ['needed', 'in_progress', 'uploaded', 'submitted', 'verified', 'rejected', 'not_applicable'],
        default: 'needed'
    },
    dueDate: Date,
    documentId: { // Link to the actual uploaded document in the Documents collection
        type: mongoose.Schema.ObjectId,
        ref: 'Document'
    },
    notes: String, // User notes specific to this item on their checklist
    isRequired: { type: Boolean, default: true },
    order: Number // Display order within its category
}, { _id: true }); // Use default _id for subdocuments if needed for direct reference/update

const ChecklistCategorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Identification", "Proof of Funds"
    description: String,
    order: Number,
    items: [ChecklistItemSchema] // Embed the items within the category
}, { _id: false });

const ChecklistSharingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' }, // User shared with
    email: String, // Or email if sharing externally
    sharedAt: { type: Date, default: Date.now },
    accessLevel: { type: String, enum: ['view', 'edit'], default: 'view' }
}, { _id: false });


const DocumentChecklistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Ref to User model (managed elsewhere)
    required: true,
    index: true
  },
  name: { // User-defined or generated name, e.g., "My Express Entry Checklist"
    type: String,
    required: true,
    trim: true
  },
  description: String,
  programId: { // Optional: if generated for a specific program
    type: mongoose.Schema.ObjectId,
    ref: 'Program', // Ref to Program model (managed elsewhere)
    index: true
  },
  roadmapId: { // Optional: if linked to a specific roadmap
    type: mongoose.Schema.ObjectId,
    ref: 'Roadmap', // Ref to Roadmap model (managed elsewhere)
    index: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  completionPercentage: { // Calculated based on item statuses
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Items can be directly in the checklist or organized by category
  // Option 1: Flat list of items (simpler)
  // items: [ChecklistItemSchema],
  // Option 2: Items organized by category (more structured)
  categories: [ChecklistCategorySchema],
  sharedWith: [ChecklistSharingSchema]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Method to calculate completion percentage (example)
DocumentChecklistSchema.methods.calculateCompletion = function() {
    let totalItems = 0;
    let completedItems = 0;

    const items = this.categories.reduce((acc, category) => acc.concat(category.items), []);
    // If using flat list: const items = this.items;

    items.forEach(item => {
        if (item.isRequired) {
            totalItems++;
            if (['uploaded', 'submitted', 'verified', 'not_applicable'].includes(item.status)) {
                completedItems++;
            }
        }
    });

    this.completionPercentage = totalItems === 0 ? 100 : Math.round((completedItems / totalItems) * 100);
    return this.completionPercentage;
};

// Middleware to update completion percentage before saving
DocumentChecklistSchema.pre('save', function(next) {
    this.calculateCompletion();
    next();
});


const DocumentChecklist = mongoose.model('DocumentChecklist', DocumentChecklistSchema);

module.exports = DocumentChecklist;
