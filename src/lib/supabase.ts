import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Singleton pattern to prevent multiple GoTrueClient instances
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'nicoya-real-estate-auth',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
  }
  return supabaseInstance
}

export const supabase = getSupabaseClient()

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
