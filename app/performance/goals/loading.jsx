import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Page Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-4 w-80 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-14 w-44 bg-slate-200 rounded-2xl animate-pulse" />
      </div>

      {/* Goal Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-none bg-slate-50/50 rounded-[32px] p-6 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-200 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-2 w-16 bg-slate-200 rounded animate-pulse" />
              <div className="h-6 w-12 bg-slate-300 rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Goals List Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 w-40 bg-slate-200 rounded-lg animate-pulse mb-4 ml-2" />
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-slate-100 rounded-[40px] overflow-hidden bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-3 flex-1">
                    <div className="h-6 w-3/4 bg-slate-100 rounded-xl animate-pulse" />
                    <div className="h-3 w-1/2 bg-slate-50 rounded-lg animate-pulse" />
                  </div>
                  <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse" />
                </div>
                
                {/* Progress Bar Skeleton */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-2 w-20 bg-slate-50 rounded animate-pulse" />
                    <div className="h-2 w-10 bg-slate-50 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-slate-200 w-1/3 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Milestones/Timeline Sidebar Skeleton */}
        <div className="space-y-8">
          <Card className="border-none bg-slate-900 rounded-[40px] p-8 h-[400px]">
            <div className="h-5 w-32 bg-slate-700 rounded-lg animate-pulse mb-8" />
            <div className="space-y-8 relative">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 animate-pulse shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-full bg-slate-800 rounded animate-pulse" />
                    <div className="h-2 w-1/2 bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}