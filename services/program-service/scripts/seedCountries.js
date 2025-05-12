const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Country = require('../models/Country');

const MONGODB_URI = process.env.MONGODB_URI;

const getSampleCountries = () => {
  const unitedStates = { name: 'United States', countryCode: 'US', region: 'North America', subregion: 'North America', flagEmoji: '🇺🇸' };
  const canada = {
      name: 'Canada',
      countryCode: 'CA',
      region: 'North America',
      subregion: 'North America',
      flagEmoji: '🇨🇦',
      immigrationPolicySummary: 'Canada has a comprehensive immigration system with various pathways for skilled workers, students, and families, driven mainly by economic policy and family reunification. A record number of immigrants were admitted to Canada in 2021, with plans to increase the annual intake to 500,000 per year.',
      skilledWorkerFocus: true,
      studentVisaOptions: true,
      familyReunificationEmphasis: true,
      commonLanguages: ['English', 'French']
    };
  const germany = { name: 'Germany', countryCode: 'DE', region: 'Europe', subregion: 'Western Europe', flagEmoji: '🇩🇪' };
  const unitedKingdom = { name: 'United Kingdom', countryCode: 'GB', region: 'Europe', subregion: 'Northern Europe', flagEmoji: '🇬🇧' };
  const australia = { name: 'Australia', countryCode: 'AU', region: 'Oceania', subregion: 'Australia and New Zealand', flagEmoji: '🇦🇺' };
  const france = { name: 'France', countryCode: 'FR', region: 'Europe', subregion: 'Western Europe', flagEmoji: '🇫🇷' };
  const italy = { name: 'Italy', countryCode: 'IT', region: 'Europe', subregion: 'Southern Europe', flagEmoji: '🇮🇹' };
  const spain = { name: 'Spain', countryCode: 'ES', region: 'Europe', subregion: 'Southern Europe', flagEmoji: '🇪🇸' };
  const netherlands = { name: 'Netherlands', countryCode: 'NL', region: 'Europe', subregion: 'Western Europe', flagEmoji: '🇳🇱' };
  const switzerland = { name: 'Switzerland', countryCode: 'CH', region: 'Europe', subregion: 'Western Europe', flagEmoji: '🇨🇭' };
  const sweden = { name: 'Sweden', countryCode: 'SE', region: 'Europe', subregion: 'Northern Europe', flagEmoji: '🇸🇪' };
  const norway = { name: 'Norway', countryCode: 'NO', region: 'Europe', subregion: 'Northern Europe', flagEmoji: '🇳🇴' };
  const denmark = { name: 'Denmark', countryCode: 'DK', region: 'Europe', subregion: 'Northern Europe', flagEmoji: '🇩🇰' };
  const belgium = { name: 'Belgium', countryCode: 'BE', region: 'Europe', subregion: 'Western Europe', flagEmoji: '🇧🇪' };
  const ireland = { name: 'Ireland', countryCode: 'IE', region: 'Europe', subregion: 'Northern Europe', flagEmoji: '🇮🇪' };
  const austria = { name: 'Austria', countryCode: 'AT', region: 'Europe', subregion: 'Western Europe', flagEmoji: '🇦🇹' };
  const singapore = { name: 'Singapore', countryCode: 'SG', region: 'Asia', subregion: 'Southeast Asia', flagEmoji: '🇸🇬' };
  const unitedArabEmirates = { name: 'United Arab Emirates', countryCode: 'AE', region: 'Asia', subregion: 'Western Asia', flagEmoji: '🇦🇪' };
  const saudiArabia = { name: 'Saudi Arabia', countryCode: 'SA', region: 'Asia', subregion: 'Western Asia', flagEmoji: '🇸🇦' };
  const japan = { name: 'Japan', countryCode: 'JP', region: 'Asia', subregion: 'Eastern Asia', flagEmoji: '🇯🇵' };

  return [
    unitedStates, canada, germany, unitedKingdom, australia, france, italy, spain, netherlands, switzerland, sweden, norway, denmark, belgium, ireland, austria, singapore, unitedArabEmirates, saudiArabia, japan
  ];
};

const sampleCountries = getSampleCountries();

const seedCountries = async () => {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not defined. Cannot seed database.');
    return false;
  }

  let retries = 5;
  let success = false;

  while (retries > 0 && !success) {
    try {
      // Only connect if not already connected
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB Connected for Seeding Countries...');
      }

      // Insert sample countries
      console.log('Inserting sample countries...');
      for (const countryData of sampleCountries) {
        // Add default values for other required fields
        const countryDataWithDefaults = {
          ...countryData,
          immigrationPolicySummary: countryData.immigrationPolicySummary || 'General immigration policies apply.',
          skilledWorkerFocus: countryData.skilledWorkerFocus !== undefined ? countryData.skilledWorkerFocus : true,
          studentVisaOptions: countryData.studentVisaOptions !== undefined ? countryData.studentVisaOptions : true,
          familyReunificationEmphasis: countryData.familyReunificationEmphasis !== undefined ? countryData.familyReunificationEmphasis : true,
          commonLanguages: countryData.commonLanguages || ['English'],
        };

        await Country.updateOne(
          { countryCode: countryData.countryCode },
          { $set: countryDataWithDefaults },
          { upsert: true }
        );
      }

      console.log('Country database seeded successfully!');
      success = true;
    } catch (error) {
      console.error(`Error seeding country database (attempt ${6-retries}/5):`, error);
      retries--;

      if (retries > 0) {
        console.log(`Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  // Only disconnect if we initiated the connection and not in production
  if (mongoose.connection.readyState === 1 && process.env.NODE_ENV !== 'production') {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }

  return success;
};

// Run the seeding function if this script is executed directly
if (require.main === module) {
  seedCountries()
    .then(success => {
      if (success) {
        console.log('Seeding completed successfully.');
        process.exit(0);
      } else {
        console.error('Seeding failed.');
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Unhandled error during seeding:', err);
      process.exit(1);
    });
}

module.exports = seedCountries;
