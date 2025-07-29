#!/usr/bin/env tsx

import { PropertyImagesService } from '../lib/property-images-service'

/**
 * Migration script to sync existing properties with the property_images table
 * This ensures both admin uploads and API uploads are consistent
 */

async function main() {
  console.log('🚀 Starting property images migration...')
  
  try {
    const result = await PropertyImagesService.migratePropertiesToImageTable()
    
    if (result.success) {
      console.log(`✅ Migration completed successfully!`)
      console.log(`📊 Processed ${result.processed} properties`)
      
      if (result.errors.length > 0) {
        console.log(`⚠️  Some warnings occurred:`)
        result.errors.forEach(error => {
          console.log(`   - ${error}`)
        })
      }
    } else {
      console.log(`❌ Migration failed:`)
      result.errors.forEach(error => {
        console.log(`   - ${error}`)
      })
    }
  } catch (error) {
    console.error('💥 Migration error:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { main as migratePropertyImages }