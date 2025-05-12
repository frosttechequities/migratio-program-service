require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Basic Configuration ---
const PORT = process.env.USER_SERVICE_PORT || 3001; // Define a port for this service
const MONGODB_URI = process.env.MONGODB_URI; // Ensure this is defined in your .env file

// --- Initialize Express App ---
const app = express();

// --- Middleware ---
// Simple request logger
app.use((req, res, next) => {
  console.log(`[UserSvc] Received request: ${req.method} ${req.originalUrl}`);
  next();
});

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
  // Add other options if needed based on Mongoose version
})
.then(() => console.log('User Service MongoDB Connected...'))
.catch(err => {
  console.error('User Service MongoDB Connection Error:', err.message);
  process.exit(1); // Exit if DB connection fails
});

// --- Routes ---
// Mount authentication routes
app.use('/api/auth', require('./routes/authRoutes'));

// Mount profile routes
app.use('/api/profiles', require('./routes/profileRoutes'));

// Mount dashboard routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Mount resource routes
app.use('/api/resources', require('./routes/resourceRoutes'));

// Mount professional (marketplace) routes
app.use('/api/professionals', require('./routes/professionalRoutes'));

// Placeholder: Load other API routes here (users, subscription)
// Example: app.use('/api/users', require('./routes/userRoutes'));
// Example: app.use('/api/subscription', require('./routes/subscriptionRoutes'));


app.get('/', (req, res) => {
  res.send('Migratio User Service is running.');
});

// --- Basic Error Handling ---
// Placeholder: Add more robust error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`User Service listening on port ${PORT}`);
});

module.exports = app; // Optional: export for testing
