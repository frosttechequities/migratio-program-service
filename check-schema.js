/**
 * Script to check the schema of the documents table in Supabase
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    // Get the schema of the documents table
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error getting schema:', error);
      return;
    }
    
    console.log('Schema of documents table:');
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log('No data found in documents table');
      
      // Try to get the table definition
      const { data: tableData, error: tableError } = await supabase
        .rpc('get_table_definition', { table_name: 'documents' });
      
      if (tableError) {
        console.error('Error getting table definition:', tableError);
      } else {
        console.log('Table definition:', tableData);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
checkSchema();
