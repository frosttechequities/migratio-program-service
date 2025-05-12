/**
 * Base Immigration Data Fetcher
 * 
 * This is the base class for all immigration data fetchers.
 * It provides common functionality for fetching and processing data.
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { logger } = require('../../../utils/logger');

class BaseImmigrationDataFetcher {
  constructor(country) {
    this.country = country;
    this.baseUrl = '';
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    this.lastUpdated = new Date();
  }

  /**
   * Initialize the fetcher
   */
  async initialize() {
    logger.info(`Initializing ${this.country} immigration data fetcher`);
  }

  /**
   * Fetch data from a URL
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise<string>} - HTML content
   */
  async fetchUrl(url, options = {}) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          ...options.headers
        },
        timeout: options.timeout || 30000,
        ...options
      });

      return response.data;
    } catch (error) {
      logger.error(`Error fetching ${url}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Parse HTML content with cheerio
   * @param {string} html - HTML content
   * @returns {Object} - Cheerio object
   */
  parseHtml(html) {
    return cheerio.load(html);
  }

  /**
   * Fetch all immigration programs
   * @returns {Promise<Array>} - Array of immigration programs
   */
  async fetchPrograms() {
    throw new Error('fetchPrograms method must be implemented by subclasses');
  }

  /**
   * Fetch processing times
   * @returns {Promise<Object>} - Processing times by program
   */
  async fetchProcessingTimes() {
    throw new Error('fetchProcessingTimes method must be implemented by subclasses');
  }

  /**
   * Fetch program fees
   * @returns {Promise<Object>} - Fees by program
   */
  async fetchFees() {
    throw new Error('fetchFees method must be implemented by subclasses');
  }

  /**
   * Fetch eligibility criteria
   * @param {string} programId - Program ID
   * @returns {Promise<Array>} - Eligibility criteria
   */
  async fetchEligibilityCriteria(programId) {
    throw new Error('fetchEligibilityCriteria method must be implemented by subclasses');
  }

  /**
   * Fetch all data
   * @returns {Promise<Object>} - All immigration data
   */
  async fetchAll() {
    try {
      logger.info(`Fetching all immigration data for ${this.country}`);
      
      // Fetch programs
      const programs = await this.fetchPrograms();
      logger.info(`Fetched ${programs.length} programs for ${this.country}`);
      
      // Fetch processing times
      const processingTimes = await this.fetchProcessingTimes();
      logger.info(`Fetched processing times for ${this.country}`);
      
      // Fetch fees
      const fees = await this.fetchFees();
      logger.info(`Fetched fees for ${this.country}`);
      
      // Combine data
      const enrichedPrograms = programs.map(program => {
        return {
          ...program,
          processingTime: processingTimes[program.id] || null,
          fees: fees[program.id] || null,
          lastUpdated: this.lastUpdated
        };
      });
      
      return {
        country: this.country,
        programs: enrichedPrograms,
        lastUpdated: this.lastUpdated
      };
    } catch (error) {
      logger.error(`Error fetching all immigration data for ${this.country}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clean text by removing extra whitespace
   * @param {string} text - Text to clean
   * @returns {string} - Cleaned text
   */
  cleanText(text) {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Extract number from text
   * @param {string} text - Text containing a number
   * @returns {number|null} - Extracted number or null
   */
  extractNumber(text) {
    if (!text) return null;
    const match = text.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
  }

  /**
   * Extract currency amount from text
   * @param {string} text - Text containing a currency amount
   * @returns {number|null} - Extracted amount or null
   */
  extractCurrency(text) {
    if (!text) return null;
    const match = text.match(/[\d,]+(\.\d+)?/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : null;
  }

  /**
   * Extract date from text
   * @param {string} text - Text containing a date
   * @returns {Date|null} - Extracted date or null
   */
  extractDate(text) {
    if (!text) return null;
    const date = new Date(text);
    return isNaN(date.getTime()) ? null : date;
  }
}

module.exports = BaseImmigrationDataFetcher;
