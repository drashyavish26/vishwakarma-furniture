'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ProductImage } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-cream-secondary rounded-sm flex items-center justify-center">
        <span className="text-teak/30 font-serif italic text-lg">No image available</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square bg-cream-secondary rounded-sm overflow-hidden group">
        <Image
          src={images[activeIdx].image_url}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx(i => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 text-espresso" />
            </button>
            <button
              onClick={() => setActiveIdx(i => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5 text-espresso" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-colors ${
                idx === activeIdx ? 'border-champagne' : 'border-transparent'
              }`}
            >
              <Image src={img.image_url} alt={`${productName} ${idx + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
