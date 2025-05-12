require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { scheduleExpiryCheck } = require('./scheduler/expiryReminder'); // Import scheduler

// --- Basic Configuration ---
const PORT = process.env.DOCUMENT_SERVICE_PORT || 3005; // Define a different port
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
.then(() => console.log('Document Service MongoDB Connected...'))
.catch(err => {
  console.error('Document Service MongoDB Connection Error:', err.message);
  process.exit(1); // Exit if DB connection fails
})
.then(() => {
    // Start scheduler after successful DB connection
    scheduleExpiryCheck();
});


// --- Routes ---
// Mount document routes
app.use('/api/documents', require('./routes/documentRoutes'));

// Placeholder: Load other API routes here (e.g., types, requirements, checklists)
// Example: app.use('/api/document-types', require('./routes/documentTypeRoutes'));
// Example: app.use('/api/document-requirements', require('./routes/documentRequirementRoutes'));
// Example: app.use('/api/document-checklists', require('./routes/checklistRoutes'));


app.get('/', (req, res) => {
  res.send('Migratio Document Service is running.');
});

// --- Basic Error Handling ---
// Placeholder: Add more robust error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Document Service listening on port ${PORT}`);
});

module.exports = app; // Optional: export for testing
