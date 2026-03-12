import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Page Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-3">
          <div className="h-10 w-72 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-14 w-56 bg-slate-200 rounded-2xl animate-pulse" />
      </div>

      {/* Appraisal Cycle Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-slate-50 border border-slate-100 rounded-[24px] animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Main Reviews Table/List Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="h-5 w-40 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-8 w-32 bg-slate-100 rounded-full animate-pulse" />
          </div>

          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="border-slate-100 rounded-[32px] overflow-hidden bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Avatar Skeleton */}
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 animate-pulse shrink-0" />
                  
                  {/* Name & Role */}
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                  </div>

                  {/* Date & Status */}
                  <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                    <div className="h-3 w-20 bg-slate-50 rounded animate-pulse" />
                    <div className="h-6 w-24 bg-slate-100 rounded-full animate-pulse" />
                  </div>

                  {/* Action Arrow */}
                  <div className="h-10 w-10 rounded-xl bg-slate-50 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar Insights Skeleton */}
        <div className="space-y-8">
          <Card className="border-none bg-slate-900 rounded-[40px] p-8 h-[350px] relative overflow-hidden">
            <div className="h-6 w-32 bg-slate-700 rounded-lg animate-pulse mb-8" />
            <div className="space-y-6">
                <div className="h-12 w-full bg-slate-800 rounded-2xl animate-pulse" />
                <div className="h-12 w-full bg-slate-800 rounded-2xl animate-pulse" />
                <div className="h-24 w-full bg-slate-800/50 rounded-2xl animate-pulse" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}