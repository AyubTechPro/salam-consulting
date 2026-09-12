import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Initialize the Supabase client
// We use the service_role key server-side (if available) to bypass RLS for inserting leads safely
export const supabase = createClient(supabaseUrl, supabaseKey);
