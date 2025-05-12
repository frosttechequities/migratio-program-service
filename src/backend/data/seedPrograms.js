const mongoose = require('mongoose');
const Program = require('../models/Program');
const canadaPrograms = require('./programs/canadaPrograms');
const usaPrograms = require('./programs/usaPrograms');
const australiaPrograms = require('./programs/australiaPrograms');
const ukPrograms = require('./programs/ukPrograms');
require('dotenv').config();

/**
 * Seed the database with immigration programs
 */
async function seedPrograms() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing programs
    await Program.deleteMany({});
    console.log('Cleared existing programs');
    
    // Combine all programs
    const allPrograms = [
      ...canadaPrograms,
      ...usaPrograms,
      ...australiaPrograms,
      ...ukPrograms
    ];
    
    // Insert programs
    await Program.insertMany(allPrograms);
    console.log(`Inserted ${allPrograms.length} programs`);
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedPrograms();
