const mongoose = require('mongoose');

// Re-defining sub-schemas here for clarity, or import if modularized
const NationalitySchema = new mongoose.Schema({
    countryId: { type: mongoose.Schema.ObjectId, ref: 'Country', required: true }, // Ref likely points to data managed elsewhere (e.g., Program Service or common DB)
    isPrimary: Boolean,
    since: Date
}, { _id: false });

const ResidenceSchema = new mongoose.Schema({
    countryId: { type: mongoose.Schema.ObjectId, ref: 'Country', required: true },
    region: String,
    city: String,
    since: Date,
    status: { type: String, enum: ['citizen', 'permanent-resident', 'temporary-resident', 'visitor', 'other'] }
}, { _id: false });

const FamilyMemberSchema = new mongoose.Schema({
    relationship: { type: String, enum: ['spouse', 'child', 'parent', 'sibling', 'other'], required: true },
    dateOfBirth: Date,
    nationality: { type: mongoose.Schema.ObjectId, ref: 'Country' },
    willAccompany: Boolean,
    dependentStatus: Boolean
}, { _id: false });

const ContactInfoSchema = new mongoose.Schema({
    email: String, // Usually same as User.email, but could differ
    phone: String,
    alternateEmail: String,
    preferredContactMethod: { type: String, enum: ['email', 'phone'] }
}, { _id: false });

const PersonalInfoSchema = new mongoose.Schema({
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'] },
    maritalStatus: { type: String, enum: ['single', 'married', 'common-law', 'separated', 'divorced', 'widowed'] },
    nationality: [NationalitySchema],
    currentResidence: ResidenceSchema,
    familyMembers: [FamilyMemberSchema],
    contactInformation: ContactInfoSchema
}, { _id: false });

const EducationSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true }, // Add ID if needed for direct updates
    degreeType: { type: String, enum: ['none','high-school', 'certificate', 'diploma', 'associate', 'bachelor', 'master', 'doctorate', 'professional'] },
    fieldOfStudy: String,
    institution: String,
    country: { type: mongoose.Schema.ObjectId, ref: 'Country' },
    city: String,
    startDate: Date,
    endDate: Date,
    isCompleted: Boolean,
    isCurrentlyEnrolled: Boolean,
    credentialStatus: { type: String, enum: ['not-assessed', 'in-assessment', 'assessed'], default: 'not-assessed' },
    equivalencyAssessment: {
        assessedBy: String,
        assessmentDate: Date,
        equivalentTo: String,
        referenceNumber: String,
        documentUrl: String // Link to stored document?
    },
    transcriptUrl: String, // Link to stored document?
    diplomaUrl: String // Link to stored document?
}); // Use default _id for array elements if easier for updates

const WorkExperienceSchema = new mongoose.Schema({
     _id: { type: mongoose.Schema.ObjectId, auto: true },
    jobTitle: String,
    employer: String,
    country: { type: mongoose.Schema.ObjectId, ref: 'Country' },
    city: String,
    industry: String,
    occupationCode: { type: mongoose.Schema.ObjectId, ref: 'OccupationCode' }, // Ref likely points to data managed elsewhere
    duties: [String],
    skills: [String], // Skills identified by user or NLP
    startDate: Date,
    endDate: Date,
    isCurrentJob: Boolean,
    hoursPerWeek: Number,
    employmentType: { type: String, enum: ['full-time', 'part-time', 'self-employed', 'contract', 'internship'] },
    verificationDocuments: [{
        documentType: { type: String, enum: ['reference-letter', 'pay-stub', 'tax-document', 'contract'] },
        documentId: { type: mongoose.Schema.ObjectId, ref: 'Document' }, // Link to Document Service's ID
        uploadDate: Date
    }]
});

const LanguageTestResultSchema = new mongoose.Schema({
    speaking: Number,
    listening: Number,
    reading: Number,
    writing: Number,
    overall: Number
}, { _id: false });

const LanguageProficiencySchema = new mongoose.Schema({
     _id: { type: mongoose.Schema.ObjectId, auto: true },
    language: { type: String, required: true }, // e.g., 'English', 'French'
    isPrimary: Boolean,
    proficiencyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'native'] },
    formalTest: {
        testType: { type: String, enum: ['IELTS', 'CELPIP', 'TEF', 'TCF', 'TOEFL', 'PTE', 'other'] },
        testDate: Date,
        expiryDate: Date,
        referenceNumber: String,
        results: LanguageTestResultSchema,
        certificateId: { type: mongoose.Schema.ObjectId, ref: 'Document' } // Link to uploaded certificate
    },
    selfAssessment: {
        speaking: Number, // scale 1-10
        listening: Number,
        reading: Number,
        writing: Number
    }
});

const FinancialInfoSchema = new mongoose.Schema({
    currency: String,
    liquidAssets: Number,
    investments: Number,
    realEstate: Number,
    annualIncome: Number,
    netWorth: Number,
    hasFinancialSupport: Boolean,
    financialSupportDetails: {
        supportSource: { type: String, enum: ['family', 'scholarship', 'loan', 'sponsor', 'other'] },
        supportAmount: Number,
        supportDuration: String
    },
    proofOfFunds: [{
        documentType: { type: String, enum: ['bank-statement', 'investment-statement', 'property-valuation', 'income-tax-return'] },
        documentId: { type: mongoose.Schema.ObjectId, ref: 'Document' },
        uploadDate: Date,
        amount: Number
    }]
}, { _id: false });

const ImmigrationApplicationSchema = new mongoose.Schema({
    country: { type: mongoose.Schema.ObjectId, ref: 'Country' },
    programType: String,
    applicationDate: Date,
    status: { type: String, enum: ['approved', 'rejected', 'withdrawn', 'in-progress'] },
    referenceNumber: String,
    rejectionReason: String
}, { _id: false });

const TravelHistorySchema = new mongoose.Schema({
    country: { type: mongoose.Schema.ObjectId, ref: 'Country' },
    purpose: { type: String, enum: ['tourism', 'business', 'education', 'work', 'family', 'other'] },
    entryDate: Date,
    exitDate: Date,
    visaType: String
}, { _id: false });

const ImmigrationViolationSchema = new mongoose.Schema({
     country: { type: mongoose.Schema.ObjectId, ref: 'Country' },
     violationType: String,
     date: Date,
     resolution: String,
     affectsEligibility: Boolean
}, { _id: false });

const DeportationHistorySchema = new mongoose.Schema({
     country: { type: mongoose.Schema.ObjectId, ref: 'Country' },
     date: Date,
     reason: String
}, { _id: false });

const ImmigrationHistorySchema = new mongoose.Schema({
    previousApplications: [ImmigrationApplicationSchema],
    travelHistory: [TravelHistorySchema],
    immigrationViolations: {
        hasViolations: Boolean,
        violationDetails: [ImmigrationViolationSchema]
    },
    deportationHistory: {
        hasDeportations: Boolean,
        deportationDetails: [DeportationHistorySchema]
    }
}, { _id: false });

const DestinationCountryPrefSchema = new mongoose.Schema({
    countryId: { type: mongoose.Schema.ObjectId, ref: 'Country', required: true },
    preferenceRank: Number // e.g., 1 = top choice
}, { _id: false });

const PathwayTypePrefSchema = new mongoose.Schema({
    type: { type: String, enum: ['work', 'study', 'family', 'investment', 'humanitarian'], required: true },
    preferenceRank: Number
}, { _id: false });

const PriorityFactorSchema = new mongoose.Schema({
    factor: { type: String, enum: ['processing-speed', 'cost', 'pathway-to-permanent-residence', 'family-friendly', 'career-opportunities'], required: true },
    importance: { type: Number, min: 1, max: 5 } // 1=Low, 5=High
}, { _id: false });

const LocationPreferencesSchema = new mongoose.Schema({
    climatePreference: { type: String, enum: ['warm', 'cold', 'moderate', 'any'] },
    settingPreference: { type: String, enum: ['urban', 'suburban', 'rural', 'any'] },
    proximityToFamily: Boolean,
    specificRegions: [String] // e.g., ['Ontario', 'British Columbia']
}, { _id: false });

const ImmigrationPreferencesSchema = new mongoose.Schema({
    destinationCountries: [DestinationCountryPrefSchema],
    pathwayTypes: [PathwayTypePrefSchema],
    timeframe: { type: String, enum: ['immediate', 'within-6-months', 'within-1-year', 'within-2-years', 'flexible'] },
    budgetRange: {
        currency: String,
        min: Number,
        max: Number
    },
    priorityFactors: [PriorityFactorSchema],
    locationPreferences: LocationPreferencesSchema
}, { _id: false });

const HealthStatusSchema = new mongoose.Schema({
    hasMedicalConditions: Boolean,
    medicalConditionDetails: String,
    requiresAccessibility: Boolean,
    accessibilityRequirements: String
}, { _id: false });

const CriminalRecordSchema = new mongoose.Schema({
     hasCriminalRecord: Boolean,
     criminalRecordDetails: String,
     rehabilitationStatus: String
}, { _id: false });

const MilitaryServiceSchema = new mongoose.Schema({
     hasServed: Boolean,
     country: { type: mongoose.Schema.ObjectId, ref: 'Country' },
     branch: String,
     rank: String,
     startDate: Date,
     endDate: Date,
     dischargeType: String
}, { _id: false });

const SpecialCircumstancesSchema = new mongoose.Schema({
     isRefugee: Boolean,
     hasHumanitarianNeeds: Boolean,
     details: String
}, { _id: false });

const AdditionalAttributesSchema = new mongoose.Schema({
    healthStatus: HealthStatusSchema,
    criminalRecord: CriminalRecordSchema,
    militaryService: MilitaryServiceSchema,
    specialCircumstances: SpecialCircumstancesSchema
}, { _id: false });

const AssessmentHistorySchema = new mongoose.Schema({
    assessmentId: { type: mongoose.Schema.ObjectId, ref: 'QuizResponse' },
    completedAt: Date,
    // score: Number // Score might be part of recommendation, not profile
    profileSnapshot: Object // Optional snapshot
}, { _id: false });

const DataConsentSchema = new mongoose.Schema({
    profileDataUsage: { type: Boolean, default: true },
    marketingCommunications: { type: Boolean, default: false },
    thirdPartySharing: { type: Boolean, default: false }, // For marketplace partners etc.
    consentDate: Date,
    consentVersion: String
}, { _id: false });

const ProfileMetadataSchema = new mongoose.Schema({
    createdAt: Date,
    lastUpdated: Date,
    completionPercentage: { type: Number, default: 0 },
    completionBySection: mongoose.Schema.Types.Mixed, // { sectionName: percentage }
    assessmentHistory: [AssessmentHistorySchema],
    dataConsent: DataConsentSchema
}, { _id: false });


// --- Main Profile Schema ---
const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  personalInfo: PersonalInfoSchema,
  education: [EducationSchema],
  workExperience: [WorkExperienceSchema],
  languageProficiency: [LanguageProficiencySchema],
  financialInformation: FinancialInfoSchema,
  immigrationHistory: ImmigrationHistorySchema,
  preferences: ImmigrationPreferencesSchema,
  additionalAttributes: AdditionalAttributesSchema,
  // Derived/Inferred data
  derivedSkills: [String],
  inferredExpertiseLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  preliminaryScores: { // Cached preliminary scores from recommendation engine
      timestamp: Date,
      topPathwayTypes: [String],
      topCountries: [String] // Store country codes or IDs
  },
  // Metadata
  profileMetadata: ProfileMetadataSchema,
  // New field for readiness checklist
  readinessChecklist: [{
      itemId: { type: String, required: true }, // e.g., 'funds_saved', 'language_assessed'
      itemText: { type: String, required: true },
      isComplete: { type: Boolean, default: false },
      notes: String,
      lastUpdated: Date
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt at the root level
});

// Method to calculate completion (example - needs refinement)
ProfileSchema.methods.calculateCompletion = function() {
    let totalScore = 0;
    let completedScore = 0;
    const sections = [
        'personalInfo', 'education', 'workExperience', 'languageProficiency',
        'financialInformation', 'immigrationHistory', 'preferences', 'additionalAttributes'
    ];
    const weights = { /* Define weights per section */ };
    const completionBySection = {};

    // Simplified logic: Check if section exists
    sections.forEach(section => {
        const weight = weights[section] || (100 / sections.length);
        totalScore += weight;
        if (this[section] && Object.keys(this[section]).length > 0) { // Basic check
             // More detailed check needed based on required fields within each section
             completionBySection[section] = 100; // Placeholder
             completedScore += weight;
        } else {
             completionBySection[section] = 0;
        }
    });

    this.profileMetadata.completionPercentage = Math.round(completedScore / totalScore * 100);
    this.profileMetadata.completionBySection = completionBySection;
    return this.profileMetadata.completionPercentage;
};

// Middleware to update metadata before saving
ProfileSchema.pre('save', function(next) {
    if (!this.profileMetadata) {
        this.profileMetadata = {};
    }
    this.profileMetadata.lastUpdated = new Date();
    // Initialize checklist if empty
    if (!this.readinessChecklist || this.readinessChecklist.length === 0) {
        this.readinessChecklist = [
            { itemId: 'funds_saved', itemText: 'Saved sufficient funds for settlement', isComplete: false },
            { itemId: 'language_assessed', itemText: 'Taken official language test(s)', isComplete: false },
            { itemId: 'eca_obtained', itemText: 'Obtained Educational Credential Assessment (ECA)', isComplete: false },
            { itemId: 'destinations_researched', itemText: 'Researched potential destination countries/regions', isComplete: false },
            { itemId: 'programs_identified', itemText: 'Identified potential immigration programs', isComplete: false },
            { itemId: 'documents_gathered', itemText: 'Started gathering key documents (passport, birth cert.)', isComplete: false },
        ];
    }
    // this.calculateCompletion(); // Call calculation method - needs refinement
    next();
});


const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
