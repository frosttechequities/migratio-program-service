/**
 * Utility for parsing Markdown files into structured data
 */
const fs = require('fs').promises;
const path = require('path');

/**
 * Parse a Markdown file into sections and content
 * @param {string} filePath - Path to the Markdown file
 * @returns {Object} - Parsed content with sections as keys
 */
async function parseMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return parseMarkdownContent(content);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Parse Markdown content into sections and content
 * @param {string} content - Markdown content
 * @returns {Object} - Parsed content with sections as keys
 */
function parseMarkdownContent(content) {
  const lines = content.split('\n');
  const result = {
    title: '',
    sections: {}
  };
  
  let currentSection = null;
  let currentSubsection = null;
  let currentContent = [];
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for headers
    if (line.startsWith('# ')) {
      // Main title
      result.title = line.substring(2).trim();
    } else if (line.startsWith('## ')) {
      // Save previous section if exists
      if (currentSection) {
        if (currentSubsection) {
          if (!result.sections[currentSection].subsections) {
            result.sections[currentSection].subsections = {};
          }
          result.sections[currentSection].subsections[currentSubsection] = currentContent.join('\n');
          currentSubsection = null;
        } else {
          result.sections[currentSection].content = currentContent.join('\n');
        }
        currentContent = [];
      }
      
      // Start new section
      currentSection = line.substring(3).trim();
      result.sections[currentSection] = { content: '', subsections: {} };
    } else if (line.startsWith('### ') && currentSection) {
      // Save previous subsection if exists
      if (currentSubsection) {
        if (!result.sections[currentSection].subsections) {
          result.sections[currentSection].subsections = {};
        }
        result.sections[currentSection].subsections[currentSubsection] = currentContent.join('\n');
        currentContent = [];
      } else if (currentContent.length > 0) {
        result.sections[currentSection].content = currentContent.join('\n');
        currentContent = [];
      }
      
      // Start new subsection
      currentSubsection = line.substring(4).trim();
    } else if (line.startsWith('#### ') && currentSection && currentSubsection) {
      // Add subheading to current content
      currentContent.push(`**${line.substring(5).trim()}**`);
    } else {
      // Add line to current content
      currentContent.push(line);
    }
  }
  
  // Save the last section/subsection
  if (currentSection) {
    if (currentSubsection) {
      if (!result.sections[currentSection].subsections) {
        result.sections[currentSection].subsections = {};
      }
      result.sections[currentSection].subsections[currentSubsection] = currentContent.join('\n');
    } else {
      result.sections[currentSection].content = currentContent.join('\n');
    }
  }
  
  return result;
}

/**
 * Extract list items from Markdown content
 * @param {string} content - Markdown content with list items
 * @returns {Array} - Array of list items
 */
function extractListItems(content) {
  const lines = content.split('\n');
  const listItems = [];
  
  for (const line of lines) {
    // Match list items (both - and * formats)
    if (line.trim().match(/^[-*]\s+(.+)$/)) {
      const item = line.trim().replace(/^[-*]\s+/, '');
      listItems.push(item);
    }
  }
  
  return listItems;
}

/**
 * Extract key-value pairs from Markdown content
 * @param {string} content - Markdown content with key-value pairs
 * @returns {Object} - Object with extracted key-value pairs
 */
function extractKeyValuePairs(content) {
  const lines = content.split('\n');
  const result = {};
  
  for (const line of lines) {
    // Match key-value pairs in format "- **Key**: Value"
    const match = line.trim().match(/^[-*]\s+\*\*([^:]+):\*\*\s*(.+)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Extract table data from Markdown content
 * @param {string} content - Markdown content with table
 * @returns {Array} - Array of objects representing table rows
 */
function extractTableData(content) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  // Need at least header, separator, and one data row
  if (lines.length < 3) {
    return [];
  }
  
  // Extract headers
  const headerLine = lines[0];
  const headers = headerLine
    .split('|')
    .map(header => header.trim())
    .filter(header => header !== '');
  
  // Skip separator line
  const dataLines = lines.slice(2);
  
  // Parse data rows
  const data = dataLines.map(line => {
    const values = line
      .split('|')
      .map(cell => cell.trim())
      .filter((cell, index) => index > 0 && index <= headers.length);
    
    // Create object with headers as keys
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = values[index] || '';
    });
    
    return rowData;
  });
  
  return data;
}

/**
 * Parse a points-based system from Markdown content
 * @param {string} content - Markdown content with points system
 * @returns {Object} - Structured points system data
 */
function parsePointsSystem(content) {
  const sections = parseMarkdownContent(content);
  const pointsSystem = {
    categories: []
  };
  
  // Extract information from each section
  Object.keys(sections.sections).forEach(sectionName => {
    const section = sections.sections[sectionName];
    
    if (sectionName.includes('Points')) {
      // This is likely a points category
      const category = {
        name: sectionName,
        description: '',
        factors: []
      };
      
      // Extract maximum points if mentioned
      const maxPointsMatch = section.content.match(/maximum\s+(\d+)\s+points/i);
      if (maxPointsMatch) {
        category.maximumPoints = parseInt(maxPointsMatch[1], 10);
      }
      
      // Process subsections as factors
      if (section.subsections) {
        Object.keys(section.subsections).forEach(subsectionName => {
          const subsectionContent = section.subsections[subsectionName];
          
          // Extract points breakdown from lists
          const pointsBreakdown = [];
          const lines = subsectionContent.split('\n');
          
          for (const line of lines) {
            // Match patterns like "- 30-35 years: 8 points"
            const match = line.trim().match(/^[-*]\s+(.+?):\s*(\d+)\s+points?(.*)$/i);
            if (match) {
              pointsBreakdown.push({
                criteria: match[1].trim(),
                points: parseInt(match[2], 10),
                description: match[3] ? match[3].trim() : ''
              });
            }
          }
          
          if (pointsBreakdown.length > 0) {
            category.factors.push({
              name: subsectionName,
              pointsBreakdown
            });
          }
        });
      }
      
      pointsSystem.categories.push(category);
    } else if (sectionName.toLowerCase().includes('minimum') || 
               sectionName.toLowerCase().includes('eligibility')) {
      // Extract minimum points requirement
      const minPointsMatch = section.content.match(/(\d+)\s+points/i);
      if (minPointsMatch) {
        pointsSystem.minimumPoints = parseInt(minPointsMatch[1], 10);
      }
    }
  });
  
  return pointsSystem;
}

module.exports = {
  parseMarkdownFile,
  parseMarkdownContent,
  extractListItems,
  extractKeyValuePairs,
  extractTableData,
  parsePointsSystem
};
