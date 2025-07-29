'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientAuth } from '@/lib/supabase-auth'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface LogoutButtonProps {
  className?: string
  showIcon?: boolean
  showText?: boolean
}

export default function LogoutButton({ 
  className = '',
  showIcon = true,
  showText = true
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientAuth()

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center text-gray-700 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {showIcon && (
        <ArrowRightOnRectangleIcon className={`h-5 w-5 ${showText ? 'mr-2' : ''}`} />
      )}
      {showText && (
        <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
      )}
    </button>
  )
}