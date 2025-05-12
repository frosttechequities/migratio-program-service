/**
 * Utility for importing data sources from Markdown files
 */
const fs = require('fs').promises;
const path = require('path');
const { parseMarkdownFile, extractTableData } = require('./markdownParser');
const DataSource = require('../models/DataSource');

/**
 * Import data sources from the research directory
 * @param {string} researchDir - Path to the research directory
 * @returns {Promise<Array>} - Array of imported data sources
 */
async function importDataSources(researchDir) {
  try {
    const dataSourcesFilePath = path.join(researchDir, 'visafy_structured_data', 'real_time_data_sources.md');
    
    if (!await fileExists(dataSourcesFilePath)) {
      console.warn('Data sources file not found');
      return [];
    }
    
    const dataSources = await importRealTimeDataSources(dataSourcesFilePath);
    console.log(`Imported ${dataSources.length} data sources`);
    
    return await DataSource.find({});
  } catch (error) {
    console.error('Error importing data sources:', error);
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
 * Import real-time data sources
 * @param {string} filePath - Path to the real-time data sources file
 * @returns {Promise<Array>} - Array of imported data sources
 */
async function importRealTimeDataSources(filePath) {
  try {
    const parsedData = await parseMarkdownFile(filePath);
    const importedSources = [];
    
    // Extract table data from the data sources section
    let sourcesTableData = null;
    
    for (const sectionName of Object.keys(parsedData.sections)) {
      const section = parsedData.sections[sectionName];
      
      if (sectionName.includes('Data Sources')) {
        sourcesTableData = extractTableData(section.content);
        break;
      }
    }
    
    if (!sourcesTableData || sourcesTableData.length === 0) {
      console.warn('No data sources table found');
      return [];
    }
    
    // Process each row in the data sources table
    for (const row of sourcesTableData) {
      const sourceName = row['Source Name'] ? row['Source Name'].trim() : null;
      if (!sourceName) continue;
      
      // Extract organization name
      let organization = row['Organization'] || 'Unknown';
      
      // Extract URL
      let url = '';
      if (row['URL']) {
        const urlMatch = row['URL'].match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (urlMatch) {
          url = urlMatch[2];
        } else {
          url = row['URL'];
        }
      }
      
      // Create data source object
      const dataSourceObj = {
        name: sourceName,
        organization,
        url,
        type: determineSourceType(organization, row['Type'] || ''),
        description: row['Description'] || `Data source for immigration information from ${organization}`,
        lastChecked: new Date(),
        active: true
      };
      
      // Extract data categories
      if (row['Data Categories']) {
        dataSourceObj.dataCategories = [];
        
        const categories = row['Data Categories'].split(',');
        for (const category of categories) {
          const categoryName = mapCategoryName(category.trim());
          
          dataSourceObj.dataCategories.push({
            category: categoryName,
            description: `${categoryName} information from ${organization}`,
            reliability: 8 // Default reliability score, would be refined later
          });
        }
      }
      
      // Extract update frequency
      if (row['Update Frequency']) {
        dataSourceObj.updateFrequency = mapUpdateFrequency(row['Update Frequency']);
      }
      
      // Extract access method
      if (row['Access Method']) {
        dataSourceObj.accessMethod = mapAccessMethod(row['Access Method']);
        
        // Extract API information if available
        if (dataSourceObj.accessMethod === 'Public API' && row['API Details']) {
          dataSourceObj.apiEndpoint = row['API Details'];
          dataSourceObj.apiAuthRequired = row['API Details'].toLowerCase().includes('auth');
        }
      }
      
      // Extract data format
      if (row['Data Format']) {
        dataSourceObj.dataFormat = mapDataFormat(row['Data Format']);
      }
      
      // Check if data source already exists
      const existingSource = await DataSource.findOne({
        name: dataSourceObj.name,
        organization: dataSourceObj.organization
      });
      
      if (existingSource) {
        // Update existing source
        Object.assign(existingSource, dataSourceObj);
        await existingSource.save();
        importedSources.push(existingSource);
        console.log(`Updated data source: ${dataSourceObj.name} - ${dataSourceObj.organization}`);
      } else {
        // Create new source
        const newSource = new DataSource(dataSourceObj);
        await newSource.save();
        importedSources.push(newSource);
        console.log(`Imported new data source: ${dataSourceObj.name} - ${dataSourceObj.organization}`);
      }
    }
    
    return importedSources;
  } catch (error) {
    console.error(`Error importing real-time data sources from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Determine the type of data source
 * @param {string} organization - Organization name
 * @param {string} typeHint - Type hint from the data
 * @returns {string} - Source type
 */
function determineSourceType(organization, typeHint) {
  const orgLower = organization.toLowerCase();
  const typeHintLower = typeHint.toLowerCase();
  
  if (orgLower.includes('government') || 
      orgLower.includes('ministry') || 
      orgLower.includes('department') ||
      typeHintLower.includes('government')) {
    return 'Government Official';
  } else if (orgLower.includes('un') || 
             orgLower.includes('united nations') || 
             orgLower.includes('international') ||
             typeHintLower.includes('international')) {
    return 'International Organization';
  } else if (orgLower.includes('university') || 
             orgLower.includes('institute') || 
             orgLower.includes('research') ||
             typeHintLower.includes('academic')) {
    return 'Academic Research';
  } else if (orgLower.includes('news') || 
             orgLower.includes('media') ||
             typeHintLower.includes('news')) {
    return 'News Media';
  } else if (orgLower.includes('law') || 
             orgLower.includes('legal') ||
             typeHintLower.includes('legal')) {
    return 'Legal Resource';
  } else if (orgLower.includes('statistics') || 
             orgLower.includes('census') ||
             typeHintLower.includes('statistics')) {
    return 'Statistical Agency';
  } else if (orgLower.includes('immigration') && 
             (orgLower.includes('consultant') || orgLower.includes('service'))) {
    return 'Immigration Consultant';
  } else if (typeHintLower.includes('industry')) {
    return 'Industry Report';
  } else {
    return 'Other';
  }
}

/**
 * Map category name to standard format
 * @param {string} category - Category name from the data
 * @returns {string} - Standardized category name
 */
function mapCategoryName(category) {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('program')) {
    return 'Immigration Programs';
  } else if (categoryLower.includes('eligibility')) {
    return 'Eligibility Criteria';
  } else if (categoryLower.includes('processing')) {
    return 'Processing Times';
  } else if (categoryLower.includes('success')) {
    return 'Success Rates';
  } else if (categoryLower.includes('cost') || categoryLower.includes('fee')) {
    return 'Application Costs';
  } else if (categoryLower.includes('document')) {
    return 'Document Requirements';
  } else if (categoryLower.includes('point')) {
    return 'Point Systems';
  } else if (categoryLower.includes('country')) {
    return 'Country Profiles';
  } else if (categoryLower.includes('settlement')) {
    return 'Settlement Information';
  } else if (categoryLower.includes('legal')) {
    return 'Legal Updates';
  } else if (categoryLower.includes('statistics') || categoryLower.includes('data')) {
    return 'Statistical Data';
  } else {
    return 'Other';
  }
}

/**
 * Map update frequency to standard format
 * @param {string} frequency - Update frequency from the data
 * @returns {string} - Standardized update frequency
 */
function mapUpdateFrequency(frequency) {
  const frequencyLower = frequency.toLowerCase();
  
  if (frequencyLower.includes('real') || frequencyLower.includes('live')) {
    return 'Real-time';
  } else if (frequencyLower.includes('daily')) {
    return 'Daily';
  } else if (frequencyLower.includes('weekly')) {
    return 'Weekly';
  } else if (frequencyLower.includes('bi-weekly')) {
    return 'Bi-weekly';
  } else if (frequencyLower.includes('month')) {
    return 'Monthly';
  } else if (frequencyLower.includes('quarter')) {
    return 'Quarterly';
  } else if (frequencyLower.includes('bi-annual') || frequencyLower.includes('semi-annual')) {
    return 'Bi-annually';
  } else if (frequencyLower.includes('annual') || frequencyLower.includes('yearly')) {
    return 'Annually';
  } else if (frequencyLower.includes('irregular')) {
    return 'Irregular';
  } else {
    return 'Unknown';
  }
}

/**
 * Map access method to standard format
 * @param {string} method - Access method from the data
 * @returns {string} - Standardized access method
 */
function mapAccessMethod(method) {
  const methodLower = method.toLowerCase();
  
  if (methodLower.includes('api')) {
    return 'Public API';
  } else if (methodLower.includes('scrap')) {
    return 'Web Scraping';
  } else if (methodLower.includes('manual')) {
    return 'Manual Collection';
  } else if (methodLower.includes('download')) {
    return 'Data Download';
  } else if (methodLower.includes('subscription')) {
    return 'Subscription Service';
  } else if (methodLower.includes('partner')) {
    return 'Partnership';
  } else {
    return 'Other';
  }
}

/**
 * Map data format to standard format
 * @param {string} format - Data format from the data
 * @returns {string} - Standardized data format
 */
function mapDataFormat(format) {
  const formatLower = format.toLowerCase();
  
  if (formatLower.includes('json')) {
    return 'JSON';
  } else if (formatLower.includes('xml')) {
    return 'XML';
  } else if (formatLower.includes('csv')) {
    return 'CSV';
  } else if (formatLower.includes('html')) {
    return 'HTML';
  } else if (formatLower.includes('pdf')) {
    return 'PDF';
  } else if (formatLower.includes('excel') || formatLower.includes('xls')) {
    return 'Excel';
  } else if (formatLower.includes('text') || formatLower.includes('txt')) {
    return 'Text';
  } else {
    return 'Other';
  }
}

module.exports = {
  importDataSources
};
