/**
 * Utility for importing country profiles from Markdown files
 */
const fs = require('fs').promises;
const path = require('path');
const { parseMarkdownFile, extractListItems, extractKeyValuePairs } = require('./markdownParser');
const CountryProfile = require('../models/CountryProfile');
const mongoose = require('mongoose');

/**
 * Import country profiles from the research directory
 * @param {string} researchDir - Path to the research directory
 * @returns {Promise<Array>} - Array of imported country profiles
 */
async function importCountryProfiles(researchDir) {
  try {
    const countryProfilesDir = path.join(researchDir, 'visafy_structured_data', 'country_profiles');
    const regions = await fs.readdir(countryProfilesDir);
    
    const importedProfiles = [];
    
    // Process each region directory
    for (const region of regions) {
      const regionDir = path.join(countryProfilesDir, region);
      const stats = await fs.stat(regionDir);
      
      if (!stats.isDirectory()) continue;
      
      const countryFiles = await fs.readdir(regionDir);
      
      // Process each country file
      for (const file of countryFiles) {
        if (!file.endsWith('.md')) continue;
        
        const filePath = path.join(regionDir, file);
        const countryData = await processCountryFile(filePath, region);
        
        if (countryData) {
          // Check if country already exists in database
          const existingCountry = await CountryProfile.findOne({ name: countryData.name });
          
          if (existingCountry) {
            // Update existing country
            Object.assign(existingCountry, countryData);
            await existingCountry.save();
            importedProfiles.push(existingCountry);
            console.log(`Updated country profile: ${countryData.name}`);
          } else {
            // Create new country
            const newCountry = new CountryProfile(countryData);
            await newCountry.save();
            importedProfiles.push(newCountry);
            console.log(`Imported new country profile: ${countryData.name}`);
          }
        }
      }
    }
    
    return importedProfiles;
  } catch (error) {
    console.error('Error importing country profiles:', error);
    throw error;
  }
}

/**
 * Process a country profile Markdown file
 * @param {string} filePath - Path to the country profile file
 * @param {string} region - Region name
 * @returns {Object} - Structured country profile data
 */
async function processCountryFile(filePath, region) {
  try {
    const parsedData = await parseMarkdownFile(filePath);
    const countryName = parsedData.title.replace(' Immigration Profile', '').trim();
    
    const countryProfile = {
      name: countryName,
      region: formatRegionName(region),
      lastUpdated: new Date(),
      dataSource: {
        name: 'Visafy Research Database',
        url: 'internal://visafy/research',
        lastChecked: new Date()
      }
    };
    
    // Process each section
    Object.keys(parsedData.sections).forEach(sectionName => {
      const section = parsedData.sections[sectionName];
      
      if (sectionName === 'Overview') {
        // Process overview section
        const overviewData = extractKeyValuePairs(section.content);
        
        // Extract global ranking
        if (overviewData['Global Ranking']) {
          const rankingMatch = overviewData['Global Ranking'].match(/#(\d+)/);
          if (rankingMatch) {
            countryProfile.globalRanking = parseInt(rankingMatch[1], 10);
          }
          
          // Extract population percentage
          const populationMatch = overviewData['Global Ranking'].match(/(\d+\.\d+)% of population/);
          if (populationMatch && !countryProfile.immigrationStatistics) {
            countryProfile.immigrationStatistics = {
              totalImmigrants: {
                percentOfPopulation: parseFloat(populationMatch[1])
              }
            };
          }
        }
        
        // Extract immigration system type
        if (overviewData['Immigration System Type']) {
          if (!countryProfile.immigrationSystem) {
            countryProfile.immigrationSystem = {};
          }
          countryProfile.immigrationSystem.systemType = overviewData['Immigration System Type'].split(' with ')[0];
        }
        
        // Extract key features
        if (overviewData['Key Immigration Features']) {
          if (!countryProfile.immigrationSystem) {
            countryProfile.immigrationSystem = {};
          }
          countryProfile.immigrationSystem.keyFeatures = overviewData['Key Immigration Features'].split(', ');
        }
        
        // Extract citizenship timeline
        if (overviewData['Citizenship Timeline']) {
          const yearsMatch = overviewData['Citizenship Timeline'].match(/(\d+)\s+years/);
          if (yearsMatch) {
            if (!countryProfile.citizenshipInfo) {
              countryProfile.citizenshipInfo = {};
            }
            countryProfile.citizenshipInfo.residencyRequirement = {
              years: parseInt(yearsMatch[1], 10),
              description: overviewData['Citizenship Timeline']
            };
          }
        }
        
        // Extract official website
        if (overviewData['Official Immigration Website']) {
          const linkMatch = overviewData['Official Immigration Website'].match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (linkMatch) {
            if (!countryProfile.immigrationSystem) {
              countryProfile.immigrationSystem = {};
            }
            countryProfile.immigrationSystem.governingBody = {
              name: linkMatch[1],
              website: linkMatch[2]
            };
          }
        }
      } else if (sectionName === 'Key Immigration Programs') {
        // Process key immigration programs
        countryProfile.keyImmigrationPrograms = [];
        
        // Process subsections as programs
        if (section.subsections) {
          Object.keys(section.subsections).forEach(programName => {
            const programContent = section.subsections[programName];
            const programDescription = programContent.split('\n\nKey features:')[0].trim();
            
            // Extract program type
            let programType = 'Other';
            if (programName.includes('Express Entry') || programName.includes('Skilled')) {
              programType = 'Skilled Worker';
            } else if (programName.includes('Business') || programName.includes('Investor') || programName.includes('Start-up')) {
              programType = 'Business/Investor';
            } else if (programName.includes('Family')) {
              programType = 'Family Sponsorship';
            } else if (programName.includes('Provincial') || programName.includes('Regional')) {
              programType = 'Provincial/Regional';
            }
            
            countryProfile.keyImmigrationPrograms.push({
              name: programName,
              description: programDescription,
              type: programType
            });
          });
        }
      } else if (sectionName === 'Eligibility Requirements') {
        // Process eligibility requirements
        // This would be linked to specific programs, so we'll skip detailed processing here
      } else if (sectionName === 'Processing Times') {
        // Process processing times
        // This would be linked to specific programs, so we'll skip detailed processing here
      } else if (sectionName === 'Settlement Information') {
        // Process settlement information
        if (!countryProfile.settlementInfo) {
          countryProfile.settlementInfo = {};
        }
        
        // Process subsections
        if (section.subsections) {
          Object.keys(section.subsections).forEach(subsectionName => {
            const subsectionContent = section.subsections[subsectionName];
            
            if (subsectionName === 'Cost of Living') {
              countryProfile.settlementInfo.costOfLiving = {
                description: subsectionContent
              };
            } else if (subsectionName === 'Healthcare') {
              countryProfile.settlementInfo.healthcare = {
                system: subsectionContent
              };
            } else if (subsectionName === 'Education') {
              countryProfile.settlementInfo.education = {
                system: subsectionContent
              };
            } else if (subsectionName === 'Employment') {
              countryProfile.settlementInfo.employment = {
                jobMarket: subsectionContent
              };
            } else if (subsectionName === 'Banking and Finance') {
              countryProfile.settlementInfo.banking = {
                accountRequirements: subsectionContent
              };
            } else if (subsectionName === 'Transportation') {
              countryProfile.settlementInfo.transportation = {
                publicTransport: subsectionContent
              };
            }
          });
        }
      } else if (sectionName === 'Useful Resources') {
        // Process useful resources
        countryProfile.usefulResources = [];
        
        const resourceLines = section.content.split('\n');
        for (const line of resourceLines) {
          const resourceMatch = line.match(/^[-*]\s+\[([^\]]+)\]\(([^)]+)\):\s*(.+)$/);
          if (resourceMatch) {
            countryProfile.usefulResources.push({
              name: resourceMatch[1],
              url: resourceMatch[2],
              description: resourceMatch[3],
              category: 'General'
            });
          }
        }
      }
    });
    
    // Generate country code
    countryProfile.code = generateCountryCode(countryName);
    
    return countryProfile;
  } catch (error) {
    console.error(`Error processing country file ${filePath}:`, error);
    return null;
  }
}

/**
 * Format region name to standard format
 * @param {string} region - Directory name of region
 * @returns {string} - Formatted region name
 */
function formatRegionName(region) {
  // Convert directory names like 'north_america' to 'North America'
  return region
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate a country code from country name
 * @param {string} countryName - Name of the country
 * @returns {string} - Two-letter country code
 */
function generateCountryCode(countryName) {
  // This is a simplified version - in a real implementation,
  // you would use a lookup table of ISO country codes
  const words = countryName.split(' ');
  if (words.length === 1) {
    return countryName.substring(0, 2).toUpperCase();
  } else {
    return words.map(word => word.charAt(0)).join('').toUpperCase();
  }
}

module.exports = {
  importCountryProfiles
};
