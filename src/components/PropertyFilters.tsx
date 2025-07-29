'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { FunnelIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface PropertyFiltersProps {
  searchParams: {
    query?: string
    location?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    page?: string
    sort?: string
  }
}

export default function PropertyFilters({ searchParams }: PropertyFiltersProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    query: searchParams.query || '',
    location: searchParams.location || '',
    type: searchParams.type || '',
    minPrice: searchParams.minPrice || '',
    maxPrice: searchParams.maxPrice || '',
    bedrooms: searchParams.bedrooms || '',
    sort: searchParams.sort || 'newest'
  })
  
  const [searchQuery, setSearchQuery] = useState(searchParams.query || '')

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'Cabuya', label: 'Cabuya' },
    { value: 'Montezuma', label: 'Montezuma' },
    { value: 'Mal País', label: 'Mal País' },
    { value: 'Santa Teresa', label: 'Santa Teresa' }
  ]

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'lot', label: 'Lot' },
    { value: 'bungalow', label: 'Bungalow' },
    { value: 'estate', label: 'Estate' }
  ]

  const bedroomOptions = [
    { value: '', label: 'Any Bedrooms' },
    { value: '1', label: '1+ Bedrooms' },
    { value: '2', label: '2+ Bedrooms' },
    { value: '3', label: '3+ Bedrooms' },
    { value: '4', label: '4+ Bedrooms' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'bedrooms', label: 'Most Bedrooms' }
  ]

  // Debounced search function
  const debouncedSearch = useCallback(
    () => debounce((query: string) => {
      const newFilters = { ...filters, query }
      setFilters(newFilters)
      
      const params = new URLSearchParams(currentSearchParams)
      if (query.trim()) {
        params.set('query', query.trim())
      } else {
        params.delete('query')
      }
      
      // Reset to first page when search changes
      params.delete('page')
      router.push(`/properties?${params.toString()}`)
    }, 500),
    [filters, currentSearchParams, router]
  )()

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    debouncedSearch(value)
  }

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.()
    }
  }, [debouncedSearch])

// Simple debounce function
function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null
  
  const debounced = ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T & { cancel: () => void }
  
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }
  
  return debounced
}

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'sort') {
        params.set(key, value)
      }
    })
    
    if (filters.sort && filters.sort !== 'newest') {
      params.set('sort', filters.sort)
    }

    // Reset to first page when filters change
    params.delete('page')
    
    router.push(`/properties?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      sort: 'newest'
    })
    setSearchQuery('')
    router.push('/properties')
  }

  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'newest')

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Properties
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by title, description, or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {searchQuery && (
            <p className="mt-1 text-xs text-gray-500">
              Searching for: &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => {
              const newFilters = { ...filters, sort: e.target.value }
              setFilters(newFilters)
              // Apply sort immediately
              const params = new URLSearchParams(currentSearchParams)
              if (e.target.value !== 'newest') {
                params.set('sort', e.target.value)
              } else {
                params.delete('sort')
              }
              router.push(`/properties?${params.toString()}`)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            {locations.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (USD)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            {bedroomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={applyFilters}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
