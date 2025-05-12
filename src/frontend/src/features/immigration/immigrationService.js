/**
 * Immigration data service
 * Handles API calls for immigration data
 */
import axios from 'axios';
import { API_BASE_URL as API_URL } from '../../config/constants';

// Get all immigration programs
const getAllPrograms = async (token, params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  };

  const response = await axios.get(`${API_URL}/api/immigration/programs`, config);
  return response.data;
};

// Get immigration program by ID
const getProgramById = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(`${API_URL}/api/immigration/programs/id/${id}`, config);
  return response.data;
};

// Get immigration programs by country
const getProgramsByCountry = async (token, country, params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  };

  const response = await axios.get(`${API_URL}/api/immigration/programs/${country}`, config);
  return response.data;
};

// Get program types
const getProgramTypes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(`${API_URL}/api/immigration/programs/types`, config);
  return response.data;
};

// Search immigration programs
const searchPrograms = async (token, query, limit = 10) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { query, limit }
  };

  const response = await axios.get(`${API_URL}/api/immigration/programs/search`, config);
  return response.data;
};

// Get all country profiles
const getAllCountries = async (token, params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  };

  const response = await axios.get(`${API_URL}/api/immigration/countries`, config);
  return response.data;
};

// Get country profile by name
const getCountryByName = async (token, name) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(`${API_URL}/api/immigration/countries/${name}`, config);
  return response.data;
};

// Get countries by region
const getCountriesByRegion = async (token, region) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(`${API_URL}/api/immigration/countries/region/${region}`, config);
  return response.data;
};

// Get available regions
const getRegions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(`${API_URL}/api/immigration/countries/regions`, config);
  return response.data;
};

// Get top immigration countries
const getTopCountries = async (token, limit = 10) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { limit }
  };

  const response = await axios.get(`${API_URL}/api/immigration/countries/top`, config);
  return response.data;
};

// Get all points systems
const getAllPointsSystems = async (token, params = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  };

  const response = await axios.get(`${API_URL}/api/immigration/points-systems`, config);
  return response.data;
};

// Get points system by ID
const getPointsSystemById = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(`${API_URL}/api/immigration/points-systems/id/${id}`, config);
  return response.data;
};

// Get points systems by country
const getPointsSystemsByCountry = async (token, country) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(`${API_URL}/api/immigration/points-systems/country/${country}`, config);
  return response.data;
};

// Calculate points for a user profile
const calculatePoints = async (token, id, userProfile) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await axios.post(
    `${API_URL}/api/immigration/points-systems/${id}/calculate`,
    userProfile,
    config
  );
  return response.data;
};

// Compare points systems
const comparePointsSystems = async (token, systemIds) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { systems: systemIds.join(',') }
  };

  const response = await axios.get(`${API_URL}/api/immigration/points-systems/compare`, config);
  return response.data;
};

// Mock data for development
const getMockImmigrationPrograms = () => {
  return [
    {
      _id: 'prog1',
      name: 'Express Entry',
      country: 'Canada',
      type: 'Skilled Worker',
      overview: 'Canada\'s flagship immigration program for skilled workers',
      eligibilityCriteria: {
        ageRequirements: {
          minAge: 18,
          maxAge: 45
        },
        languageRequirements: {
          languages: [
            {
              language: 'English',
              minimumLevel: 'CLB 7'
            }
          ]
        }
      },
      processingInfo: {
        standardProcessing: {
          duration: {
            min: 6,
            max: 8,
            unit: 'months'
          }
        }
      }
    },
    {
      _id: 'prog2',
      name: 'Global Talent Visa',
      country: 'United Kingdom',
      type: 'Skilled Worker',
      overview: 'UK\'s visa for talented individuals in specific fields',
      eligibilityCriteria: {
        ageRequirements: {
          minAge: 18,
          maxAge: 65
        }
      },
      processingInfo: {
        standardProcessing: {
          duration: {
            min: 3,
            max: 5,
            unit: 'weeks'
          }
        }
      }
    }
  ];
};

// Mock data for development
const getMockCountryProfiles = () => {
  return [
    {
      _id: 'country1',
      name: 'Canada',
      code: 'CA',
      region: 'North America',
      immigrationSystem: {
        systemType: 'Points-based',
        keyFeatures: ['Express Entry', 'Provincial Nomination']
      },
      citizenshipInfo: {
        residencyRequirement: {
          years: 3
        }
      }
    },
    {
      _id: 'country2',
      name: 'Australia',
      code: 'AU',
      region: 'Oceania',
      immigrationSystem: {
        systemType: 'Points-based',
        keyFeatures: ['SkillSelect', 'State Sponsorship']
      },
      citizenshipInfo: {
        residencyRequirement: {
          years: 4
        }
      }
    }
  ];
};

// Mock data for points systems
const getMockPointsSystems = () => {
  return [
    {
      _id: 'ps1',
      name: 'Express Entry Comprehensive Ranking System',
      country: 'Canada',
      program: 'Express Entry',
      maxPoints: 1200,
      passingScore: 470,
      categories: [
        {
          name: 'Core Human Capital Factors',
          maxPoints: 500,
          factors: [
            {
              name: 'Age',
              maxPoints: 110,
              description: 'Points based on age at time of application'
            },
            {
              name: 'Education',
              maxPoints: 150,
              description: 'Points based on level of education'
            },
            {
              name: 'Language Proficiency',
              maxPoints: 160,
              description: 'Points based on official language proficiency'
            },
            {
              name: 'Canadian Work Experience',
              maxPoints: 80,
              description: 'Points based on Canadian work experience'
            }
          ]
        },
        {
          name: 'Spouse Factors',
          maxPoints: 40,
          factors: [
            {
              name: 'Spouse Education',
              maxPoints: 10,
              description: 'Points based on spouse education'
            },
            {
              name: 'Spouse Language Proficiency',
              maxPoints: 20,
              description: 'Points based on spouse language proficiency'
            },
            {
              name: 'Spouse Canadian Work Experience',
              maxPoints: 10,
              description: 'Points based on spouse Canadian work experience'
            }
          ]
        }
      ]
    },
    {
      _id: 'ps2',
      name: 'Australia General Skilled Migration Points Test',
      country: 'Australia',
      program: 'Skilled Independent Visa (Subclass 189)',
      maxPoints: 100,
      passingScore: 65,
      categories: [
        {
          name: 'Age',
          maxPoints: 30,
          factors: [
            {
              name: 'Age Range',
              maxPoints: 30,
              description: 'Points based on age at time of invitation'
            }
          ]
        },
        {
          name: 'English Language Ability',
          maxPoints: 20,
          factors: [
            {
              name: 'English Proficiency',
              maxPoints: 20,
              description: 'Points based on English language test scores'
            }
          ]
        },
        {
          name: 'Work Experience',
          maxPoints: 20,
          factors: [
            {
              name: 'Skilled Employment',
              maxPoints: 20,
              description: 'Points based on years of skilled employment'
            }
          ]
        }
      ]
    }
  ];
};

const immigrationService = {
  getAllPrograms,
  getProgramById,
  getProgramsByCountry,
  getProgramTypes,
  searchPrograms,
  getAllCountries,
  getCountryByName,
  getCountriesByRegion,
  getRegions,
  getTopCountries,
  getAllPointsSystems,
  getPointsSystemById,
  getPointsSystemsByCountry,
  calculatePoints,
  comparePointsSystems,
  getMockImmigrationPrograms,
  getMockCountryProfiles,
  getMockPointsSystems
};

export default immigrationService;
