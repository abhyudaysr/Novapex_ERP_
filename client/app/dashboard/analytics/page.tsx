"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/page-header"
import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  Heart, 
  GraduationCap, 
  ArrowUpRight,
  Filter,
  Zap,
  Target,
  Award
} from "lucide-react"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [userRole, setUserRole] = useState("hr")

  useEffect(() => {
    const stored = sessionStorage.getItem("userRole")
    if (stored) setUserRole(stored.toLowerCase())
    
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  // Role-Based Metrics Mapping
  const getMetrics = () => {
    if (isEmployee) {
      return [
        { label: "My Productivity", value: 94, change: "+2%", trend: "up", icon: <Activity className="w-4 h-4 text-blue-500" /> },
        { label: "Skill Acquisition", value: 78, change: "+15%", trend: "up", icon: <GraduationCap className="w-4 h-4 text-emerald-500" /> },
        { label: "Task Accuracy", value: 98, change: "+1%", trend: "up", icon: <Target className="w-4 h-4 text-indigo-500" /> },
        { label: "Wellness Index", value: 85, change: "-2%", trend: "down", icon: <Heart className="w-4 h-4 text-rose-500" /> },
      ]
    }
    if (isManager) {
      return [
        { label: "Team Velocity", value: 89, change: "+4%", trend: "up", icon: <Zap className="w-4 h-4 text-amber-500" /> },
        { label: "Project Health", value: 92, change: "+7%", trend: "up", icon: <Activity className="w-4 h-4 text-blue-500" /> },
        { label: "Team Morale", value: 84, change: "+3%", trend: "up", icon: <Heart className="w-4 h-4 text-rose-500" /> },
        { label: "Review Completion", value: 100, change: "0%", trend: "up", icon: <Target className="w-4 h-4 text-emerald-500" /> },
      ]
    }
    return [
      { label: "Org Satisfaction", value: 87, change: "+5%", trend: "up", icon: <Heart className="w-4 h-4 text-rose-500" /> },
      { label: "Global Productivity", value: 92, change: "+12%", trend: "up", icon: <Activity className="w-4 h-4 text-blue-500" /> },
      { label: "Retention Rate", value: 92, change: "+3%", trend: "up", icon: <Users className="w-4 h-4 text-amber-500" /> },
      { label: "L&D Engagement", value: 94, change: "+8%", trend: "up", icon: <GraduationCap className="w-4 h-4 text-emerald-500" /> },
    ]
  }

  // Data mapping for the main list
  const getBreakdownData = () => {
    if (isEmployee) {
      return [
        { name: "React/Next.js", employees: "Advanced", productivity: 95, satisfaction: 90, color: "bg-blue-500" },
        { name: "System Design", employees: "Intermediate", productivity: 75, satisfaction: 82, color: "bg-emerald-500" },
        { name: "Team Mentorship", employees: "Active", productivity: 88, satisfaction: 95, color: "bg-purple-500" },
      ]
    }
    // HR and Manager see Departmental/Team data
    return [
      { name: "Engineering", employees: 45, productivity: 95, satisfaction: 89, color: "bg-blue-500" },
      { name: "Sales", employees: 32, productivity: 88, satisfaction: 85, color: "bg-emerald-500" },
      { name: "Marketing", employees: 28, productivity: 91, satisfaction: 92, color: "bg-purple-500" },
      { name: "HR", employees: 12, productivity: 87, satisfaction: 88, color: "bg-orange-500" },
    ]
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-[24px]"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-100 rounded-[32px]"></div>
      </div>
    )
  }

  return (
    <div className="page-shell p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <PageHeader
        eyebrow="Signal Board"
        statusLabel={isEmployee ? "Self Metrics" : isManager ? "Team View" : "Enterprise"}
        title={`${isEmployee ? "My Productivity" : isManager ? "Team" : "Organizational"} Intelligence`}
        description={
          isEmployee
            ? "Your personal performance metrics and skill growth."
            : "Real-time performance heuristics and health monitoring."
        }
      >
        <div className="section-shell flex items-center gap-2 p-1.5">
          <div className="p-2 text-slate-400"><Filter className="w-4 h-4" /></div>
          {["7d", "30d", "90d", "1y"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={`rounded-xl px-5 font-bold transition-all ${timeRange === range ? "bg-blue-600 shadow-lg shadow-blue-200" : "text-slate-500"}`}
            >
              {range}
            </Button>
          ))}
        </div>
      </PageHeader>

      {/* High-Level Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getMetrics().map((metric) => (
          <Card key={metric.label} className="border-none shadow-xl shadow-slate-200/50 bg-white/70 backdrop-blur-md rounded-[28px] overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {metric.icon}
                </div>
                <Badge className={`rounded-full border-none font-black ${metric.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {metric.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
                <h3 className="text-3xl font-black text-slate-900">{metric.value}%</h3>
              </div>
              <div className="mt-4">
                <Progress value={metric.value} className="h-1.5 bg-slate-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/60 rounded-[32px] bg-white">
          <CardHeader className="p-8 pb-0">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">
                    {isEmployee ? "Skill Proficiency" : isManager ? "Direct Report Overview" : "Departmental Efficiency"}
                </CardTitle>
                <CardDescription className="font-medium text-slate-400">
                    {isEmployee ? "Tracking your technical evolution" : "Benchmarking performance across your scope"}
                </CardDescription>
              </div>
              {!isEmployee && (
                <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200">
                  Detailed Report <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {getBreakdownData().map((dept) => (
                <div key={dept.name} className="group/item">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                      <span className="font-black text-slate-800 tracking-tight">{dept.name}</span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">{dept.employees}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                        {isEmployee ? "Confidence" : "Prod"}: <span className="text-slate-900">{dept.productivity}%</span>
                      </span>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                        {isEmployee ? "Interest" : "Sat"}: <span className="text-slate-900">{dept.satisfaction}%</span>
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Progress value={dept.productivity} className="h-1.5" />
                    <Progress value={dept.satisfaction} className="h-1.5 opacity-60" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action/Forecast Card */}
        <Card className={`border-none shadow-2xl shadow-slate-200/60 rounded-[32px] overflow-hidden relative ${isEmployee ? 'bg-blue-600' : 'bg-slate-900'} text-white`}>
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black tracking-tight">
                {isEmployee ? "Career Path" : "Projected Growth"}
            </CardTitle>
            <CardDescription className="text-slate-300 font-medium italic">
                {isEmployee ? "Next Milestone: Senior" : "Quarterly Forecasts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center justify-center h-full pb-20">
              <div className={`w-full h-48 ${isEmployee ? 'bg-white/10' : 'bg-white/5'} rounded-3xl border border-white/10 flex flex-col items-center justify-center border-dashed group hover:bg-white/20 transition-all cursor-help`}>
                {isEmployee ? (
                    <Award className="w-12 h-12 text-white mb-4 animate-pulse" />
                ) : (
                    <TrendingUp className="w-12 h-12 text-blue-400 mb-4 animate-bounce" />
                )}
                <p className="font-bold text-sm tracking-widest uppercase text-white">
                    {isEmployee ? "Certification Goal" : "Chart Engine Ready"}
                </p>
                <p className="text-[10px] text-slate-300 mt-2 px-6 text-center">
                    {isEmployee ? "85% progress toward Lead Engineer role. Review criteria." : "Waiting for Recharts or Chart.js integration to render vector flows."}
                </p>
              </div>
              {isEmployee && (
                  <Button className="w-full mt-6 bg-white text-blue-600 hover:bg-slate-100 font-black rounded-2xl">
                      Open Growth Plan
                  </Button>
              )}
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-400" />
        </Card>
      </div>
    </div>
  )
}
