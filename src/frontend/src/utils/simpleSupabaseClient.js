import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDkxODgsImV4cCI6MjA2MjY4NTE4OH0.l1B9Ew14YyQri9EGsOZd7MJ4XVA7YbgmuNX-w_b0NKc';

console.log('[simpleSupabaseClient] Initializing Supabase client with URL:', supabaseUrl);

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Add a function to get the current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[simpleSupabaseClient] Error getting session:', error.message);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('[simpleSupabaseClient] Exception getting session:', error);
    return null;
  }
};

export default supabase;
