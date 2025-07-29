export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          price: number
          location: string
          lot_size: number
          construction_size: number | null
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
        Insert: {
          id?: string
          title: string
          price: number
          location: string
          lot_size: number
          construction_size?: number | null
          bedrooms: number
          bathrooms: number
          description: string
          amenities: string[]
          images: string[]
          slug: string
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          price?: number
          location?: string
          lot_size?: number
          construction_size?: number | null
          bedrooms?: number
          bathrooms?: number
          description?: string
          amenities?: string[]
          images?: string[]
          slug?: string
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_inquiries: {
        Row: {
          id: string
          property_id: string | null
          name: string
          email: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          name: string
          email: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          name?: string
          email?: string
          message?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          role: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: number
          created_at: string
          property_id: string | null
          image_url: string | null
          alt_text: string | null
          caption: string | null
          is_primary: boolean | null
        }
        Insert: {
          id?: number
          created_at?: string
          property_id?: string | null
          image_url?: string | null
          alt_text?: string | null
          caption?: string | null
          is_primary?: boolean | null
        }
        Update: {
          id?: number
          created_at?: string
          property_id?: string | null
          image_url?: string | null
          alt_text?: string | null
          caption?: string | null
          is_primary?: boolean | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}