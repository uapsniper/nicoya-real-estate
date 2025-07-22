'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getPlaceholderImage } from '@/lib/placeholder-images'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  fill = false,
  priority = false,
  sizes
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Handle local image paths by converting them to placeholder URLs
  const getImageSrc = (originalSrc: string) => {
    if (originalSrc.startsWith('/images/')) {
      const imageName = originalSrc.replace('/images/', '')
      return getPlaceholderImage(imageName)
    }
    return originalSrc
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    // Fallback to placeholder image
    const fallbackSrc = getPlaceholderImage('placeholder-property.jpg')
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(false)
    }
  }

  const finalSrc = getImageSrc(imgSrc)

  const imageProps = {
    src: finalSrc,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    priority,
    sizes
  }

  if (fill) {
    return <Image {...imageProps} fill />
  }

  return (
    <Image 
      {...imageProps} 
      width={width || 600} 
      height={height || 400}
    />
  )
}
