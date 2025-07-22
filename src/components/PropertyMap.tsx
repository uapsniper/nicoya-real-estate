'use client'

import { useState } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface PropertyMapProps {
  location: string
  title: string
}

export default function PropertyMap({ location, title }: PropertyMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  // Extract location parts for better geocoding
  const locationParts = location.split(',').map(part => part.trim())
  const searchQuery = encodeURIComponent(`${locationParts[0]}, Peninsula de Nicoya, Costa Rica`)

  const handleLoadMap = () => {
    setMapLoaded(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
      
      <div className="mb-4">
        <div className="flex items-center text-gray-700">
          <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
          <span className="text-lg">{location}</span>
        </div>
      </div>

      {!mapLoaded ? (
        <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">
                <MapPinIcon className="h-16 w-16 mx-auto text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Location</h3>
              <p className="text-gray-600 mb-4">
                Click to load an interactive map showing the property location
              </p>
              <button
                onClick={handleLoadMap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Load Map
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-96 rounded-lg overflow-hidden">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${searchQuery}&zoom=14`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing location of ${title}`}
            className="rounded-lg"
          />
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">About the Area</h4>
        <p className="text-blue-800 text-sm">
          {locationParts[0]} is located in the beautiful Peninsula de Nicoya, known for its pristine beaches, 
          abundant wildlife, and laid-back atmosphere. The area offers easy access to national parks, 
          world-class surfing, and sustainable eco-tourism opportunities.
        </p>
      </div>

      <div className="mt-4 text-center">
        <a
          href={`https://www.google.com/maps/search/${searchQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <MapPinIcon className="h-4 w-4 mr-1" />
          View in Google Maps
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}
