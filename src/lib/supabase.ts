import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUP_URL;
const supabaseKey = process.env.SUP_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;