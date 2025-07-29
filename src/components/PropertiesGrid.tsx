import { getPropertiesWithImages } from '@/lib/property-service'
import PropertyCard from './PropertyCard'
import Pagination from './Pagination'
import Link from 'next/link'

interface PropertiesGridProps {
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

const ITEMS_PER_PAGE = 12

async function getProperties(searchParams: PropertiesGridProps['searchParams']) {
  try {
    const page = parseInt(searchParams.page || '1')
    const offset = (page - 1) * ITEMS_PER_PAGE

    const result = await getPropertiesWithImages({
      query: searchParams.query,
      location: searchParams.location,
      propertyType: searchParams.type,
      minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined,
      bedrooms: searchParams.bedrooms ? parseInt(searchParams.bedrooms) : undefined,
      sort: searchParams.sort,
      limit: ITEMS_PER_PAGE,
      offset: offset
    })

    const totalPages = Math.ceil(result.total / ITEMS_PER_PAGE)

    return {
      properties: result.properties,
      total: result.total,
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
            {searchParams.query && (
              <span className="text-blue-600"> for &ldquo;{searchParams.query}&rdquo;</span>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Page {page} of {totalPages}
            {(searchParams.location || searchParams.minPrice || searchParams.maxPrice || searchParams.bedrooms) && (
              <span className="ml-2">• Filters applied</span>
            )}
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
