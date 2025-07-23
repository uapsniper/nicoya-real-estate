import PropertyForm from './PropertyForm'
import { Property } from '@/lib/supabase'

interface EditPropertyFormProps {
  property: Property
}

export default function EditPropertyForm({ property }: EditPropertyFormProps) {
  return <PropertyForm property={property} isEditing={true} />
}
