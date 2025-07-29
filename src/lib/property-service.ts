import { supabase, Property } from './supabase'
import { getPropertyImageUrls } from './supabase-storage'
import { PropertyImagesService } from './property-images-service'

/**
 * Enhanced property service that integrates with Supabase Storage and property_images table
 */

/**
 * Get images from both Storage and property_images table
 * @param propertyId - Property ID
 * @returns Array of unique image URLs
 */
async function getAllPropertyImages(propertyId: string): Promise<string[]> {
  try {
    // Get images from both sources in parallel
    const [storageImages, tableImages] = await Promise.all([
      getPropertyImageUrls(propertyId),
      PropertyImagesService.getPropertyImages(propertyId)
    ])

    // Convert table images to URLs
    const tableImageUrls = tableImages
      .filter(img => img.image_url)
      .map(img => img.image_url!)

    // Combine and deduplicate
    const allImages = [...storageImages, ...tableImageUrls]
    const uniqueImages = Array.from(new Set(allImages))

    return uniqueImages
  } catch (error) {
    console.error('Error getting all property images:', error)
    return []
  }
}

/**
 * Fetch a single property with images from Storage
 * @param id - Property ID
 * @returns Property with populated image URLs from Storage
 */
export async function getPropertyWithImages(id: string): Promise<Property | null> {
  if (!supabase) {
    return null
  }

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

    // Fetch images from all sources
    const allImages = await getAllPropertyImages(property.id)
    
    // Populate images array with all available URLs
    const propertyWithImages: Property = {
      ...property,
      images: allImages.length > 0 ? allImages : property.images || []
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
  query?: string
  sort?: string
} = {}): Promise<{ properties: Property[]; total: number }> {
  if (!supabase) {
    return { properties: [], total: 0 }
  }

  try {
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })

    // Apply filters
    // Text search across multiple fields
    if (options.query) {
      query = query.or(`title.ilike.%${options.query}%,description.ilike.%${options.query}%,location.ilike.%${options.query}%`)
    }

    if (options.location && options.location !== 'All Locations') {
      query = query.ilike('location', `%${options.location}%`)
    }
    
    if (options.propertyType) {
      query = query.ilike('title', `%${options.propertyType}%`)
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

    // Apply sorting
    switch (options.sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'price-low':
        query = query.order('price', { ascending: true })
        break
      case 'price-high':
        query = query.order('price', { ascending: false })
        break
      case 'bedrooms':
        query = query.order('bedrooms', { ascending: false })
        break
      default: // 'newest'
        query = query.order('created_at', { ascending: false })
    }

    if (options.offset && options.limit) {
      query = query.range(options.offset, options.offset + options.limit - 1)
    } else if (options.limit) {
      query = query.limit(options.limit)
    }

    const { data: properties, error, count } = await query

    if (error) {
      console.error('Error fetching properties:', error)
      return { properties: [], total: 0 }
    }

    if (!properties || properties.length === 0) {
      return { properties: [], total: count || 0 }
    }

    // Fetch images for all properties in parallel
    const propertiesWithImages = await Promise.all(
      properties.map(async (property) => {
        const allImages = await getAllPropertyImages(property.id)
        return {
          ...property,
          images: allImages.length > 0 ? allImages : property.images || []
        }
      })
    )

    return { properties: propertiesWithImages, total: count || 0 }
  } catch (error) {
    console.error('Error in getPropertiesWithImages:', error)
    return { properties: [], total: 0 }
  }
}

/**
 * Get featured properties with images
 * @param limit - Number of featured properties to fetch
 * @returns Array of featured properties with images
 */
export async function getFeaturedPropertiesWithImages(limit: number = 6): Promise<Property[]> {
  const result = await getPropertiesWithImages({ featured: true, limit })
  return result.properties
}

/**
 * Search properties by title/description with images
 * @param searchTerm - Search term
 * @param limit - Number of results to return
 * @returns Array of matching properties with images
 */
export async function searchPropertiesWithImages(searchTerm: string, limit: number = 20): Promise<Property[]> {
  const result = await getPropertiesWithImages({ query: searchTerm, limit })
  return result.properties
}

/**
 * Get property by slug with images
 * @param slug - Property slug
 * @returns Property with images or null
 */
export async function getPropertyBySlugWithImages(slug: string): Promise<Property | null> {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

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

    // Fetch images from all sources
    const allImages = await getAllPropertyImages(property.id)
    
    return {
      ...property,
      images: allImages.length > 0 ? allImages : property.images || []
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
  if (!supabase) {
    console.error('Supabase client not initialized')
    return []
  }

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
        const allImages = await getAllPropertyImages(property.id)
        return {
          ...property,
          images: allImages.length > 0 ? allImages : property.images || []
        }
      })
    )

    return propertiesWithImages
  } catch (error) {
    console.error('Error in getRelatedPropertiesWithImages:', error)
    return []
  }
}
