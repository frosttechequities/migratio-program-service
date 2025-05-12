require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
// This service likely won't need a direct DB connection
// const mongoose = require('mongoose');

// --- Basic Configuration ---
const PORT = process.env.PDF_SERVICE_PORT || 3007; // Define a different port
// const MONGODB_URI = process.env.MONGODB_URI;

// --- Initialize Express App ---
const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// --- Database Connection (Likely not needed here) ---
/*
if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('PDF Service MongoDB Connected...'))
.catch(err => {
  console.error('PDF Service MongoDB Connection Error:', err.message);
  process.exit(1);
});
*/

// --- Routes ---
// Mount PDF routes
app.use('/api/pdf', require('./routes/pdfRoutes'));

app.get('/', (req, res) => {
  res.send('Migratio PDF Generation Service is running.');
});

// --- Basic Error Handling ---
// Placeholder: Add more robust error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`PDF Generation Service listening on port ${PORT}`);
});

module.exports = app; // Optional: export for testing
