import PropertyForm from '@/components/admin/PropertyForm'

export default function NewPropertyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-2">Create a new property listing for your real estate portfolio</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <PropertyForm />
      </div>
    </div>
  )
}
