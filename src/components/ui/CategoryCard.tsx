import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/types'
import { ArrowRight } from 'lucide-react'

const CATEGORY_ICONS: Record<string, string> = {
  'sofa-sets': '🛋️',
  'wooden-beds': '🛏️',
  'sagwan-furniture': '🪵',
  'dining-tables': '🍽️',
  'sofa-fabrics': '🧵',
  'mattresses': '😴',
  'customized-furniture': '✏️',
  'other-furniture': '🏠',
}

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className="relative aspect-square rounded-sm overflow-hidden bg-cream-secondary card-hover">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cream to-cream-secondary">
            <span className="text-5xl mb-3">{CATEGORY_ICONS[category.slug] || '🪑'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif text-white text-lg font-semibold">{category.name}</h3>
          <div className="flex items-center gap-1 text-champagne text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Explore</span><ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  )
}
