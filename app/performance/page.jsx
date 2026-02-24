"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Target, TrendingUp, Award, Users, 
  Calendar, Star, Filter, Plus, ChevronRight,
  ArrowUpRight, ArrowDownRight, MessageSquare, Zap
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PerformancePage() {
  const [animateCards, setAnimateCards] = useState(false)
  const [userRole, setUserRole] = useState("hr")

  useEffect(() => {
    setAnimateCards(true)
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  // Role-based Stats configuration
  const performanceStats = isEmployee 
    ? [
        { title: "Current Rating", value: "4.8/5", change: "+0.2", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
        { title: "Personal Goals", value: "6/8", change: "75%", icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Next Review", value: "14 Days", change: "Mar 15", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Skill Points", value: "+1.2k", change: "+150", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
      ]
    : [
        { title: "Avg Rating", value: "4.2/5", change: "+0.3", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
        { title: "Goal Completion", value: "87%", change: "+12%", icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Active Reviews", value: "15", change: "-5", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: isHR ? "High Potentials" : "Team Size", value: isHR ? "23" : "12", change: "+8", icon: isHR ? Award : Users, color: "text-purple-600", bg: "bg-purple-50" },
      ]

  const recentReviews = [
    { name: "Sarah Johnson", dept: "Engineering", rating: 4.5, status: "Completed", date: "Jan 15", goals: "7/8" },
    { name: "Michael Chen", dept: "Product", rating: 4.8, status: "Completed", date: "Jan 10", goals: "6/6" },
    { name: "Emily Davis", dept: "Design", rating: null, status: "In Progress", date: "Feb 01", goals: "3/5" },
  ]

  // Filter reviews: Employees only see their own history
  const displayReviews = isEmployee 
    ? recentReviews.filter(r => r.name === "Sarah Johnson") 
    : recentReviews

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Header - Role Sensitive */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            {isEmployee ? "My Growth" : "Performance"} <span className="text-blue-600">{isEmployee ? "Dashboard" : "Hub"}</span>
          </h1>
          <p className="text-slate-500 font-medium">
            {isHR ? "Holistic talent analytics and evaluation oversight." : isManager ? "Manage team evaluations and productivity." : "Track your achievements and upcoming milestones."}
          </p>
        </div>
        <div className="flex gap-3">
          {!isEmployee && (
            <Button variant="outline" className="h-12 rounded-xl border-slate-200 font-bold px-6">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          )}
          <Button className="bg-slate-900 hover:bg-blue-600 text-white h-12 rounded-xl font-bold px-6 shadow-lg shadow-slate-200 transition-all">
            {isEmployee ? (
              <><Zap className="w-4 h-4 mr-2" /> Self Assessment</>
            ) : (
              <><Plus className="w-4 h-4 mr-2" /> {isHR ? "New Cycle" : "Review Member"}</>
            )}
          </Button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={animateCards ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none bg-white rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                  <div className="flex items-end gap-2">
                    <h2 className="text-2xl font-black text-slate-900">{stat.value}</h2>
                    <span className={`text-[10px] font-bold mb-1 flex items-center ${stat.change.includes('+') ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {stat.change.includes('+') && <ArrowUpRight className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Review Queue / History */}
        <Card className="lg:col-span-2 border-none bg-white rounded-[40px] shadow-xl shadow-slate-200/40 overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
                {isEmployee ? "Review History" : "Recent Evaluations"}
              </CardTitle>
              <CardDescription className="font-medium text-slate-400">
                {isEmployee ? "Your past performance results" : "Activity across departments"}
              </CardDescription>
            </div>
            {!isEmployee && (
              <Link href="/performance/reviews" className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">View All</Link>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {displayReviews.map((review, i) => (
              <div key={i} className="flex items-center justify-between p-8 hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm">
                    <AvatarFallback className="font-black bg-slate-100">{review.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-black text-slate-900">{review.name}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">{review.dept}</p>
                  </div>
                </div>
                <div className="flex items-center gap-12">
                   <div className="hidden md:block">
                      <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Goals</p>
                      <p className="text-sm font-bold text-slate-700">{review.goals}</p>
                   </div>
                   <div className="text-right min-w-[100px]">
                      <Badge className={`rounded-full px-3 py-1 font-black text-[9px] uppercase ${review.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {review.status}
                      </Badge>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">{review.date}</p>
                   </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Sidebar - Role Sensitive */}
        <div className="space-y-6">
          <Card className="border-none bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-200">
            <h3 className="font-black text-xl mb-6">Quick Actions</h3>
            <div className="grid gap-4">
              <Link href={isEmployee ? "/performance/my-goals" : "/performance/goals"}>
                <Button className="w-full justify-between h-14 bg-white/5 hover:bg-blue-600 rounded-2xl px-6 transition-all group">
                  <span className="font-bold">{isEmployee ? "Update My Goals" : "Set Team Goals"}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button className="w-full justify-between h-14 bg-white/5 hover:bg-blue-600 rounded-2xl px-6 transition-all group">
                <span className="font-bold">{isEmployee ? "Request Feedback" : "360° Feedback"}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              {isHR && (
                <Button className="w-full justify-between h-14 bg-white/5 hover:bg-blue-600 rounded-2xl px-6 transition-all group">
                  <span className="font-bold">Export Reports</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </Card>

          <Card className="border-none bg-blue-50 rounded-[40px] p-8 overflow-hidden relative">
            <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-100 rotate-12" />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                {isEmployee ? "Tips for Growth" : "Insights"}
              </p>
              <h4 className="text-lg font-black text-slate-900 leading-tight mb-4">
                {isEmployee 
                  ? "You're in the top 5% of Engineers this month." 
                  : "Productivity is up 12% this quarter."}
              </h4>
              <p className="text-sm font-medium text-slate-600 mb-6">
                {isEmployee 
                  ? "Complete your Python certification to unlock Senior Developer tracks." 
                  : "Engineering department leads in goal completion velocity."}
              </p>
              <Button variant="link" className="p-0 h-auto text-blue-600 font-black text-xs uppercase tracking-widest">
                {isEmployee ? "View Roadmap" : "See Analysis"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}