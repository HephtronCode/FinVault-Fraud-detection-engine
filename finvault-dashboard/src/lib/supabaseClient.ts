import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase credentials are not available. Please check your environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);