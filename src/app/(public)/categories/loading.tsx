import { CategoryCardSkeleton } from '@/components/ui/LoadingSkeleton'

export default function CategoriesLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-secondary border-b border-cream-secondary/50">
        <div className="section-container py-12">
          <div className="skeleton h-10 w-48 mb-2" />
          <div className="skeleton h-5 w-72" />
        </div>
      </div>
      <div className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
