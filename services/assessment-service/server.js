require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Basic Configuration ---
const PORT = process.env.ASSESSMENT_SERVICE_PORT || 3003; // Define a different port
const MONGODB_URI = process.env.MONGODB_URI; // Ensure this is defined in your .env file

// --- Initialize Express App ---
const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// --- Database Connection ---
if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables.');
  process.exit(1); // Exit if DB connection string is missing
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Assessment Service MongoDB Connected...'))
.catch(err => {
  console.error('Assessment Service MongoDB Connection Error:', err.message);
  process.exit(1); // Exit if DB connection fails
});

// --- Routes ---
// Mount quiz routes
app.use('/api/quiz', require('./routes/quizRoutes'));

// Placeholder: Load other API routes if needed
// Example: app.use('/api/assessment/questions', require('./routes/questionRoutes')); // If managing questions here

app.get('/', (req, res) => {
  res.send('Migratio Assessment Service is running.');
});

// --- Basic Error Handling ---
// Placeholder: Add more robust error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Assessment Service listening on port ${PORT}`);
});

module.exports = app; // Optional: export for testing
