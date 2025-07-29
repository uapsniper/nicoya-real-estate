import { NextRequest } from 'next/server'
import { checkAuth } from '@/lib/supabase-auth'

export async function middleware(request: NextRequest) {
  return await checkAuth(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images|robots.txt|sitemap.xml).*)',
  ],
}