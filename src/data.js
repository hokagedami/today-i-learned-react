
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://gvpsnngnkglgpmykmvrn.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLIC_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;