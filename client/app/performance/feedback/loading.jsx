import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Page Header Skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-64 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Feedback Feed Skeleton (Left Side) */}
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-100 rounded-[40px] overflow-hidden bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-slate-50 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action/Insights Panel Skeleton (Right Side) */}
        <div className="space-y-6">
          <Card className="border-none bg-blue-50/50 rounded-[40px] p-8">
            <div className="h-5 w-32 bg-blue-100 rounded-lg animate-pulse mb-6" />
            <div className="space-y-4">
              <div className="h-14 w-full bg-white rounded-2xl animate-pulse" />
              <div className="h-14 w-full bg-white rounded-2xl animate-pulse" />
            </div>
          </Card>

          <Card className="border-slate-100 rounded-[40px] p-8">
            <div className="h-5 w-40 bg-slate-100 rounded-lg animate-pulse mb-4" />
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
              <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
              <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}