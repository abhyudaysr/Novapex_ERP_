export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10">
      <div className="max-w-7xl mx-auto animate-pulse">
        
        {/* Header Skeleton */}
        <div className="mb-12 space-y-3">
          <div className="h-10 bg-slate-200 rounded-2xl w-64" />
          <div className="h-4 bg-slate-200 rounded-lg w-96" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main Settings Grid Skeleton */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm h-48 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-4" />
                    <div className="h-5 bg-slate-200 rounded-lg w-3/4 mb-2" />
                  </div>
                  <div className="h-3 bg-slate-100 rounded-md w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeletons */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 h-64">
              <div className="h-6 bg-slate-200 rounded-lg w-1/2 mb-6" />
              <div className="space-y-4">
                <div className="h-10 bg-slate-50 rounded-xl w-full" />
                <div className="h-10 bg-slate-50 rounded-xl w-full" />
                <div className="h-10 bg-slate-50 rounded-xl w-full" />
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-[32px] p-8 h-40">
              <div className="h-4 bg-slate-700 rounded w-1/3 mb-4" />
              <div className="h-8 bg-slate-800 rounded-xl w-3/4" />
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}