import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Peninsula de Nicoya - Costa Rica Real Estate Investment Guide',
  description: 'Learn about investing in Peninsula de Nicoya real estate. Discover why Cabuya, Montezuma, and Mal País are Costa Rica\'s most promising investment destinations.',
  keywords: ['Peninsula de Nicoya', 'Costa Rica investment', 'real estate guide', 'Cabuya', 'Montezuma', 'Mal País', 'property investment'],
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="absolute inset-0">
          <Image
            src="/images/nicoya-peninsula-aerial.jpg"
            alt="Aerial view of Peninsula de Nicoya coastline"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              About Peninsula de Nicoya
            </h1>
            <p className="text-xl sm:text-2xl max-w-2xl">
              Discover Costa Rica's hidden gem for real estate investment and tropical living
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Peninsula de Nicoya?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              The Peninsula de Nicoya represents one of Costa Rica's most pristine and promising regions for 
              real estate investment. Located on the Pacific coast, this stunning peninsula offers a unique 
              combination of natural beauty, growing infrastructure, and investment potential that attracts 
              discerning buyers from around the world.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              From the bohemian charm of Montezuma to the world-class surfing of Mal País and the tranquil 
              beaches of Cabuya, each area offers distinct advantages for both lifestyle and investment purposes.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Explore Properties
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/nicoya-beach-sunset.jpg"
                alt="Beautiful sunset over Nicoya Peninsula beach"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Key Locations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Prime Investment Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cabuya */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/images/cabuya-beach.jpg"
                  alt="Cabuya beach and coastline"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cabuya</h3>
                <p className="text-gray-700 mb-4">
                  A peaceful fishing village offering pristine beaches and direct access to Cabo Blanco 
                  Nature Reserve. Perfect for eco-conscious investors seeking tranquility.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 10-minute walk to Cabo Blanco Reserve</li>
                  <li>• Pristine beaches with minimal development</li>
                  <li>• Growing eco-tourism market</li>
                  <li>• Authentic Costa Rican village atmosphere</li>
                </ul>
              </div>
            </div>

            {/* Montezuma */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/images/montezuma-waterfall.jpg"
                  alt="Montezuma waterfall and tropical landscape"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Montezuma</h3>
                <p className="text-gray-700 mb-4">
                  A vibrant bohemian town known for its famous waterfalls, artistic community, and 
                  established tourism infrastructure. Ideal for rental property investments.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Famous Montezuma waterfalls</li>
                  <li>• Established tourism infrastructure</li>
                  <li>• Vibrant arts and culture scene</li>
                  <li>• High rental demand year-round</li>
                </ul>
              </div>
            </div>

            {/* Mal País */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/images/mal-pais-surf.jpg"
                  alt="Mal País surf break and coastline"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mal País</h3>
                <p className="text-gray-700 mb-4">
                  World-renowned surfing destination with luxury resorts and high-end development. 
                  Premium location for luxury property investments.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• World-class surfing breaks</li>
                  <li>• Luxury resort developments</li>
                  <li>• International airport access</li>
                  <li>• High-end property appreciation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Benefits */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Investment Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainable Growth</h3>
              <p className="text-gray-600 text-sm">
                Eco-friendly development with strong environmental protections ensuring long-term value.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Appreciation</h3>
              <p className="text-gray-600 text-sm">
                Consistent property value growth driven by increasing international interest and limited supply.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏖️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tourism Revenue</h3>
              <p className="text-gray-600 text-sm">
                Strong rental income potential from year-round tourism and growing eco-tourism market.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Political Stability</h3>
              <p className="text-gray-600 text-sm">
                Costa Rica's stable democracy and pro-foreign investment policies provide security.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Invest in Paradise?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover exclusive properties in Peninsula de Nicoya and start your journey to owning 
            a piece of Costa Rican paradise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
