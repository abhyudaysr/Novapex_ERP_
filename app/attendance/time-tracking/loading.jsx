export default function Loading() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end mb-4">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200/60 rounded-2xl animate-pulse backdrop-blur-md" />
          <div className="h-4 w-48 bg-slate-100/60 rounded-lg animate-pulse backdrop-blur-md" />
        </div>
        <div className="h-12 w-40 bg-slate-200/60 rounded-xl animate-pulse backdrop-blur-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Clock Skeleton */}
        <div className="lg:col-span-1">
          <div className="glass-card h-[400px] rounded-[40px] border border-white/40 bg-white/20 backdrop-blur-xl p-8 flex flex-col items-center justify-center space-y-6">
            <div className="h-32 w-32 rounded-full bg-slate-200/50 animate-pulse" />
            <div className="h-12 w-48 bg-slate-200/50 rounded-2xl animate-pulse" />
            <div className="h-14 w-full bg-slate-300/40 rounded-2xl animate-pulse mt-4" />
          </div>
        </div>

        {/* Right Column: List Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-32 bg-slate-200/60 rounded-lg animate-pulse mb-6" />
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="glass-card rounded-3xl border border-white/40 bg-white/20 backdrop-blur-md p-5 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-slate-200/50 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200/50 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-slate-100/50 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-8 w-24 bg-slate-200/50 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
