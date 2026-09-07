import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Hardcode your actual URL and Key here as strings (wrapped in quotes)
const supabaseUrl = 'https://lbcwocvyelxaaanhijdp.supabase.co';
const supabaseKey = 'sb_publishable_Pv8ZdgGhbvoE_URVL-jH7w_RX8iovGN';

export const supabase = createClient(supabaseUrl, supabaseKey);