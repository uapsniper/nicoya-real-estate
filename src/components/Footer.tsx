import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-400">
                Nicoya Coast
              </span>
              <span className="ml-2 text-sm text-green-400 font-medium">
                Real Estate
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Discover paradise in Costa Rica's Peninsula de Nicoya. We specialize in 
              luxury properties, beachfront homes, and investment opportunities in 
              Cabuya, Montezuma, and Mal País.
            </p>
            <div className="text-gray-300">
              <p>📧 info@nicoyacoast.com</p>
              <p>📞 +506 2642-0000</p>
              <p>📍 Peninsula de Nicoya, Costa Rica</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-blue-400 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?featured=true" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Featured Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Locations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?location=Cabuya" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Cabuya
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Montezuma" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Montezuma
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Mal País" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Mal País
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Santa Teresa" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Santa Teresa
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Nicoya Coast Real Estate. All rights reserved.
          </p>
          <div className="mt-2 space-x-4">
            <Link href="/sitemap.xml" className="text-gray-400 hover:text-blue-400 text-sm">
              Sitemap
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-blue-400 text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-blue-400 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
