'use client'

import { useState } from 'react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  
  // Debug logging
  console.log('PropertyGallery rendered with:', {
    title,
    imagesCount: images?.length || 0,
    images: images
  })

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  // Handle keyboard events inline
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedImage !== null) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
            onClick={() => openLightbox(index)}
            style={{ height: '200px' }}
          >
            <img
              src={image}
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              style={{ display: 'block' }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

            {/* Main Image */}
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center">
              <img
                src={images[selectedImage]}
                alt={`${title} - Image ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain"
                onLoad={() => console.log('Lightbox image loaded:', images[selectedImage])}
                onError={(e) => {
                  console.error('Lightbox image failed:', images[selectedImage])
                  const target = e.target as HTMLImageElement
                  target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
                }}
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              {selectedImage + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
