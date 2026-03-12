export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 bg-slate-200 rounded-2xl w-64"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-96"></div>
        </div>
        <div className="h-12 bg-slate-100 rounded-2xl w-48"></div>
      </div>

      {/* Report Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="h-48 bg-white border border-slate-100 rounded-[32px] p-6 space-y-4"
          >
            <div className="flex justify-between">
              <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
              <div className="w-16 h-6 bg-slate-50 rounded-full"></div>
            </div>
            <div className="h-6 bg-slate-100 rounded-lg w-3/4"></div>
            <div className="h-4 bg-slate-50 rounded-lg w-1/2"></div>
          </div>
        ))}
      </div>

      {/* Main Table/Chart Skeleton */}
      <div className="bg-white border border-slate-100 rounded-[40px] p-8 h-[400px] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-slate-100 rounded-xl w-48"></div>
          <div className="h-8 bg-slate-50 rounded-xl w-32"></div>
        </div>
        <div className="flex-1 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-50/50 rounded-2xl w-full"></div>
          ))}
        </div>
      </div>
    </div>
  )
}