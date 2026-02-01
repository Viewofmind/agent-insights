import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtvdltvdetdmhqtvmghl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dmRsdHZkZXRkbWhxdHZtZ2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjEwNTksImV4cCI6MjA4NTUzNzA1OX0.q-aKXyqpLPnW0DpzkTsGwbrwwBLj7sPmQYH58peuwPg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);