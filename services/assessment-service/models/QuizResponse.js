const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  questionId: { type: String, required: true }, // Identifier for the question asked
  questionText: { type: String }, // Optional: Store the question text for context
  responseValue: { type: mongoose.Schema.Types.Mixed }, // The actual answer value (String, Number, Boolean, Array, etc.)
  responseText: { type: String }, // Optional: Text representation of the answer, if applicable
  answeredAt: { type: Date, default: Date.now }
}, { _id: false });

const DeviceInfoSchema = new mongoose.Schema({
    deviceType: String, // e.g., 'desktop', 'mobile', 'tablet'
    browser: String, // e.g., 'Chrome', 'Firefox'
    operatingSystem: String // e.g., 'Windows 10', 'iOS 15'
}, { _id: false });

const QuizResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Reference to the User model (managed by User Service)
    required: true,
    index: true
  },
  sessionId: { // Unique identifier for this specific quiz attempt/session
    type: String,
    required: true,
    unique: true,
    index: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  status: { // Track the status of this quiz session
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress'
  },
  responses: [ResponseSchema], // Array of answers given in this session
  quizVersion: { // Version of the quiz questions/logic used
    type: String
  },
  completionPercentage: { // Calculated percentage completion
    type: Number,
    min: 0,
    max: 100
  },
  lastQuestionId: { // ID of the last question answered
      type: String
  },
  deviceInfo: DeviceInfoSchema // Information about the device used
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const QuizResponse = mongoose.model('QuizResponse', QuizResponseSchema);

module.exports = QuizResponse;
