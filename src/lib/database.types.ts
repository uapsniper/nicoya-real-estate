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
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
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