/**
 * Supabase Client
 *
 * This file provides a Supabase client for interacting with the Supabase backend.
 */

import { createClient } from '@supabase/supabase-js';

console.log('[supabaseClient] Initializing Supabase client');

// Supabase URL and anon key from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NzU5ODgsImV4cCI6MjAzMTE1MTk4OH0.Wd0jXKYQQgwIwP0SvCblOmjVBCKzKIxHMrGOq5xUYHE';

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
        'Accept': 'application/json',
        'Prefer': 'return=representation',
      },
    },
  });

  return supabaseInstance;
};

const supabase = getSupabaseClient();

// Add a function to get the current session
export const getSupabaseSession = async () => {
  try {
    console.log('[supabaseClient] Getting session');
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
    console.log('[supabaseClient] Refreshing token');
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
    console.log('[supabaseClient] Getting authenticated client');

    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('[supabaseClient] No token found in localStorage, trying to refresh');
      const refreshedToken = await refreshToken();
      if (!refreshedToken) {
        console.log('[supabaseClient] Token refresh failed, returning default client');
        return supabase;
      }
    } else {
      console.log('[supabaseClient] Token found in localStorage');
    }

    return supabase;
  } catch (error) {
    console.error('[supabaseClient] Error getting authenticated client:', error);
    return supabase;
  }
};

export { getSupabaseClient };
export default supabase;
