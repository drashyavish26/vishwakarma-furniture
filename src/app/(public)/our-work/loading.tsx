export default function OurWorkLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-cream-secondary border-b border-cream-secondary/50">
        <div className="section-container py-12">
          <div className="skeleton h-4 w-24 mb-2" />
          <div className="skeleton h-10 w-48 mb-2" />
          <div className="skeleton h-5 w-80" />
        </div>
      </div>
      <div className="section-container py-8">
        <div className="flex gap-2 flex-wrap mb-8">
          <div className="skeleton h-9 w-24" />
          <div className="skeleton h-9 w-20" />
          <div className="skeleton h-9 w-24" />
          <div className="skeleton h-9 w-28" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-cream-secondary overflow-hidden">
              <div className="skeleton aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-6 w-3/4" />
                <div className="skeleton h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
