// Script to update sample properties with actual image URLs
import { supabase } from '@/lib/supabase'
import { samplePropertyImages } from '@/lib/placeholder-images'

export async function updatePropertyImages() {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return
  }

  try {
    // Get all properties
    const { data: properties, error: fetchError } = await supabase
      .from('properties')
      .select('id, title')
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching properties:', fetchError)
      return
    }

    if (!properties || properties.length === 0) {
      console.log('No properties found to update')
      return
    }

    console.log(`Found ${properties.length} properties to update with images`)

    // Update each property with sample images
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      
      // Assign 2-4 images per property
      const numImages = Math.floor(Math.random() * 3) + 2 // 2-4 images
      const propertyImages = []
      
      for (let j = 0; j < numImages; j++) {
        const imageIndex = (i * numImages + j) % samplePropertyImages.length
        propertyImages.push(samplePropertyImages[imageIndex])
      }

      // Update the property with images
      const { error: updateError } = await supabase!
        .from('properties')
        .update({ images: propertyImages })
        .eq('id', property.id)

      if (updateError) {
        console.error(`Error updating property ${property.title}:`, updateError)
      } else {
        console.log(`✅ Updated ${property.title} with ${propertyImages.length} images`)
      }
    }

    console.log('🎉 All properties updated with images!')
    
  } catch (error) {
    console.error('Error in updatePropertyImages:', error)
  }
}

// Run the script if called directly
if (require.main === module) {
  updatePropertyImages()
}
