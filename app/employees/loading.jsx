import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-3">
          <div className="h-10 w-48 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-14 w-40 bg-slate-200 rounded-2xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar/Navigation Skeleton */}
        <Card className="border-slate-100 rounded-[40px] overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
                  <div className="h-2 w-2/3 bg-slate-50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-slate-100 rounded-[40px] overflow-hidden bg-white h-[600px]">
            {/* Banner Skeleton */}
            <div className="h-32 bg-slate-100 animate-pulse relative">
              <div className="absolute -bottom-12 left-10 flex items-end gap-6">
                <div className="h-32 w-32 border-8 border-white bg-slate-200 rounded-[40px] animate-pulse" />
                <div className="pb-4 space-y-2">
                  <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse" />
                  <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
            
            <CardContent className="pt-24 px-10">
              {/* Tab Bar Skeleton */}
              <div className="h-14 w-full bg-slate-50 rounded-2xl animate-pulse mb-10" />
              
              {/* Content Grid Skeleton */}
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                  <div className="space-y-4">
                    <div className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse" />
                    <div className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse" />
                    <div className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                  <div className="h-48 w-full bg-slate-50 rounded-[32px] animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}