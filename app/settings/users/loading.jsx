export default function Loading() {
  return (
    <div className="page-shell p-6 md:p-10 animate-pulse">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Skeleton */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-200" />
          <div className="space-y-3">
            <div className="h-10 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-64 bg-slate-200 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main List Skeleton */}
          <div className="xl:col-span-3 space-y-4">
            {/* Search/Filter Bar Skeleton */}
            <div className="h-16 w-full bg-white rounded-[24px] border border-slate-100 mb-8" />
            
            {/* User Row Skeletons */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-48 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-slate-100 rounded-full" />
                  <div className="h-8 w-8 bg-slate-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <aside className="space-y-6">
            <div className="h-64 bg-white rounded-[32px] border border-slate-100" />
            <div className="h-48 bg-white rounded-[32px] border border-slate-100" />
          </aside>

        </div>
      </div>
    </div>
  )
}
