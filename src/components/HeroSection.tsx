'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const heroImages = [
  {
    src: 'https://radndwvoaogfbncoevxt.supabase.co/storage/v1/object/public/property-images/hero-images/77.png',
    alt: 'Beautiful Costa Rica beachfront property'
  },
  {
    src: 'https://radndwvoaogfbncoevxt.supabase.co/storage/v1/object/public/property-images/hero-images/66.png',
    alt: 'Luxury villa in Peninsula de Nicoya'
  },
  {
    src: 'https://radndwvoaogfbncoevxt.supabase.co/storage/v1/object/public/property-images/hero-images/44.png',
    alt: 'Oceanview property in Costa Rica'
  }
]

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Preload all hero images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = heroImages.map((image) => {
        return new Promise<void>((resolve, reject) => {
          const img = new window.Image()
          img.onload = () => resolve()
          img.onerror = () => reject(new Error(`Failed to load image: ${image.src}`))
          img.src = image.src
        })
      })

      try {
        await Promise.all(imagePromises)
        setImagesLoaded(true)
      } catch (error) {
        console.error('Error preloading hero images:', error)
        setImagesLoaded(true) // Continue anyway
      }
    }

    preloadImages()
  }, [])

  useEffect(() => {
    setIsClient(true)
    
    // Only start rotation after images are loaded
    if (!imagesLoaded) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 10000) // Change image every 10 seconds

    return () => clearInterval(interval)
  }, [imagesLoaded])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* Mobile height and spacing adjustment */}
      <style jsx>{`
        @media (max-height: 700px) {
          .hero-container {
            padding: 1rem 0 2rem 0;
          }
        }
        @media (max-width: 640px) {
          .hero-main {
            min-height: calc(100vh - 4rem);
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }
      `}</style>
      {/* Crossfade background images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            isClient && imagesLoaded && index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ))}
      
      {/* Loading state fallback */}
      {!imagesLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600"
        />
      )}

      {/* Hero Content */}
      <div className="hero-container hero-main relative z-10 text-center px-3 sm:px-6 lg:px-8 xl:px-12 w-full max-w-7xl mx-auto pt-8 sm:pt-0">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-8 lg:p-12 xl:p-16 mx-auto max-w-5xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-6 leading-tight text-white drop-shadow-2xl">
            Discover Paradise in{' '}
            <span className="text-blue-300 drop-shadow-lg">Nicoya Coast</span>,{' '}
            <span className="text-green-300 drop-shadow-lg">Costa Rica</span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-8 text-gray-100 max-w-4xl mx-auto drop-shadow-lg leading-relaxed">
            Luxury beachfront properties, oceanview lots, and investment opportunities 
            in the pristine Peninsula de Nicoya
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center mt-4 sm:mt-8 lg:mt-10">
          <Link
            href="/properties"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg lg:text-xl font-semibold transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Browse Properties
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white hover:text-gray-900 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg lg:text-xl font-semibold transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Contact Us
          </Link>
        </div>

        {/* Key Features */}
        <div className="mt-6 sm:mt-12 lg:mt-16 xl:mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center max-w-6xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 hover:bg-black/50 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Beachfront Properties</h3>
            <p className="text-gray-100 text-sm leading-relaxed">Direct access to pristine beaches and crystal-clear waters</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 hover:bg-black/50 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Nature Reserves</h3>
            <p className="text-gray-100 text-sm leading-relaxed">Close to Cabo Blanco and Manuel Antonio National Parks</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 hover:bg-black/50 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Investment Potential</h3>
            <p className="text-gray-100 text-sm leading-relaxed">High-growth market with excellent rental opportunities</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  )
}
