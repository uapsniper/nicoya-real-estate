# Deployment Guide - Nicoya Coast Real Estate

This guide will walk you through deploying your real estate website to production.

## 🚀 Quick Deployment (Vercel + Supabase)

### Step 1: Prepare Supabase Database

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and enter project details
   - Wait for project to be created

2. **Set up Database Schema:**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run" to execute the schema
   - This creates tables and inserts sample properties

3. **Configure Row Level Security:**
   - The schema already includes RLS policies
   - Properties are publicly readable
   - Admin operations require authentication (to be implemented)

4. **Get API Keys:**
   - Go to Settings > API
   - Copy your `Project URL` and `anon public` key
   - Save the `service_role` key securely (for admin operations)

### Step 2: Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Nicoya Coast Real Estate"
   git branch -M main
   git remote add origin https://github.com/yourusername/nicoya-real-estate.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
     ```
   - Click "Deploy"

3. **Custom Domain (Optional):**
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain
   - Update `NEXT_PUBLIC_SITE_URL` environment variable

### Step 3: Post-Deployment Setup

1. **Update Robots.txt:**
   - Update the sitemap URL in `public/robots.txt`
   - Replace with your actual domain

2. **Test All Features:**
   - Browse properties
   - Test search and filters
   - Submit contact forms
   - Check admin dashboard
   - Verify SEO meta tags

3. **Add Real Content:**
   - Replace sample properties with real listings
   - Add actual property images
   - Update company contact information

## 🔧 Alternative Deployment Options

### Netlify

1. **Build Settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables:**
   Add the same environment variables as Vercel

3. **Deploy:**
   - Connect GitHub repository
   - Configure build settings
   - Deploy

### Railway

1. **Create Railway Project:**
   - Connect GitHub repository
   - Railway auto-detects Next.js

2. **Environment Variables:**
   Add environment variables in Railway dashboard

3. **Custom Domain:**
   Configure custom domain in Railway settings

## 📊 Production Checklist

### Performance
- [ ] Images optimized and properly sized
- [ ] Database queries optimized
- [ ] Caching configured
- [ ] CDN setup for static assets

### SEO
- [ ] Meta tags configured for all pages
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt configured
- [ ] Schema markup implemented
- [ ] Open Graph images added

### Security
- [ ] Environment variables secured
- [ ] Admin routes protected (implement authentication)
- [ ] HTTPS enabled
- [ ] CORS configured properly

### Content
- [ ] Sample data replaced with real properties
- [ ] Contact information updated
- [ ] About page content customized
- [ ] Property images added
- [ ] Legal pages added (privacy, terms)

### Analytics (Optional)
- [ ] Google Analytics configured
- [ ] Search Console setup
- [ ] Performance monitoring

## 🔐 Security Considerations

### Current Security Status
- ⚠️ **Admin dashboard has no authentication** - Implement before production
- ✅ Database RLS policies configured
- ✅ Environment variables secured
- ✅ No sensitive data in client-side code

### Recommended Security Enhancements

1. **Implement Authentication:**
   ```bash
   npm install @supabase/auth-helpers-nextjs
   ```
   
2. **Add Admin Authentication:**
   - Use Supabase Auth
   - Protect admin routes with middleware
   - Add login/logout functionality

3. **Rate Limiting:**
   - Implement rate limiting for contact forms
   - Add CAPTCHA for public forms

## 📈 Monitoring & Analytics

### Essential Monitoring
1. **Vercel Analytics:** Built-in performance monitoring
2. **Supabase Dashboard:** Database performance and usage
3. **Google Search Console:** SEO performance

### Optional Analytics
1. **Google Analytics 4:** User behavior tracking
2. **Hotjar:** User experience insights
3. **Sentry:** Error monitoring

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures:**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Environment Variable Issues:**
   - Verify all variables are set in deployment platform
   - Check variable names match exactly
   - Restart deployment after changes

3. **Database Connection Issues:**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Test connection in Supabase dashboard

4. **Image Loading Issues:**
   - Verify image URLs in database
   - Check image file paths
   - Update Next.js image domains if using external images

### Performance Issues

1. **Slow Page Loads:**
   - Optimize images
   - Enable caching
   - Use CDN for static assets

2. **Database Queries:**
   - Add database indexes
   - Optimize query patterns
   - Use database connection pooling

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- Update dependencies monthly
- Monitor database performance
- Review and respond to inquiries
- Update property listings
- Check analytics and SEO performance

### Backup Strategy
- Supabase provides automatic backups
- Export property data regularly
- Backup environment variables securely

---

## 🎉 Congratulations!

Your Nicoya Coast Real Estate website is now ready for production! 

**Next Steps:**
1. Complete the deployment checklist
2. Add real property content
3. Implement authentication for admin features
4. Monitor performance and user feedback
5. Iterate and improve based on analytics

For ongoing support and enhancements, refer to the main documentation and consider the future enhancement suggestions in SETUP.md.
