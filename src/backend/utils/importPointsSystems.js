/**
 * Utility for importing points systems from Markdown files
 */
const fs = require('fs').promises;
const path = require('path');
const { parseMarkdownFile, parsePointsSystem, extractTableData } = require('./markdownParser');
const PointsSystem = require('../models/PointsSystem');

/**
 * Import points systems from the research directory
 * @param {string} researchDir - Path to the research directory
 * @returns {Promise<Array>} - Array of imported points systems
 */
async function importPointsSystems(researchDir) {
  try {
    const pointsSystemsFilePath = path.join(researchDir, 'point_systems_comparison.md');
    const eligibilityCriteriaFilePath = path.join(researchDir, 'immigration_eligibility_criteria.md');
    
    // Import points systems
    const pointsSystems = await importPointsSystemsComparison(pointsSystemsFilePath);
    console.log(`Imported ${pointsSystems.length} points systems from comparison file`);
    
    // Enhance with eligibility criteria if available
    if (await fileExists(eligibilityCriteriaFilePath)) {
      const enhancedSystems = await enhanceWithEligibilityCriteria(eligibilityCriteriaFilePath, pointsSystems);
      console.log(`Enhanced ${enhancedSystems.length} points systems with eligibility criteria`);
    }
    
    return await PointsSystem.find({});
  } catch (error) {
    console.error('Error importing points systems:', error);
    throw error;
  }
}

/**
 * Check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - Whether the file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Import points systems from comparison file
 * @param {string} filePath - Path to the points systems comparison file
 * @returns {Promise<Array>} - Array of imported points systems
 */
async function importPointsSystemsComparison(filePath) {
  try {
    const parsedData = await parseMarkdownFile(filePath);
    const importedSystems = [];
    
    // Extract table data from the comparison section
    let comparisonTableData = null;
    
    for (const sectionName of Object.keys(parsedData.sections)) {
      const section = parsedData.sections[sectionName];
      
      if (sectionName.includes('Points-Based Systems')) {
        comparisonTableData = extractTableData(section.content);
        break;
      }
    }
    
    if (!comparisonTableData || comparisonTableData.length === 0) {
      console.warn('No points system comparison table found');
      return [];
    }
    
    // Process each row in the comparison table
    for (const row of comparisonTableData) {
      const country = row['Country'] ? row['Country'].split(' (')[0].trim() : null;
      if (!country) continue;
      
      // Extract program name
      let programName = '';
      if (row['Country'] && row['Country'].includes('(')) {
        programName = row['Country'].match(/\(([^)]+)\)/)[1];
      }
      
      // Create points system data
      const pointsSystemData = {
        name: `${country} Points System`,
        country,
        programName,
        description: `Points-based immigration system for ${country}`,
        lastUpdated: new Date(),
        dataSource: {
          name: 'Visafy Research Database',
          url: 'internal://visafy/research',
          lastChecked: new Date()
        },
        categories: []
      };
      
      // Extract minimum points
      if (row['Minimum Points']) {
        const minPointsMatch = row['Minimum Points'].match(/(\d+)/);
        if (minPointsMatch) {
          pointsSystemData.minimumPoints = parseInt(minPointsMatch[1], 10);
        }
        
        // Extract competitive points if available
        const competitiveMatch = row['Minimum Points'].match(/(\d+)\+\s+\(competitive\)/i);
        if (competitiveMatch) {
          pointsSystemData.competitivePoints = parseInt(competitiveMatch[1], 10);
        }
      }
      
      // Add categories based on available columns
      const categories = [
        { column: 'Age Points', name: 'Age' },
        { column: 'Education Points', name: 'Education' },
        { column: 'Language Points', name: 'Language Proficiency' },
        { column: 'Experience Points', name: 'Work Experience' },
        { column: 'Other Key Factors', name: 'Other Factors' }
      ];
      
      for (const category of categories) {
        if (row[category.column]) {
          const categoryData = {
            name: category.name,
            description: row[category.column],
            factors: []
          };
          
          // Extract maximum points if available
          const maxPointsMatch = row[category.column].match(/Max\s+(\d+)/i);
          if (maxPointsMatch) {
            categoryData.maximumPoints = parseInt(maxPointsMatch[1], 10);
          }
          
          // Add a generic factor for now - this would be enhanced later
          categoryData.factors.push({
            name: category.name,
            description: row[category.column],
            pointsBreakdown: []
          });
          
          pointsSystemData.categories.push(categoryData);
        }
      }
      
      // Check if points system already exists
      const existingSystem = await PointsSystem.findOne({
        country: pointsSystemData.country,
        programName: pointsSystemData.programName
      });
      
      if (existingSystem) {
        // Update existing system
        Object.assign(existingSystem, pointsSystemData);
        await existingSystem.save();
        importedSystems.push(existingSystem);
        console.log(`Updated points system: ${pointsSystemData.country} - ${pointsSystemData.programName}`);
      } else {
        // Create new system
        const newSystem = new PointsSystem(pointsSystemData);
        await newSystem.save();
        importedSystems.push(newSystem);
        console.log(`Imported new points system: ${pointsSystemData.country} - ${pointsSystemData.programName}`);
      }
    }
    
    return importedSystems;
  } catch (error) {
    console.error(`Error importing points systems from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Enhance points systems with eligibility criteria
 * @param {string} filePath - Path to the eligibility criteria file
 * @param {Array} pointsSystems - Array of already imported points systems
 * @returns {Promise<Array>} - Array of enhanced points systems
 */
async function enhanceWithEligibilityCriteria(filePath, pointsSystems) {
  try {
    const parsedData = await parseMarkdownFile(filePath);
    const enhancedSystems = [];
    
    // Process each country section
    for (const countryName of Object.keys(parsedData.sections)) {
      const countrySection = parsedData.sections[countryName];
      
      // Skip non-country sections
      if (!countrySection.subsections || Object.keys(countrySection.subsections).length === 0) {
        continue;
      }
      
      // Extract country name without section marker
      const country = countryName.replace(/^#+\s+/, '');
      
      // Find matching points systems for this country
      const matchingSystems = pointsSystems.filter(system => 
        system.country.toLowerCase() === country.toLowerCase());
      
      if (matchingSystems.length === 0) continue;
      
      // Process each program subsection
      for (const programName of Object.keys(countrySection.subsections)) {
        const programContent = countrySection.subsections[programName];
        
        // Find matching points system for this program
        const matchingSystem = matchingSystems.find(system => 
          system.programName.toLowerCase().includes(programName.toLowerCase()) ||
          programName.toLowerCase().includes(system.programName.toLowerCase()));
        
        if (!matchingSystem) continue;
        
        // Parse points system details
        const pointsSystemDetails = parsePointsSystem(programContent);
        
        // Enhance the matching system with detailed points breakdown
        if (pointsSystemDetails && pointsSystemDetails.categories) {
          // Update categories with more detailed information
          for (const category of pointsSystemDetails.categories) {
            const existingCategory = matchingSystem.categories.find(c => 
              c.name.toLowerCase() === category.name.toLowerCase());
            
            if (existingCategory) {
              // Update existing category
              existingCategory.maximumPoints = category.maximumPoints || existingCategory.maximumPoints;
              
              // Add factors with points breakdown
              if (category.factors && category.factors.length > 0) {
                existingCategory.factors = category.factors;
              }
            } else {
              // Add new category
              matchingSystem.categories.push(category);
            }
          }
          
          // Update minimum points if available
          if (pointsSystemDetails.minimumPoints) {
            matchingSystem.minimumPoints = pointsSystemDetails.minimumPoints;
          }
          
          // Save the enhanced system
          await matchingSystem.save();
          enhancedSystems.push(matchingSystem);
          console.log(`Enhanced points system with detailed criteria: ${matchingSystem.country} - ${matchingSystem.programName}`);
        }
      }
    }
    
    return enhancedSystems;
  } catch (error) {
    console.error(`Error enhancing points systems with eligibility criteria from ${filePath}:`, error);
    throw error;
  }
}

module.exports = {
  importPointsSystems
};
