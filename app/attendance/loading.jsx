export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200/60 rounded-2xl animate-pulse backdrop-blur-md" />
          <div className="h-4 w-48 bg-slate-100/60 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-32 bg-slate-200/60 rounded-xl animate-pulse" />
          <div className="h-12 w-32 bg-slate-200/60 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="h-32 bg-white/50 border border-white rounded-[24px] animate-pulse backdrop-blur-sm"
          />
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Large Chart Area */}
        <div className="lg:col-span-2">
          <div className="h-[400px] bg-white/50 border border-white rounded-[32px] animate-pulse backdrop-blur-md" />
        </div>

        {/* Side List Area */}
        <div className="lg:col-span-1">
          <div className="h-[400px] bg-white/50 border border-white rounded-[32px] animate-pulse backdrop-blur-md" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-40 bg-slate-200/60 rounded-lg animate-pulse" />
        <div className="h-[300px] bg-white/50 border border-white rounded-[32px] animate-pulse backdrop-blur-md" />
      </div>
    </div>
  )
}