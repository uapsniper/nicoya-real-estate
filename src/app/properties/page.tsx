import { Suspense } from 'react'
import { Metadata } from 'next'
import PropertiesGrid from '@/components/PropertiesGrid'
import PropertyFilters from '@/components/PropertyFilters'

export const metadata: Metadata = {
  title: 'Properties for Sale in Peninsula de Nicoya, Costa Rica',
  description: 'Browse luxury beachfront properties, oceanview lots, and investment opportunities in Cabuya, Montezuma, Mal País, and Santa Teresa.',
  keywords: ['Costa Rica properties', 'Peninsula de Nicoya real estate', 'beachfront homes', 'oceanview lots', 'investment properties'],
}

interface PropertiesPageProps {
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

export default function PropertiesPage({ searchParams }: PropertiesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Properties in Peninsula de Nicoya
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Discover your perfect property in Costa Rica's most beautiful coastal region. 
            From beachfront villas to jungle retreats, find your slice of paradise.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="sticky top-24">
              <PropertyFilters searchParams={searchParams} />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-300"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }>
              <PropertiesGrid searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
