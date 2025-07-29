import { getPropertiesWithImages } from '@/lib/property-service'
import { formatPrice, formatArea } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { PencilIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline'
import DeletePropertyButton from '@/components/admin/DeletePropertyButton'

async function getProperties() {
  const result = await getPropertiesWithImages()
  return result.properties
}

export default async function AdminPropertiesPage() {
  const properties = await getProperties()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-2">Manage your real estate listings</p>
          </div>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </div>
      </div>

      {properties.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {properties.map((property) => (
              <li key={property.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      {/* Property Image */}
                      <div className="flex-shrink-0 mr-4">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                          <Image
                            src={property.images[0] || '/images/placeholder-property.jpg'}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {property.title}
                          </h3>
                          {property.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="truncate">{property.location}</span>
                          <span className="mx-2">•</span>
                          <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                          <span className="mx-2">•</span>
                          <span>{formatArea(property.lot_size)}</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-lg font-semibold text-green-600">
                            {formatPrice(property.price)}
                          </span>
                          <span className="ml-4 text-sm text-gray-500">
                            Added {new Date(property.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/properties/${property.slug}`}
                        target="_blank"
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        title="View Property"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        title="Edit Property"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <DeletePropertyButton 
                        propertyId={property.id} 
                        propertyTitle={property.title}
                      />
                    </div>
                  </div>

                  {/* Property Stats */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="font-semibold text-gray-900">{property.images.length}</div>
                      <div className="text-gray-500">Images</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="font-semibold text-gray-900">{property.amenities.length}</div>
                      <div className="text-gray-500">Amenities</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="font-semibold text-gray-900">
                        {property.construction_size ? formatArea(property.construction_size) : 'N/A'}
                      </div>
                      <div className="text-gray-500">Built Area</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="font-semibold text-gray-900">
                        {property.slug.length > 20 ? property.slug.substring(0, 20) + '...' : property.slug}
                      </div>
                      <div className="text-gray-500">URL Slug</div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first property listing.
          </p>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Your First Property
          </Link>
        </div>
      )}
    </div>
  )
}
