export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 rounded-2xl w-72"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-96"></div>
        </div>
        <div className="h-14 bg-slate-100 rounded-2xl w-44 shadow-sm"></div>
      </div>

      {/* Analytics Summary Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white border border-slate-100 rounded-[32px] p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-slate-100 rounded-full w-20"></div>
              <div className="h-6 bg-slate-200 rounded-lg w-12"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Department Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="h-64 bg-white border border-slate-50 rounded-[40px] p-8 space-y-6 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-slate-100 rounded-[20px]"></div>
              <div className="w-24 h-6 bg-slate-50 rounded-full"></div>
            </div>
            
            <div className="space-y-3">
              <div className="h-6 bg-slate-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded-lg w-full"></div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100"></div>
                ))}
              </div>
              <div className="h-4 bg-slate-100 rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}