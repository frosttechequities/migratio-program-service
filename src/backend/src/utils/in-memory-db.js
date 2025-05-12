const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { logger } = require('./logger');

let mongoServer;

/**
 * Connect to an in-memory MongoDB server
 * @returns {Promise<string>} MongoDB URI
 */
const connectToInMemoryDB = async () => {
  try {
    // Create an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Connect to the in-memory server
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info('Connected to in-memory MongoDB');
    return uri;
  } catch (error) {
    logger.error('Error connecting to in-memory MongoDB:', error);
    throw error;
  }
};

/**
 * Disconnect from the in-memory MongoDB server
 */
const disconnectFromInMemoryDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    logger.info('Disconnected from in-memory MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from in-memory MongoDB:', error);
  }
};

module.exports = {
  connectToInMemoryDB,
  disconnectFromInMemoryDB
};
