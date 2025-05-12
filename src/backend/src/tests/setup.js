const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Config for MongoDB Memory Server
const mongoServer = new MongoMemoryServer();

// Connect to the in-memory database before running tests
beforeAll(async () => {
  const uri = await mongoServer.getUri();
  await mongoose.connect(uri);
});

// Disconnect and close the db connection after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
