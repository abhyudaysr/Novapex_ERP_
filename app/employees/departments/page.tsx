"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Building2, 
  Plus, 
  TrendingUp, 
  Users2, 
  Target, 
  Wallet, 
  ArrowUpRight, 
  Briefcase,
  Lock 
} from "lucide-react"

export default function DepartmentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState("hr") // Default role

  useEffect(() => {
    const stored = sessionStorage.getItem("userRole")
    if (stored) setUserRole(stored.toLowerCase())
    
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const departments = [
    {
      id: 1,
      name: "Engineering",
      description: "Software development and technical operations",
      headOfDepartment: "Sarah Johnson",
      headAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      employeeCount: 45,
      budget: "$2.4M",
      budgetUsed: 78,
      performance: 94,
      projects: 12,
      openPositions: 3,
      color: "bg-blue-600",
    },
    {
      id: 2,
      name: "Sales",
      description: "Revenue generation and client acquisition",
      headOfDepartment: "Mike Chen",
      headAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      employeeCount: 32,
      budget: "$1.8M",
      budgetUsed: 65,
      performance: 88,
      projects: 8,
      openPositions: 2,
      color: "bg-emerald-600",
    },
    {
      id: 3,
      name: "Marketing",
      description: "Brand management and customer engagement",
      headOfDepartment: "Emily Rodriguez",
      headAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      employeeCount: 28,
      budget: "$1.2M",
      budgetUsed: 82,
      performance: 91,
      projects: 15,
      openPositions: 1,
      color: "bg-purple-600",
    },
    {
      id: 4,
      name: "Finance",
      description: "Financial planning and accounting",
      headOfDepartment: "Alex Thompson",
      headAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      employeeCount: 18,
      budget: "$1.0M",
      budgetUsed: 69,
      performance: 93,
      projects: 6,
      openPositions: 1,
      color: "bg-slate-800",
    },
  ]

  // Role Filtering: Managers only see their dept (Engineering), HR sees all
  const visibleDepartments = isHR 
    ? departments 
    : isManager 
      ? departments.filter(d => d.name === "Engineering") 
      : departments;

  const stats = [
    { label: "Talent Pool", value: "135", icon: <Users2 className="w-5 h-5" />, trend: "+4% vs Last Q", hide: isEmployee },
    { label: "Active Units", value: "6", icon: <Building2 className="w-5 h-5" />, trend: "Fully Operational", hide: false },
    { label: "Op-Ex projects", value: "45", icon: <Target className="w-5 h-5" />, trend: "12 In Pipeline", hide: isEmployee },
    { label: "Open Reqs", value: "9", icon: <Briefcase className="w-5 h-5" />, trend: "Hiring Active", hide: isEmployee },
  ].filter(s => !s.hide);

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="h-10 bg-slate-100 rounded-xl w-64 animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-xl w-40 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-50 border border-slate-100 rounded-[32px] animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Unit <span className="text-blue-600">{isEmployee ? "Directory" : "Intelligence"}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isHR ? "Cross-departmental performance and capital allocation." : isManager ? "Detailed analytics for your operational unit." : "Corporate structure and leadership overview."}
          </p>
        </div>
        {isHR && (
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-7 px-8 font-bold shadow-xl shadow-slate-200 flex gap-2 group transition-all">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Provision Unit
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">{stat.icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded-lg">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      {/* Department Cards */}
      <div className={`grid grid-cols-1 ${!isManager ? 'lg:grid-cols-2' : ''} gap-8`}>
        {visibleDepartments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white border border-slate-100 rounded-[40px] p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${dept.color} opacity-5 rounded-bl-[100px] transition-transform duration-700`} />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="space-y-1">
                <Badge className={`${dept.color} text-white border-none px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2`}>
                  Active Unit
                </Badge>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{dept.name}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[280px]">{dept.description}</p>
              </div>
              {!isEmployee && (
                <div className="text-right">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{dept.employeeCount}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Assets</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl mb-8 border border-slate-100/50">
              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                <AvatarImage src={dept.headAvatar} />
                <AvatarFallback>{dept.headOfDepartment.substring(0,2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">{dept.headOfDepartment}</p>
                <p className="text-xs text-slate-500 font-medium">Head of Unit</p>
              </div>
              <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white text-slate-400 hover:text-blue-600 transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Restricted Metrics Section */}
            {!isEmployee && (
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget Cap</span>
                    </div>
                    {isHR ? (
                      <span className="text-xs font-black text-slate-900">{dept.budgetUsed}%</span>
                    ) : (
                      <Lock className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                  {isHR ? (
                    <>
                      <Progress value={dept.budgetUsed} className="h-2 bg-slate-100" />
                      <p className="text-[10px] font-bold text-slate-400">{dept.budget} Allocated</p>
                    </>
                  ) : (
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-slate-200 w-1/2 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Performance</span>
                    </div>
                    <span className="text-xs font-black text-blue-600">{dept.performance}%</span>
                  </div>
                  <Progress value={dept.performance} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                  <p className="text-[10px] font-bold text-slate-400">Unit Health Index</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projects</span>
                  <span className="text-sm font-bold text-slate-900">{dept.projects}</span>
                </div>
                {!isEmployee && (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Open Roles</span>
                    <span className="text-sm font-bold text-blue-600">+{dept.openPositions}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" className="rounded-xl border-slate-100 font-bold hover:bg-slate-50 px-6">
                {isEmployee ? "Contact Unit" : "Unit Report"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}