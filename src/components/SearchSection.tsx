'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, MapPinIcon, HomeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

export default function SearchSection() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  })

  const locations = [
    'All Locations',
    'Cabuya',
    'Montezuma', 
    'Mal País',
    'Santa Teresa'
  ]

  const propertyTypes = [
    'All Types',
    'House',
    'Villa',
    'Lot',
    'Bungalow',
    'Estate'
  ]

  const bedroomOptions = [
    'Any',
    '1+',
    '2+',
    '3+',
    '4+'
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (searchParams.location && searchParams.location !== 'All Locations') {
      params.set('location', searchParams.location)
    }
    if (searchParams.propertyType && searchParams.propertyType !== 'All Types') {
      params.set('type', searchParams.propertyType.toLowerCase())
    }
    if (searchParams.minPrice) {
      params.set('minPrice', searchParams.minPrice)
    }
    if (searchParams.maxPrice) {
      params.set('maxPrice', searchParams.maxPrice)
    }
    if (searchParams.bedrooms && searchParams.bedrooms !== 'Any') {
      params.set('bedrooms', searchParams.bedrooms.replace('+', ''))
    }

    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Property
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search through our exclusive collection of properties in Costa Rica's most beautiful coastal region
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Location and Property Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPinIcon className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <select
                  id="location"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                  <HomeIcon className="inline h-4 w-4 mr-1" />
                  Property Type
                </label>
                <select
                  id="propertyType"
                  value={searchParams.propertyType}
                  onChange={(e) => setSearchParams({...searchParams, propertyType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Range Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                  Min Price (USD)
                </label>
                <input
                  type="number"
                  id="minPrice"
                  placeholder="100,000"
                  value={searchParams.minPrice}
                  onChange={(e) => setSearchParams({...searchParams, minPrice: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                  Max Price (USD)
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="2,000,000"
                  value={searchParams.maxPrice}
                  onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  <HomeIcon className="inline h-4 w-4 mr-1" />
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  value={searchParams.bedrooms}
                  onChange={(e) => setSearchParams({...searchParams, bedrooms: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {bedroomOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center shadow-lg"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Search Properties
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
