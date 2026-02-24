export default function Loading() {
  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-slate-200/60 rounded-2xl animate-pulse backdrop-blur-md" />
          <div className="h-4 w-40 bg-slate-100/60 rounded-lg animate-pulse backdrop-blur-md" />
        </div>
        <div className="h-12 w-32 bg-slate-200/60 rounded-xl animate-pulse backdrop-blur-md" />
      </div>

      {/* Table/List Skeleton with Glass Effect */}
      <div className="glass-card rounded-[32px] border border-white/40 bg-white/20 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/50">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="flex items-center space-x-4 py-4 border-b border-white/20 last:border-0"
          >
            <div className="h-12 w-12 bg-slate-200/50 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 bg-slate-200/50 rounded animate-pulse" />
              <div className="h-3 w-1/6 bg-slate-100/50 rounded animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-slate-200/50 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
