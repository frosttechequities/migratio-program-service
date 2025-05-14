import { createClient } from '@supabase/supabase-js';
import { getTokenFromLocalStorage } from './authUtils';

// Supabase URL and anon key from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDkxODgsImV4cCI6MjA2MjY4NTE4OH0.l1B9Ew14YyQri9EGsOZd7MJ4XVA7YbgmuNX-w_b0NKc';

// Create a single supabase client for interacting with your database
// Use a singleton pattern to ensure only one instance is created
let supabaseInstance = null;

const getSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'sb-qyvvrvthalxeibsmckep-auth-token',
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });

  return supabaseInstance;
};

const supabase = getSupabaseClient();

// Add a function to get the current session
export const getSupabaseSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[supabaseClient] Error getting session:', error.message);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('[supabaseClient] Exception getting session:', error);
    return null;
  }
};

// Function to refresh the token
export const refreshToken = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('[supabaseClient] Error refreshing token:', error.message);
      return null;
    }

    if (data.session) {
      // Update token in localStorage
      localStorage.setItem('token', data.session.access_token);
      return data.session.access_token;
    }

    return null;
  } catch (error) {
    console.error('[supabaseClient] Error refreshing token:', error.message);
    return null;
  }
};

// Add a function to get an authenticated client
export const getAuthenticatedClient = async () => {
  try {
    let token = getTokenFromLocalStorage();

    // If no token found or token is expired, try to refresh
    if (!token) {
      token = await refreshToken();
      if (!token) {
        return supabase; // Return default client if refresh failed
      }
    }

    // Use the singleton instance but add the auth header
    const client = getSupabaseClient();

    // Set the auth header for this request
    // Use global headers instead of setAuth which is deprecated
    client.supabaseUrl = supabaseUrl;
    client.supabaseKey = supabaseAnonKey;
    client.headers = {
      ...client.headers,
      'Authorization': `Bearer ${token}`
    };

    return client;
  } catch (error) {
    console.error('[supabaseClient] Error getting authenticated client:', error);
    return supabase;
  }
};

export { getSupabaseClient };
export default supabase;
