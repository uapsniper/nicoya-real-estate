import { supabase, Property } from './supabase'
import { getPropertyImageUrls } from './supabase-storage'

/**
 * Enhanced property service that integrates with Supabase Storage
 */

/**
 * Fetch a single property with images from Storage
 * @param id - Property ID
 * @returns Property with populated image URLs from Storage
 */
export async function getPropertyWithImages(id: string): Promise<Property | null> {
  try {
    // Fetch property from database
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !property) {
      console.error('Error fetching property:', error)
      return null
    }

    // Fetch images from Storage
    const storageImages = await getPropertyImageUrls(property.id)
    
    // Populate images array with Storage URLs
    const propertyWithImages: Property = {
      ...property,
      images: storageImages.length > 0 ? storageImages : property.images || []
    }

    return propertyWithImages
  } catch (error) {
    console.error('Error in getPropertyWithImages:', error)
    return null
  }
}

/**
 * Fetch multiple properties with images from Storage
 * @param options - Query options
 * @returns Array of properties with populated image URLs
 */
export async function getPropertiesWithImages(options: {
  limit?: number
  offset?: number
  location?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  propertyType?: string
  featured?: boolean
} = {}): Promise<Property[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (options.location && options.location !== 'All Locations') {
      query = query.ilike('location', `%${options.location}%`)
    }
    
    if (options.minPrice) {
      query = query.gte('price', options.minPrice)
    }
    
    if (options.maxPrice) {
      query = query.lte('price', options.maxPrice)
    }
    
    if (options.bedrooms) {
      query = query.gte('bedrooms', options.bedrooms)
    }
    
    if (options.featured !== undefined) {
      query = query.eq('featured', options.featured)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data: properties, error } = await query

    if (error) {
      console.error('Error fetching properties:', error)
      return []
    }

    if (!properties || properties.length === 0) {
      return []
    }

    // Fetch images for all properties in parallel
    const propertiesWithImages = await Promise.all(
      properties.map(async (property) => {
        const storageImages = await getPropertyImageUrls(property.id)
        return {
          ...property,
          images: storageImages.length > 0 ? storageImages : property.images || []
        }
      })
    )

    return propertiesWithImages
  } catch (error) {
    console.error('Error in getPropertiesWithImages:', error)
    return []
  }
}

/**
 * Get featured properties with images
 * @param limit - Number of featured properties to fetch
 * @returns Array of featured properties with images
 */
export async function getFeaturedPropertiesWithImages(limit: number = 6): Promise<Property[]> {
  return getPropertiesWithImages({ featured: true, limit })
}

/**
 * Search properties by title/description with images
 * @param searchTerm - Search term
 * @param limit - Number of results to return
 * @returns Array of matching properties with images
 */
export async function searchPropertiesWithImages(searchTerm: string, limit: number = 20): Promise<Property[]> {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching properties:', error)
      return []
    }

    if (!properties || properties.length === 0) {
      return []
    }

    // Fetch images for all properties in parallel
    const propertiesWithImages = await Promise.all(
      properties.map(async (property) => {
        const storageImages = await getPropertyImageUrls(property.id)
        return {
          ...property,
          images: storageImages.length > 0 ? storageImages : property.images || []
        }
      })
    )

    return propertiesWithImages
  } catch (error) {
    console.error('Error in searchPropertiesWithImages:', error)
    return []
  }
}

/**
 * Get property by slug with images
 * @param slug - Property slug
 * @returns Property with images or null
 */
export async function getPropertyBySlugWithImages(slug: string): Promise<Property | null> {
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !property) {
      console.error('Error fetching property by slug:', error)
      return null
    }

    // Fetch images from Storage
    const storageImages = await getPropertyImageUrls(property.id)
    
    return {
      ...property,
      images: storageImages.length > 0 ? storageImages : property.images || []
    }
  } catch (error) {
    console.error('Error in getPropertyBySlugWithImages:', error)
    return null
  }
}

/**
 * Get related properties (same location) with images
 * @param currentPropertyId - ID of current property to exclude
 * @param location - Location to match
 * @param limit - Number of related properties to return
 * @returns Array of related properties with images
 */
export async function getRelatedPropertiesWithImages(
  currentPropertyId: string, 
  location: string, 
  limit: number = 4
): Promise<Property[]> {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .ilike('location', `%${location}%`)
      .neq('id', currentPropertyId)
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching related properties:', error)
      return []
    }

    if (!properties || properties.length === 0) {
      return []
    }

    // Fetch images for all properties in parallel
    const propertiesWithImages = await Promise.all(
      properties.map(async (property) => {
        const storageImages = await getPropertyImageUrls(property.id)
        return {
          ...property,
          images: storageImages.length > 0 ? storageImages : property.images || []
        }
      })
    )

    return propertiesWithImages
  } catch (error) {
    console.error('Error in getRelatedPropertiesWithImages:', error)
    return []
  }
}
