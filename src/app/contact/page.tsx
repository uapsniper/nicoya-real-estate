import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Contact Us - Nicoya Coast Real Estate',
  description: 'Get in touch with our Peninsula de Nicoya real estate experts. Contact us for property inquiries, investment advice, and personalized service.',
  keywords: ['contact', 'Costa Rica real estate', 'Peninsula de Nicoya', 'property inquiry', 'real estate agent'],
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to find your dream property in Peninsula de Nicoya? 
              Get in touch with our expert team for personalized assistance.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 mb-12 lg:mb-0">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPinIcon className="h-6 w-6 text-blue-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Office Location</h3>
                    <p className="text-gray-600">
                      Peninsula de Nicoya<br />
                      Puntarenas Province<br />
                      Costa Rica
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-blue-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">
                      <a href="tel:+50626420000" className="hover:text-blue-600">
                        +506 2642-0000
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@nicoyacoast.com" className="hover:text-blue-600">
                        info@nicoyacoast.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-blue-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 4:00 PM</p>
                      <p>Sunday: By appointment</p>
                      <p className="text-sm mt-2 text-blue-600">Costa Rica Time (CST)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Services</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Property Sales & Acquisitions
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Investment Consulting
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Property Management
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Legal Assistance
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Market Analysis
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Whether you&apos;re looking to buy, sell, or invest in Peninsula de Nicoya real estate, 
                we&apos;re here to help. Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can foreigners buy property in Costa Rica?
              </h3>
              <p className="text-gray-600 mb-6">
                Yes, foreigners have the same property rights as Costa Rican citizens and can own property 
                in fee simple title. We assist with all legal requirements and documentation.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What are the typical closing costs?
              </h3>
              <p className="text-gray-600 mb-6">
                Closing costs typically range from 3-5% of the property value, including transfer taxes, 
                legal fees, and registration costs. We provide detailed cost breakdowns for each transaction.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer property management services?
              </h3>
              <p className="text-gray-600 mb-6">
                Yes, we offer comprehensive property management services including maintenance, 
                rental management, and guest services for investment properties.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How is the rental market in the area?
              </h3>
              <p className="text-gray-600 mb-6">
                The Peninsula de Nicoya has a strong rental market driven by eco-tourism and surf tourism. 
                Many properties achieve 60-80% occupancy rates with attractive rental yields.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let us help you find the perfect property in Peninsula de Nicoya. 
            Our experienced team is ready to guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+50626420000"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Call Now
            </a>
            <a
              href="mailto:info@nicoyacoast.com"
              className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
