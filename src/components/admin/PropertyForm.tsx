'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import { Property } from '@/lib/supabase'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

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
  const [newImageUrl, setNewImageUrl] = useState('')

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

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const removeImage = (imageToRemove: string) => {
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
      const slug = generateSlug(formData.title)
      
      const propertyData = {
        title: formData.title,
        price: parseFloat(formData.price),
        location: formData.location,
        lot_size: parseInt(formData.lot_size),
        construction_size: formData.construction_size ? parseInt(formData.construction_size) : null,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        description: formData.description,
        featured: formData.featured,
        amenities: formData.amenities,
        images: formData.images,
        slug: slug,
        updated_at: new Date().toISOString()
      }

      let error

      if (isEditing && property) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('properties')
          .insert([propertyData])
        error = insertError
      }

      if (error) {
        throw error
      }

      setSubmitStatus('success')
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/admin/properties')
      }, 1500)

    } catch (error) {
      console.error('Error saving property:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {formData.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Images ({formData.images.length})
              </label>
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700 truncate flex-1 mr-4">
                      {image}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
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
