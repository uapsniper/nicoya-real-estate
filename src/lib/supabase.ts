import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Create client only if environment variables are available
let supabase: ReturnType<typeof createClient<Database>> | null = null

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export { supabase }

// Types for our database
export type Property = Database['public']['Tables']['properties']['Row']
export type ContactInquiry = Database['public']['Tables']['contact_inquiries']['Row']
