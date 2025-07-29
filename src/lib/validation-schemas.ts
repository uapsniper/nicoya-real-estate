import { z } from 'zod'

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be less than 255 characters'),
  
  phone: z.string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim() === '') return true
      // Allow various phone formats: +1-555-123-4567, (555) 123-4567, 555.123.4567, etc.
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\.\(\)]{10,20}$/
      return phoneRegex.test(phone.replace(/[\s\-\.\(\)]/g, ''))
    }, 'Please enter a valid phone number'),
  
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  
  inquiryType: z.enum(['general', 'buying', 'selling', 'investment', 'management', 'other'])
})

// Property Inquiry Form Schema
export const propertyInquirySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be less than 255 characters'),
  
  phone: z.string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim() === '') return true
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\.\(\)]{10,20}$/
      return phoneRegex.test(phone.replace(/[\s\-\.\(\)]/g, ''))
    }, 'Please enter a valid phone number'),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  
  preferredContact: z.enum(['email', 'phone', 'either']).optional(),
  
  visitingSchedule: z.enum(['immediate', 'within_week', 'within_month', 'flexible']).optional()
})

// Property Search Schema
export const propertySearchSchema = z.object({
  query: z.string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters')
    .optional(),
  
  location: z.string().optional(),
  
  minPrice: z.number()
    .min(0, 'Minimum price must be positive')
    .max(10000000, 'Price seems too high')
    .optional(),
  
  maxPrice: z.number()
    .min(0, 'Maximum price must be positive')
    .max(10000000, 'Price seems too high')
    .optional(),
  
  bedrooms: z.number()
    .min(0, 'Bedrooms cannot be negative')
    .max(20, 'Too many bedrooms')
    .optional(),
  
  bathrooms: z.number()
    .min(0, 'Bathrooms cannot be negative')
    .max(20, 'Too many bathrooms')
    .optional(),
    
  propertyType: z.enum(['house', 'condo', 'land', 'commercial', 'other']).optional()
}).refine((data) => {
  if (data.minPrice && data.maxPrice) {
    return data.minPrice <= data.maxPrice
  }
  return true
}, {
  message: 'Minimum price must be less than or equal to maximum price',
  path: ['maxPrice']
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type PropertyInquiryData = z.infer<typeof propertyInquirySchema>
export type PropertySearchData = z.infer<typeof propertySearchSchema>