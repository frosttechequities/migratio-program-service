/**
 * Utility for importing immigration programs from Markdown files
 */
const fs = require('fs').promises;
const path = require('path');
const { parseMarkdownFile, extractListItems } = require('./markdownParser');
const ImmigrationProgram = require('../models/ImmigrationProgram');

/**
 * Import immigration programs from the research directory
 * @param {string} researchDir - Path to the research directory
 * @returns {Promise<Array>} - Array of imported immigration programs
 */
async function importImmigrationPrograms(researchDir) {
  try {
    const programsFilePath = path.join(researchDir, 'immigration_programs_database.md');
    const expandedProgramsFilePath = path.join(researchDir, 'expanded_immigration_programs.md');
    
    // Import basic programs first
    const basicPrograms = await importBasicPrograms(programsFilePath);
    console.log(`Imported ${basicPrograms.length} basic immigration programs`);
    
    // Import expanded program details if available
    if (await fileExists(expandedProgramsFilePath)) {
      const expandedPrograms = await importExpandedPrograms(expandedProgramsFilePath, basicPrograms);
      console.log(`Updated ${expandedPrograms.length} programs with expanded details`);
    }
    
    return await ImmigrationProgram.find({});
  } catch (error) {
    console.error('Error importing immigration programs:', error);
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
 * Import basic immigration programs
 * @param {string} filePath - Path to the immigration programs database file
 * @returns {Promise<Array>} - Array of imported immigration programs
 */
async function importBasicPrograms(filePath) {
  try {
    const parsedData = await parseMarkdownFile(filePath);
    const importedPrograms = [];
    
    // Process each country section
    for (const countryName of Object.keys(parsedData.sections)) {
      const countrySection = parsedData.sections[countryName];
      
      // Skip non-country sections
      if (!countrySection.subsections || Object.keys(countrySection.subsections).length === 0) {
        continue;
      }
      
      // Process each program subsection
      for (const programName of Object.keys(countrySection.subsections)) {
        const programContent = countrySection.subsections[programName];
        const programData = await processProgramContent(programContent, programName, countryName);
        
        if (programData) {
          // Check if program already exists
          const existingProgram = await ImmigrationProgram.findOne({
            country: programData.country,
            name: programData.name
          });
          
          if (existingProgram) {
            // Update existing program
            Object.assign(existingProgram, programData);
            await existingProgram.save();
            importedPrograms.push(existingProgram);
            console.log(`Updated immigration program: ${programData.country} - ${programData.name}`);
          } else {
            // Create new program
            const newProgram = new ImmigrationProgram(programData);
            await newProgram.save();
            importedPrograms.push(newProgram);
            console.log(`Imported new immigration program: ${programData.country} - ${programData.name}`);
          }
        }
      }
    }
    
    return importedPrograms;
  } catch (error) {
    console.error(`Error importing basic programs from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Process program content to extract structured data
 * @param {string} content - Program content from Markdown
 * @param {string} programName - Name of the program
 * @param {string} countryName - Name of the country
 * @returns {Object} - Structured program data
 */
async function processProgramContent(content, programName, countryName) {
  try {
    // Initialize program data
    const programData = {
      name: programName,
      country: countryName.replace(/^## /, ''),
      lastUpdated: new Date(),
      dataSource: {
        name: 'Visafy Research Database',
        url: 'internal://visafy/research',
        lastChecked: new Date()
      }
    };
    
    // Extract program type
    if (programName.includes('Express Entry') || programName.includes('Skilled Worker')) {
      programData.type = 'Skilled Worker';
    } else if (programName.includes('Business') || programName.includes('Investor') || programName.includes('Start-up')) {
      programData.type = 'Business/Investor';
    } else if (programName.includes('Family')) {
      programData.type = 'Family Sponsorship';
    } else if (programName.includes('Provincial') || programName.includes('Regional')) {
      programData.type = 'Provincial/Regional';
    } else if (programName.includes('Student')) {
      programData.type = 'Student';
    } else if (programName.includes('Temporary')) {
      programData.type = 'Temporary Worker';
    } else if (programName.includes('Humanitarian') || programName.includes('Refugee')) {
      programData.type = 'Humanitarian';
    } else {
      programData.type = 'Other';
    }
    
    // Extract permanent residency status
    programData.permanentResidency = !programName.includes('Temporary') && 
                                    !programName.includes('Visitor') && 
                                    !programName.includes('Student');
    
    // Parse content line by line
    const lines = content.split('\n');
    let currentField = null;
    let fieldContent = [];
    
    for (const line of lines) {
      // Check for field markers
      if (line.startsWith('- **Type**:')) {
        programData.subtype = line.replace('- **Type**:', '').trim();
      } else if (line.startsWith('- **Purpose**:')) {
        programData.purpose = line.replace('- **Purpose**:', '').trim();
      } else if (line.startsWith('- **Overview**:')) {
        currentField = 'overview';
        fieldContent = [line.replace('- **Overview**:', '').trim()];
      } else if (line.startsWith('- **Requirements**:')) {
        currentField = 'requirements';
        fieldContent = [line.replace('- **Requirements**:', '').trim()];
      } else if (line.startsWith('- **Processing Time**:')) {
        if (!programData.processingInfo) {
          programData.processingInfo = {};
        }
        
        const processingTime = line.replace('- **Processing Time**:', '').trim();
        const timeRangeMatch = processingTime.match(/(\d+)[-–](\d+)\s+(\w+)/);
        
        if (timeRangeMatch) {
          programData.processingInfo.standardProcessing = {
            duration: {
              min: parseInt(timeRangeMatch[1], 10),
              max: parseInt(timeRangeMatch[2], 10),
              unit: timeRangeMatch[3].toLowerCase().endsWith('s') 
                ? timeRangeMatch[3].toLowerCase() 
                : `${timeRangeMatch[3].toLowerCase()}s`
            },
            description: processingTime
          };
        } else {
          programData.processingInfo = {
            standardProcessing: {
              description: processingTime
            }
          };
        }
      } else if (line.startsWith('- **Path to PR/Citizenship**:')) {
        const pathInfo = line.replace('- **Path to PR/Citizenship**:', '').trim();
        
        if (pathInfo.includes('Direct') && pathInfo.includes('permanent residency')) {
          programData.pathToPR = {
            available: true,
            description: pathInfo
          };
        }
        
        if (pathInfo.includes('citizenship')) {
          const citizenshipMatch = pathInfo.match(/citizenship\s+(?:available\s+)?after\s+(\d+)\s+years/i);
          if (citizenshipMatch) {
            programData.pathToCitizenship = {
              timeline: `${citizenshipMatch[1]} years`,
              description: pathInfo
            };
          } else {
            programData.pathToCitizenship = {
              description: pathInfo
            };
          }
        }
      } else if (currentField) {
        // Continue adding content to the current field
        fieldContent.push(line);
      }
    }
    
    // Save collected field content
    if (currentField === 'overview' && fieldContent.length > 0) {
      programData.overview = fieldContent.join('\n');
    } else if (currentField === 'requirements' && fieldContent.length > 0) {
      // Extract eligibility criteria from requirements
      const requirementsText = fieldContent.join('\n');
      
      if (!programData.eligibilityCriteria) {
        programData.eligibilityCriteria = {};
      }
      
      // Look for age requirements
      const ageMatch = requirementsText.match(/age[^,\.]*?(\d+)[-–](\d+)/i);
      if (ageMatch) {
        programData.eligibilityCriteria.ageRequirements = {
          minAge: parseInt(ageMatch[1], 10),
          maxAge: parseInt(ageMatch[2], 10),
          description: ageMatch[0]
        };
      }
      
      // Look for education requirements
      if (requirementsText.toLowerCase().includes('education')) {
        programData.eligibilityCriteria.educationRequirements = {
          description: extractRequirement(requirementsText, 'education')
        };
      }
      
      // Look for language requirements
      if (requirementsText.toLowerCase().includes('language')) {
        programData.eligibilityCriteria.languageRequirements = {
          description: extractRequirement(requirementsText, 'language')
        };
      }
      
      // Look for work experience requirements
      if (requirementsText.toLowerCase().includes('experience') || 
          requirementsText.toLowerCase().includes('work')) {
        programData.eligibilityCriteria.workExperienceRequirements = {
          description: extractRequirement(requirementsText, 'experience', 'work')
        };
      }
    }
    
    return programData;
  } catch (error) {
    console.error(`Error processing program content for ${countryName} - ${programName}:`, error);
    return null;
  }
}

/**
 * Extract a specific requirement from text
 * @param {string} text - Full requirements text
 * @param {string} keyword - Primary keyword to look for
 * @param {string} altKeyword - Alternative keyword to look for
 * @returns {string} - Extracted requirement text
 */
function extractRequirement(text, keyword, altKeyword = null) {
  const lines = text.split('\n');
  const relevantLines = [];
  
  let foundKeyword = false;
  for (const line of lines) {
    if (line.toLowerCase().includes(keyword) || 
        (altKeyword && line.toLowerCase().includes(altKeyword))) {
      foundKeyword = true;
      relevantLines.push(line);
    } else if (foundKeyword && line.trim() !== '' && !line.match(/^[-*]\s+\*\*/)) {
      // Continue including lines until we hit another requirement marker
      relevantLines.push(line);
    } else if (foundKeyword && line.match(/^[-*]\s+\*\*/)) {
      // Stop when we hit another requirement marker
      break;
    }
  }
  
  return relevantLines.join('\n');
}

/**
 * Import expanded program details
 * @param {string} filePath - Path to the expanded programs file
 * @param {Array} basicPrograms - Array of already imported basic programs
 * @returns {Promise<Array>} - Array of updated programs
 */
async function importExpandedPrograms(filePath, basicPrograms) {
  // This would be implemented to add more detailed information to the basic programs
  // For brevity, we'll leave this as a placeholder
  return [];
}

module.exports = {
  importImmigrationPrograms
};
