import { Metadata } from 'next'
import AdminNavigation from '@/components/admin/AdminNavigation'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Nicoya Coast Real Estate',
  description: 'Manage properties, inquiries, and content for Nicoya Coast Real Estate.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavigation />
      <main className="py-6">
        {children}
      </main>
    </div>
  )
}
