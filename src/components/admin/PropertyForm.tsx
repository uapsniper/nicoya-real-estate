'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import { Property } from '@/lib/supabase'
import { PlusIcon, XMarkIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { uploadMultiplePropertyImages, deletePropertyImage, validateImageFile } from '@/lib/image-upload'
import { PropertyImagesService } from '@/lib/property-images-service'

interface PropertyFormProps {
  property?: Property
  isEditing?: boolean
}

export default function PropertyForm({ property, isEditing = false }: PropertyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const [formData, setFormData] = useState({
    title: property?.title || '',
    price: property?.price?.toString() || '',
    location: property?.location || '',
    lot_size: property?.lot_size?.toString() || '',
    construction_size: property?.construction_size?.toString() || '',
    bedrooms: property?.bedrooms?.toString() || '0',
    bathrooms: property?.bathrooms?.toString() || '0',
    description: property?.description || '',
    featured: property?.featured || false,
    amenities: property?.amenities || [],
    images: property?.images || []
  })

  const [newAmenity, setNewAmenity] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')

  const locations = [
    'Cabuya, Peninsula de Nicoya, Costa Rica',
    'Montezuma, Peninsula de Nicoya, Costa Rica',
    'Mal País, Peninsula de Nicoya, Costa Rica',
    'Santa Teresa, Peninsula de Nicoya, Costa Rica'
  ]

  const commonAmenities = [
    'Ocean View', 'Pool', 'Garden Views', 'Near Beach', 'Investment Opportunity',
    'Nature Reserve Access', 'Colonial Architecture', 'Development Potential',
    'Near Waterfalls', 'Town Center Location', 'Pacific Views', 'Private Pool',
    'Luxury Finishes', 'Surf Access', 'Contemporary Design', 'Infinity Pool',
    'Beachfront', 'Sunset Views', 'Direct Beach Access', 'Hardwood Finishes',
    'Open Plan', 'Eco-Friendly', 'Solar Power', 'Rainwater Collection',
    'Organic Gardens', 'Wildlife Viewing', 'Sustainable Living', 'Panoramic Views',
    'Natural Spring', 'Fruit Trees', 'Multiple Terraces', '360-degree Views', 'Privacy'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }))
      setNewAmenity('')
    }
  }

  const removeAmenity = (amenityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }))
  }

  const addCommonAmenity = (amenity: string) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate files
    const validFiles = files.filter(file => {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        console.error(`Invalid file ${file.name}: ${validation.error}`)
        return false
      }
      return true
    })

    setSelectedFiles(validFiles)
  }

  const uploadImages = async (propertyId: string) => {
    if (selectedFiles.length === 0) return []

    setUploadingImages(true)
    setUploadProgress('Uploading images...')

    try {
      const uploadResults = await uploadMultiplePropertyImages(selectedFiles, propertyId)
      
      const successfulUploads = uploadResults
        .filter(result => result.success && result.imageUrl)
        .map(result => result.imageUrl!)

      const failedUploads = uploadResults.filter(result => !result.success)
      
      if (failedUploads.length > 0) {
        console.error('Some uploads failed:', failedUploads)
      }

      setUploadProgress(`Uploaded ${successfulUploads.length} images successfully`)
      setSelectedFiles([]) // Clear selected files after upload
      
      return successfulUploads
    } catch (error) {
      console.error('Error uploading images:', error)
      setUploadProgress('Error uploading images')
      return []
    } finally {
      setUploadingImages(false)
      setTimeout(() => setUploadProgress(''), 3000)
    }
  }

  const removeImage = async (imageToRemove: string) => {
    // If it's a Supabase storage URL, delete it from storage
    if (imageToRemove.includes('supabase.co/storage')) {
      const deleteResult = await deletePropertyImage(imageToRemove)
      if (!deleteResult.success) {
        console.error('Failed to delete image from storage:', deleteResult.error)
      }
    }

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      console.log('Starting property submission...')
      
      // Wrap the entire operation in a timeout to prevent infinite hanging
      await Promise.race([
        performPropertySubmission(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Property submission timed out after 30 seconds')), 30000)
        )
      ])

    } catch (error) {
      console.error('Error saving property:', error)
      setSubmitStatus('error')
      // Show a more specific error message
      if (error instanceof Error) {
        console.error('Error details:', error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const performPropertySubmission = async () => {
      
      if (!supabase) {
        throw new Error('Database connection not available')
      }

      console.log('Database client available:', !!supabase)
      
      // Check authentication status
      if (supabase) {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log('Authentication status:', {
          user: user ? { id: user.id, email: user.email } : null,
          error: authError
        })
        
        if (!user) {
          throw new Error('User is not authenticated. Please log in again.')
        }
      }

      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Property title is required')
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error('Valid price is required')
      }
      if (!formData.location.trim()) {
        throw new Error('Location is required')
      }
      if (!formData.lot_size || parseInt(formData.lot_size) <= 0) {
        throw new Error('Valid lot size is required')
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required')
      }

      const slug = generateSlug(formData.title)
      let propertyId = property?.id
      let uploadedImageUrls: string[] = []

      console.log('Generated slug:', slug)

      // First, create or update the property to get an ID
      const propertyData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        location: formData.location.trim(),
        lot_size: parseInt(formData.lot_size),
        construction_size: formData.construction_size ? parseInt(formData.construction_size) : null,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        description: formData.description.trim(),
        featured: formData.featured,
        amenities: formData.amenities,
        images: formData.images, // Will be updated with new images
        slug: slug,
        updated_at: new Date().toISOString()
      }

      // Log data validation
      console.log('Validating property data...')
      console.log('- Title length:', formData.title.length)
      console.log('- Description length:', formData.description.length)
      console.log('- Amenities count:', formData.amenities.length)
      console.log('- Images count:', formData.images.length)

      console.log('Property data to submit:', propertyData)

      if (isEditing && property) {
        console.log('Updating existing property:', property.id)
        console.log('Property data size:', JSON.stringify(propertyData).length, 'bytes')
        
        // Add timeout specifically for the update operation
        const updateResult = await Promise.race([
          supabase
            .from('properties')
            .update(propertyData)
            .eq('id', property.id),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Property update query timed out after 15 seconds')), 15000)
          )
        ])
        
        console.log('Update operation completed')
        
        if (updateResult.error) {
          console.error('Update error:', updateResult.error)
          throw new Error(`Failed to update property: ${updateResult.error.message}`)
        }
        
        propertyId = property.id
        console.log('Property updated successfully, ID:', property.id)
      } else {
        console.log('Creating new property...')
        // Create new property
        const { data: newProperty, error: insertError } = await supabase
          .from('properties')
          .insert([propertyData])
          .select('id')
          .single()
        
        if (insertError) {
          console.error('Insert error:', insertError)
          throw insertError
        }
        propertyId = newProperty.id
        console.log('New property created with ID:', propertyId)
      }

      // Upload new images if any are selected
      if (selectedFiles.length > 0 && propertyId) {
        console.log(`Uploading ${selectedFiles.length} images...`)
        uploadedImageUrls = await uploadImages(propertyId)
        console.log('Images uploaded:', uploadedImageUrls)
        
        // Update the property with the new image URLs
        const allImages = [...formData.images, ...uploadedImageUrls]
        const { error: imageUpdateError } = await supabase
          .from('properties')
          .update({ images: allImages })
          .eq('id', propertyId)
        
        if (imageUpdateError) {
          console.error('Error updating images:', imageUpdateError)
          // Don't throw here, just log the error
        } else {
          console.log('Property images updated successfully')
        }

        // Also add to property_images table for API consistency
        if (uploadedImageUrls.length > 0) {
          console.log('Adding images to property_images table...')
          try {
            const imageServiceResult = await Promise.race([
              PropertyImagesService.addPropertyImages(
                propertyId, 
                uploadedImageUrls, 
                false // Don't update property record since we already did it above
              ),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Image service timeout')), 10000)
              )
            ]) as { success: boolean; error?: string }
            
            if (!imageServiceResult.success) {
              console.error('Error adding to property_images table:', imageServiceResult.error)
              // Don't throw, just log - this is not critical for the main update
            } else {
              console.log('Property images records created successfully')
            }
          } catch (error) {
            console.error('Image service operation timed out or failed:', error)
            // Continue anyway - this is not critical for the main property update
          }
        }
      }

      console.log('Property submission completed successfully')
      setSubmitStatus('success')
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/admin/properties')
      }, 1500)
  }

  return (
    <div className="p-6">
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-medium">
              Property {isEditing ? 'updated' : 'created'} successfully!
            </p>
          </div>
          <p className="text-green-700 text-sm mt-1">Redirecting to properties list...</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium">Error saving property</p>
          </div>
          <p className="text-red-700 text-sm mt-1">Please check all fields and try again.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600 text-gray-900"
                placeholder="e.g., Charming Twin Homes in Cabuya – Walk to the Beach"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600 text-gray-900"
                placeholder="975000"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600 text-gray-900"
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="lot_size" className="block text-sm font-medium text-gray-700 mb-2">
                Lot Size (m²) *
              </label>
              <input
                type="number"
                id="lot_size"
                name="lot_size"
                value={formData.lot_size}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600 text-gray-900"
                placeholder="2998"
              />
            </div>

            <div>
              <label htmlFor="construction_size" className="block text-sm font-medium text-gray-700 mb-2">
                Construction Size (m²)
              </label>
              <input
                type="number"
                id="construction_size"
                name="construction_size"
                value={formData.construction_size}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600 text-gray-900"
                placeholder="200"
              />
            </div>

            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600 text-gray-900"
                placeholder="2"
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600 text-gray-900"
                placeholder="2"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Detailed description of the property, highlighting key features and potential..."
          />
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities & Features</h3>
          
          {/* Common Amenities */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Add Common Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {commonAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => addCommonAmenity(amenity)}
                  disabled={formData.amenities.includes(amenity)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.amenities.includes(amenity)
                      ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amenity Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Custom Amenity
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600"
                placeholder="Enter custom amenity"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Selected Amenities */}
          {formData.amenities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Amenities ({formData.amenities.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Images */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Images</h3>
          
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Select images to upload
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploadingImages}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      PNG, JPG, WebP up to 10MB each
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Files ({selectedFiles.length})
                </label>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                      <div className="flex items-center">
                        <PhotoIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      {!uploadingImages && (
                        <button
                          type="button"
                          onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Upload Progress */}
                {uploadProgress && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-md">
                    <div className="flex items-center">
                      {uploadingImages && (
                        <CloudArrowUpIcon className="h-4 w-4 text-blue-500 mr-2 animate-pulse" />
                      )}
                      <span className="text-sm text-gray-600">{uploadProgress}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Current Images */}
          {formData.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Property Images ({formData.images.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNNCAzSDE2QTE3IDE3IDAgMCAxIDIwIDNWMTZBMSAxIDAgMCAxIDIwIDIwSDRBMSAxIDAgMCAxIDMgMjBWNEExIDEgMCAwIDEgNCAzWiIgZmlsbD0iI0Y5RkFGQiIgc3Ryb2tlPSIjRDFENUREIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNOSAxMUwxMiA4TDE5IDEyTDE5IDE2SDEySDUiIGZpbGw9IiNGM0Y0RjYiLz4KICA8Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <div className="mt-1 text-xs text-gray-500 truncate">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Featured Property */}
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
              Mark as Featured Property
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Featured properties will be displayed prominently on the homepage
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Property' : 'Create Property')
            }
          </button>
        </div>
      </form>
    </div>
  )
}
