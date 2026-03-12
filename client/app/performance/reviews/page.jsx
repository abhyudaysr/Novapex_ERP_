"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  TrendingUp, Star, Search, Filter, 
  ArrowLeft, Plus, Edit, Eye, CheckCircle2, 
  Clock, AlertCircle, ShieldCheck, UserCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PerformanceReviewsPage() {
  const [userRole, setUserRole] = useState("hr")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const reviews = [
    {
      id: 1,
      employee: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      department: "Engineering",
      role: "Senior Software Engineer",
      reviewer: "John Smith",
      reviewPeriod: "Q4 2025",
      rating: 4.5,
      status: "Completed",
      nextReview: "2026-07-15",
      strengths: ["Technical expertise", "Leadership"],
      goals: 8,
      goalsCompleted: 7,
    },
    {
      id: 2,
      employee: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?u=mike",
      department: "Product",
      role: "Product Manager",
      reviewer: "Lisa Rodriguez",
      reviewPeriod: "Q4 2025",
      rating: 4.8,
      status: "Completed",
      nextReview: "2026-07-10",
      strengths: ["Strategic thinking", "Innovation"],
      goals: 6,
      goalsCompleted: 6,
    },
    {
      id: 3,
      employee: "Emily Davis",
      avatar: "https://i.pravatar.cc/150?u=emily",
      department: "Design",
      role: "UX Designer",
      reviewer: "John Smith",
      reviewPeriod: "Q1 2026",
      rating: null,
      status: "In Progress",
      nextReview: "2026-03-01",
      strengths: [],
      goals: 5,
      goalsCompleted: 3,
    },
  ]

  // Stats vary based on role context
  const reviewStats = isEmployee ? [
    { title: "Your Avg Rating", value: "4.7", color: "text-blue-600", icon: Star },
    { title: "Reviews Done", value: "12", color: "text-emerald-600", icon: CheckCircle2 },
    { title: "Next Milestone", value: "14d", color: "text-amber-600", icon: Clock },
    { title: "Goal Progress", value: "85%", color: "text-slate-900", icon: TrendingUp },
  ] : [
    { title: "Completed", value: "28", color: "text-emerald-600", icon: CheckCircle2 },
    { title: "In Progress", value: "08", color: "text-blue-600", icon: Clock },
    { title: "Pending", value: "12", color: "text-amber-600", icon: AlertCircle },
    { title: "Avg Rating", value: "4.3", color: "text-slate-900", icon: Star },
  ]

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100"
      case "In Progress": return "bg-blue-50 text-blue-600 border-blue-100"
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-100"
      default: return "bg-slate-50 text-slate-600"
    }
  }

  // Employees only see their own review card (simulated filter)
  const filteredReviews = isEmployee ? reviews.filter(r => r.employee === "Sarah Johnson") : reviews

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isHR ? "Talent Calibration" : isManager ? "Team Performance" : "Personal Growth"}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            {isEmployee ? "My" : "Performance"} <span className="text-blue-600">Reviews</span>
          </h1>
          <p className="text-slate-500 font-medium">
            {isHR ? "Calibrate company talent through structured data." : isManager ? "Review and coach your direct reports." : "Track your professional evolution."}
          </p>
        </div>
        
        {/* Actions limited to Managers/HR */}
        {!isEmployee && (
          <Button className="bg-slate-900 hover:bg-blue-600 text-white h-14 px-8 rounded-2xl font-black transition-all shadow-xl shadow-slate-200">
            <Plus className="w-5 h-5 mr-2" />
            {isHR ? "New Review Cycle" : "Evaluate Member"}
          </Button>
        )}
      </div>

      {/* Role-Specific High-Level Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reviewStats.map((stat, i) => (
          <Card key={i} className="border-none bg-white rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Role Badging */}
      <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={isEmployee ? "Search feedback history..." : "Search by name, role, or department..."}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-medium text-sm transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Badge className="bg-slate-900 text-white border-none py-2 px-4 rounded-xl flex gap-2">
              {isHR ? <ShieldCheck className="w-3 h-3" /> : <UserCircle className="w-3 h-3" />}
              <span className="text-[10px] font-black uppercase tracking-tighter">{userRole} Access</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="rounded-[40px] border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 rounded-2xl border-4 border-slate-50">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback className="rounded-2xl font-black">{review.employee[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{review.employee}</h3>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{review.role}</p>
                      </div>
                    </div>
                    <Badge className={`rounded-full px-4 py-1.5 font-black text-[10px] uppercase border ${getStatusStyle(review.status)}`}>
                      {review.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-4 space-y-8">
                  <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-[32px]">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Period</p>
                      <p className="text-sm font-bold text-slate-700">{review.reviewPeriod}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {isEmployee ? "Reviewer" : "Assigned To"}
                      </p>
                      <p className="text-sm font-bold text-slate-700">{review.reviewer}</p>
                    </div>
                  </div>

                  {/* Goal Realization: HR/Managers see team stats, Employees see personal */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {isEmployee ? "My Progress" : "Objective Achievement"}
                      </span>
                      <span className="text-sm font-black text-slate-900">{Math.round((review.goalsCompleted/review.goals)*100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(review.goalsCompleted / review.goals) * 100}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-2">
                       {review.status === "Completed" ? (
                         <Button variant="ghost" className="rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50">
                           <Eye className="w-4 h-4 mr-2" /> View Full Report
                         </Button>
                       ) : (
                         <Button className="bg-blue-600 hover:bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest px-6 transition-all">
                           {isEmployee ? <Plus className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                           {isEmployee ? "Self Assessment" : "Resume Evaluation"}
                         </Button>
                       )}
                    </div>
                    {isHR && (
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Compliance</p>
                         <p className="text-xs font-bold text-emerald-600">Verified</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}