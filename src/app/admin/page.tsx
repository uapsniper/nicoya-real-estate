import { supabase } from '@/lib/supabase'
import { BuildingOfficeIcon, EnvelopeIcon, EyeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

async function getDashboardStats() {
  try {
    // Get total properties count
    const { count: totalProperties } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })

    // Get featured properties count
    const { count: featuredProperties } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('featured', true)

    // Get total inquiries count
    const { count: totalInquiries } = await supabase
      .from('contact_inquiries')
      .select('*', { count: 'exact', head: true })

    // Get recent inquiries (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: recentInquiries } = await supabase
      .from('contact_inquiries')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    // Get average property price
    const { data: priceData } = await supabase
      .from('properties')
      .select('price')

    const averagePrice = priceData && priceData.length > 0
      ? priceData.reduce((sum, property) => sum + property.price, 0) / priceData.length
      : 0

    return {
      totalProperties: totalProperties || 0,
      featuredProperties: featuredProperties || 0,
      totalInquiries: totalInquiries || 0,
      recentInquiries: recentInquiries || 0,
      averagePrice
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalProperties: 0,
      featuredProperties: 0,
      totalInquiries: 0,
      recentInquiries: 0,
      averagePrice: 0
    }
  }
}

async function getRecentProperties() {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, title, price, location, created_at, featured')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching recent properties:', error)
      return []
    }

    return properties || []
  } catch (error) {
    console.error('Error fetching recent properties:', error)
    return []
  }
}

async function getRecentInquiries() {
  try {
    const { data: inquiries, error } = await supabase
      .from('contact_inquiries')
      .select('id, name, email, created_at, property_id')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching recent inquiries:', error)
      return []
    }

    return inquiries || []
  } catch (error) {
    console.error('Error fetching recent inquiries:', error)
    return []
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentProperties = await getRecentProperties()
  const recentInquiries = await getRecentInquiries()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard. Here&apos;s an overview of your real estate listings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Featured Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.featuredProperties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EnvelopeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
              <p className="text-xs text-gray-500">{stats.recentInquiries} this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Price</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.averagePrice)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
              <Link
                href="/admin/properties"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentProperties.length > 0 ? (
              recentProperties.map((property) => (
                <div key={property.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {property.title}
                        </h3>
                        {property.featured && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{property.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatPrice(property.price)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(property.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No properties found</p>
                <Link
                  href="/admin/properties/new"
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Add your first property
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
              <Link
                href="/admin/inquiries"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{inquiry.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{inquiry.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </p>
                      {inquiry.property_id && (
                        <p className="text-xs text-blue-600">Property inquiry</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No inquiries yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Property
          </Link>
          <Link
            href="/admin/properties"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Manage Properties
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            View Inquiries
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            View Website
          </Link>
        </div>
      </div>
    </div>
  )
}
