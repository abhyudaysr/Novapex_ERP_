"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Plus, Search, Check, X, ArrowLeft, Info, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function LeaveRequestsPage() {
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [showLeaveBalance, setShowLeaveBalance] = useState(null)
  const [userRole, setUserRole] = useState("hr") // Logic: Role-based state

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const leaveRequests = [
    {
      id: 1,
      employee: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      department: "Engineering",
      leaveType: "Annual Leave",
      startDate: "2024-02-15",
      endDate: "2024-02-19",
      days: 5,
      reason: "Family vacation",
      status: "Pending",
      appliedDate: "2024-01-20",
      approver: "John Smith",
      balance: { annual: { used: 8, total: 20 }, sick: { used: 3, total: 10 }, personal: { used: 2, total: 5 } },
    },
    {
      id: 2,
      employee: "Michael Chen",
      avatar: "/thoughtful-man.png",
      department: "Product",
      leaveType: "Sick Leave",
      startDate: "2024-01-25",
      endDate: "2024-01-26",
      days: 2,
      reason: "Medical appointment",
      status: "Approved",
      appliedDate: "2024-01-22",
      approver: "Lisa Rodriguez",
      balance: { annual: { used: 12, total: 20 }, sick: { used: 4, total: 10 }, personal: { used: 1, total: 5 } },
    },
  ]

  // Logic: Filter requests based on role
  // HR sees all, Manager sees their dept, Employee sees only theirs
  const filteredRequests = leaveRequests.filter(req => {
    if (isHR) return true
    if (isManager) return req.department === "Engineering"
    if (isEmployee) return req.employee === "Sarah Johnson" // Simulated own record
    return false
  })

  const leaveStats = [
    { title: "Pending Requests", value: "8", color: "text-amber-500", show: !isEmployee },
    { title: "Approved This Month", value: "15", color: "text-emerald-500", show: !isEmployee },
    { title: "Annual Balance", value: "12/20", color: "text-blue-500", show: isEmployee },
    { title: "Sick Leave Left", value: "7", color: "text-violet-500", show: isEmployee },
    { title: "Total Days Taken", value: "142", color: "text-blue-500", show: isHR },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-emerald-500/10 text-emerald-600 border-emerald-200"
      case "Pending": return "bg-amber-500/10 text-amber-600 border-amber-200"
      case "Rejected": return "bg-rose-500/10 text-rose-600 border-rose-200"
      default: return "bg-slate-500/10 text-slate-600"
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-1">
            <Link href="/attendance">
              <Button variant="ghost" size="sm" className="hover:bg-white/50 -ml-2 mb-2 group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to {isEmployee ? "Dashboard" : "Attendance"}
              </Button>
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {isEmployee ? "My Leaves" : "Leave Management"}
            </h1>
            <p className="text-slate-500 font-medium">
              {isHR ? "Global leave tracking & oversight" : isManager ? "Review team absence requests" : "Apply for and track your time off"}
            </p>
          </div>
          
          {/* Action: Only Manager/HR can export, only Employee/HR can apply (per typical policy) */}
          <div className="flex gap-3">
            {!isEmployee && (
               <Button variant="outline" className="h-12 px-6 rounded-2xl border-white bg-white/60">
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Button>
            )}
            {(isEmployee || isHR) && (
              <Button onClick={() => setShowNewRequest(true)} className="bg-primary hover:bg-primary/90 shadow-lg h-12 px-6 rounded-2xl">
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats Grid - Role Specific */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {leaveStats.filter(s => s.show).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-md"
            >
              <p className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Requests List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request, i) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card relative overflow-hidden rounded-[32px] border border-white/80 bg-white/70 backdrop-blur-xl shadow-xl p-1"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 border-2 border-white shadow-md">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {request.employee.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{request.employee}</h3>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight">{request.department}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(request.status)} font-bold rounded-lg px-3 py-1`}>
                    {request.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white/40 p-4 rounded-2xl border border-white/50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Leave Type</p>
                    <p className="font-bold text-slate-700">{request.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</p>
                    <p className="font-bold text-slate-700">{request.days} Days</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-white/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Reason</p>
                    <p className="text-sm font-medium text-slate-600 italic">"{request.reason}"</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {/* View Balance: Only HR/Manager to check employee eligibility */}
                    {!isEmployee && (
                      <Button
                        size="sm"
                        onClick={() => setShowLeaveBalance(request.id)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold h-10 shadow-lg shadow-blue-200"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Check Balance
                      </Button>
                    )}
                    
                    {/* Approval Actions: Only for Managers or HR */}
                    {(isManager || isHR) && request.status === "Pending" && (
                      <div className="flex flex-1 gap-2">
                        <Button size="sm" className="flex-1 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold">
                          <Check className="w-4 h-4 mr-2" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl font-bold">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Employee specific view: can cancel pending request */}
                    {isEmployee && request.status === "Pending" && (
                       <Button size="sm" variant="ghost" className="flex-1 text-rose-500 hover:bg-rose-50 rounded-xl font-bold">
                         Cancel Request
                       </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leave Balance Modal */}
        <AnimatePresence>
          {showLeaveBalance && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-lg overflow-hidden glass-card rounded-[40px] border border-white bg-white shadow-2xl"
              >
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Entitlement Check</h2>
                      <p className="font-bold text-primary">{leaveRequests.find((r) => r.id === showLeaveBalance)?.employee}</p>
                    </div>
                    <Button variant="ghost" onClick={() => setShowLeaveBalance(null)} className="rounded-full h-10 w-10 p-0">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(leaveRequests.find((r) => r.id === showLeaveBalance)?.balance || {}).map(([type, data]) => {
                      const percentage = Math.round((data.used / data.total) * 100)
                      return (
                        <div key={type} className="space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="capitalize font-bold text-slate-700">{type} Leave</span>
                            <span className="text-xs font-black text-slate-400">
                              {data.used} / {data.total} DAYS
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2.5" />
                        </div>
                      )
                    })}
                  </div>

                  <Button onClick={() => setShowLeaveBalance(null)} className="w-full h-12 rounded-2xl bg-slate-900 text-white font-bold">
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}