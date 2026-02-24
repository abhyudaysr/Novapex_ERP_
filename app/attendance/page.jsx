"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Calendar, Users, TrendingUp, CheckCircle, AlertCircle, Filter, Download, ArrowRight, LogIn, LogOut } from "lucide-react"

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [userRole, setUserRole] = useState("hr") // Logic: Default role

  useEffect(() => {
    setMounted(true)
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000)
    
    // Simulating role retrieval
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
    
    return () => clearInterval(timeInterval)
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const attendanceStats = [
    { title: "Present Today", value: "142", change: "+5%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Late Arrivals", value: "8", change: "-12%", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "On Leave", value: "15", change: "+2%", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Average Hours", value: "8.2", change: "+0.3", icon: Clock, color: "text-violet-500", bg: "bg-violet-50" },
  ]

  const todayAttendance = [
    { name: "Sarah Johnson", avatar: "/diverse-woman-portrait.png", checkIn: "09:00 AM", checkOut: "06:15 PM", totalHours: "8h 45m", status: "Present", department: "Engineering" },
    { name: "Michael Chen", avatar: "/thoughtful-man.png", checkIn: "08:45 AM", checkOut: "05:30 PM", totalHours: "8h 15m", status: "Present", department: "Product" },
    { name: "Emily Davis", avatar: "/diverse-woman-portrait.png", checkIn: "09:15 AM", checkOut: "--", totalHours: "6h 30m", status: "Active", department: "Design" },
    { name: "David Wilson", avatar: "/thoughtful-man.png", checkIn: "09:30 AM", checkOut: "--", totalHours: "6h 15m", status: "Late", department: "Analytics" },
  ]

  // Filter roster: Managers only see their department (Engineering)
  const filteredRoster = isManager 
    ? todayAttendance.filter(emp => emp.department === "Engineering")
    : todayAttendance

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "Active": return "bg-sky-100 text-sky-700 border-sky-200"
      case "Late": return "bg-amber-100 text-amber-700 border-amber-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {isEmployee ? "My Time" : "Attendance"} <span className="text-blue-600">{isEmployee ? "Logs" : "Overview"}</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {isEmployee ? "Track your hours and attendance history" : "Real-time workforce monitoring and analytics"}
            </p>
          </div>
          
          <div className="flex gap-3">
            {!isEmployee && (
              <Button variant="outline" className="h-12 px-6 rounded-xl border-white bg-white/60 backdrop-blur-md font-bold shadow-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            )}
            {isHR && (
              <Button className="h-12 px-6 rounded-xl bg-slate-900 text-white font-bold shadow-xl">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            )}
          </div>
        </motion.div>

        {/* Dynamic Glass Clock & Check-in (Role Specific) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={isEmployee ? "lg:col-span-2" : "lg:col-span-3"}
          >
            <Card className="overflow-hidden border-none bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl rounded-[32px]">
              <CardContent className="p-8 md:p-12 relative overflow-hidden">
                <div className="relative z-10 text-center space-y-2">
                  {mounted ? (
                    <>
                      <motion.div 
                        key={currentTime.getSeconds()}
                        className="text-6xl md:text-7xl font-black text-white tracking-tighter"
                      >
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </motion.div>
                      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">
                        {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </>
                  ) : (
                    <div className="h-20 w-64 bg-white/10 rounded-2xl animate-pulse mx-auto" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Employee Action Card: Check-in/Out */}
          {isEmployee && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="h-full rounded-[32px] border-none bg-white shadow-xl flex flex-col justify-center items-center p-8 gap-4">
                <div className="text-center">
                  <p className="text-sm font-black text-slate-400 uppercase">Current Status</p>
                  <Badge className="bg-emerald-100 text-emerald-700 border-none mt-1">Clocked In</Badge>
                </div>
                <div className="w-full space-y-3">
                  <Button className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-100">
                    <LogOut className="w-5 h-5 mr-2" /> Clock Out
                  </Button>
                  <p className="text-[10px] text-center text-slate-400 font-medium">Last activity: 09:00 AM</p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Stats Grid: HIDDEN FOR EMPLOYEES */}
        {!isEmployee && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {attendanceStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white bg-white/50 backdrop-blur-xl rounded-[24px]">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className={`border-none font-bold ${stat.change.startsWith("+") ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Main List & Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Attendance List: Only for HR and Managers */}
          {!isEmployee && (
            <motion.div className="lg:col-span-2">
              <Card className="glass-card border-white bg-white/50 backdrop-blur-xl rounded-[32px] shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-black text-slate-800">
                      {isManager ? "Department Roster" : "Today's Roster"}
                    </CardTitle>
                    <CardDescription className="font-medium">
                      {isManager ? "Engineering Team Activity" : "Real-time workforce monitoring"}
                    </CardDescription>
                  </div>
                  <Users className="w-6 h-6 text-blue-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredRoster.map((employee, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/40 border border-white rounded-2xl hover:bg-white/80 transition-all gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                          <AvatarFallback className="font-black bg-slate-100">{employee.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-slate-800">{employee.name}</p>
                          <p className="text-xs font-bold text-blue-600 uppercase">{employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 px-4">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase">In</p>
                          <p className="font-bold text-slate-700 text-sm">{employee.checkIn}</p>
                        </div>
                        <Badge className={`px-3 py-1 rounded-lg font-black text-[10px] tracking-widest uppercase border-2 ${getStatusStyle(employee.status)}`} variant="outline">
                          {employee.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Side Actions Area */}
          <div className={`${isEmployee ? "lg:col-span-3 grid grid-cols-1 md:grid-cols-3" : "space-y-6"} gap-6`}>
            {[
              { title: isEmployee ? "My Hours" : "Time Tracking", desc: "Detailed logs and work hours", icon: Clock, link: "#" },
              { title: "Leave Requests", desc: "Manage approvals and balances", icon: Calendar, link: "#" },
              { title: isEmployee ? "History" : "Analytics", desc: "View historical data", icon: TrendingUp, link: "#" }
            ].map((action, i) => (
              <Link key={i} href={action.link}>
                <Card className="glass-card border-white bg-white/40 backdrop-blur-md rounded-3xl hover:bg-white transition-all group cursor-pointer shadow-sm h-full">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 tracking-tight">{action.title}</h3>
                        <p className="text-xs font-medium text-slate-500">{action.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}