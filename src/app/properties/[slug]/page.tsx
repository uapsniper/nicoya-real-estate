import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { formatPrice, formatArea } from '@/lib/utils'
import PropertyGallery from '@/components/PropertyGallery'
import PropertyMap from '@/components/PropertyMap'
import InquiryForm from '@/components/InquiryForm'
import RelatedProperties from '@/components/RelatedProperties'
import { MapPinIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface PropertyPageProps {
  params: {
    slug: string
  }
}

async function getProperty(slug: string) {
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !property) {
      return null
    }

    return property
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await getProperty(params.slug)

  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.'
    }
  }

  return {
    title: `${property.title} - ${formatPrice(property.price)}`,
    description: property.description.slice(0, 160),
    keywords: [
      property.title,
      property.location,
      'Costa Rica real estate',
      'Peninsula de Nicoya',
      ...property.amenities
    ],
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.images.length > 0 ? [
        {
          url: property.images[0],
          width: 1200,
          height: 630,
          alt: property.title,
        }
      ] : [],
      type: 'article',
    },
    alternates: {
      canonical: `/properties/${property.slug}`,
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await getProperty(params.slug)

  if (!property) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${property.slug}`,
    image: property.images,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressCountry: 'Costa Rica',
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.lot_size,
      unitCode: 'MTK',
    },
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    amenityFeature: property.amenities.map((amenity: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Image */}
        <div className="relative h-96 md:h-[500px]">
          <Image
            src={property.images[0] || '/images/placeholder-property.jpg'}
            alt={property.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {formatPrice(property.price)}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
                
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <HomeIcon className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-2">🚿</div>
                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-2">📐</div>
                    <div className="text-2xl font-bold text-gray-900">{formatArea(property.lot_size)}</div>
                    <div className="text-sm text-gray-600">Lot Size</div>
                  </div>
                  {property.construction_size && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 mb-2">🏠</div>
                      <div className="text-2xl font-bold text-gray-900">{formatArea(property.construction_size)}</div>
                      <div className="text-sm text-gray-600">Built Area</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Features & Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.amenities.map((amenity: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm"
                        >
                          <span className="mr-2">✓</span>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Info */}
                <div className="border-t pt-6">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>Listed on {new Date(property.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              {property.images && property.images.length > 1 && (
                <PropertyGallery images={property.images} title={property.title} />
              )}

              {/* Map */}
              <PropertyMap location={property.location} title={property.title} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-gray-600">USD</div>
                  </div>
                </div>

                {/* Inquiry Form */}
                <InquiryForm propertyId={property.id} propertyTitle={property.title} />
              </div>
            </div>
          </div>

          {/* Related Properties */}
          <div className="mt-16">
            <RelatedProperties currentPropertyId={property.id} location={property.location} />
          </div>
        </div>
      </div>
    </>
  )
}
