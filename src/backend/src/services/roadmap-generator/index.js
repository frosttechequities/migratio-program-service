/**
 * Roadmap Generator Service
 *
 * Generates personalized immigration roadmaps based on user profiles and recommendations.
 * Uses real-world immigration program data and requirements.
 */

const { logger } = require('../../utils/logger');
const { Roadmap } = require('../../models/roadmap.model');
const { Document } = require('../../models/document.model');
const { allPrograms } = require('../../data/immigration/programs');

// Import phase generators
const { createPreparationPhase } = require('./phase-generator');
const { createDocumentPhase } = require('./document-phase');
const { createApplicationPhase } = require('./application-phase');
const { createProcessingPhase } = require('./processing-phase');
const { createPreArrivalPhase } = require('./pre-arrival-phase');
const { createSettlementPhase } = require('./settlement-phase');

class RoadmapGenerator {
  /**
   * Generate a roadmap based on a recommendation
   * @param {Object} recommendation - Recommendation object
   * @param {Object} user - User object
   * @returns {Promise<Object>} - Generated roadmap
   */
  async generateRoadmap(recommendation, user) {
    try {
      logger.info(`Generating roadmap for user ${user._id} based on recommendation ${recommendation._id}`);

      // Get the program details
      const program = this._getProgramDetails(recommendation.programId);
      if (!program) {
        throw new Error(`Program not found: ${recommendation.programId}`);
      }

      // Create roadmap structure
      const roadmapData = {
        userId: user._id,
        recommendationId: recommendation._id,
        title: `${program.name} Immigration Roadmap`,
        description: `Personalized immigration roadmap for ${program.name} (${program.country})`,
        programId: program.programId,
        programName: program.name,
        country: program.country,
        status: 'draft',
        startDate: new Date(),
        phases: []
      };

      // Generate phases based on program
      roadmapData.phases = await this._generatePhases(program, recommendation, user);

      // Calculate estimated completion date
      roadmapData.targetCompletionDate = this._calculateEstimatedCompletionDate(roadmapData.phases);

      // Create the roadmap
      const roadmap = new Roadmap(roadmapData);

      // Calculate completion percentage
      roadmap.calculateCompletionPercentage();

      // Save the roadmap
      await roadmap.save();

      logger.info(`Roadmap generated successfully: ${roadmap._id}`);

      return roadmap;
    } catch (error) {
      logger.error(`Error generating roadmap: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate phases for a roadmap
   * @param {Object} program - Immigration program
   * @param {Object} recommendation - Recommendation object
   * @param {Object} user - User object
   * @returns {Promise<Array>} - Generated phases
   */
  async _generatePhases(program, recommendation, user) {
    try {
      logger.info(`Generating phases for program ${program.programId}`);

      const phases = [];

      // Phase 1: Preparation and Planning
      phases.push(createPreparationPhase(program, recommendation, user));

      // Phase 2: Document Collection and Verification
      phases.push(createDocumentPhase(program, recommendation, user));

      // Phase 3: Application Submission
      phases.push(createApplicationPhase(program, recommendation, user));

      // Phase 4: Application Processing
      phases.push(createProcessingPhase(program, recommendation, user));

      // Phase 5: Pre-Arrival Preparation
      phases.push(createPreArrivalPhase(program, recommendation, user));

      // Phase 6: Arrival and Settlement
      phases.push(createSettlementPhase(program, recommendation, user));

      logger.info(`Generated ${phases.length} phases for program ${program.programId}`);

      return phases;
    } catch (error) {
      logger.error(`Error generating phases: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get program details from program ID
   * @param {string} programId - Program ID
   * @returns {Object} - Program details
   */
  _getProgramDetails(programId) {
    return allPrograms.find(p => p.programId === programId);
  }

  /**
   * Calculate estimated completion date based on phases
   * @param {Array} phases - Roadmap phases
   * @returns {Date} - Estimated completion date
   */
  _calculateEstimatedCompletionDate(phases) {
    const now = new Date();
    let totalDays = 0;

    // Sum up the estimated duration of all phases
    phases.forEach(phase => {
      if (phase.milestones && phase.milestones.length > 0) {
        phase.milestones.forEach(milestone => {
          if (milestone.estimatedDuration) {
            const { value, unit } = milestone.estimatedDuration;

            if (unit === 'days') {
              totalDays += value;
            } else if (unit === 'weeks') {
              totalDays += value * 7;
            } else if (unit === 'months') {
              totalDays += value * 30;
            }
          }
        });
      }
    });

    // Add buffer time (20%)
    totalDays = Math.ceil(totalDays * 1.2);

    // Calculate the target date
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + totalDays);

    return targetDate;
  }

  /**
   * Create document records for a roadmap
   * @param {Object} roadmap - Roadmap object
   * @param {Object} user - User object
   * @returns {Promise<Array>} - Created documents
   */
  async createDocumentRecords(roadmap, user) {
    try {
      logger.info(`Creating document records for roadmap ${roadmap._id}`);

      const documents = [];

      // Iterate through phases and milestones to find document requirements
      for (const phase of roadmap.phases) {
        for (const milestone of phase.milestones) {
          if (milestone.documents && milestone.documents.length > 0) {
            for (const docRef of milestone.documents) {
              // Create document record
              const document = new Document({
                userId: user._id,
                roadmapId: roadmap._id,
                milestoneId: milestone._id,
                title: this._getDocumentTitle(docRef.documentId),
                description: this._getDocumentDescription(docRef.documentId),
                category: this._getDocumentCategory(docRef.documentId),
                documentType: docRef.documentId,
                status: 'pending',
                isRequired: docRef.required
              });

              // Save document
              await document.save();
              documents.push(document);

              // Update milestone document reference with document ID
              docRef.documentId = document._id;
            }
          }
        }
      }

      // Save the updated roadmap
      await roadmap.save();

      logger.info(`Created ${documents.length} document records for roadmap ${roadmap._id}`);

      return documents;
    } catch (error) {
      logger.error(`Error creating document records: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get document title based on document type
   * @param {string} documentType - Document type
   * @returns {string} - Document title
   */
  _getDocumentTitle(documentType) {
    const titles = {
      'passport': 'Passport',
      'birth_certificate': 'Birth Certificate',
      'marriage_certificate': 'Marriage Certificate',
      'diplomas': 'Diplomas and Degrees',
      'transcripts': 'Academic Transcripts',
      'credential_assessment': 'Educational Credential Assessment',
      'reference_letters': 'Employment Reference Letters',
      'employment_contracts': 'Employment Contracts',
      'pay_stubs': 'Pay Stubs or Tax Documents',
      'resume': 'Resume/CV',
      'language_test_results': 'Language Test Results',
      'bank_statements': 'Bank Statements',
      'investment_statements': 'Investment Statements',
      'asset_proof': 'Proof of Assets',
      'police_certificates': 'Police Certificates',
      'health_examination': 'Health Examination Results'
    };

    return titles[documentType] || 'Document';
  }

  /**
   * Get document description based on document type
   * @param {string} documentType - Document type
   * @returns {string} - Document description
   */
  _getDocumentDescription(documentType) {
    const descriptions = {
      'passport': 'Valid passport with at least 6 months validity beyond your planned stay',
      'birth_certificate': 'Official birth certificate with translation if not in English/French',
      'marriage_certificate': 'Official marriage certificate with translation if not in English/French',
      'diplomas': 'Diplomas and degrees from all post-secondary education',
      'transcripts': 'Official academic transcripts from all post-secondary education',
      'credential_assessment': 'Educational credential assessment from a designated organization',
      'reference_letters': 'Reference letters from employers confirming work experience',
      'employment_contracts': 'Employment contracts from current and previous employers',
      'pay_stubs': 'Pay stubs or tax documents proving employment',
      'resume': 'Detailed resume/CV with all work experience',
      'language_test_results': 'Official language test results (IELTS, CELPIP, TEF, etc.)',
      'bank_statements': 'Bank statements showing sufficient settlement funds',
      'investment_statements': 'Investment account statements',
      'asset_proof': 'Documents proving ownership of assets',
      'police_certificates': 'Police certificates from all countries where you lived for 6+ months since age 18',
      'health_examination': 'Results of medical examination by an approved panel physician'
    };

    return descriptions[documentType] || 'Required document for your immigration application';
  }

  /**
   * Get document category based on document type
   * @param {string} documentType - Document type
   * @returns {string} - Document category
   */
  _getDocumentCategory(documentType) {
    const categories = {
      'passport': 'identity',
      'birth_certificate': 'identity',
      'marriage_certificate': 'identity',
      'diplomas': 'education',
      'transcripts': 'education',
      'credential_assessment': 'education',
      'reference_letters': 'work',
      'employment_contracts': 'work',
      'pay_stubs': 'work',
      'resume': 'work',
      'language_test_results': 'language',
      'bank_statements': 'financial',
      'investment_statements': 'financial',
      'asset_proof': 'financial',
      'police_certificates': 'other',
      'health_examination': 'other'
    };

    return categories[documentType] || 'other';
  }
}

module.exports = RoadmapGenerator;
