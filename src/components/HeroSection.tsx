import OptimizedImage from '@/components/OptimizedImage'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src="/images/nicoya-beach-hero.jpg"
          alt="Beautiful beach in Peninsula de Nicoya, Costa Rica"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Discover Paradise in{' '}
          <span className="text-blue-400">Nicoya Coast</span>,{' '}
          <span className="text-green-400">Costa Rica</span>
        </h1>
        
        <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
          Luxury beachfront properties, oceanview lots, and investment opportunities 
          in the pristine Peninsula de Nicoya
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/properties"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg"
          >
            Browse Properties
          </Link>
          <Link
            href="/contact"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>

        {/* Key Features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-2">🏖️</div>
            <h3 className="text-lg font-semibold mb-2">Beachfront Properties</h3>
            <p className="text-gray-200 text-sm">Direct access to pristine beaches and crystal-clear waters</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-2">🌿</div>
            <h3 className="text-lg font-semibold mb-2">Nature Reserves</h3>
            <p className="text-gray-200 text-sm">Close to Cabo Blanco and Manuel Antonio National Parks</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-semibold mb-2">Investment Potential</h3>
            <p className="text-gray-200 text-sm">High-growth market with excellent rental opportunities</p>
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
