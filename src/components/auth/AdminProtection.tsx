'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'

interface AdminProtectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminProtection({ children, fallback }: AdminProtectionProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login?redirect=/admin')
      } else if (!isAdmin) {
        router.push('/auth/unauthorized')
      }
    }
  }, [user, isAdmin, loading, router])

  // Show loading state
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      )
    )
  }

  // Don't render children if not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}