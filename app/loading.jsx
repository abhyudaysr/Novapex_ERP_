export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10">
      <div className="max-w-[1600px] mx-auto animate-pulse">
        
        {/* Top Navigation Skeleton */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
            <div className="h-6 w-32 bg-slate-200 rounded-md" />
          </div>
          <div className="flex gap-4">
            <div className="w-40 h-10 bg-white border border-slate-100 rounded-xl" />
            <div className="w-10 h-10 bg-slate-200 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Main Metric Skeletons */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-[32px] border border-slate-100 p-6">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg mb-4" />
                  <div className="h-6 w-1/2 bg-slate-200 rounded" />
                </div>
              ))}
            </div>

            {/* Large Chart Area Skeleton */}
            <div className="h-[400px] bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between mb-8">
                <div className="h-6 w-48 bg-slate-100 rounded" />
                <div className="h-6 w-24 bg-slate-50 rounded" />
              </div>
              <div className="w-full h-64 bg-slate-50 rounded-2xl relative overflow-hidden">
                {/* Simulated Chart Line */}
                <div className="absolute inset-0 flex items-end px-4 gap-2">
                   {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
                     <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-slate-100 rounded-t-lg" />
                   ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar / Feed Skeleton */}
          <div className="lg:col-span-4 space-y-8">
             <div className="h-[250px] bg-slate-900 rounded-[40px] p-8">
               <div className="h-4 w-24 bg-slate-700 rounded mb-4" />
               <div className="h-8 w-48 bg-slate-800 rounded-lg mb-8" />
               <div className="space-y-3">
                 <div className="h-2 w-full bg-slate-800 rounded" />
                 <div className="h-2 w-2/3 bg-slate-800 rounded" />
               </div>
             </div>

             <div className="h-[400px] bg-white rounded-[40px] border border-slate-100 p-8">
                <div className="h-5 w-32 bg-slate-200 rounded mb-6" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4 mb-6">
                    <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
                    <div className="space-y-2 w-full">
                      <div className="h-3 w-3/4 bg-slate-100 rounded" />
                      <div className="h-2 w-1/2 bg-slate-50 rounded" />
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}