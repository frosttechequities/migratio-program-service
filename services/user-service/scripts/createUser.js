require('dotenv').config({ path: '../.env.example' }); // Adjust path if .env is elsewhere relative to this script
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path to User model

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined. Make sure it is in your .env file.');
  process.exit(1);
}

const createTestUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for user creation...');

    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      passwordHash: 'password123', // This will be hashed by the pre-save hook
      emailVerified: true, // Assuming we want the user to be verified for testing
      accountStatus: 'active',
      userRole: 'user', // or 'admin' if needed for testing admin features
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log(`User with email ${userData.email} already exists.`);
      // Optionally, update the existing user or skip
      // For now, just log and exit
      mongoose.connection.close();
      return;
    }

    const newUser = new User(userData);
    await newUser.save(); // pre-save hook will hash the password

    console.log('Test user created successfully:');
    console.log(`  Name: ${newUser.firstName} ${newUser.lastName}`);
    console.log(`  Email: ${newUser.email}`);
    console.log('  Password was set to: password123 (and has been hashed)');
    console.log(`  User ID: ${newUser._id}`);

  } catch (error) {
    console.error('Error creating test user:', error);
    if (error.code === 11000) {
        console.error(`Duplicate key error: A user with email ${userData.email} might already exist or another unique field constraint was violated.`);
    }
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

createTestUser();
