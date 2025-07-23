'use client'

interface PropertyHeroImageProps {
  imageUrl: string
  title: string
}

export default function PropertyHeroImage({ imageUrl, title }: PropertyHeroImageProps) {
  return (
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-full object-cover"
      style={{ display: 'block' }}
    />
  )
}
