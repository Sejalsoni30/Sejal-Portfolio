import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase Project Credentials (configured from .env)
const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || 
                    (typeof window !== 'undefined' && window.__ENV__?.NEXT_PUBLIC_SUPABASE_URL) || 
                    'https://untczzvaspqagjkbxcwj.supabase.co';

const supabaseKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || 
                    (typeof window !== 'undefined' && window.__ENV__?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || 
                    'sb_publishable_Ui1j3Lssm82RhvysCCD20w_rXAUiR0q';

export const supabase = createClient(supabaseUrl, supabaseKey);
