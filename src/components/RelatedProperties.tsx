import { supabase } from '@/lib/supabase'
import PropertyCard from './PropertyCard'
import Link from 'next/link'

interface RelatedPropertiesProps {
  currentPropertyId: string
  location: string
}

async function getRelatedProperties(currentPropertyId: string, location: string) {
  if (!supabase) {
    return []
  }

  try {
    // Extract the main location (first part before comma)
    const mainLocation = location.split(',')[0].trim()
    
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .neq('id', currentPropertyId) // Exclude current property
      .ilike('location', `%${mainLocation}%`) // Find properties in similar location
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching related properties:', error)
      return []
    }

    // If we don't have enough properties from the same location, 
    // get some random properties to fill the gap
    if (properties && properties.length < 3) {
      const { data: additionalProperties, error: additionalError } = await supabase
        .from('properties')
        .select('*')
        .neq('id', currentPropertyId)
        .not('location', 'ilike', `%${mainLocation}%`)
        .order('created_at', { ascending: false })
        .limit(6 - properties.length)

      if (!additionalError && additionalProperties) {
        return [...properties, ...additionalProperties]
      }
    }

    return properties || []
  } catch (error) {
    console.error('Error fetching related properties:', error)
    return []
  }
}

export default async function RelatedProperties({ currentPropertyId, location }: RelatedPropertiesProps) {
  const relatedProperties = await getRelatedProperties(currentPropertyId, location)

  if (relatedProperties.length === 0) {
    return null
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Similar Properties
        </h2>
        <p className="text-gray-600">
          Explore other properties in the area that might interest you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/properties"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          View All Properties
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
