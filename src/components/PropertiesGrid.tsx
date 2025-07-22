import { supabase, Property } from '@/lib/supabase'
import PropertyCard from './PropertyCard'
import Pagination from './Pagination'
import Link from 'next/link'

interface PropertiesGridProps {
  searchParams: {
    location?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    page?: string
    sort?: string
  }
}

const ITEMS_PER_PAGE = 12

async function getProperties(searchParams: PropertiesGridProps['searchParams']) {
  try {
    const page = parseInt(searchParams.page || '1')
    const offset = (page - 1) * ITEMS_PER_PAGE

    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })

    // Apply filters
    if (searchParams.location) {
      query = query.ilike('location', `%${searchParams.location}%`)
    }

    if (searchParams.type) {
      query = query.ilike('title', `%${searchParams.type}%`)
    }

    if (searchParams.minPrice) {
      query = query.gte('price', parseInt(searchParams.minPrice))
    }

    if (searchParams.maxPrice) {
      query = query.lte('price', parseInt(searchParams.maxPrice))
    }

    if (searchParams.bedrooms) {
      query = query.gte('bedrooms', parseInt(searchParams.bedrooms))
    }

    // Apply sorting
    switch (searchParams.sort) {
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

    // Apply pagination
    query = query.range(offset, offset + ITEMS_PER_PAGE - 1)

    const { data: properties, error, count } = await query

    if (error) {
      console.error('Error fetching properties:', error)
      return { properties: [], total: 0, page, totalPages: 0 }
    }

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

    return {
      properties: properties || [],
      total: count || 0,
      page,
      totalPages
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
    return { properties: [], total: 0, page: 1, totalPages: 0 }
  }
}

export default async function PropertiesGrid({ searchParams }: PropertiesGridProps) {
  const { properties, total, page, totalPages } = await getProperties(searchParams)

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your search criteria or browse all available properties.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
        >
          View All Properties
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {total} {total === 1 ? 'Property' : 'Properties'} Found
          </h2>
          <p className="text-gray-600 mt-1">
            Page {page} of {totalPages}
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          searchParams={searchParams}
        />
      )}
    </div>
  )
}
