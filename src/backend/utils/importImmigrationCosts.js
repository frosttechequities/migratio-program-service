/**
 * Utility for importing immigration costs from Markdown files
 */
const fs = require('fs').promises;
const path = require('path');
const { parseMarkdownFile, extractTableData } = require('./markdownParser');
const ImmigrationCost = require('../models/ImmigrationCost');

/**
 * Import immigration costs from the research directory
 * @param {string} researchDir - Path to the research directory
 * @returns {Promise<Array>} - Array of imported immigration costs
 */
async function importImmigrationCosts(researchDir) {
  try {
    const costsFilePath = path.join(researchDir, 'immigration_costs.md');
    const costPatternsFilePath = path.join(researchDir, 'immigration_cost_patterns.md');
    
    // Import basic costs
    const costs = await importBasicCosts(costsFilePath);
    console.log(`Imported ${costs.length} immigration cost records`);
    
    // Enhance with cost patterns if available
    if (await fileExists(costPatternsFilePath)) {
      const enhancedCosts = await enhanceWithCostPatterns(costPatternsFilePath, costs);
      console.log(`Enhanced ${enhancedCosts.length} immigration cost records with cost patterns`);
    }
    
    return await ImmigrationCost.find({});
  } catch (error) {
    console.error('Error importing immigration costs:', error);
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
 * Import basic immigration costs
 * @param {string} filePath - Path to the immigration costs file
 * @returns {Promise<Array>} - Array of imported immigration costs
 */
async function importBasicCosts(filePath) {
  try {
    const parsedData = await parseMarkdownFile(filePath);
    const importedCosts = [];
    
    // Extract table data from the comparison section
    let costsTableData = null;
    
    for (const sectionName of Object.keys(parsedData.sections)) {
      const section = parsedData.sections[sectionName];
      
      if (sectionName.includes('Comparison Table')) {
        costsTableData = extractTableData(section.content);
        break;
      }
    }
    
    if (!costsTableData || costsTableData.length === 0) {
      console.warn('No immigration costs comparison table found');
      return [];
    }
    
    // Process each row in the comparison table
    for (const row of costsTableData) {
      const country = row['Country'] ? row['Country'].trim() : null;
      if (!country) continue;
      
      // Create immigration cost object
      const costData = {
        country,
        programName: row['Program'] || 'Primary Immigration Program', // Default value if not specified
        lastUpdated: new Date(),
        dataSource: {
          name: 'Visafy Research Database',
          url: 'internal://visafy/research',
          lastChecked: new Date()
        },
        applicationFees: {},
        totalEstimatedCost: {}
      };
      
      // Extract application fee
      if (row['Application Fee']) {
        const feeMatch = row['Application Fee'].match(/([A-Z]{1,3})\$\s*(\d+(?:,\d+)?)/);
        if (feeMatch) {
          const currency = feeMatch[1] || 'USD';
          const amount = parseInt(feeMatch[2].replace(',', ''), 10);
          
          costData.applicationFees.primaryApplicant = {
            amount,
            currency,
            description: row['Application Fee']
          };
        } else {
          costData.applicationFees.primaryApplicant = {
            description: row['Application Fee']
          };
        }
      }
      
      // Extract additional fees
      if (row['Additional Fees']) {
        costData.additionalFees = [];
        
        const feeItems = row['Additional Fees'].split(',');
        for (const feeItem of feeItems) {
          const feeMatch = feeItem.match(/([^:]+):\s*([A-Z]{1,3})\$\s*(\d+(?:,\d+)?)/);
          if (feeMatch) {
            const feeName = feeMatch[1].trim();
            const currency = feeMatch[2] || 'USD';
            const amount = parseInt(feeMatch[3].replace(',', ''), 10);
            
            costData.additionalFees.push({
              name: feeName,
              amount,
              currency,
              mandatory: feeName.toLowerCase().includes('required'),
              description: feeItem.trim()
            });
          } else {
            costData.additionalFees.push({
              name: feeItem.trim(),
              description: feeItem.trim()
            });
          }
        }
      }
      
      // Extract settlement funds
      if (row['Settlement Funds']) {
        costData.settlementFunds = {
          required: !row['Settlement Funds'].toLowerCase().includes('not required')
        };
        
        if (costData.settlementFunds.required) {
          const fundsMatch = row['Settlement Funds'].match(/([A-Z]{1,3})\$\s*(\d+(?:,\d+)?)/);
          if (fundsMatch) {
            const currency = fundsMatch[1] || 'USD';
            const amount = parseInt(fundsMatch[2].replace(',', ''), 10);
            
            costData.settlementFunds.singleApplicant = {
              amount,
              currency
            };
            
            // Extract per dependent amount if available
            const dependentMatch = row['Settlement Funds'].match(/\+\s*([A-Z]{1,3})\$\s*(\d+(?:,\d+)?)\s+per\s+dependent/i);
            if (dependentMatch) {
              const depCurrency = dependentMatch[1] || currency;
              const depAmount = parseInt(dependentMatch[2].replace(',', ''), 10);
              
              costData.settlementFunds.additionalPerDependent = {
                amount: depAmount,
                currency: depCurrency
              };
            }
          }
          
          costData.settlementFunds.description = row['Settlement Funds'];
        }
      }
      
      // Extract total cost
      if (row['Total Cost (Approx.)']) {
        const totalCostMatch = row['Total Cost (Approx.)'].match(/([A-Z]{1,3})\$\s*(\d+(?:,\d+)?)\s*-\s*([A-Z]{1,3})\$\s*(\d+(?:,\d+)?)/);
        if (totalCostMatch) {
          const minCurrency = totalCostMatch[1] || 'USD';
          const minAmount = parseInt(totalCostMatch[2].replace(',', ''), 10);
          const maxCurrency = totalCostMatch[3] || minCurrency;
          const maxAmount = parseInt(totalCostMatch[4].replace(',', ''), 10);
          
          costData.totalEstimatedCost.singleApplicant = {
            minimum: minAmount,
            maximum: maxAmount,
            currency: minCurrency === maxCurrency ? minCurrency : 'USD' // Default to USD if currencies differ
          };
          
          // Estimate family cost as 2-3x individual cost
          costData.totalEstimatedCost.familyOfFour = {
            minimum: Math.round(minAmount * 2),
            maximum: Math.round(maxAmount * 3),
            currency: costData.totalEstimatedCost.singleApplicant.currency
          };
        } else {
          const singleMatch = row['Total Cost (Approx.)'].match(/([A-Z]{1,3})\$\s*(\d+(?:,\d+)?)/);
          if (singleMatch) {
            const currency = singleMatch[1] || 'USD';
            const amount = parseInt(singleMatch[2].replace(',', ''), 10);
            
            costData.totalEstimatedCost.singleApplicant = {
              minimum: Math.round(amount * 0.8), // Estimate minimum as 80% of stated amount
              maximum: Math.round(amount * 1.2), // Estimate maximum as 120% of stated amount
              currency
            };
            
            // Estimate family cost as 2-3x individual cost
            costData.totalEstimatedCost.familyOfFour = {
              minimum: Math.round(amount * 1.8),
              maximum: Math.round(amount * 3),
              currency
            };
          }
        }
        
        costData.totalEstimatedCost.description = row['Total Cost (Approx.)'];
      }
      
      // Extract payment methods
      if (row['Payment Methods']) {
        costData.paymentMethods = row['Payment Methods'].split(',').map(method => ({
          method: method.trim()
        }));
      }
      
      // Check if immigration cost already exists
      const existingCost = await ImmigrationCost.findOne({
        country: costData.country,
        programName: costData.programName
      });
      
      if (existingCost) {
        // Update existing cost
        Object.assign(existingCost, costData);
        await existingCost.save();
        importedCosts.push(existingCost);
        console.log(`Updated immigration cost: ${costData.country} - ${costData.programName}`);
      } else {
        // Create new cost
        const newCost = new ImmigrationCost(costData);
        await newCost.save();
        importedCosts.push(newCost);
        console.log(`Imported new immigration cost: ${costData.country} - ${costData.programName}`);
      }
    }
    
    return importedCosts;
  } catch (error) {
    console.error(`Error importing basic costs from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Enhance immigration costs with cost patterns
 * @param {string} filePath - Path to the cost patterns file
 * @param {Array} costs - Array of already imported costs
 * @returns {Promise<Array>} - Array of enhanced costs
 */
async function enhanceWithCostPatterns(filePath, costs) {
  // This would be implemented to add more detailed information from cost patterns
  // For brevity, we'll leave this as a placeholder
  return [];
}

module.exports = {
  importImmigrationCosts
};
