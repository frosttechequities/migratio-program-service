require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
// May need mongoose if storing results or for ObjectId validation
// const mongoose = require('mongoose');

// --- Basic Configuration ---
const PORT = process.env.RECOMMENDATION_SERVICE_PORT || 3004; // Define a different port
// const MONGODB_URI = process.env.MONGODB_URI; // May not need direct DB connection if orchestrating

// --- Initialize Express App ---
const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// --- Database Connection (Optional for this service) ---
/*
if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Recommendation Service MongoDB Connected...'))
.catch(err => {
  console.error('Recommendation Service MongoDB Connection Error:', err.message);
  process.exit(1);
});
*/

// --- Routes ---
// Mount recommendation routes
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

app.get('/', (req, res) => {
  res.send('Migratio Recommendation Service is running.');
});

// --- Basic Error Handling ---
// Placeholder: Add more robust error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Recommendation Service listening on port ${PORT}`);
});

module.exports = app; // Optional: export for testing
