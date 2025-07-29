'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { EnvelopeIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  property_id?: string
  created_at: string
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      if (!supabase) {
        throw new Error('Database connection not available')
      }

      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setInquiries(data || [])
    } catch (err) {
      console.error('Error fetching inquiries:', err)
      setError(err instanceof Error ? err.message : 'Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-2">Manage customer inquiries and messages</p>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading inquiries...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-2">Manage customer inquiries and messages</p>
        </div>
        <div className="text-center py-12">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-600 mt-2">Manage customer inquiries and messages</p>
      </div>

      {inquiries.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {inquiry.name}
                        </h3>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span className="truncate">{inquiry.email}</span>
                        {inquiry.phone && (
                          <>
                            <span className="mx-2">•</span>
                            <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            <span>{inquiry.phone}</span>
                          </>
                        )}
                        <span className="mx-2">•</span>
                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {inquiry.message}
                        </p>
                      </div>
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
            <EnvelopeIcon className="mx-auto h-16 w-16" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Inquiries Yet</h3>
          <p className="text-gray-600">
            Customer inquiries will appear here when they contact you through the website.
          </p>
        </div>
      )}
    </div>
  )
}