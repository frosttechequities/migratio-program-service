/**
 * Analysis Service
 * Analyzes document quality and completeness
 */
const logger = require('../utils/logger');

/**
 * Analysis Service class
 */
class AnalysisService {
  /**
   * Analyze document quality and completeness
   * @param {Object} document - Document object
   * @param {Object} extractedData - Extracted data from document
   * @param {Object} programRequirements - Program requirements (optional)
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeDocument(document, extractedData, programRequirements = null) {
    try {
      logger.info(`[ANALYSIS_SVC] Analyzing document: ${document.id}`);
      
      // Analyze document quality
      const qualityAnalysis = await this.analyzeQuality(document, extractedData);
      
      // Analyze document completeness
      const completenessAnalysis = await this.analyzeCompleteness(document, extractedData, programRequirements);
      
      // Generate optimization suggestions
      const optimizationSuggestions = await this.generateOptimizationSuggestions(
        document, 
        extractedData, 
        qualityAnalysis, 
        completenessAnalysis
      );
      
      return {
        qualityAnalysis,
        completenessAnalysis,
        optimizationSuggestions,
        overallScore: this.calculateOverallScore(qualityAnalysis, completenessAnalysis)
      };
    } catch (error) {
      logger.error(`[ANALYSIS_SVC] Error analyzing document: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze document quality
   * @param {Object} document - Document object
   * @param {Object} extractedData - Extracted data from document
   * @returns {Promise<Object>} - Quality analysis results
   */
  async analyzeQuality(document, extractedData) {
    try {
      logger.info(`[ANALYSIS_SVC] Analyzing quality for document: ${document.id}`);
      
      // Initialize quality metrics
      const metrics = {
        imageQuality: 0,
        textClarity: 0,
        extractionConfidence: 0,
        formatConsistency: 0
      };
      
      // Assess image quality based on file type and size
      metrics.imageQuality = this.assessImageQuality(document);
      
      // Assess text clarity based on OCR confidence
      metrics.textClarity = this.assessTextClarity(document);
      
      // Assess extraction confidence
      metrics.extractionConfidence = extractedData && extractedData.confidence 
        ? extractedData.confidence 
        : 0;
      
      // Assess format consistency
      metrics.formatConsistency = this.assessFormatConsistency(document, extractedData);
      
      // Calculate overall quality score
      const overallScore = this.calculateQualityScore(metrics);
      
      // Determine quality level
      const qualityLevel = this.determineQualityLevel(overallScore);
      
      // Generate quality issues
      const issues = this.identifyQualityIssues(metrics, qualityLevel);
      
      return {
        metrics,
        overallScore,
        qualityLevel,
        issues
      };
    } catch (error) {
      logger.error(`[ANALYSIS_SVC] Error analyzing quality: ${error.message}`);
      return {
        metrics: {
          imageQuality: 0,
          textClarity: 0,
          extractionConfidence: 0,
          formatConsistency: 0
        },
        overallScore: 0,
        qualityLevel: 'poor',
        issues: [{
          type: 'error',
          message: 'Failed to analyze document quality',
          severity: 'high'
        }]
      };
    }
  }

  /**
   * Assess image quality based on file type and size
   * @param {Object} document - Document object
   * @returns {number} - Image quality score (0-1)
   */
  assessImageQuality(document) {
    try {
      // Check file type
      const fileType = document.file_type || '';
      const isHighQualityFormat = ['application/pdf', 'image/png', 'image/tiff'].includes(fileType);
      const isMediumQualityFormat = ['image/jpeg', 'image/bmp'].includes(fileType);
      
      // Base score on file type
      let score = isHighQualityFormat ? 0.8 : (isMediumQualityFormat ? 0.6 : 0.4);
      
      // Adjust based on file size (if available)
      if (document.file_size) {
        const fileSizeInMB = document.file_size / (1024 * 1024);
        
        // Very small files are likely low quality
        if (fileSizeInMB < 0.1) {
          score -= 0.3;
        } 
        // Larger files are likely higher quality (up to a point)
        else if (fileSizeInMB > 1) {
          score += 0.1;
        }
      }
      
      // Ensure score is between 0 and 1
      return Math.max(0, Math.min(1, score));
    } catch (error) {
      logger.error(`[ANALYSIS_SVC] Error assessing image quality: ${error.message}`);
      return 0.5; // Default to medium quality on error
    }
  }

  /**
   * Assess text clarity based on OCR confidence
   * @param {Object} document - Document object
   * @returns {number} - Text clarity score (0-1)
   */
  assessTextClarity(document) {
    try {
      // If OCR confidence is available, use it
      if (document.ocr_confidence) {
        return document.ocr_confidence;
      }
      
      // If OCR text is available, estimate quality based on text length and content
      if (document.ocr_text) {
        const text = document.ocr_text;
        
        // Check for common OCR errors
        const errorPatterns = [
          /[il1|]{3,}/g, // Repeated i, l, 1, |
          /[0O]{3,}/g,   // Repeated 0, O
          /[^a-zA-Z0-9\s.,;:'"!?()-]{3,}/g // Repeated special characters
        ];
        
        let errorCount = 0;
        errorPatterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            errorCount += matches.length;
          }
        });
        
        // Calculate error rate
        const textLength = text.length;
        const errorRate = textLength > 0 ? errorCount / textLength : 0;
        
        // Convert to clarity score (inverse of error rate)
        return Math.max(0, Math.min(1, 1 - (errorRate * 10)));
      }
      
      // Default if no OCR data available
      return 0.5;
    } catch (error) {
      logger.error(`[ANALYSIS_SVC] Error assessing text clarity: ${error.message}`);
      return 0.5; // Default to medium clarity on error
    }
  }

  /**
   * Assess format consistency
   * @param {Object} document - Document object
   * @param {Object} extractedData - Extracted data from document
   * @returns {number} - Format consistency score (0-1)
   */
  assessFormatConsistency(document, extractedData) {
    try {
      // Default score
      let score = 0.5;
      
      // If no extracted data, return default score
      if (!extractedData) {
        return score;
      }
      
      // Check if document type matches expected format
      const documentType = document.document_type || '';
      
      // Adjust score based on document type and extracted data
      switch (documentType.toLowerCase()) {
        case 'passport':
          // Check if passport data was successfully extracted
          if (extractedData.passportNumber && extractedData.name && extractedData.dateOfBirth) {
            score = 0.9;
          } else if (extractedData.passportNumber || extractedData.name) {
            score = 0.7;
          } else {
            score = 0.3;
          }
          break;
          
        case 'language_test':
          // Check if language test data was successfully extracted
          if (extractedData.testType !== 'Unknown' && extractedData.scores && 
              Object.values(extractedData.scores).some(s => s !== null)) {
            score = 0.9;
          } else if (extractedData.testType !== 'Unknown') {
            score = 0.6;
          } else {
            score = 0.3;
          }
          break;
          
        case 'education_credential':
          // Check if education credential data was successfully extracted
          if (extractedData.institution && extractedData.degree) {
            score = 0.9;
          } else if (extractedData.institution || extractedData.degree) {
            score = 0.6;
          } else {
            score = 0.3;
          }
          break;
          
        default:
          // For generic documents, check if any data was extracted
          if (extractedData.dates && extractedData.dates.length > 0) {
            score = 0.7;
          }
          break;
      }
      
      return score;
    } catch (error) {
      logger.error(`[ANALYSIS_SVC] Error assessing format consistency: ${error.message}`);
      return 0.5; // Default to medium consistency on error
    }
  }

  /**
   * Calculate overall quality score
   * @param {Object} metrics - Quality metrics
   * @returns {number} - Overall quality score (0-100)
   */
  calculateQualityScore(metrics) {
    try {
      // Weights for each metric
      const weights = {
        imageQuality: 0.3,
        textClarity: 0.3,
        extractionConfidence: 0.25,
        formatConsistency: 0.15
      };
      
      // Calculate weighted sum
      let weightedSum = 0;
      let totalWeight = 0;
      
      for (const [metric, weight] of Object.entries(weights)) {
        if (metrics[metric] !== undefined) {
          weightedSum += metrics[metric] * weight;
          totalWeight += weight;
        }
      }
      
      // Normalize to 0-100 scale
      const normalizedScore = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
      
      // Round to nearest integer
      return Math.round(normalizedScore);
    } catch (error) {
      logger.error(`[ANALYSIS_SVC] Error calculating quality score: ${error.message}`);
      return 50; // Default to medium score on error
    }
  }

  /**
   * Determine quality level based on score
   * @param {number} score - Quality score
   * @returns {string} - Quality level (excellent, good, fair, poor)
   */
  determineQualityLevel(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }

  /**
   * Identify quality issues based on metrics
   * @param {Object} metrics - Quality metrics
   * @param {string} qualityLevel - Overall quality level
   * @returns {Array} - List of quality issues
   */
  identifyQualityIssues(metrics, qualityLevel) {
    const issues = [];
    
    // Only add issues if quality is not excellent
    if (qualityLevel !== 'excellent') {
      // Check image quality
      if (metrics.imageQuality < 0.6) {
        issues.push({
          type: 'image_quality',
          message: metrics.imageQuality < 0.3 
            ? 'Document image quality is very poor' 
            : 'Document image quality could be improved',
          severity: metrics.imageQuality < 0.3 ? 'high' : 'medium'
        });
      }
      
      // Check text clarity
      if (metrics.textClarity < 0.6) {
        issues.push({
          type: 'text_clarity',
          message: metrics.textClarity < 0.3 
            ? 'Text in the document is difficult to read' 
            : 'Text clarity could be improved',
          severity: metrics.textClarity < 0.3 ? 'high' : 'medium'
        });
      }
      
      // Check extraction confidence
      if (metrics.extractionConfidence < 0.6) {
        issues.push({
          type: 'extraction_confidence',
          message: 'Information could not be reliably extracted from the document',
          severity: metrics.extractionConfidence < 0.3 ? 'high' : 'medium'
        });
      }
      
      // Check format consistency
      if (metrics.formatConsistency < 0.6) {
        issues.push({
          type: 'format_consistency',
          message: 'Document format does not match expected standards',
          severity: metrics.formatConsistency < 0.3 ? 'high' : 'medium'
        });
      }
    }
    
    return issues;
  }

  /**
   * Analyze document completeness against requirements
   * @param {Object} document - Document object
   * @param {Object} extractedData - Extracted data from document
   * @param {Object} programRequirements - Program requirements (optional)
   * @returns {Promise<Object>} - Completeness analysis results
   */
  async analyzeCompleteness(document, extractedData, programRequirements) {
    try {
      logger.info(`[ANALYSIS_SVC] Analyzing completeness for document: ${document.id}`);
      
      // Get document type requirements
      const requirements = this.getDocumentTypeRequirements(document.document_type);
      
      // Check required fields
      const requiredFields = requirements.requiredFields || [];
      const missingFields = [];
      const presentFields = [];
      
      for (const field of requiredFields) {
        const isPresent = this.checkFieldPresence(field, extractedData);
        
        if (isPresent) {
          presentFields.push(field);
        } else {
          missingFields.push(field);
        }
      }
      
      // Calculate completeness score
      const completenessScore = requiredFields.length > 0 
        ? Math.round((presentFields.length / requiredFields.length) * 100) 
        : 100;
      
      // Determine completeness level
      const completenessLevel = this.determineCompletenessLevel(completenessScore);
      
      return {
        requiredFields,
        presentFields,
        missingFields,
        completenessScore,
        completenessLevel
      };
    } catch (error) {
      logger.error(`[ANALYSIS_SVC] Error analyzing completeness: ${error.message}`);
      return {
        requiredFields: [],
        presentFields: [],
        missingFields: [],
        completenessScore: 0,
        completenessLevel: 'incomplete'
      };
    }
  }

  /**
   * Get requirements for a specific document type
   * @param {string} documentType - Document type
   * @returns {Object} - Document type requirements
   */
  getDocumentTypeRequirements(documentType) {
    // Default requirements
    const defaultRequirements = {
      requiredFields: []
    };
    
    // Return requirements based on document type
    switch ((documentType || '').toLowerCase()) {
      case 'passport':
        return {
          requiredFields: ['passportNumber', 'name', 'dateOfBirth', 'nationality', 'expiryDate']
        };
        
      case 'language_test':
        return {
          requiredFields: ['testType', 'candidateName', 'testDate', 'scores.overall']
        };
        
      case 'education_credential':
        return {
          requiredFields: ['institution', 'degree', 'graduationDate', 'studentName']
        };
        
      case 'employment_letter':
        return {
          requiredFields: ['company', 'employeeName', 'position', 'startDate']
        };
        
      default:
        return defaultRequirements;
    }
  }

  /**
   * Check if a field is present in extracted data
   * @param {string} field - Field name (can be nested, e.g., 'scores.overall')
   * @param {Object} extractedData - Extracted data
   * @returns {boolean} - Whether field is present
   */
  checkFieldPresence(field, extractedData) {
    if (!extractedData) {
      return false;
    }
    
    // Handle nested fields (e.g., 'scores.overall')
    const fieldParts = field.split('.');
    let value = extractedData;
    
    for (const part of fieldParts) {
      if (!value || value[part] === undefined || value[part] === null) {
        return false;
      }
      value = value[part];
    }
    
    // Check if value is empty string or empty array
    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    
    return true;
  }

  /**
   * Determine completeness level based on score
   * @param {number} score - Completeness score
   * @returns {string} - Completeness level (complete, mostly_complete, partially_complete, incomplete)
   */
  determineCompletenessLevel(score) {
    if (score === 100) return 'complete';
    if (score >= 75) return 'mostly_complete';
    if (score >= 50) return 'partially_complete';
    return 'incomplete';
  }

  /**
   * Generate optimization suggestions
   * @param {Object} document - Document object
   * @param {Object} extractedData - Extracted data
   * @param {Object} qualityAnalysis - Quality analysis results
   * @param {Object} completenessAnalysis - Completeness analysis results
   * @returns {Promise<Array>} - Optimization suggestions
   */
  async generateOptimizationSuggestions(document, extractedData, qualityAnalysis, completenessAnalysis) {
    try {
      logger.info(`[ANALYSIS_SVC] Generating optimization suggestions for document: ${document.id}`);
      
      const suggestions = [];
      
      // Add suggestions based on quality issues
      if (qualityAnalysis && qualityAnalysis.issues) {
        for (const issue of qualityAnalysis.issues) {
          let suggestion;
          
          switch (issue.type) {
            case 'image_quality':
              suggestion = {
                type: 'quality_improvement',
                message: 'Upload a higher quality scan or photo of the document',
                details: 'A clearer image will improve data extraction accuracy',
                priority: issue.severity === 'high' ? 'high' : 'medium'
              };
              break;
              
            case 'text_clarity':
              suggestion = {
                type: 'quality_improvement',
                message: 'Upload a document with clearer text',
                details: 'Ensure the text is not blurry, faded, or too small',
                priority: issue.severity === 'high' ? 'high' : 'medium'
              };
              break;
              
            case 'format_consistency':
              suggestion = {
                type: 'format_correction',
                message: 'Ensure the document follows standard format',
                details: 'The document format does not match the expected layout',
                priority: 'medium'
              };
              break;
          }
          
          if (suggestion) {
            suggestions.push(suggestion);
          }
        }
      }
      
      // Add suggestions based on missing fields
      if (completenessAnalysis && completenessAnalysis.missingFields) {
        for (const field of completenessAnalysis.missingFields) {
          suggestions.push({
            type: 'missing_information',
            message: `Document is missing required field: ${this.formatFieldName(field)}`,
            details: 'Upload a complete document that includes all required information',
            priority: 'high'
          });
        }
      }
      
      // Add document-specific suggestions
      const documentType = (document.document_type || '').toLowerCase();
      
      if (documentType === 'passport' && extractedData) {
        // Check passport expiry
        if (extractedData.expiryDate) {
          const expiryDate = new Date(extractedData.expiryDate);
          const now = new Date();
          const sixMonthsFromNow = new Date();
          sixMonthsFromNow.setMonth(now.getMonth() + 6);
          
          if (expiryDate < now) {
            suggestions.push({
              type: 'document_validity',
              message: 'Passport has expired',
              details: 'Upload a valid, non-expired passport',
              priority: 'critical'
            });
          } else if (expiryDate < sixMonthsFromNow) {
            suggestions.push({
              type: 'document_validity',
              message: 'Passport expires in less than 6 months',
              details: 'Many countries require passports to be valid for at least 6 months',
              priority: 'high'
            });
          }
        }
      }
      
      return suggestions;
    } catch (error) {
      logger.error(`[ANALYSIS_SVC] Error generating optimization suggestions: ${error.message}`);
      return [];
    }
  }

  /**
   * Format field name for display
   * @param {string} field - Field name
   * @returns {string} - Formatted field name
   */
  formatFieldName(field) {
    // Replace dots with spaces
    let formatted = field.replace(/\./g, ' ');
    
    // Capitalize first letter of each word
    formatted = formatted.replace(/\b\w/g, c => c.toUpperCase());
    
    // Replace camelCase with spaces
    formatted = formatted.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    return formatted;
  }

  /**
   * Calculate overall document score
   * @param {Object} qualityAnalysis - Quality analysis results
   * @param {Object} completenessAnalysis - Completeness analysis results
   * @returns {number} - Overall document score (0-100)
   */
  calculateOverallScore(qualityAnalysis, completenessAnalysis) {
    try {
      // Get quality and completeness scores
      const qualityScore = qualityAnalysis && qualityAnalysis.overallScore !== undefined 
        ? qualityAnalysis.overallScore 
        : 0;
        
      const completenessScore = completenessAnalysis && completenessAnalysis.completenessScore !== undefined 
        ? completenessAnalysis.completenessScore 
        : 0;
      
      // Calculate weighted average (quality: 40%, completeness: 60%)
      const overallScore = Math.round((qualityScore * 0.4) + (completenessScore * 0.6));
      
      return overallScore;
    } catch (error) {
      logger.error(`[ANALYSIS_SVC] Error calculating overall score: ${error.message}`);
      return 0;
    }
  }
}

module.exports = new AnalysisService();
