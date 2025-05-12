const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');
const { connectToInMemoryDB } = require('./utils/in-memory-db');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS handling
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } })); // HTTP request logging

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    logger.info('Connected to MongoDB');
    startServer();
  })
  .catch(async (error) => {
    logger.error('MongoDB connection error:', error);
    logger.info('Attempting to connect to in-memory MongoDB...');

    try {
      await connectToInMemoryDB();
      logger.info('Successfully connected to in-memory MongoDB');
      startServer();
    } catch (inMemoryError) {
      logger.error('Failed to connect to in-memory MongoDB:', inMemoryError);
      process.exit(1);
    }
  });

// Function to start the server
function startServer() {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app; // Export for testing
