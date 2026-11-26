export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-sm overflow-hidden border border-cream-secondary">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-8 w-1/3" />
        <div className="flex gap-2">
          <div className="skeleton h-10 flex-1" />
          <div className="skeleton h-10 flex-1" />
        </div>
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return <div className="skeleton aspect-square rounded-sm" />
}
