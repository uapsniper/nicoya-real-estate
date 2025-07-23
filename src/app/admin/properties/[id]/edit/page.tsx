import { notFound } from 'next/navigation'
import { getPropertyWithImages } from '@/lib/property-service'
import EditPropertyForm from '@/components/admin/EditPropertyForm'

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

async function getProperty(id: string) {
  try {
    const property = await getPropertyWithImages(id)
    return property
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-gray-600 mt-2">Update property details and information</p>
      </div>

      <EditPropertyForm property={property} />
    </div>
  )
}
