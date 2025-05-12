# User Domain Schemas

This document defines the MongoDB schemas for the User Domain collections in the Migratio platform.

## Users Collection

The Users collection stores authentication and account information.

```javascript
// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String
  },
  preferredLanguage: {
    type: String,
    default: 'en'
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  referralSource: {
    type: String
  },
  userRole: {
    type: String,
    enum: ['user', 'admin', 'contentManager'],
    default: 'user'
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ accountStatus: 1 });
UserSchema.index({ subscriptionTier: 1 });
UserSchema.index({ userRole: 1 });

// Methods
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, role: this.userRole },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Pre-save hook for password hashing
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

## Profiles Collection

The Profiles collection stores detailed user profile information used for recommendations.

```javascript
// Profile Schema
const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  personalInfo: {
    dateOfBirth: {
      type: Date
    },
    nationality: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    }],
    currentResidence: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed', 'separated', 'commonLaw']
    },
    dependents: {
      type: Number,
      default: 0,
      min: 0
    },
    familyMembers: [{
      relationship: {
        type: String,
        required: true
      },
      age: {
        type: Number,
        required: true
      },
      nationality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
      }
    }]
  },
  education: [{
    degree: {
      type: String,
      required: true
    },
    fieldOfStudy: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    },
    yearCompleted: {
      type: Number
    },
    durationMonths: {
      type: Number
    },
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  }],
  workExperience: [{
    jobTitle: {
      type: String,
      required: true
    },
    employer: {
      type: String,
      required: true
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    },
    occupationCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OccupationCode'
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    isCurrentJob: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    skillsUsed: [{
      type: String
    }],
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  }],
  languageProficiency: [{
    language: {
      type: String,
      required: true
    },
    speaking: {
      type: Number,
      min: 1,
      max: 10
    },
    listening: {
      type: Number,
      min: 1,
      max: 10
    },
    reading: {
      type: Number,
      min: 1,
      max: 10
    },
    writing: {
      type: Number,
      min: 1,
      max: 10
    },
    overallScore: {
      type: String
    },
    testType: {
      type: String
    },
    testDate: {
      type: Date
    },
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  }],
  financialResources: {
    liquidAssets: {
      type: Number
    },
    currency: {
      type: String,
      default: 'USD'
    },
    annualIncome: {
      type: Number
    },
    netWorth: {
      type: Number
    },
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  },
  immigrationHistory: [{
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    },
    visaType: {
      type: String
    },
    purpose: {
      type: String
    },
    entryDate: {
      type: Date
    },
    exitDate: {
      type: Date
    },
    wasRefused: {
      type: Boolean,
      default: false
    },
    refusalReason: {
      type: String
    },
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  }],
  preferences: {
    destinationCountries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    }],
    pathwayTypes: [{
      type: String,
      enum: ['work', 'study', 'family', 'investment', 'humanitarian']
    }],
    timeframe: {
      type: String,
      enum: ['immediate', '6months', '1year', '2years', '5years']
    },
    budgetRange: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    priorityFactors: [{
      type: String,
      enum: ['speed', 'cost', 'permanence', 'flexibility']
    }]
  },
  assessmentResults: {
    lastCompleted: {
      type: Date
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    quizResponses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuizResponse'
    }]
  },
  completedSections: {
    personalInfo: {
      type: Boolean,
      default: false
    },
    education: {
      type: Boolean,
      default: false
    },
    workExperience: {
      type: Boolean,
      default: false
    },
    languageProficiency: {
      type: Boolean,
      default: false
    },
    financialResources: {
      type: Boolean,
      default: false
    },
    immigrationHistory: {
      type: Boolean,
      default: false
    },
    preferences: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ 'personalInfo.nationality': 1 });
ProfileSchema.index({ 'personalInfo.currentResidence': 1 });
ProfileSchema.index({ 'preferences.destinationCountries': 1 });
ProfileSchema.index({ 'preferences.pathwayTypes': 1 });
ProfileSchema.index({ 'workExperience.occupationCode': 1 });

// Virtual for age calculation
ProfileSchema.virtual('age').get(function() {
  if (!this.personalInfo.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Method to calculate profile completion percentage
ProfileSchema.methods.calculateCompletionPercentage = function() {
  const sections = Object.values(this.completedSections);
  const completedCount = sections.filter(Boolean).length;
  return Math.round((completedCount / sections.length) * 100);
};

// Pre-save hook to update completion percentage
ProfileSchema.pre('save', function(next) {
  // Update section completion flags
  this.completedSections.personalInfo = !!(
    this.personalInfo.dateOfBirth && 
    this.personalInfo.nationality && 
    this.personalInfo.currentResidence
  );
  
  this.completedSections.education = !!(this.education && this.education.length > 0);
  this.completedSections.workExperience = !!(this.workExperience && this.workExperience.length > 0);
  this.completedSections.languageProficiency = !!(this.languageProficiency && this.languageProficiency.length > 0);
  this.completedSections.financialResources = !!(this.financialResources && this.financialResources.liquidAssets);
  this.completedSections.immigrationHistory = true; // Optional section
  this.completedSections.preferences = !!(
    this.preferences.destinationCountries && 
    this.preferences.destinationCountries.length > 0 &&
    this.preferences.pathwayTypes &&
    this.preferences.pathwayTypes.length > 0
  );
  
  // Calculate overall completion percentage
  const completionPercentage = this.calculateCompletionPercentage();
  this.assessmentResults.completionPercentage = completionPercentage;
  
  next();
});
```

## Subscriptions Collection

The Subscriptions collection manages user subscription information.

```javascript
// Subscription Schema
const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired', 'past_due', 'trialing'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'annual'],
    default: 'monthly'
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  paymentMethodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod'
  },
  lastBillingDate: {
    type: Date
  },
  nextBillingDate: {
    type: Date
  },
  canceledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  },
  promotionCode: {
    type: String
  },
  promotionDiscount: {
    type: Number
  },
  externalSubscriptionId: {
    type: String
  },
  paymentProvider: {
    type: String,
    enum: ['stripe', 'paypal', 'manual'],
    default: 'stripe'
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes
SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ plan: 1 });
SubscriptionSchema.index({ nextBillingDate: 1 });

// Virtual for days remaining
SubscriptionSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return 0;
  
  const today = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

// Method to check if subscription is active
SubscriptionSchema.methods.isActive = function() {
  return this.status === 'active' || this.status === 'trialing';
};

// Method to cancel subscription
SubscriptionSchema.methods.cancel = function(reason) {
  this.status = 'canceled';
  this.autoRenew = false;
  this.canceledAt = new Date();
  this.cancellationReason = reason;
  return this.save();
};
```

## PaymentMethods Collection

The PaymentMethods collection stores user payment information.

```javascript
// PaymentMethod Schema
const PaymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['card', 'paypal', 'bank_account'],
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'failed'],
    default: 'active'
  },
  // Card-specific fields
  card: {
    brand: {
      type: String
    },
    last4: {
      type: String
    },
    expiryMonth: {
      type: Number
    },
    expiryYear: {
      type: Number
    },
    holderName: {
      type: String
    }
  },
  // PayPal-specific fields
  paypal: {
    email: {
      type: String
    }
  },
  // Bank account-specific fields
  bankAccount: {
    bankName: {
      type: String
    },
    accountType: {
      type: String
    },
    last4: {
      type: String
    }
  },
  billingAddress: {
    line1: {
      type: String
    },
    line2: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    postalCode: {
      type: String
    },
    country: {
      type: String
    }
  },
  externalPaymentMethodId: {
    type: String
  },
  paymentProvider: {
    type: String,
    enum: ['stripe', 'paypal', 'manual'],
    default: 'stripe'
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes
PaymentMethodSchema.index({ userId: 1 });
PaymentMethodSchema.index({ userId: 1, isDefault: 1 });
PaymentMethodSchema.index({ status: 1 });

// Virtual for expiry date formatted
PaymentMethodSchema.virtual('expiryFormatted').get(function() {
  if (!this.card || !this.card.expiryMonth || !this.card.expiryYear) return null;
  
  const month = String(this.card.expiryMonth).padStart(2, '0');
  const year = String(this.card.expiryYear).slice(-2);
  
  return `${month}/${year}`;
});

// Method to check if card is expired
PaymentMethodSchema.methods.isExpired = function() {
  if (!this.card || !this.card.expiryMonth || !this.card.expiryYear) return false;
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = now.getFullYear();
  
  return (this.card.expiryYear < currentYear) || 
         (this.card.expiryYear === currentYear && this.card.expiryMonth < currentMonth);
};

// Pre-save hook to update status based on expiration
PaymentMethodSchema.pre('save', function(next) {
  if (this.type === 'card' && this.isExpired()) {
    this.status = 'expired';
  }
  next();
});
```
