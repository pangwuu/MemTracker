/**
 * Connects to supabase.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJ_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_API_KEY
// Safety check to debug if variables are missing
if (!supabaseUrl || !supabasePublishableKey) {
  console.error('Supabase keys are missing! Check your .env file.')
}
export const supabase = createClient(supabaseUrl, supabasePublishableKey)