const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required.'],
    trim: true,
    index: true,
  },
  contentType: {
    type: String,
    required: true,
    enum: ['guide', 'checklist', 'link', 'article', 'faq'],
    default: 'article',
  },
  content: { // Can store Markdown text, structured JSON for checklists, or a URL for links
    type: String,
    required: [true, 'Resource content or URL is required.'],
  },
  summary: { // Optional short summary for list views
    type: String,
    trim: true,
  },
  targetAudienceTags: { // Tags to help filter resources for specific users/contexts
    type: [String],
    index: true,
    // Examples: 'canada', 'usa', 'student-visa', 'express-entry', 'post-arrival', 'pre-decision', 'financial-planning'
  },
  tags: { // General keywords for searching
    type: [String],
    index: true,
  },
  source: { // Optional: Source of the information (e.g., official website, internal content team)
    type: String,
    trim: true,
  },
  sourceUrl: { // Optional: Link to the original source if applicable
      type: String,
      trim: true
  },
  author: { // Optional: Author if internally created content
      type: String,
      trim: true
  },
  publishedDate: { // Date the resource was published or last significantly updated
      type: Date,
      default: Date.now
  },
  isActive: { // Control visibility
      type: Boolean,
      default: true,
      index: true
  },
  // Potential future fields:
  // upvotes: { type: Number, default: 0 },
  // viewCount: { type: Number, default: 0 },
  // relatedResources: [{ type: mongoose.Schema.ObjectId, ref: 'Resource' }]
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Add text index for searching title, summary, tags
ResourceSchema.index({ title: 'text', summary: 'text', tags: 'text' });

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;
