/**
 * Utility for importing processing times and success rates from Markdown files
 */
const fs = require('fs').promises;
const path = require('path');
const { parseMarkdownFile, extractTableData } = require('./markdownParser');
const ProcessingData = require('../models/ProcessingData');

/**
 * Import processing times and success rates from the research directory
 * @param {string} researchDir - Path to the research directory
 * @returns {Promise<Array>} - Array of imported processing data
 */
async function importProcessingData(researchDir) {
  try {
    const processingFilePath = path.join(researchDir, 'immigration_processing_times_success_rates.md');
    const visualDataFilePath = path.join(researchDir, 'processing_times_visual_data.md');
    
    // Import basic processing data
    const processingData = await importBasicProcessingData(processingFilePath);
    console.log(`Imported ${processingData.length} processing data records`);
    
    // Enhance with visual data if available
    if (await fileExists(visualDataFilePath)) {
      const enhancedData = await enhanceWithVisualData(visualDataFilePath, processingData);
      console.log(`Enhanced ${enhancedData.length} processing data records with visual data`);
    }
    
    return await ProcessingData.find({});
  } catch (error) {
    console.error('Error importing processing data:', error);
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
 * Import basic processing data
 * @param {string} filePath - Path to the processing times file
 * @returns {Promise<Array>} - Array of imported processing data
 */
async function importBasicProcessingData(filePath) {
  try {
    const parsedData = await parseMarkdownFile(filePath);
    const importedData = [];
    
    // Extract table data from the processing information section
    let processingTableData = null;
    
    for (const sectionName of Object.keys(parsedData.sections)) {
      const section = parsedData.sections[sectionName];
      
      if (sectionName.includes('Processing Information Comparison')) {
        processingTableData = extractTableData(section.content);
        break;
      }
    }
    
    if (!processingTableData || processingTableData.length === 0) {
      console.warn('No processing information comparison table found');
      return [];
    }
    
    // Process each row in the comparison table
    for (const row of processingTableData) {
      const country = row['Country'] ? row['Country'].trim() : null;
      if (!country) continue;
      
      // Create processing data object
      const processingDataObj = {
        country,
        programName: 'Primary Immigration Program', // Default value, would be refined later
        lastUpdated: new Date(),
        dataSource: {
          name: 'Visafy Research Database',
          url: 'internal://visafy/research',
          lastChecked: new Date()
        },
        processingTimes: {
          standard: {}
        },
        successRates: {
          overall: {}
        }
      };
      
      // Extract standard processing time
      if (row['Standard Processing']) {
        const timeRangeMatch = row['Standard Processing'].match(/(\d+)[-–](\d+)\s+(\w+)/);
        if (timeRangeMatch) {
          processingDataObj.processingTimes.standard = {
            minimum: parseInt(timeRangeMatch[1], 10),
            maximum: parseInt(timeRangeMatch[2], 10),
            unit: timeRangeMatch[3].toLowerCase().endsWith('s') 
              ? timeRangeMatch[3].toLowerCase() 
              : `${timeRangeMatch[3].toLowerCase()}s`,
            lastUpdated: new Date()
          };
        } else {
          processingDataObj.processingTimes.standard = {
            description: row['Standard Processing'],
            lastUpdated: new Date()
          };
        }
      }
      
      // Extract expedited option
      if (row['Expedited Option']) {
        processingDataObj.processingTimes.expedited = {
          available: row['Expedited Option'].toLowerCase() !== 'none'
        };
        
        if (processingDataObj.processingTimes.expedited.available) {
          const expeditedMatch = row['Expedited Option'].match(/(\d+)[-–]?(\d+)?\s+(\w+)/);
          if (expeditedMatch) {
            processingDataObj.processingTimes.expedited.minimum = parseInt(expeditedMatch[1], 10);
            if (expeditedMatch[2]) {
              processingDataObj.processingTimes.expedited.maximum = parseInt(expeditedMatch[2], 10);
            } else {
              processingDataObj.processingTimes.expedited.maximum = parseInt(expeditedMatch[1], 10);
            }
            processingDataObj.processingTimes.expedited.unit = expeditedMatch[3].toLowerCase().endsWith('s') 
              ? expeditedMatch[3].toLowerCase() 
              : `${expeditedMatch[3].toLowerCase()}s`;
          }
          
          // Extract fee if available
          const feeMatch = row['Expedited Option'].match(/\$(\d+(?:,\d+)?)/);
          if (feeMatch) {
            processingDataObj.processingTimes.expedited.additionalFee = {
              amount: parseInt(feeMatch[1].replace(',', ''), 10),
              currency: 'USD' // Default, would be refined later
            };
          }
        }
      }
      
      // Extract success rate
      if (row['Success Rate']) {
        const successRateMatch = row['Success Rate'].match(/(\d+)[-–](\d+)%/);
        if (successRateMatch) {
          const minRate = parseInt(successRateMatch[1], 10);
          const maxRate = parseInt(successRateMatch[2], 10);
          processingDataObj.successRates.overall = {
            rate: (minRate + maxRate) / 2, // Use average as the rate
            description: row['Success Rate'],
            year: new Date().getFullYear() - 1 // Assume previous year, would be refined later
          };
        } else {
          const singleRateMatch = row['Success Rate'].match(/(\d+)%/);
          if (singleRateMatch) {
            processingDataObj.successRates.overall = {
              rate: parseInt(singleRateMatch[1], 10),
              description: row['Success Rate'],
              year: new Date().getFullYear() - 1 // Assume previous year, would be refined later
            };
          }
        }
      }
      
      // Extract annual quotas
      if (row['Annual Quotas']) {
        processingDataObj.quotaInformation = {
          hasQuota: row['Annual Quotas'].toLowerCase() !== 'none' && 
                   !row['Annual Quotas'].toLowerCase().includes('no quota')
        };
        
        if (processingDataObj.quotaInformation.hasQuota) {
          const quotaMatch = row['Annual Quotas'].match(/(\d+(?:,\d+)?)/);
          if (quotaMatch) {
            processingDataObj.quotaInformation.annualQuota = parseInt(quotaMatch[1].replace(',', ''), 10);
          }
          processingDataObj.quotaInformation.description = row['Annual Quotas'];
        }
      }
      
      // Extract key success factors
      if (row['Key Success Factors']) {
        const factors = row['Key Success Factors'].split(',').map(factor => factor.trim());
        processingDataObj.commonRejectionReasons = factors.map(factor => ({
          reason: `Insufficient ${factor}`,
          description: `Applicants often fail due to insufficient ${factor.toLowerCase()}`
        }));
      }
      
      // Check if processing data already exists
      const existingData = await ProcessingData.findOne({
        country: processingDataObj.country,
        programName: processingDataObj.programName
      });
      
      if (existingData) {
        // Update existing data
        Object.assign(existingData, processingDataObj);
        await existingData.save();
        importedData.push(existingData);
        console.log(`Updated processing data: ${processingDataObj.country} - ${processingDataObj.programName}`);
      } else {
        // Create new data
        const newData = new ProcessingData(processingDataObj);
        await newData.save();
        importedData.push(newData);
        console.log(`Imported new processing data: ${processingDataObj.country} - ${processingDataObj.programName}`);
      }
    }
    
    return importedData;
  } catch (error) {
    console.error(`Error importing basic processing data from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Enhance processing data with visual data
 * @param {string} filePath - Path to the visual data file
 * @param {Array} processingData - Array of already imported processing data
 * @returns {Promise<Array>} - Array of enhanced processing data
 */
async function enhanceWithVisualData(filePath, processingData) {
  // This would be implemented to add more detailed information from visual data
  // For brevity, we'll leave this as a placeholder
  return [];
}

module.exports = {
  importProcessingData
};
