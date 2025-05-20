/**
 * Extraction Service
 * Extracts structured data from OCR results based on document type
 */
const logger = require('../utils/logger');

/**
 * Extraction Service class
 */
class ExtractionService {
  /**
   * Extract data from OCR results based on document type
   * @param {Object} ocrResults - OCR results
   * @param {string} documentType - Type of document
   * @returns {Promise<Object>} - Extracted data
   */
  async extractData(ocrResults, documentType) {
    try {
      logger.info(`[EXTRACT_SVC] Extracting data for document type: ${documentType}`);
      
      // Select extraction method based on document type
      let extractedData;
      switch (documentType.toLowerCase()) {
        case 'passport':
          extractedData = this.extractPassportData(ocrResults);
          break;
        case 'language_test':
          extractedData = this.extractLanguageTestData(ocrResults);
          break;
        case 'education_credential':
          extractedData = this.extractEducationCredentialData(ocrResults);
          break;
        case 'employment_letter':
          extractedData = this.extractEmploymentLetterData(ocrResults);
          break;
        default:
          extractedData = this.extractGenericData(ocrResults);
          break;
      }
      
      return {
        documentType,
        extractedData,
        confidence: this.calculateConfidence(extractedData)
      };
    } catch (error) {
      logger.error(`[EXTRACT_SVC] Error extracting data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract passport data from OCR results
   * @param {Object} ocrResults - OCR results
   * @returns {Object} - Extracted passport data
   */
  extractPassportData(ocrResults) {
    try {
      const text = ocrResults.text;
      
      // Extract passport number
      const passportNumberRegex = /(?:Passport No|Passport Number|No|Number)[.:]\s*([A-Z0-9]{6,9})/i;
      const passportNumberMatch = text.match(passportNumberRegex);
      const passportNumber = passportNumberMatch ? passportNumberMatch[1] : null;
      
      // Extract name
      const nameRegex = /(?:Name|Surname and given names)[.:]\s*([A-Z\s]+)/i;
      const nameMatch = text.match(nameRegex);
      const name = nameMatch ? nameMatch[1].trim() : null;
      
      // Extract date of birth
      const dobRegex = /(?:Date of Birth|Birth Date|DOB)[.:]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i;
      const dobMatch = text.match(dobRegex);
      const dateOfBirth = dobMatch ? dobMatch[1] : null;
      
      // Extract nationality
      const nationalityRegex = /(?:Nationality|Citizenship)[.:]\s*([A-Z\s]+)/i;
      const nationalityMatch = text.match(nationalityRegex);
      const nationality = nationalityMatch ? nationalityMatch[1].trim() : null;
      
      // Extract expiry date
      const expiryRegex = /(?:Date of Expiry|Expiry Date|Expiration)[.:]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i;
      const expiryMatch = text.match(expiryRegex);
      const expiryDate = expiryMatch ? expiryMatch[1] : null;
      
      return {
        passportNumber,
        name,
        dateOfBirth,
        nationality,
        expiryDate,
        confidence: {
          passportNumber: passportNumber ? 0.8 : 0,
          name: name ? 0.7 : 0,
          dateOfBirth: dateOfBirth ? 0.8 : 0,
          nationality: nationality ? 0.7 : 0,
          expiryDate: expiryDate ? 0.8 : 0
        }
      };
    } catch (error) {
      logger.error(`[EXTRACT_SVC] Error extracting passport data: ${error.message}`);
      return {
        confidence: {
          overall: 0
        }
      };
    }
  }

  /**
   * Extract language test data from OCR results
   * @param {Object} ocrResults - OCR results
   * @returns {Object} - Extracted language test data
   */
  extractLanguageTestData(ocrResults) {
    try {
      const text = ocrResults.text;
      
      // Determine test type (IELTS, TOEFL, etc.)
      let testType = 'Unknown';
      if (text.includes('IELTS')) {
        testType = 'IELTS';
      } else if (text.includes('TOEFL')) {
        testType = 'TOEFL';
      } else if (text.includes('CELPIP')) {
        testType = 'CELPIP';
      }
      
      // Extract candidate information
      const candidateNameRegex = /(?:Candidate|Name|Test taker)[.:]\s*([A-Za-z\s]+)/i;
      const candidateNameMatch = text.match(candidateNameRegex);
      const candidateName = candidateNameMatch ? candidateNameMatch[1].trim() : null;
      
      // Extract test date
      const testDateRegex = /(?:Test Date|Date of Test|Examination Date)[.:]\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i;
      const testDateMatch = text.match(testDateRegex);
      const testDate = testDateMatch ? testDateMatch[1] : null;
      
      // Extract scores based on test type
      let scores = {};
      
      if (testType === 'IELTS') {
        // Extract IELTS scores
        const listeningRegex = /Listening[.:]\s*(\d+\.?\d*)/i;
        const readingRegex = /Reading[.:]\s*(\d+\.?\d*)/i;
        const writingRegex = /Writing[.:]\s*(\d+\.?\d*)/i;
        const speakingRegex = /Speaking[.:]\s*(\d+\.?\d*)/i;
        const overallRegex = /Overall[.:]\s*(\d+\.?\d*)/i;
        
        const listeningMatch = text.match(listeningRegex);
        const readingMatch = text.match(readingRegex);
        const writingMatch = text.match(writingRegex);
        const speakingMatch = text.match(speakingRegex);
        const overallMatch = text.match(overallRegex);
        
        scores = {
          listening: listeningMatch ? parseFloat(listeningMatch[1]) : null,
          reading: readingMatch ? parseFloat(readingMatch[1]) : null,
          writing: writingMatch ? parseFloat(writingMatch[1]) : null,
          speaking: speakingMatch ? parseFloat(speakingMatch[1]) : null,
          overall: overallMatch ? parseFloat(overallMatch[1]) : null
        };
      } else if (testType === 'TOEFL') {
        // Extract TOEFL scores
        const listeningRegex = /Listening[.:]\s*(\d+)/i;
        const readingRegex = /Reading[.:]\s*(\d+)/i;
        const writingRegex = /Writing[.:]\s*(\d+)/i;
        const speakingRegex = /Speaking[.:]\s*(\d+)/i;
        const totalRegex = /Total[.:]\s*(\d+)/i;
        
        const listeningMatch = text.match(listeningRegex);
        const readingMatch = text.match(readingRegex);
        const writingMatch = text.match(writingRegex);
        const speakingMatch = text.match(speakingRegex);
        const totalMatch = text.match(totalRegex);
        
        scores = {
          listening: listeningMatch ? parseInt(listeningMatch[1]) : null,
          reading: readingMatch ? parseInt(readingMatch[1]) : null,
          writing: writingMatch ? parseInt(writingMatch[1]) : null,
          speaking: speakingMatch ? parseInt(speakingMatch[1]) : null,
          total: totalMatch ? parseInt(totalMatch[1]) : null
        };
      }
      
      return {
        testType,
        candidateName,
        testDate,
        scores,
        confidence: {
          testType: testType !== 'Unknown' ? 0.9 : 0.3,
          candidateName: candidateName ? 0.7 : 0,
          testDate: testDate ? 0.8 : 0,
          scores: Object.values(scores).some(score => score !== null) ? 0.8 : 0
        }
      };
    } catch (error) {
      logger.error(`[EXTRACT_SVC] Error extracting language test data: ${error.message}`);
      return {
        confidence: {
          overall: 0
        }
      };
    }
  }

  /**
   * Extract education credential data from OCR results
   * @param {Object} ocrResults - OCR results
   * @returns {Object} - Extracted education credential data
   */
  extractEducationCredentialData(ocrResults) {
    try {
      const text = ocrResults.text;
      
      // Extract institution name
      const institutionRegex = /(?:University|College|Institute|School)[:\s]+([A-Za-z\s&,]+)/i;
      const institutionMatch = text.match(institutionRegex);
      const institution = institutionMatch ? institutionMatch[1].trim() : null;
      
      // Extract degree/qualification
      const degreeRegex = /(?:Degree|Qualification|Diploma|Certificate)[:\s]+([A-Za-z\s&,]+)/i;
      const degreeMatch = text.match(degreeRegex);
      const degree = degreeMatch ? degreeMatch[1].trim() : null;
      
      // Extract graduation date
      const gradDateRegex = /(?:Graduation Date|Date of Graduation|Conferred on|Awarded on)[:\s]+(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i;
      const gradDateMatch = text.match(gradDateRegex);
      const graduationDate = gradDateMatch ? gradDateMatch[1] : null;
      
      // Extract student name
      const studentNameRegex = /(?:Student|Name|Graduate)[:\s]+([A-Za-z\s]+)/i;
      const studentNameMatch = text.match(studentNameRegex);
      const studentName = studentNameMatch ? studentNameMatch[1].trim() : null;
      
      return {
        institution,
        degree,
        graduationDate,
        studentName,
        confidence: {
          institution: institution ? 0.8 : 0,
          degree: degree ? 0.7 : 0,
          graduationDate: graduationDate ? 0.8 : 0,
          studentName: studentName ? 0.7 : 0
        }
      };
    } catch (error) {
      logger.error(`[EXTRACT_SVC] Error extracting education credential data: ${error.message}`);
      return {
        confidence: {
          overall: 0
        }
      };
    }
  }

  /**
   * Extract employment letter data from OCR results
   * @param {Object} ocrResults - OCR results
   * @returns {Object} - Extracted employment letter data
   */
  extractEmploymentLetterData(ocrResults) {
    try {
      const text = ocrResults.text;
      
      // Extract company name
      const companyRegex = /(?:Company|Employer|Organization)[:\s]+([A-Za-z\s&,.]+)/i;
      const companyMatch = text.match(companyRegex);
      const company = companyMatch ? companyMatch[1].trim() : null;
      
      // Extract employee name
      const employeeRegex = /(?:Employee|Name)[:\s]+([A-Za-z\s]+)/i;
      const employeeMatch = text.match(employeeRegex);
      const employeeName = employeeMatch ? employeeMatch[1].trim() : null;
      
      // Extract position/job title
      const positionRegex = /(?:Position|Job Title|Title|Role)[:\s]+([A-Za-z\s]+)/i;
      const positionMatch = text.match(positionRegex);
      const position = positionMatch ? positionMatch[1].trim() : null;
      
      // Extract employment dates
      const startDateRegex = /(?:Start Date|Employment Date|Joined on)[:\s]+(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})/i;
      const startDateMatch = text.match(startDateRegex);
      const startDate = startDateMatch ? startDateMatch[1] : null;
      
      return {
        company,
        employeeName,
        position,
        startDate,
        confidence: {
          company: company ? 0.8 : 0,
          employeeName: employeeName ? 0.7 : 0,
          position: position ? 0.8 : 0,
          startDate: startDate ? 0.7 : 0
        }
      };
    } catch (error) {
      logger.error(`[EXTRACT_SVC] Error extracting employment letter data: ${error.message}`);
      return {
        confidence: {
          overall: 0
        }
      };
    }
  }

  /**
   * Extract generic data from OCR results
   * @param {Object} ocrResults - OCR results
   * @returns {Object} - Extracted generic data
   */
  extractGenericData(ocrResults) {
    try {
      const text = ocrResults.text;
      
      // Extract dates
      const dateRegex = /\b(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})\b/g;
      const dates = [];
      let dateMatch;
      while ((dateMatch = dateRegex.exec(text)) !== null) {
        dates.push(dateMatch[1]);
      }
      
      // Extract names (simple approach)
      const nameRegex = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g;
      const names = [];
      let nameMatch;
      while ((nameMatch = nameRegex.exec(text)) !== null) {
        names.push(nameMatch[1]);
      }
      
      // Extract numbers
      const numberRegex = /\b([A-Z0-9]{6,})\b/g;
      const numbers = [];
      let numberMatch;
      while ((numberMatch = numberRegex.exec(text)) !== null) {
        numbers.push(numberMatch[1]);
      }
      
      return {
        dates,
        names,
        numbers,
        confidence: {
          dates: dates.length > 0 ? 0.6 : 0,
          names: names.length > 0 ? 0.5 : 0,
          numbers: numbers.length > 0 ? 0.7 : 0
        }
      };
    } catch (error) {
      logger.error(`[EXTRACT_SVC] Error extracting generic data: ${error.message}`);
      return {
        confidence: {
          overall: 0
        }
      };
    }
  }

  /**
   * Calculate overall confidence score for extracted data
   * @param {Object} extractedData - Extracted data with confidence scores
   * @returns {number} - Overall confidence score
   */
  calculateConfidence(extractedData) {
    try {
      if (!extractedData || !extractedData.confidence) {
        return 0;
      }
      
      // If overall confidence is already calculated, return it
      if (extractedData.confidence.overall !== undefined) {
        return extractedData.confidence.overall;
      }
      
      // Calculate average of all confidence scores
      const confidenceValues = Object.values(extractedData.confidence).filter(value => typeof value === 'number');
      
      if (confidenceValues.length === 0) {
        return 0;
      }
      
      const sum = confidenceValues.reduce((total, value) => total + value, 0);
      return sum / confidenceValues.length;
    } catch (error) {
      logger.error(`[EXTRACT_SVC] Error calculating confidence: ${error.message}`);
      return 0;
    }
  }
}

module.exports = new ExtractionService();
