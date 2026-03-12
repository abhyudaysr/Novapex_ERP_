import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-3">
          <div className="h-12 w-64 bg-slate-200 rounded-[20px] animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-14 w-40 bg-slate-200 rounded-2xl animate-pulse shadow-sm" />
      </div>

      {/* Metric Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white border border-slate-100 rounded-[32px] p-6 space-y-4 shadow-sm">
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
            <div className="h-8 w-12 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Performance Analytics Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 h-[450px]">
            <div className="flex justify-between items-center mb-10">
              <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-8 w-32 bg-slate-100 rounded-full animate-pulse" />
            </div>
            {/* Simulated Chart Area */}
            <div className="flex items-end justify-between h-64 px-4">
              {[60, 80, 45, 90, 70, 55, 85].map((height, i) => (
                <div 
                  key={i} 
                  className="w-12 bg-slate-100 rounded-t-2xl animate-pulse" 
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Action Sidebar Skeleton */}
        <div className="space-y-8">
          <Card className="border-none bg-slate-900 rounded-[40px] p-8 h-[220px] relative overflow-hidden">
            <div className="h-5 w-36 bg-slate-700 rounded-lg animate-pulse mb-6" />
            <div className="space-y-4">
              <div className="h-12 w-full bg-slate-800 rounded-2xl animate-pulse" />
              <div className="h-12 w-full bg-slate-800 rounded-2xl animate-pulse" />
            </div>
          </Card>

          <Card className="border-slate-100 rounded-[40px] p-8 h-[200px] bg-white shadow-sm">
            <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse mb-6" />
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 animate-pulse" />
              <div className="space-y-2 flex-1 pt-2">
                <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-slate-50 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}