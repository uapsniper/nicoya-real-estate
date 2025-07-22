// Placeholder images for Costa Rica real estate website
// Using high-quality stock images from Unsplash with proper attribution

export const placeholderImages = {
  // Hero and main images
  'nicoya-beach-hero.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
  'nicoya-peninsula-aerial.jpg': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center',
  'nicoya-beach-sunset.jpg': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&h=400&fit=crop&crop=center',
  'nicoya-nature.jpg': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop&crop=center',
  
  // Location specific images
  'cabuya-beach.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
  'montezuma-waterfall.jpg': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center',
  'mal-pais-surf.jpg': 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop&crop=center',
  
  // Property placeholder
  'placeholder-property.jpg': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&crop=center',
  
  // Open Graph image
  'og-image.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center',
}

// Function to get placeholder image URL
export function getPlaceholderImage(imageName: string): string {
  return placeholderImages[imageName as keyof typeof placeholderImages] || placeholderImages['placeholder-property.jpg']
}

// Sample property images for seeding
export const samplePropertyImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center', // Modern house
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&crop=center', // Beach house
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&crop=center', // Villa
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=center', // Contemporary home
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&crop=center', // Luxury house
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&crop=center', // Tropical house
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop&crop=center', // Estate
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center', // Modern villa
]
