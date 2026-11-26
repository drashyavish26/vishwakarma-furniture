import { ProductCardSkeleton } from '@/components/ui/LoadingSkeleton'

export default function ProductsLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-secondary border-b border-cream-secondary/50">
        <div className="section-container py-12">
          <div className="skeleton h-10 w-48 mb-2" />
          <div className="skeleton h-5 w-80" />
        </div>
      </div>
      <div className="section-container py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="skeleton h-10 w-64" />
          <div className="skeleton h-10 w-20" />
          <div className="skeleton h-10 w-28" />
          <div className="skeleton h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
