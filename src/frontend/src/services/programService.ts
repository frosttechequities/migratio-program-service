/**
 * Program Service API Client
 * 
 * This service provides functions to interact with the Program Service API,
 * which manages immigration program data and country information.
 */

// Base URL for the Program Service API
// In production, this should be the Render deployment URL
const PROGRAM_API_BASE_URL = 'https://migratio-program-service.onrender.com/api';

// Country interface representing country data from the API
export interface Country {
  id: string;
  name: string;
  countryCode: string;
  region: string;
  subregion: string;
  flagEmoji: string;
  immigrationPolicySummary: string;
  skilledWorkerFocus: boolean;
  studentVisaOptions: boolean;
  familyReunificationEmphasis: boolean;
  commonLanguages: string[];
}

// Program interface representing immigration program data from the API
export interface Program {
  id: string;
  name: string;
  country: string | Country;
  countryCode: string;
  category: string;
  subcategory: string;
  description: string;
  eligibilityCriteria: any[];
  processingTime: any;
  costs: any[];
  requiredDocuments: any[];
  applicationSteps: any[];
  benefits: string[];
  limitations: string[];
  pathwayToResidency: boolean;
  pathwayToCitizenship: boolean;
  officialWebsite: string;
  lastUpdated: string;
}

/**
 * Program Service API client
 */
export const programService = {
  /**
   * Fetch all countries from the API
   * @returns Promise resolving to an array of Country objects
   */
  fetchCountries: async (): Promise<Country[]> => {
    try {
      const response = await fetch(`${PROGRAM_API_BASE_URL}/countries`);
      if (!response.ok) {
        let errorDetail = 'Failed to fetch countries';
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorDetail = errorData.detail;
          }
        } catch {
          // Ignore if response is not JSON
        }
        throw new Error(errorDetail);
      }
      const data = await response.json();
      return data.data.countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },

  /**
   * Fetch a specific country by its code
   * @param countryCode The ISO country code (e.g., 'US', 'CA')
   * @returns Promise resolving to a Country object
   */
  fetchCountryByCode: async (countryCode: string): Promise<Country> => {
    try {
      const response = await fetch(`${PROGRAM_API_BASE_URL}/countries/${countryCode}`);
      if (!response.ok) {
        let errorDetail = `Failed to fetch country with code ${countryCode}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorDetail = errorData.detail;
          }
        } catch {
          // Ignore if response is not JSON
        }
        throw new Error(errorDetail);
      }
      const data = await response.json();
      return data.data.country;
    } catch (error) {
      console.error(`Error fetching country with code ${countryCode}:`, error);
      throw error;
    }
  },

  /**
   * Fetch all immigration programs from the API
   * @returns Promise resolving to an array of Program objects
   */
  fetchPrograms: async (): Promise<Program[]> => {
    try {
      const response = await fetch(`${PROGRAM_API_BASE_URL}/programs`);
      if (!response.ok) {
        let errorDetail = 'Failed to fetch programs';
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorDetail = errorData.detail;
          }
        } catch {
          // Ignore if response is not JSON
        }
        throw new Error(errorDetail);
      }
      const data = await response.json();
      return data.data.programs;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  /**
   * Fetch programs for a specific country
   * @param countryCode The ISO country code (e.g., 'US', 'CA')
   * @returns Promise resolving to an array of Program objects
   */
  fetchProgramsByCountry: async (countryCode: string): Promise<Program[]> => {
    try {
      const response = await fetch(`${PROGRAM_API_BASE_URL}/programs/country/${countryCode}`);
      if (!response.ok) {
        let errorDetail = `Failed to fetch programs for country ${countryCode}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorDetail = errorData.detail;
          }
        } catch {
          // Ignore if response is not JSON
        }
        throw new Error(errorDetail);
      }
      const data = await response.json();
      return data.data.programs;
    } catch (error) {
      console.error(`Error fetching programs for country ${countryCode}:`, error);
      throw error;
    }
  },

  /**
   * Fetch a specific program by its ID
   * @param programId The program ID
   * @returns Promise resolving to a Program object
   */
  fetchProgramById: async (programId: string): Promise<Program> => {
    try {
      const response = await fetch(`${PROGRAM_API_BASE_URL}/programs/${programId}`);
      if (!response.ok) {
        let errorDetail = `Failed to fetch program with ID ${programId}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorDetail = errorData.detail;
          }
        } catch {
          // Ignore if response is not JSON
        }
        throw new Error(errorDetail);
      }
      const data = await response.json();
      return data.data.program;
    } catch (error) {
      console.error(`Error fetching program with ID ${programId}:`, error);
      throw error;
    }
  }
};

export default programService;
