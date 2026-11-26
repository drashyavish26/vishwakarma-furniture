export default function AdminDashboardLoading() {
  return (
    <div>
      <div className="skeleton h-9 w-60 mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-sm p-5 border border-cream-secondary space-y-3">
            <div className="skeleton w-10 h-10 rounded-sm" />
            <div className="skeleton h-8 w-16" />
            <div className="skeleton h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-sm border border-cream-secondary p-5 space-y-4">
        <div className="skeleton h-6 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <div className="skeleton w-12 h-12 rounded-sm flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-48" />
                <div className="skeleton h-3 w-28" />
              </div>
              <div className="skeleton h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
