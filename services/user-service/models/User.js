const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false // Do not send password hash back in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
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
    enum: ['free', 'pathfinder', 'navigator', 'concierge', 'enterprise'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date
  },
  paymentGatewayCustomerId: { // e.g., Stripe Customer ID
    type: String,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
      type: String,
      select: false
  },
  preferredLanguage: {
    type: String,
    default: 'en'
  },
  profileId: { // Link to the separate Profile document
    type: mongoose.Schema.ObjectId,
    ref: 'Profile' // Assuming a 'Profile' model exists
  },
  userRole: {
    type: String,
    enum: ['user', 'admin', 'contentManager', 'supportAgent', 'consultant'],
    default: 'user'
  },
  preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      notificationChannels: [{ type: String, enum: ['email', 'in_app', 'push', 'sms'] }],
      dashboardFocus: { type: String, enum: ['planning', 'application', 'settlement', 'overview'], default: 'overview' }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// --- Middleware ---

// Password Hashing Middleware (before saving)
UserSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('passwordHash')) return next();

  // Hash the password with cost of 12
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);

  // // Delete passwordConfirm field if you were using one
  // this.passwordConfirm = undefined;
  next();
});

// Update passwordChangedAt property (before saving, if password modified)
UserSchema.pre('save', function(next) {
  if (!this.isModified('passwordHash') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // Subtract 1 sec to ensure token generated after change
  next();
});

// --- Instance Methods ---

// Method to check password validity
UserSchema.methods.correctPassword = async function(
  candidatePassword,
  userPasswordHash
) {
  return await bcrypt.compare(candidatePassword, userPasswordHash);
};

// Method to check if password was changed after JWT was issued
UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// Method to create password reset token (example)
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');

  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expiry (e.g., 10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // Return the unhashed token to send to user
};


const User = mongoose.model('User', UserSchema);

module.exports = User;
