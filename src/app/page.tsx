import { Suspense } from 'react'
import { getFeaturedPropertiesWithImages } from '@/lib/property-service'
import HeroSection from '@/components/HeroSection'
import FeaturedProperties from '@/components/FeaturedProperties'
import SearchSection from '@/components/SearchSection'
import AboutSection from '@/components/AboutSection'

export default async function Home() {
  const featuredProperties = await getFeaturedPropertiesWithImages(6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Search Section */}
      <SearchSection />
      
      {/* Featured Properties */}
      <Suspense fallback={
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      }>
        <FeaturedProperties />
      </Suspense>
      
      {/* About Section */}
      <AboutSection />
    </div>
  )
}
