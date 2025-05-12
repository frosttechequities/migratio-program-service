/**
 * Test Immigration Program Model
 * 
 * This script tests the immigration program model.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ImmigrationProgram = require('../models/immigration-program.model');
const { logger } = require('../utils/logger');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/**
 * Test creating a simple immigration program
 */
async function testCreateProgram() {
  try {
    console.log('Testing creation of a simple immigration program...');
    
    // Create a simple program
    const program = new ImmigrationProgram({
      programId: 'test_program',
      name: 'Test Program',
      country: 'Test Country',
      category: 'Test Category',
      description: 'This is a test program',
      officialUrl: 'https://example.com',
      processingTime: {
        min: 3,
        max: 6,
        unit: 'months',
        formatted: '3-6 months'
      },
      fees: {
        application: 1000,
        total: 1000,
        currency: 'USD'
      },
      successRate: 0.8
    });
    
    // Save the program
    await program.save();
    
    console.log('Program created successfully:');
    console.log(`- ID: ${program._id}`);
    console.log(`- Program ID: ${program.programId}`);
    console.log(`- Name: ${program.name}`);
    
    return program;
  } catch (error) {
    console.error('Error creating program:', error);
    throw error;
  }
}

/**
 * Clean up test data
 */
async function cleanUp(program) {
  try {
    console.log('\nCleaning up test data...');
    
    // Delete the test program
    if (program) {
      await ImmigrationProgram.deleteOne({ _id: program._id });
      console.log(`Deleted test program: ${program._id}`);
    }
    
    console.log('Cleanup completed successfully.');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

// Run the test
async function runTest() {
  let testProgram = null;
  
  try {
    // Test creating a program
    testProgram = await testCreateProgram();
    
    console.log('\nTest completed successfully.');
  } catch (error) {
    console.error('\nTest failed:', error);
  } finally {
    // Clean up test data
    await cleanUp(testProgram);
    process.exit(0);
  }
}

runTest();
