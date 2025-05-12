/**
 * Application-wide constants
 */

// API endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Immigration data constants
export const REGIONS = [
  'North America',
  'Europe',
  'Asia',
  'Oceania',
  'South America',
  'Africa'
];

export const PROGRAM_TYPES = [
  'Skilled Worker',
  'Family Sponsorship',
  'Business Immigration',
  'Student Pathway',
  'Humanitarian',
  'Working Holiday'
];

// Calendar constants
export const CALENDAR_VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  AGENDA: 'agenda'
};

// Document types
export const DOCUMENT_TYPES = [
  'Passport',
  'Birth Certificate',
  'Marriage Certificate',
  'Education Credential',
  'Language Test Result',
  'Employment Reference',
  'Police Clearance',
  'Medical Exam',
  'Financial Proof',
  'Other'
];

// Status constants
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10
};
