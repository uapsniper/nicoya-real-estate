-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  location TEXT NOT NULL,
  lot_size INTEGER NOT NULL, -- in square meters
  construction_size INTEGER, -- in square meters, nullable for lots
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  slug TEXT UNIQUE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact inquiries table
CREATE TABLE contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_featured ON properties(featured) WHERE featured = TRUE;
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_contact_inquiries_property_id ON contact_inquiries(property_id);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for properties (public read, authenticated write)
CREATE POLICY "Properties are viewable by everyone" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Properties are editable by authenticated users" ON properties
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for contact inquiries (authenticated users can insert)
CREATE POLICY "Anyone can submit contact inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact inquiries are viewable by authenticated users" ON contact_inquiries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert sample properties
INSERT INTO properties (title, price, location, lot_size, construction_size, bedrooms, bathrooms, description, amenities, images, slug, featured) VALUES
(
  'Charming Twin Homes in Cabuya – Walk to the Beach',
  975000.00,
  'Cabuya, Peninsula de Nicoya, Costa Rica',
  2998,
  200,
  2,
  2,
  'Colonial-style homes nestled in lush tropical gardens, just a 10-minute walk to pristine beaches and Cabo Blanco Nature Reserve. These charming twin properties offer the perfect blend of comfort and investment potential, ideal for Airbnb rentals or a peaceful retreat in paradise.',
  ARRAY['Pool', 'Garden Views', 'Near Beach', 'Investment Opportunity', 'Nature Reserve Access', 'Colonial Architecture'],
  ARRAY['/images/cabuya-twin-1.jpg', '/images/cabuya-twin-2.jpg', '/images/cabuya-twin-3.jpg', '/images/cabuya-twin-4.jpg'],
  'charming-twin-homes-in-cabuya-walk-to-the-beach',
  true
),
(
  'Oceanview Lot in Montezuma with Development Potential',
  450000.00,
  'Montezuma, Peninsula de Nicoya, Costa Rica',
  1500,
  null,
  0,
  0,
  'Prime oceanview lot in the heart of Montezuma, offering stunning Pacific views and endless development possibilities. Located just minutes from the famous Montezuma waterfalls and vibrant town center, this property is perfect for building your dream home or boutique hotel.',
  ARRAY['Ocean View', 'Development Potential', 'Near Waterfalls', 'Town Center Location', 'Pacific Views'],
  ARRAY['/images/montezuma-lot-1.jpg', '/images/montezuma-lot-2.jpg', '/images/montezuma-lot-3.jpg'],
  'oceanview-lot-in-montezuma-with-development-potential',
  true
),
(
  'Luxury Villa in Mal País with Private Pool',
  1250000.00,
  'Mal País, Peninsula de Nicoya, Costa Rica',
  3500,
  350,
  4,
  3,
  'Stunning luxury villa featuring contemporary design with traditional Costa Rican elements. This property boasts panoramic ocean views, a private infinity pool, and direct access to world-class surfing beaches. Perfect for luxury vacation rentals or as a primary residence.',
  ARRAY['Ocean View', 'Private Pool', 'Luxury Finishes', 'Surf Access', 'Contemporary Design', 'Infinity Pool'],
  ARRAY['/images/mal-pais-villa-1.jpg', '/images/mal-pais-villa-2.jpg', '/images/mal-pais-villa-3.jpg', '/images/mal-pais-villa-4.jpg', '/images/mal-pais-villa-5.jpg'],
  'luxury-villa-in-mal-pais-with-private-pool',
  true
),
(
  'Beachfront Bungalow in Santa Teresa',
  680000.00,
  'Santa Teresa, Peninsula de Nicoya, Costa Rica',
  800,
  120,
  2,
  1,
  'Charming beachfront bungalow with direct beach access and stunning sunset views. This cozy property features an open-plan design, tropical hardwood finishes, and a large deck perfect for enjoying the ocean breeze. Walking distance to restaurants and surf shops.',
  ARRAY['Beachfront', 'Sunset Views', 'Direct Beach Access', 'Hardwood Finishes', 'Open Plan'],
  ARRAY['/images/santa-teresa-bungalow-1.jpg', '/images/santa-teresa-bungalow-2.jpg', '/images/santa-teresa-bungalow-3.jpg'],
  'beachfront-bungalow-in-santa-teresa',
  false
),
(
  'Jungle Retreat near Cabo Blanco Reserve',
  320000.00,
  'Cabuya, Peninsula de Nicoya, Costa Rica',
  2000,
  80,
  1,
  1,
  'Eco-friendly jungle retreat surrounded by pristine nature and wildlife. This sustainable property features solar power, rainwater collection, and organic gardens. Perfect for nature lovers seeking tranquility and connection with Costa Rica''s incredible biodiversity.',
  ARRAY['Eco-Friendly', 'Solar Power', 'Rainwater Collection', 'Organic Gardens', 'Wildlife Viewing', 'Sustainable Living'],
  ARRAY['/images/jungle-retreat-1.jpg', '/images/jungle-retreat-2.jpg', '/images/jungle-retreat-3.jpg'],
  'jungle-retreat-near-cabo-blanco-reserve',
  false
),
(
  'Hilltop Estate with Panoramic Views',
  850000.00,
  'Montezuma, Peninsula de Nicoya, Costa Rica',
  4200,
  280,
  3,
  2,
  'Magnificent hilltop estate offering 360-degree views of the Pacific Ocean and surrounding mountains. This property features multiple terraces, mature fruit trees, and a natural spring. Ideal for those seeking privacy and breathtaking vistas in a tropical paradise.',
  ARRAY['Panoramic Views', 'Natural Spring', 'Fruit Trees', 'Multiple Terraces', '360-degree Views', 'Privacy'],
  ARRAY['/images/hilltop-estate-1.jpg', '/images/hilltop-estate-2.jpg', '/images/hilltop-estate-3.jpg', '/images/hilltop-estate-4.jpg'],
  'hilltop-estate-with-panoramic-views',
  false
);
