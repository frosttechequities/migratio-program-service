import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDkxODgsImV4cCI6MjA2MjY4NTE4OH0.l1B9Ew14YyQri9EGsOZd7MJ4XVA7YbgmuNX-w_b0NKc';

// Only log in development environment
if (process.env.NODE_ENV === 'development') {
  console.log('[supabaseClient] Initializing Supabase client');
}

// Create a single supabase client for interacting with your database
// Use a singleton pattern to ensure only one instance is created
let supabaseInstance = null;

const getSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Create the Supabase client with proper configuration
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
        'Accept': '*/*',  // Accept any content type
        'Prefer': 'return=representation',
      },
    },
    // Set debug to true in development to help troubleshoot issues
    debug: process.env.NODE_ENV === 'development',
  });

  // Log when the client is initialized (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('[supabaseClient] Supabase client initialized');
  }

  return supabaseInstance;
};

// Initialize the Supabase client
const supabase = getSupabaseClient();

/**
 * Get the current Supabase session
 * @returns {Promise<Object|null>} The current session or null if no session exists
 */
export const getSupabaseSession = async () => {
  try {
    // Get the session directly from Supabase
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[supabaseClient] Error getting session:', error.message);
      }
      return null;
    }

    if (!data.session) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[supabaseClient] No active session found');
      }
      return null;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[supabaseClient] Active session found');
    }
    return data.session;
  } catch (error) {
    console.error('[supabaseClient] Exception getting session:', error);
    return null;
  }
};

/**
 * Refresh the current Supabase session
 * @returns {Promise<string|null>} The new access token or null if refresh failed
 */
export const refreshToken = async () => {
  try {
    // Try to refresh the session
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('[supabaseClient] Error refreshing session:', error.message);
      return null;
    }

    if (!data.session) {
      console.log('[supabaseClient] No session after refresh');
      return null;
    }

    console.log('[supabaseClient] Session refreshed successfully');
    return data.session.access_token;
  } catch (error) {
    console.error('[supabaseClient] Exception refreshing session:', error);
    return null;
  }
};



/**
 * Get an authenticated Supabase client
 * @returns {Promise<Object>} Authenticated Supabase client
 */
export const getAuthenticatedClient = async () => {
  try {
    // Check if we have an active session
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[supabaseClient] Error getting session:', error.message);
      }
      // Instead of throwing an error, return the client anyway
      // This allows the application to continue functioning even if authentication fails
      return supabase;
    }

    if (!data.session) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[supabaseClient] No active session found');
      }
      // Instead of throwing an error, return the client anyway
      // The calling code should handle the case where there's no session
      return supabase;
    }

    // Return the existing client - Supabase JS client automatically handles auth
    return supabase;
  } catch (error) {
    console.error('[supabaseClient] Error getting authenticated client:', error);
    // Instead of throwing an error, return the client anyway
    return supabase;
  }
};

export { getSupabaseClient };
export default supabase;
