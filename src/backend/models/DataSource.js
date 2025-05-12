const mongoose = require('mongoose');

/**
 * Schema for data sources
 */
const DataSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'Government Official',
      'International Organization',
      'Academic Research',
      'Industry Report',
      'News Media',
      'Immigration Consultant',
      'Legal Resource',
      'Statistical Agency',
      'Other'
    ],
    required: true
  },
  country: String,
  url: {
    type: String,
    required: true
  },
  description: String,
  dataCategories: [{
    category: {
      type: String,
      enum: [
        'Immigration Programs',
        'Eligibility Criteria',
        'Processing Times',
        'Success Rates',
        'Application Costs',
        'Document Requirements',
        'Point Systems',
        'Country Profiles',
        'Settlement Information',
        'Legal Updates',
        'Statistical Data',
        'Other'
      ]
    },
    subcategories: [String],
    description: String,
    reliability: {
      type: Number, // 1-10 scale
      min: 1,
      max: 10
    }
  }],
  updateFrequency: {
    type: String,
    enum: [
      'Real-time',
      'Daily',
      'Weekly',
      'Bi-weekly',
      'Monthly',
      'Quarterly',
      'Bi-annually',
      'Annually',
      'Irregular',
      'Unknown'
    ]
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date
  },
  accessMethod: {
    type: String,
    enum: [
      'Public API',
      'Web Scraping',
      'Manual Collection',
      'Data Download',
      'Subscription Service',
      'Partnership',
      'Other'
    ]
  },
  apiEndpoint: String,
  apiDocumentation: String,
  apiAuthRequired: Boolean,
  scrapingInstructions: String,
  dataFormat: {
    type: String,
    enum: [
      'JSON',
      'XML',
      'CSV',
      'HTML',
      'PDF',
      'Excel',
      'Text',
      'Other'
    ]
  },
  transformationRequired: Boolean,
  transformationNotes: String,
  contactPerson: {
    name: String,
    email: String,
    phone: String,
    position: String
  },
  notes: String,
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
DataSourceSchema.index({ name: 1, organization: 1 }, { unique: true });
DataSourceSchema.index({ type: 1 });
DataSourceSchema.index({ country: 1 });
DataSourceSchema.index({ 'dataCategories.category': 1 });
DataSourceSchema.index({ updateFrequency: 1 });
DataSourceSchema.index({ lastChecked: 1 });
DataSourceSchema.index({ active: 1 });

module.exports = mongoose.model('DataSource', DataSourceSchema);
