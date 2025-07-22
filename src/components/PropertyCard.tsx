import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/lib/supabase'
import { formatPrice, formatArea, truncateText } from '@/lib/utils'
import { MapPinIcon, HomeIcon, BanknotesIcon } from '@heroicons/react/24/outline'

interface PropertyCardProps {
  property: Property
  featured?: boolean
}

export default function PropertyCard({ property, featured = false }: PropertyCardProps) {
  const cardClasses = featured 
    ? "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-blue-200" 
    : "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"

  return (
    <div className={cardClasses}>
      <Link href={`/properties/${property.slug}`}>
        <div className="relative">
          {/* Property Image */}
          <div className="relative h-48 sm:h-56 md:h-48 lg:h-56">
            <Image
              src={property.images[0] || '/images/placeholder-property.jpg'}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {featured && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </div>
            )}
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {formatPrice(property.price)}
            </div>
          </div>

          {/* Property Details */}
          <div className="p-4 sm:p-6">
            <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
              {property.title}
            </h3>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">{property.location}</span>
            </div>

            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {truncateText(property.description, featured ? 150 : 100)}
            </p>

            {/* Property Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <HomeIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  {property.bedrooms > 0 ? `${property.bedrooms} bed` : 'Land'}
                  {property.bathrooms > 0 && `, ${property.bathrooms} bath`}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <BanknotesIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">{formatArea(property.lot_size)}</span>
              </div>
            </div>

            {/* Amenities Preview */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="text-gray-500 text-xs px-2 py-1">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium text-sm hover:text-blue-800">
                View Details →
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(property.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
