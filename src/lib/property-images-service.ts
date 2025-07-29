import { supabase } from './supabase'
import { Database } from './database.types'

type PropertyImage = Database['public']['Tables']['property_images']['Row']
type PropertyImageInsert = Database['public']['Tables']['property_images']['Insert']

/**
 * Service to handle property images synchronization between 
 * the properties.images array and the property_images table
 */
export class PropertyImagesService {
  
  /**
   * Get all images for a property from the property_images table
   */
  static async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    if (!supabase) return []

    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching property images:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getPropertyImages:', error)
      return []
    }
  }

  /**
   * Add images to the property_images table and update the properties.images array
   */
  static async addPropertyImages(
    propertyId: string, 
    imageUrls: string[],
    updatePropertyRecord = true
  ): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    try {
      // Insert into property_images table
      const imageRecords: PropertyImageInsert[] = imageUrls.map(url => ({
        property_id: propertyId,
        image_url: url,
        is_primary: false
      }))

      const { error: insertError } = await supabase
        .from('property_images')
        .insert(imageRecords)

      if (insertError) {
        console.error('Error inserting property images:', insertError)
        return { success: false, error: insertError.message }
      }

      // Update properties.images array if requested
      if (updatePropertyRecord) {
        const result = await this.syncPropertyImagesArray(propertyId)
        if (!result.success) {
          return result
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in addPropertyImages:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Remove images from both property_images table and properties.images array
   */
  static async removePropertyImages(
    propertyId: string,
    imageUrls: string[],
    updatePropertyRecord = true
  ): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    try {
      // Remove from property_images table
      const { error: deleteError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId)
        .in('image_url', imageUrls)

      if (deleteError) {
        console.error('Error deleting property images:', deleteError)
        return { success: false, error: deleteError.message }
      }

      // Update properties.images array if requested
      if (updatePropertyRecord) {
        const result = await this.syncPropertyImagesArray(propertyId)
        if (!result.success) {
          return result
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in removePropertyImages:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Synchronize the properties.images array with the property_images table
   * This ensures both sources are consistent
   */
  static async syncPropertyImagesArray(propertyId: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    try {
      // Get all images from property_images table
      const images = await this.getPropertyImages(propertyId)
      const imageUrls = images
        .filter(img => img.image_url)
        .map(img => img.image_url!)

      // Update the properties.images array
      const { error: updateError } = await supabase
        .from('properties')
        .update({ 
          images: imageUrls,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)

      if (updateError) {
        console.error('Error updating property images array:', updateError)
        return { success: false, error: updateError.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in syncPropertyImagesArray:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Sync all properties - migrate images array to property_images table
   * This is useful for one-time migration or maintenance
   */
  static async migratePropertiesToImageTable(): Promise<{ success: boolean; processed: number; errors: string[] }> {
    if (!supabase) {
      return { success: false, processed: 0, errors: ['Supabase client not available'] }
    }

    try {
      // Get all properties with images
      const { data: properties, error: fetchError } = await supabase
        .from('properties')
        .select('id, images')
        .not('images', 'is', null)

      if (fetchError) {
        return { success: false, processed: 0, errors: [fetchError.message] }
      }

      if (!properties || properties.length === 0) {
        return { success: true, processed: 0, errors: [] }
      }

      const errors: string[] = []
      let processed = 0

      for (const property of properties) {
        if (property.images && property.images.length > 0) {
          // Check if images already exist in property_images table
          const existingImages = await this.getPropertyImages(property.id)
          const existingUrls = existingImages.map(img => img.image_url)
          
          // Only add images that don't already exist
          const newImages = property.images.filter(url => !existingUrls.includes(url))
          
          if (newImages.length > 0) {
            const result = await this.addPropertyImages(property.id, newImages, false)
            if (!result.success) {
              errors.push(`Property ${property.id}: ${result.error}`)
            } else {
              processed++
            }
          }
        }
      }

      return { 
        success: errors.length === 0, 
        processed, 
        errors 
      }
    } catch (error) {
      console.error('Error in migratePropertiesToImageTable:', error)
      return { 
        success: false, 
        processed: 0, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      }
    }
  }

  /**
   * Set primary image for a property
   */
  static async setPrimaryImage(propertyId: string, imageUrl: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    try {
      // First, unset all primary images for this property
      await supabase
        .from('property_images')
        .update({ is_primary: false })
        .eq('property_id', propertyId)

      // Set the specified image as primary
      const { error: updateError } = await supabase
        .from('property_images')
        .update({ is_primary: true })
        .eq('property_id', propertyId)
        .eq('image_url', imageUrl)

      if (updateError) {
        console.error('Error setting primary image:', updateError)
        return { success: false, error: updateError.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in setPrimaryImage:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get the primary image for a property
   */
  static async getPrimaryImage(propertyId: string): Promise<PropertyImage | null> {
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .eq('is_primary', true)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error fetching primary image:', error)
        return null
      }

      return data || null
    } catch (error) {
      console.error('Error in getPrimaryImage:', error)
      return null
    }
  }
}