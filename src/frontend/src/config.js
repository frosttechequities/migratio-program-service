// API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Supabase URL and Key
export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
export const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDkxODgsImV4cCI6MjA2MjY4NTE4OH0.Nt-mwYfKmXQFIkAYnhh_kYI4L_-5MaIKrz9hvoC7jto';

// Hugging Face API Token
export const HF_API_TOKEN = process.env.REACT_APP_HF_API_TOKEN || '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';

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Theme settings
export const THEME_SETTINGS = {
  light: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff'
    }
  },
  dark: {
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000'
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: '#000'
    }
  }
};

// Font size settings
export const FONT_SIZE_SETTINGS = {
  small: {
    h1: '2rem',
    h2: '1.75rem',
    h3: '1.5rem',
    h4: '1.25rem',
    h5: '1.1rem',
    h6: '1rem',
    body1: '0.875rem',
    body2: '0.8rem'
  },
  medium: {
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.75rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1.1rem',
    body1: '1rem',
    body2: '0.875rem'
  },
  large: {
    h1: '3rem',
    h2: '2.5rem',
    h3: '2rem',
    h4: '1.75rem',
    h5: '1.5rem',
    h6: '1.25rem',
    body1: '1.1rem',
    body2: '1rem'
  }
};

// Density settings
export const DENSITY_SETTINGS = {
  comfortable: {
    padding: {
      small: '8px',
      medium: '16px',
      large: '24px'
    },
    margin: {
      small: '8px',
      medium: '16px',
      large: '24px'
    },
    spacing: 8
  },
  compact: {
    padding: {
      small: '4px',
      medium: '8px',
      large: '16px'
    },
    margin: {
      small: '4px',
      medium: '8px',
      large: '16px'
    },
    spacing: 4
  },
  spacious: {
    padding: {
      small: '12px',
      medium: '24px',
      large: '32px'
    },
    margin: {
      small: '12px',
      medium: '24px',
      large: '32px'
    },
    spacing: 12
  }
};
