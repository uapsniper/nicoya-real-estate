import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
