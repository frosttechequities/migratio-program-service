# Database Architecture

This document outlines the database architecture for the Migratio platform, including schema design, relationships, and implementation details.

## Overview

Migratio uses MongoDB as its primary database, chosen for its flexibility in handling diverse immigration program requirements and user profiles. The database architecture is designed to support:

1. Flexible schema evolution as requirements change
2. Efficient querying for recommendation algorithms
3. Scalability for growing user base and data volume
4. Data integrity and consistency across collections

## Database Organization

The database is organized into the following collections, grouped by domain:

### User Domain
- Users
- Profiles
- Subscriptions
- PaymentMethods

### Assessment Domain
- Questions
- QuizSessions
- Responses

### Program Domain
- Programs
- Countries
- OccupationCodes
- PolicyUpdates

### Recommendation Domain
- Recommendations
- Matches
- GapAnalyses

### Roadmap Domain
- Roadmaps
- Timelines
- Tasks
- Milestones

### Document Domain
- Documents
- DocumentTypes
- GeneratedPDFs
- Templates

### Analytics Domain
- Events
- UserJourneys
- Metrics
- Reports

## Implementation Approach

The database implementation follows these principles:

1. **Schema Validation**: MongoDB schema validation to enforce data structure
2. **Mongoose ODM**: Using Mongoose for schema definition and validation in Node.js
3. **Indexes**: Strategic indexing for query optimization
4. **References**: Using references for relationships between collections
5. **Denormalization**: Strategic denormalization for query performance

## Connection Configuration

Database connection is configured using environment variables:

```javascript
// Database connection configuration
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
```

## Core Schema Definitions

The following sections provide the core schema definitions for the main collections. Additional schemas are defined in separate files for clarity.
