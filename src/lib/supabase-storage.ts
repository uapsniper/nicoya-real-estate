import { supabase } from './supabase'

// Supabase Storage configuration
export const STORAGE_BUCKET = 'property-images'

/**
 * Get public URL for a property image
 * @param propertyId - The unique ID of the property
 * @param imageName - The name of the image file
 * @returns Public URL for the image
 */
export function getPropertyImageUrl(propertyId: string, imageName: string): string {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(`${propertyId}/${imageName}`)
  
  return data.publicUrl
}

/**
 * List all images for a property
 * @param propertyId - The unique ID of the property
 * @returns Array of image file names
 */
export async function listPropertyImages(propertyId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(propertyId, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('Error listing property images:', error)
      return []
    }

    // Filter out folders and return only image files
    return data
      ?.filter(file => file.name && isImageFile(file.name))
      ?.map(file => file.name) || []
  } catch (error) {
    console.error('Error in listPropertyImages:', error)
    return []
  }
}

/**
 * Get all image URLs for a property
 * @param propertyId - The unique ID of the property
 * @returns Array of public URLs for all property images
 */
export async function getPropertyImageUrls(propertyId: string): Promise<string[]> {
  const imageNames = await listPropertyImages(propertyId)
  return imageNames.map(imageName => getPropertyImageUrl(propertyId, imageName))
}

/**
 * Upload an image to a property's folder
 * @param propertyId - The unique ID of the property
 * @param file - The image file to upload
 * @param fileName - Optional custom file name
 * @returns Upload result with public URL
 */
export async function uploadPropertyImage(
  propertyId: string, 
  file: File, 
  fileName?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const finalFileName = fileName || `${Date.now()}-${file.name}`
    const filePath = `${propertyId}/${finalFileName}`

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      return { success: false, error: error.message }
    }

    const publicUrl = getPropertyImageUrl(propertyId, finalFileName)
    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Error in uploadPropertyImage:', error)
    return { success: false, error: 'Upload failed' }
  }
}

/**
 * Delete an image from a property's folder
 * @param propertyId - The unique ID of the property
 * @param imageName - The name of the image file to delete
 * @returns Deletion result
 */
export async function deletePropertyImage(
  propertyId: string, 
  imageName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = `${propertyId}/${imageName}`

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deletePropertyImage:', error)
    return { success: false, error: 'Delete failed' }
  }
}

/**
 * Delete all images for a property (when property is deleted)
 * @param propertyId - The unique ID of the property
 * @returns Deletion result
 */
export async function deleteAllPropertyImages(propertyId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const imageNames = await listPropertyImages(propertyId)
    
    if (imageNames.length === 0) {
      return { success: true }
    }

    const filePaths = imageNames.map(name => `${propertyId}/${name}`)

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(filePaths)

    if (error) {
      console.error('Error deleting all property images:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteAllPropertyImages:', error)
    return { success: false, error: 'Delete failed' }
  }
}

/**
 * Check if a file is an image based on its extension
 * @param fileName - The name of the file
 * @returns True if the file is an image
 */
function isImageFile(fileName: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
  return imageExtensions.includes(extension)
}

/**
 * Generate a thumbnail URL for an image (if Supabase supports image transformations)
 * @param propertyId - The unique ID of the property
 * @param imageName - The name of the image file
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 * @returns Thumbnail URL
 */
export function getPropertyImageThumbnail(
  propertyId: string, 
  imageName: string, 
  width: number = 400, 
  height: number = 300
): string {
  // For now, return the regular image URL
  // In the future, you can implement image transformations if Supabase supports them
  return getPropertyImageUrl(propertyId, imageName)
}
