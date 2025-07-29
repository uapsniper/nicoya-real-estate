import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

// Types for our database
export interface Property {
  id: string
  title: string
  price: number
  location: string
  lot_size: number
  construction_size?: number
  bedrooms: number
  bathrooms: number
  description: string
  amenities: string[]
  images: string[]
  slug: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ContactInquiry {
  id: string
  property_id?: string
  name: string
  email: string
  message: string
  created_at: string
}
