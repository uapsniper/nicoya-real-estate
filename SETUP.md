# Nicoya Coast Real Estate - Setup Guide

A modern, SEO-optimized real estate website built with Next.js, Tailwind CSS, and Supabase for Costa Rica's Peninsula de Nicoya.

## 🚀 Features

- **Modern Design**: Responsive, mobile-first design with tropical color scheme
- **SEO Optimized**: Server-side rendering, meta tags, schema markup, sitemaps
- **Property Management**: Full CRUD operations for property listings
- **Advanced Search**: Filters by location, price, bedrooms, property type
- **Image Galleries**: Lightbox galleries with keyboard navigation
- **Contact Forms**: Inquiry forms with Supabase integration
- **Admin Dashboard**: Complete property management system
- **Maps Integration**: Google Maps integration for property locations

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Maps API key (optional, for maps)

## 🛠️ Installation

1. **Clone and install dependencies:**
   ```bash
   cd nicoya-real-estate
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local` and update with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Set up Supabase database:**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - This will create the `properties` and `contact_inquiries` tables with sample data

4. **Configure Google Maps (Optional):**
   - Get a Google Maps API key
   - Update the PropertyMap component with your API key
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in the component

5. **Add property images:**
   - Add your property images to the `public/images/` directory
   - Update the sample data in the database with actual image paths
   - Or use the admin dashboard to add properties with image URLs

## 🚀 Running the Application

1. **Development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

2. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 📊 Database Schema

### Properties Table
- `id`: UUID primary key
- `title`: Property title
- `price`: Price in USD (decimal)
- `location`: Full location string
- `lot_size`: Lot size in square meters
- `construction_size`: Built area in square meters (nullable)
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `description`: Detailed description
- `amenities`: Array of amenity strings
- `images`: Array of image URLs
- `slug`: SEO-friendly URL slug
- `featured`: Boolean for featured properties
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Contact Inquiries Table
- `id`: UUID primary key
- `property_id`: Reference to property (nullable)
- `name`: Contact name
- `email`: Contact email
- `message`: Inquiry message
- `created_at`: Creation timestamp

## 🎨 Customization

### Colors and Styling
The website uses a tropical color scheme defined in Tailwind CSS:
- Primary: Blue (ocean)
- Secondary: Green (nature)
- Accent: White and grays

### Content
- Update company information in components (Navigation, Footer, Contact)
- Modify location options in search and property forms
- Customize amenities list in PropertyForm component

### SEO
- Update metadata in layout.tsx and page components
- Modify sitemap.ts for additional pages
- Update robots.txt with your domain

## 🔐 Admin Access

The admin dashboard is available at `/admin` and includes:
- Property management (CRUD operations)
- Inquiry management
- Dashboard with statistics
- Image upload functionality

**Note**: Currently, there's no authentication system. In production, implement proper authentication using Supabase Auth or similar.

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Mobile Optimization

The website is fully responsive and optimized for:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## 🔍 SEO Features

- Server-side rendering with Next.js App Router
- Dynamic meta tags and Open Graph
- JSON-LD structured data for properties
- Automatic sitemap generation
- Optimized images with Next.js Image component
- Clean, SEO-friendly URLs

## 🐛 Troubleshooting

### Common Issues

1. **Supabase connection errors:**
   - Verify environment variables
   - Check Supabase project settings
   - Ensure RLS policies are configured correctly

2. **Images not loading:**
   - Check image URLs in the database
   - Verify images exist in public/images directory
   - Update image paths in sample data

3. **Build errors:**
   - Clear .next directory: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check for TypeScript errors

## 📞 Support

For questions or issues:
- Check the documentation
- Review the code comments
- Create an issue in the repository

## 🎯 Future Enhancements

Potential improvements for production:
- User authentication system
- Property image upload to Supabase Storage
- Email notifications for inquiries
- Advanced search with map integration
- Multi-language support
- Property comparison feature
- Virtual tour integration
- Payment processing for premium listings

---

Built with ❤️ for Costa Rica's beautiful Peninsula de Nicoya
