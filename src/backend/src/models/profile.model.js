const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'common-law', 'separated', 'divorced', 'widowed']
    },
    nationality: [{
      country: {
        type: String,
        required: true
      },
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    currentResidence: {
      country: String,
      region: String,
      city: String,
      since: Date
    },
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      region: String,
      postalCode: String,
      country: String
    }
  },
  education: [{
    level: {
      type: String,
      enum: ['high-school', 'certificate', 'diploma', 'associate', 'bachelor', 'master', 'doctorate', 'professional']
    },
    field: String,
    institution: String,
    country: String,
    startDate: Date,
    endDate: Date,
    completed: Boolean,
    documentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  }],
  workExperience: [{
    jobTitle: String,
    employer: String,
    country: String,
    industry: String,
    startDate: Date,
    endDate: Date,
    isCurrentJob: Boolean,
    description: String,
    skills: [String],
    documentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  }],
  languageProficiency: [{
    language: String,
    reading: {
      type: Number,
      min: 0,
      max: 10
    },
    writing: {
      type: Number,
      min: 0,
      max: 10
    },
    speaking: {
      type: Number,
      min: 0,
      max: 10
    },
    listening: {
      type: Number,
      min: 0,
      max: 10
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 10
    },
    testType: {
      type: String,
      enum: ['ielts', 'toefl', 'celpip', 'self-assessment', 'other']
    },
    testDate: Date,
    documentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  }],
  financialInfo: {
    currency: String,
    liquidAssets: Number,
    netWorth: Number,
    annualIncome: Number,
    documentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  },
  immigrationPreferences: {
    destinationCountries: [{
      country: String,
      priority: Number
    }],
    pathwayTypes: [{
      type: {
        type: String,
        enum: ['work', 'study', 'family', 'investment', 'humanitarian']
      },
      priority: Number
    }],
    timeframe: {
      type: String,
      enum: ['immediate', 'within-6-months', 'within-1-year', 'within-2-years', 'flexible']
    },
    budgetRange: {
      min: Number,
      max: Number,
      currency: String
    }
  },
  completionStatus: {
    personalInfo: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    education: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    workExperience: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    languageProficiency: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    financialInfo: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    immigrationPreferences: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true
});

// Method to calculate profile completion
profileSchema.methods.calculateCompletion = function() {
  // Define section weights (must sum to 100)
  const sectionWeights = {
    personalInfo: 20,
    education: 15,
    workExperience: 15,
    languageProficiency: 20,
    financialInfo: 10,
    immigrationPreferences: 20
  };

  // Calculate personal info completion
  const personalInfoFields = ['dateOfBirth', 'gender', 'maritalStatus', 'nationality', 'currentResidence', 'phone'];
  const personalInfoCompletion = this._calculateSectionCompletion(this.personalInfo, personalInfoFields);
  
  // Calculate education completion
  const educationCompletion = this.education && this.education.length > 0 ? 100 : 0;
  
  // Calculate work experience completion
  const workExperienceCompletion = this.workExperience && this.workExperience.length > 0 ? 100 : 0;
  
  // Calculate language proficiency completion
  const languageProficiencyCompletion = this.languageProficiency && this.languageProficiency.length > 0 ? 100 : 0;
  
  // Calculate financial info completion
  const financialInfoFields = ['currency', 'liquidAssets', 'netWorth', 'annualIncome'];
  const financialInfoCompletion = this._calculateSectionCompletion(this.financialInfo, financialInfoFields);
  
  // Calculate immigration preferences completion
  const preferencesFields = ['destinationCountries', 'pathwayTypes', 'timeframe', 'budgetRange'];
  const preferencesCompletion = this._calculateSectionCompletion(this.immigrationPreferences, preferencesFields);
  
  // Update completion status
  this.completionStatus = {
    personalInfo: personalInfoCompletion,
    education: educationCompletion,
    workExperience: workExperienceCompletion,
    languageProficiency: languageProficiencyCompletion,
    financialInfo: financialInfoCompletion,
    immigrationPreferences: preferencesCompletion,
    overall: Math.round(
      (personalInfoCompletion * sectionWeights.personalInfo +
      educationCompletion * sectionWeights.education +
      workExperienceCompletion * sectionWeights.workExperience +
      languageProficiencyCompletion * sectionWeights.languageProficiency +
      financialInfoCompletion * sectionWeights.financialInfo +
      preferencesCompletion * sectionWeights.immigrationPreferences) / 100
    )
  };
  
  return this.completionStatus;
};

// Helper method to calculate section completion
profileSchema.methods._calculateSectionCompletion = function(section, fields) {
  if (!section) return 0;
  
  let completedFields = 0;
  let totalFields = fields.length;
  
  fields.forEach(field => {
    if (section[field]) {
      // Check arrays
      if (Array.isArray(section[field])) {
        if (section[field].length > 0) completedFields++;
      } 
      // Check objects
      else if (typeof section[field] === 'object') {
        const subFields = Object.keys(section[field]);
        if (subFields.some(subField => section[field][subField])) {
          completedFields++;
        }
      } 
      // Check primitive values
      else if (section[field]) {
        completedFields++;
      }
    }
  });
  
  return Math.round((completedFields / totalFields) * 100);
};

// Create model
const Profile = mongoose.model('Profile', profileSchema);

module.exports = { Profile };
