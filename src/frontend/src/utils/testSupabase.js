// Test file to verify Supabase import
import { createClient } from '@supabase/supabase-js';

console.log('Supabase import successful');

// Create a test client
const testClient = createClient(
  'https://qyvvrvthalxeibsmckep.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDkxODgsImV4cCI6MjA2MjY4NTE4OH0.l1B9Ew14YyQri9EGsOZd7MJ4XVA7YbgmuNX-w_b0NKc'
);

console.log('Test client created:', testClient);

export default testClient;
