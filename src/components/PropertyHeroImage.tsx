'use client'

import Image from 'next/image'

interface PropertyHeroImageProps {
  imageUrl: string
  title: string
}

export default function PropertyHeroImage({ imageUrl, title }: PropertyHeroImageProps) {
  return (
    <Image
      src={imageUrl}
      alt={title}
      fill
      className="object-cover"
      priority
      sizes="100vw"
    />
  )
}
