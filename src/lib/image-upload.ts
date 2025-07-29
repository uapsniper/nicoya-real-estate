import { supabase } from './supabase'

export interface ImageUploadResult {
  success: boolean
  imageUrl?: string
  error?: string
}

/**
 * Uploads an image file to Supabase storage
 * @param file - The image file to upload
 * @param propertyId - The property ID to create a folder for
 * @param fileName - Optional custom file name (will use file.name if not provided)
 * @returns Promise with upload result
 */
export async function uploadPropertyImage(
  file: File,
  propertyId: string,
  fileName?: string
): Promise<ImageUploadResult> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase client not initialized'
    }
  }

  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      }
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 10MB'
      }
    }

    // Generate unique filename if not provided
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const uploadFileName = fileName || `${timestamp}.${fileExtension}`
    
    // Create the file path: property-id/filename
    const filePath = `${propertyId}/${uploadFileName}`

    // Upload the file
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path)

    return {
      success: true,
      imageUrl: urlData.publicUrl
    }

  } catch (error) {
    console.error('Image upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Uploads multiple images for a property
 * @param files - Array of image files to upload
 * @param propertyId - The property ID to create a folder for
 * @returns Promise with array of upload results
 */
export async function uploadMultiplePropertyImages(
  files: File[],
  propertyId: string
): Promise<ImageUploadResult[]> {
  const uploadPromises = files.map((file, index) => 
    uploadPropertyImage(file, propertyId, `image-${index + 1}-${Date.now()}.${file.name.split('.').pop()}`)
  )

  return Promise.all(uploadPromises)
}

/**
 * Deletes an image from Supabase storage
 * @param imageUrl - The full URL of the image to delete
 * @returns Promise with deletion result
 */
export async function deletePropertyImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase client not initialized'
    }
  }

  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/property-images/')
    if (urlParts.length !== 2) {
      return {
        success: false,
        error: 'Invalid image URL format'
      }
    }

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('property-images')
      .remove([filePath])

    if (error) {
      console.error('Storage delete error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return { success: true }

  } catch (error) {
    console.error('Image delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Validates if a file is a valid image
 * @param file - The file to validate
 * @returns Object with validation result
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'File must be an image'
    }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB'
    }
  }

  // Check for supported formats
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!supportedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Supported formats: JPEG, PNG, WebP, GIF'
    }
  }

  return { isValid: true }
}