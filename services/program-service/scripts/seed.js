const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Adjust path if .env is in root or service dir
const mongoose = require('mongoose');
const Program = require('../models/Program');
// Assuming Country model/data might be needed and managed elsewhere or seeded separately
// const Country = require('../models/Country'); // Or fetch ObjectId if seeded elsewhere

const MONGODB_URI = process.env.MONGODB_URI;

// --- Sample Program Data ---
// IMPORTANT: Replace with real, researched data for the initial 10 countries
const samplePrograms = [
  {
    name: 'Federal Skilled Worker Program (Express Entry)',
    country: new mongoose.Types.ObjectId(), // Replace with actual ObjectId for Canada
    countryCode: 'CA', // Add code for easier lookup if Country collection not used directly
    category: 'work',
    subcategory: 'Express Entry',
    description: 'For skilled workers with foreign work experience who want to immigrate to Canada permanently.',
    eligibilityCriteria: [
      { criterionType: 'language', criterionName: 'English/French Proficiency (CLB)', minValue: 7, isRequired: true },
      { criterionType: 'education', criterionName: 'Minimum Education Level', minValue: 'Secondary School', isRequired: true },
      { criterionType: 'workExperience', criterionName: 'Skilled Work Experience (NOC 0, A, B)', minValue: 1, unit: 'year', isRequired: true },
      { criterionType: 'age', criterionName: 'Age Points', maxValue: 45 }, // Points vary
      { criterionType: 'financial', criterionName: 'Proof of Funds', minValue: 13757, unit: 'CAD', description: 'For 1 person (as of early 2024)' } // NOTE: Amount changes, needs real-time update mechanism
    ],
    processingTime: { averageMonths: 6, source: 'IRCC Website' },
    costs: [ { feeType: 'Application Processing Fee', amount: 850, currency: 'CAD'}, { feeType: 'Right of Permanent Residence Fee', amount: 515, currency: 'CAD'} ],
    officialWebsite: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/federal-skilled-workers.html',
    pathwayToResidency: true,
    pathwayToCitizenship: true,
    tags: ['skilled worker', 'express entry', 'canada', 'points-based'],
    isActive: true,
    postArrivalSupportLevel: 2
  },
  {
    name: 'Skilled Independent visa (subclass 189)',
    country: new mongoose.Types.ObjectId(), // Replace with actual ObjectId for Australia
    countryCode: 'AU',
    category: 'work',
    subcategory: 'Points-tested stream',
    description: 'For invited workers and New Zealand citizens with skills Australia needs, to live and work permanently anywhere in Australia.',
    eligibilityCriteria: [
        { criterionType: 'age', criterionName: 'Age Limit', maxValue: 44, isRequired: true },
        { criterionType: 'occupation', criterionName: 'Eligible Skilled Occupation', isRequired: true }, // Needs link to occupation list
        { criterionType: 'skills', criterionName: 'Skills Assessment', isRequired: true },
        { criterionType: 'language', criterionName: 'Competent English', isRequired: true }, // e.g., IELTS 6+
        { criterionType: 'points', criterionName: 'Points Test Score', minValue: 65, isRequired: true } // Points threshold can change
    ],
    processingTime: { averageMonths: 12, minMonths: 8, maxMonths: 24, source: 'Australian Home Affairs' }, // Example, varies greatly
    costs: [ { feeType: 'Visa Application Charge (Primary)', amount: 4640, currency: 'AUD'} ], // As of early 2024
    officialWebsite: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189',
    pathwayToResidency: true,
    pathwayToCitizenship: true,
    tags: ['skilled worker', 'australia', 'points-based', 'permanent residency'],
    isActive: true,
    postArrivalSupportLevel: 2
  }
  // Add data for other initial programs...
];

const seedDatabase = async () => {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not defined. Cannot seed database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding...');

    // Clear existing programs (optional, use with caution)
    // console.log('Deleting existing programs...');
    // await Program.deleteMany({});

    // Insert sample programs
    console.log('Inserting sample programs...');
    // Use updateOne with upsert to avoid duplicates if run multiple times
    for (const programData of samplePrograms) {
        // Need actual Country ObjectIds if ref is strict
        // For now, remove country ref or use placeholder if schema allows
        // delete programData.country; // Or handle country lookup/creation

        await Program.updateOne(
            { name: programData.name, countryCode: programData.countryCode }, // Use a unique key
            { $set: programData },
            { upsert: true } // Create if not exists, update if exists
        );
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

// Run the seeding function
seedDatabase();
