import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { WhatsAppButton } from './WhatsAppButton'
import { ExternalLink, Wrench } from 'lucide-react'

interface ProductCardProps {
  product: Product
  whatsapp?: string
}

export function ProductCard({ product, whatsapp = '919876543210' }: ProductCardProps) {
  const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0]

  return (
    <div className="group bg-white rounded-sm overflow-hidden card-hover shadow-sm border border-cream-secondary">
      <div className="relative aspect-[4/3] bg-cream-secondary overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream-secondary">
            <span className="text-teak/40 text-sm font-serif italic">No image</span>
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 bg-espresso/80 text-cream text-xs px-2 py-1 rounded-sm backdrop-blur-sm">
            {typeof product.category === 'object' ? product.category.name : product.category}
          </span>
        )}
        {product.customization_available && (
          <span className="absolute top-3 right-3 bg-champagne text-espresso text-xs px-2 py-1 rounded-sm flex items-center gap-1">
            <Wrench className="w-3 h-3" /> Custom
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-espresso mb-1 line-clamp-2 group-hover:text-teak transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-espresso/60 text-sm mb-3 line-clamp-2 font-sans">{product.description}</p>
        )}
        {product.material && (
          <p className="text-teak text-xs font-medium mb-3">Material: {product.material}</p>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="font-serif text-champagne-dark font-semibold text-lg">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href={`/products/${product.slug}`}
            className="btn-secondary text-xs px-3 py-2 flex-1 justify-center"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Details
          </Link>
          <WhatsAppButton whatsapp={whatsapp} productName={product.name} className="flex-1 justify-center" />
        </div>
      </div>
    </div>
  )
}
