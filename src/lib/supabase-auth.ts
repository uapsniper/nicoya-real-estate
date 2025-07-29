import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

// Client-side auth helper
export const createClientAuth = () => createClientComponentClient()

// Server-side auth helper (only use in Server Components)
export const createServerAuth = async () => {
  const { cookies } = await import('next/headers')
  return createServerComponentClient({ cookies })
}

// Auth configuration
export const AUTH_CONFIG = {
  redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
  adminRole: 'admin',
  protectedRoutes: ['/admin'],
  publicRoutes: ['/auth/login', '/auth/callback', '/auth/signup'],
}

// User role type
export interface UserProfile {
  id: string
  email: string
  role?: string
  full_name?: string
  created_at: string
  updated_at: string
}

// Auth state type
export interface AuthState {
  user: any | null // eslint-disable-line @typescript-eslint/no-explicit-any
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
}

// Helper function to check if user has admin role
export const isAdminUser = (user: any, profile: UserProfile | null): boolean => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!user || !profile) return false
  return profile.role === AUTH_CONFIG.adminRole
}

// Helper function to get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const supabase = await createServerAuth()
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return profile
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

// Middleware helper to check authentication
export const checkAuth = async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  
  // Skip auth check for public routes and static files
  if (
    AUTH_CONFIG.publicRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if route needs protection
  const isProtectedRoute = AUTH_CONFIG.protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  try {
    const { createServerComponentClient } = await import('@supabase/auth-helpers-nextjs')
    const supabase = createServerComponentClient({ 
      cookies: () => ({
        get: (name: string) => request.cookies.get(name)?.value,
        set: () => {},
        remove: () => {},
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    })
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // For admin routes, check admin role
    if (pathname.startsWith('/admin')) {
      const profile = await getUserProfile(session.user.id)
      if (!isAdminUser(session.user, profile)) {
        return NextResponse.redirect(new URL('/auth/unauthorized', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
}