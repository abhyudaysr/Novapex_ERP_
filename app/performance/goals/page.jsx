"use client"

import { useState, useEffect } from "react"
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Flag, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  ChevronRight,
  Users,
  Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [userRole, setUserRole] = useState("hr")

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const goals = [
    {
      id: 1,
      title: "Scale Cloud Infrastructure",
      description: "Optimize AWS instances to reduce latency by 20% across all regions.",
      progress: 75,
      category: "Technical",
      priority: "High",
      dueDate: "Mar 30, 2026",
      status: "active",
      owner: "Engineering Team",
      milestones: ["Audit instances", "Implement auto-scaling", "Region testing"]
    },
    {
      id: 2,
      title: "Revenue Growth Q1",
      description: "Onboard 15 new enterprise-level clients for the ERP suite.",
      progress: 40,
      category: "Sales",
      priority: "High",
      dueDate: "Mar 31, 2026",
      status: "active",
      owner: "Sales Department",
      milestones: ["Lead gen", "Demo phase", "Closing"]
    },
    {
      id: 3,
      title: "UI/UX Refresh",
      description: "Complete the design system documentation for the Novapex rebranding.",
      progress: 100,
      category: "Design",
      priority: "Medium",
      dueDate: "Feb 10, 2026",
      status: "completed",
      owner: "Creative Lead",
      milestones: ["Icon set", "Typography", "Component library"]
    }
  ]

  // Filter goals: Employees only see goals they own or contribute to
  const filteredGoals = goals.filter(g => {
    const statusMatch = g.status === activeTab
    if (isEmployee) return statusMatch && g.category === "Technical" // Mock filter for employee role
    return statusMatch
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            {isEmployee ? "My" : "Strategic"} <span className="text-blue-600">Objectives</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isHR ? "Aligning organizational targets with long-term mission." : isManager ? "Tracking team performance and milestone velocity." : "Executing your personal growth roadmap."}
          </p>
        </div>
        {!isEmployee && (
          <Button className="bg-slate-900 hover:bg-blue-600 text-white shadow-2xl shadow-slate-200 h-14 px-8 rounded-2xl flex gap-2 font-black transition-all group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            {isHR ? "Deploy Global Goal" : "Assign Team Goal"}
          </Button>
        )}
      </div>

      {/* Stats Summary Bar - Role Specific */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[32px] border-none bg-blue-50/50 p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white">
            {isEmployee ? <Briefcase className="w-6 h-6" /> : <Target className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600/60">
              {isEmployee ? "Personal Goals" : "Active Objectives"}
            </p>
            <p className="text-2xl font-black text-slate-900">{isEmployee ? "03" : "08"}</p>
          </div>
        </Card>
        <Card className="rounded-[32px] border-none bg-emerald-50/50 p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500 rounded-2xl text-white"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Completion Rate</p>
            <p className="text-2xl font-black text-slate-900">{isEmployee ? "100%" : "92%"}</p>
          </div>
        </Card>
        <Card className="rounded-[32px] border-none bg-amber-50/50 p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-500 rounded-2xl text-white">
            {isHR ? <TrendingUp className="w-6 h-6" /> : <Users className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/60">
              {isHR ? "Org Velocity" : isManager ? "Team Alignment" : "Peer Ranking"}
            </p>
            <p className="text-2xl font-black text-slate-900">{isHR ? "+14%" : "98%"}</p>
          </div>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl border border-slate-200/50">
            {["active", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {filteredGoals.map((goal) => (
                <Card key={goal.id} className="group border-none shadow-xl shadow-slate-200/40 rounded-[40px] overflow-hidden bg-white hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500">
                  <CardContent className="p-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{goal.title}</h3>
                          <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] uppercase">{goal.category}</Badge>
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-lg">{goal.description}</p>
                        {!isEmployee && <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Owner: {goal.owner}</p>}
                      </div>
                      { (isHR || isManager) && (
                        <button className="text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical /></button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Progress</span>
                        <span className="text-lg font-black text-slate-900">{goal.progress}%</span>
                      </div>
                      <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute h-full bg-blue-600 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-bold text-slate-600">{goal.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Flag className={`w-4 h-4 ${goal.priority === 'High' ? 'text-rose-500' : 'text-amber-500'}`} />
                        <span className="text-xs font-bold text-slate-600">{goal.priority} Priority</span>
                      </div>
                      <div className="ml-auto">
                        <Button variant="ghost" className="text-blue-600 font-black text-xs uppercase tracking-widest flex gap-2 hover:bg-blue-50">
                          {isEmployee ? "Update My Status" : "Review Progress"} <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar: Roadmap/Milestones */}
        <div className="space-y-8">
          <Card className="border-none bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-200">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-6 h-6 text-blue-400" />
              <h3 className="font-black text-xl tracking-tight">
                {isEmployee ? "My Roadmap" : "Tracking Roadmap"}
              </h3>
            </div>
            
            <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              {goals[0].milestones.map((ms, idx) => (
                <div key={idx} className="flex gap-6 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-slate-800 transition-all duration-500 ${idx === 0 ? 'bg-blue-600 border-blue-600' : 'bg-slate-900 shadow-lg'}`}>
                    {idx === 0 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 bg-slate-700 rounded-full" />}
                  </div>
                  <div>
                    <p className={`text-sm font-black tracking-tight ${idx === 0 ? 'text-white' : 'text-slate-500'}`}>{ms}</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase mt-1">
                      {isManager && idx !== 0 ? (
                        <button className="text-blue-400 hover:underline">Approve Task</button>
                      ) : (
                        `Status: ${idx === 0 ? 'Verified' : 'Pending'}`
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-12 h-14 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[20px] font-black uppercase tracking-widest text-[10px]">
              {isHR ? "Export Org Timeline" : "View Full Timeline"}
            </Button>
          </Card>

          {isHR && (
            <Card className="border-none bg-blue-600 rounded-[40px] p-8 text-white shadow-xl">
               <h4 className="font-black text-lg mb-2">Alignment Report</h4>
               <p className="text-xs font-medium text-blue-100 mb-6">94% of departmental goals align with the 2026 North Star.</p>
               <Button className="w-full bg-white text-blue-600 font-black rounded-xl text-[10px] uppercase">Download Audit</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}