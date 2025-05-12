const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: { // Denormalize user name for easier display
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide a rating between 1 and 5']
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Review comment cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        transform: function(doc, ret) {
            if (ret.userId && typeof ret.userId !== 'string') {
                ret.userId = ret.userId.toString();
            }
            // You can add other transformations here if needed
            // e.g., delete ret._id; // if you don't want to expose subdocument _id
        }
    }
});


const ProfessionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Professional name is required.'],
    trim: true,
    index: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['lawyer', 'consultant', 'translator', 'other'],
    index: true,
  },
  companyName: { // Optional
    type: String,
    trim: true,
  },
  location: {
    city: String,
    countryCode: { // ISO 3166-1 alpha-2 code
        type: String,
        uppercase: true,
        trim: true,
        minlength: 2,
        maxlength: 2,
    },
    // Could add province/state later
  },
  specializations: { // e.g., 'Express Entry', 'Study Permit', 'Family Sponsorship', 'Business Immigration'
    type: [String],
    index: true,
  },
  languagesSpoken: [String],
  description: { // Short bio or service description
    type: String,
    trim: true,
  },
  contactInfo: {
    email: String,
    phone: String,
    website: String,
  },
  profileImageUrl: {
    type: String,
    trim: true,
  },
  licenseNumber: String, // Optional, depending on profession/region
  regulatoryBody: String, // Optional
  yearsOfExperience: Number,
  // V2+ fields: rating, reviews, bookingLink, hourlyRate, servicesOffered[]
    isActive: { // For admin control
        type: Boolean,
        default: true,
        index: true,
    },
    // V1 Review fields
    reviews: [ReviewSchema],
    averageRating: {
        type: Number,
        min: 1,
        max: 5,
        // set: val => Math.round(val * 10) / 10 // Optional: Round to one decimal place
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
  timestamps: true,
  toJSON: { virtuals: true }, // Ensure virtuals are included when converting to JSON
  toObject: { virtuals: true }
});

// Add text index for searching name, company, description, specializations
ProfessionalSchema.index({ name: 'text', companyName: 'text', description: 'text', specializations: 'text' });

// Middleware to recalculate average rating after a review is saved/removed
// Note: This runs on Review subdocument save/remove which isn't standard.
// It's better to calculate this within the controller logic after adding/deleting reviews.
// We'll add a static method instead for the controller to call.

ProfessionalSchema.statics.calculateAverageRating = async function(professionalId) {
    const stats = await this.aggregate([
        {
            $match: { _id: professionalId }
        },
        {
            $unwind: '$reviews'
        },
        {
            $group: {
                _id: '$_id',
                numReviews: { $sum: 1 },
                avgRating: { $avg: '$reviews.rating' }
            }
        }
    ]);

    try {
        if (stats.length > 0) {
            await this.findByIdAndUpdate(professionalId, {
                numReviews: stats[0].numReviews,
                averageRating: stats[0].avgRating
            });
        } else {
             // No reviews left, reset stats
             await this.findByIdAndUpdate(professionalId, {
                numReviews: 0,
                averageRating: undefined // Or null, or 0 depending on preference
            });
        }
    } catch (err) {
        console.error(`Error updating average rating for professional ${professionalId}:`, err);
    }
};


const Professional = mongoose.model('Professional', ProfessionalSchema);

module.exports = Professional;
