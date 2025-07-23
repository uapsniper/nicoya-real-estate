'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 10000) // Change image every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Full opacity background image */}
      <div 
        className="absolute inset-0 transition-all duration-500 ease-in-out"
        style={{
          backgroundImage: isClient ? `url(${heroImages[currentImageIndex].src})` : `url(${heroImages[0].src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 sm:p-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
            Discover Paradise in{' '}
            <span className="text-blue-300 drop-shadow-lg">Nicoya Coast</span>,{' '}
            <span className="text-green-300 drop-shadow-lg">Costa Rica</span>
          </h1>
          
          <p className="text-xl sm:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto drop-shadow-lg">
            Luxury beachfront properties, oceanview lots, and investment opportunities 
            in the pristine Peninsula de Nicoya
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Link
            href="/properties"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Browse Properties
          </Link>
          <Link
            href="/contact"
            className="bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Contact Us
          </Link>
        </div>

        {/* Key Features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-black/50 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Beachfront Properties</h3>
            <p className="text-gray-100 text-sm leading-relaxed">Direct access to pristine beaches and crystal-clear waters</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-black/50 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Nature Reserves</h3>
            <p className="text-gray-100 text-sm leading-relaxed">Close to Cabo Blanco and Manuel Antonio National Parks</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-black/50 transition-all duration-300">
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
