import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_PROJ_URL
const supabasePublishableKey = process.env.REACT_APP_SUPABASE_API_KEY

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

console.log('Connecting to supabase complete!')