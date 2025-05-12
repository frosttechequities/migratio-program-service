require('dotenv').config(); // Load environment variables from .env file
const seedCountries = require('./scripts/seedCountries'); // Import the seedCountries function
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Basic Configuration ---
const PORT = process.env.PROGRAM_SERVICE_PORT || 3002; // Define a different port for this service
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
.then(async () => {
  console.log('Program Service MongoDB Connected...');

  try {
    console.log('Seeding database...');
    const seedingSuccess = await seedCountries();
    if (seedingSuccess) {
      console.log('Database seeded successfully.');
    } else {
      console.warn('Database seeding completed with issues.');
    }
  } catch (seedErr) {
    console.error('Error during seeding:', seedErr);
    // Continue running the service even if seeding fails
  }

  // Start the server after database connection and seeding
  app.listen(PORT, () => {
    console.log(`Program Service listening on port ${PORT}`);
  });
})
.catch(err => {
  console.error('Program Service MongoDB Connection Error:', err.message);
  process.exit(1); // Exit if DB connection fails
});

// --- Routes ---
// Mount program routes
app.use('/api/programs', require('./routes/programRoutes'));

// Mount country routes
app.use('/api/countries', require('./routes/countryRoutes'));


app.get('/', (_req, res) => {
  res.send('Migratio Program Service is running.');
});

// --- Basic Error Handling ---
// Placeholder: Add more robust error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app; // Optional: export for testing
