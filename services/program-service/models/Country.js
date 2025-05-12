const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Country name is required.'],
    unique: true,
    trim: true,
  },
  countryCode: { // ISO 3166-1 alpha-2 code
    type: String,
    required: [true, 'Country code (ISO alpha-2) is required.'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 2,
    maxlength: 2,
    index: true,
  },
  region: { // e.g., North America, Europe, Asia Pacific
    type: String,
    trim: true,
    index: true,
  },
  subregion: { // e.g., Western Europe, Southeast Asia
    type: String,
    trim: true,
  },
  flagEmoji: { // Optional: Emoji representation
      type: String,
      trim: true
  },
  // Fields for high-level policy summaries (V1 - placeholders)
  immigrationPolicySummary: {
      type: String,
      trim: true,
      default: 'General immigration policies apply. Specific program details vary.'
  },
  skilledWorkerFocus: { // General indicator if country prioritizes skilled workers
      type: Boolean,
      default: true
  },
  studentVisaOptions: { // General indicator
      type: Boolean,
      default: true
  },
  familyReunificationEmphasis: { // General indicator
      type: Boolean,
      default: true
  },
  typicalAgeRangeGeneral: { // Very broad typical age range for economic immigration
      min: Number,
      max: Number,
      notes: String
  },
  commonLanguages: [String], // e.g., ['English', 'French']
  // Add more fields as needed for country profiles: cost of living index, quality of life rank, etc.
  lastUpdated: {
      type: Date,
      default: Date.now
  }
}, {
  timestamps: true
});

const Country = mongoose.model('Country', CountrySchema);

module.exports = Country;
