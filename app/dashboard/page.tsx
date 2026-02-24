"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, Settings, FileText, Calendar, Bell, ArrowRight, Zap, Target, Award, PieChart, CheckCircle2, ShieldCheck, Briefcase, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AuthGuard from "../../components/AuthGuard"
import Chatbot from "../../components/ui/chatbot"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingRequests: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState("employee") 
  const [userData, setUserData] = useState<any>(null)

  const recentActivities = [
    { id: 1, action: "New employee added", user: "Sarah Johnson", time: "2 hours ago", type: "success" },
    { id: 2, action: "Leave request approved", user: "Mike Chen", time: "4 hours ago", type: "info" },
    { id: 3, action: "Employee Settings updated", user: "System", time: "1 day ago", type: "success" },
    { id: 4, action: "Performance review due", user: "Alex Rodriguez", time: "2 days ago", type: "warning" },
  ]

  const upcomingEvents = [
    { id: 1, title: "Team Meeting", date: "Today, 2:00 PM", department: "Engineering", icon: <Calendar className="w-4 h-4" /> },
    { id: 2, title: "Performance Reviews", date: "Tomorrow, 9:00 AM", department: "HR", icon: <TrendingUp className="w-4 h-4" /> },
    { id: 3, title: "Quarterly Planning", date: "Friday, 10:00 AM", department: "Management", icon: <Bell className="w-4 h-4" /> },
  ]

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Check who is logged in from SessionStorage (set by Login Page)
        const savedRole = sessionStorage.getItem("userRole") || "employee";
        
        // 2. Fetch full profile from API using the role we just found
        const response = await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // We pass an email that matches our mock database to get the right profile
            body: JSON.stringify({ email: `${savedRole}@novapex.com` })
        })
        
        const data = await response.json()
        
        setUserData(data)
        const role = data.role.toLowerCase()
        setUserRole(role)

        // 3. APPLY ROLE-SPECIFIC LOGIC
        if (role === "hr") {
          setStats({ totalEmployees: 247, presentToday: 198, onLeave: 12, pendingRequests: 8 })
        } else if (role === "manager") {
          setStats({ totalEmployees: 12, presentToday: 10, onLeave: 1, pendingRequests: 4 })
        } else {
          setStats({ totalEmployees: 0, presentToday: 0, onLeave: 0, pendingRequests: 0 })
        }
      } catch (error) {
        console.error("Dashboard Sync Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const isEmployee = userRole === "employee"
  const isHR = userRole === "hr"
  const isManager = userRole === "manager"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Novapex Intelligence</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="space-y-10 pb-20 p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <Zap className="w-3 h-3 fill-current" /> Security Level: {userRole.toUpperCase()}
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">
              Nova<span className="text-blue-600">pex</span> Central
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-lg">
              Welcome back, <span className="text-slate-900 font-bold">{userData?.name || "User"}</span>. 
              {isHR && ` Strategic workforce oversight for ${userData?.dept || "HR"}.`}
              {isManager && ` Managing the ${userData?.dept || "Engineering"} team.`}
              {isEmployee && " Your personalized career suite."}
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {!isEmployee ? (
              <motion.div key="admin-btn" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-2xl px-8 py-7 rounded-2xl flex gap-3 font-bold transition-all hover:-translate-y-1 active:scale-95">
                  <FileText className="w-5 h-5" /> Export {isManager ? "Team" : "Intelligence"}
                </Button>
              </motion.div>
            ) : (
              <motion.div key="emp-btn" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-2xl px-8 py-7 rounded-2xl flex gap-3 font-bold transition-all hover:-translate-y-1 active:scale-95">
                  <Award className="w-5 h-5" /> View My Achievements
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Intelligence Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
                id: 'stat1', 
                label: isHR ? "Workforce" : isManager ? "Direct Reports" : "Leave Balance", 
                value: isHR ? stats.totalEmployees : isManager ? `${stats.totalEmployees} Members` : "24 Days", 
                color: "text-blue-600", 
                icon: isEmployee ? <Calendar className="w-4 h-4"/> : <Users className="w-4 h-4"/>, 
                extra: isHR ? "+12 New Hires" : isManager ? `Dept: ${userData?.dept || "Engineering"}` : "Current Year" 
            },
            { id: 'stat2', label: "Active Pulse", value: stats.presentToday, color: "text-emerald-600", progress: true },
            { id: 'stat3', label: "Off Duty Today", value: stats.onLeave, color: "text-amber-600", extra: "Scheduled Leaves" },
            { 
                id: 'stat4', 
                label: isHR ? "Gatekeeper" : isManager ? "Team Requests" : "Performance Index", 
                value: isHR ? stats.pendingRequests : isManager ? `${stats.pendingRequests} Pending` : "9.2/10", 
                color: (isHR || isManager) ? "text-rose-600" : "text-indigo-600", 
                icon: isEmployee ? <Target className="w-4 h-4"/> : <PieChart className="w-4 h-4"/>, 
                extra: isEmployee ? "Top 5% of Team" : "Action Required" 
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-7 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{stat.label}</p>
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  {stat.icon || <TrendingUp className="w-4 h-4"/>}
                </div>
              </div>
              <div className={`text-4xl font-black tracking-tight ${stat.color}`}>{stat.value}</div>
              
              {stat.progress ? (
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Efficiency</span>
                    <span className="text-[10px] font-black text-slate-400">82%</span>
                  </div>
                  <Progress value={82} className="h-1.5 bg-slate-50" />
                </div>
              ) : (
                <div className="mt-6">
                   <span className="px-3 py-1 text-[10px] font-black rounded-full bg-slate-50 text-slate-500 uppercase tracking-widest group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {stat.extra}
                   </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Activity & Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {isHR ? "System Intelligence Logs" : isManager ? "Team Performance Velocity" : "My Career Growth Index"}
                  </h3>
                  <button className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest hover:gap-4 transition-all">
                    {isEmployee ? "Growth Map" : isManager ? "Team Reports" : "Full History"} <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
              <div className="p-8">
                {(isEmployee || isManager) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {[
                            { label: isManager ? "Project Completion" : "Technical Proficiency", val: 85, color: "bg-blue-600" },
                            { label: isManager ? "Team Synergy" : "Project Delivery", val: 92, color: "bg-emerald-600" },
                            { label: isManager ? "Resource Allocation" : "Collaboration", val: 78, color: "bg-amber-600" }
                        ].map((skill, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{skill.label}</span>
                                    <span className="text-sm font-black text-slate-900">{skill.val}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} animate={{ width: `${skill.val}%` }}
                                        transition={{ duration: 1, delay: idx * 0.2 }}
                                        className={`h-full ${skill.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-slate-50 rounded-3xl p-6 flex flex-col justify-center border border-dashed border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-600 rounded-lg text-white"><CheckCircle2 className="w-4 h-4"/></div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-600">{isManager ? "Management Tip" : "Quarterly Milestone"}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed">
                            {isManager ? 
                              `Three team members are approaching their 'Senior II' promotion eligibility. Schedule a sync to discuss.` : 
                              "You are on track to complete your Senior Certification this month. Keep up the momentum!"
                            }
                        </p>
                    </div>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-5 p-5 rounded-[24px] hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className={`w-2.5 h-2.5 rounded-full ${activity.type === "success" ? "bg-emerald-500" : activity.type === "warning" ? "bg-rose-500" : "bg-blue-500"} shadow-lg`} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{activity.action}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

          <motion.div 
            className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 group"
            whileHover={{ scale: 1.01 }}
          >
             <h3 className="text-2xl font-black mb-8 tracking-tight">Mission Briefing</h3>
             <div className="space-y-6 relative z-10">
               {upcomingEvents.map((event) => (
                 <div key={event.id} className="flex items-center gap-4 group/item cursor-pointer">
                   <div className="p-2.5 bg-white/10 rounded-xl text-blue-400 group-hover/item:bg-blue-600 transition-all duration-300">
                    {event.icon}
                   </div>
                   <div>
                     <h4 className="font-bold text-sm tracking-tight">{event.title}</h4>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{event.date}</p>
                   </div>
                 </div>
               ))}
             </div>
             <Button className="w-full mt-10 bg-blue-600 hover:bg-blue-500 font-black rounded-2xl py-6 relative z-10 shadow-xl shadow-blue-600/20">
                Full Calendar
             </Button>
             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
          </motion.div>
        </div>

        {/* Command Gates */}
        <div className={`grid grid-cols-1 gap-8 ${isEmployee ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {[
            { title: "Attendance", href: "/attendance", color: "from-blue-600 to-indigo-700", desc: "Clock-in & Logs", roles: ["hr", "manager", "employee"] },
            { title: "Performance", href: "/performance", color: "from-emerald-600 to-teal-700", desc: "KPIs & Reviews", roles: ["hr", "manager", "employee"] },
            { 
              title: isHR ? "Core Settings" : "Team Oversight", 
              href: isHR ? "/settings" : "/team-management", 
              color: "from-slate-800 to-slate-950", 
              desc: isHR ? "System Config" : "Member Oversight", 
              roles: ["hr", "manager"] 
            },
          ].map((item, i) => {
            if (!item.roles.includes(userRole)) return null;

            return (
              <Link href={item.href} key={i}>
                <motion.div 
                  whileHover={{ y: -12, scale: 1.02 }}
                  className={`h-56 rounded-[40px] p-8 flex flex-col justify-between text-white shadow-2xl bg-gradient-to-br ${item.color} relative overflow-hidden group`}
                >
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black tracking-tighter mb-1">{item.title}</h3>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-30 group-hover:rotate-45 transition-all duration-700">
                    {isManager ? <Briefcase className="w-40 h-40" /> : <Settings className="w-40 h-40" />}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        <Chatbot />
      </div>
    </AuthGuard>
  )
}