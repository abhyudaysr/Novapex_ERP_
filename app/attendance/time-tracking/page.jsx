"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  Filter,
  Search,
  Download,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  PauseCircle,
  CalendarCheck,
} from "lucide-react"

export default function TimeTrackingPage() {
  const [userRole, setUserRole] = useState("hr")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [openDept, setOpenDept] = useState(null)

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const timeEntries = [
    { employee: "Sarah Johnson", avatar: "/avatars/sarah.png", department: "Engineering", date: "2024-01-15", checkIn: "09:00 AM", checkOut: "06:15 PM", breakTime: "1h 00m", totalHours: "8h 15m", status: "Completed", project: "Web Application" },
    { employee: "Michael Chen", avatar: "/avatars/michael.png", department: "Engineering", date: "2024-01-15", checkIn: "08:45 AM", checkOut: "05:30 PM", breakTime: "45m", totalHours: "8h 00m", status: "Completed", project: "Mobile App" },
    { employee: "Emily Davis", avatar: "/avatars/emily.png", department: "Design", date: "2024-01-15", checkIn: "09:15 AM", checkOut: "--", breakTime: "30m", totalHours: "6h 30m", status: "In Progress", project: "UI Design" },
    { employee: "David Wilson", avatar: "/avatars/david.png", department: "Data Analytics", date: "2024-01-15", checkIn: "09:30 AM", checkOut: "--", breakTime: "15m", totalHours: "6h 15m", status: "In Progress", project: "Data Analysis" },
  ]

  const weeklyStats = [
    { day: "Mon", hours: 8.5, target: 8 },
    { day: "Tue", hours: 7.8, target: 8 },
    { day: "Wed", hours: 8.2, target: 8 },
    { day: "Thu", hours: 8.0, target: 8 },
    { day: "Fri", hours: 7.5, target: 8 },
  ]

  // Logic: Filter entries based on role
  const filteredEntries = timeEntries.filter(entry => {
    if (isHR) return true
    if (isManager) return entry.department === "Engineering" // Mock departmental scope
    if (isEmployee) return entry.employee === "Sarah Johnson" // Mock personal scope
    return false
  })

  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.department]) acc[entry.department] = []
    acc[entry.department].push(entry)
    return acc
  }, {})

  return (
    <div className="page-shell p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-1">
            <Link href="/attendance">
              <Button variant="ghost" size="sm" className="hover:bg-white/50 -ml-2 mb-2 group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Attendance
              </Button>
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {isEmployee ? "My Time" : "Time"} <span className="text-primary">{isEmployee ? "Logs" : "Tracking"}</span>
            </h1>
            <p className="text-slate-500 font-medium">
              {isHR ? "Company-wide productivity overview" : isManager ? "Review team work logs and projects" : "Track your daily hours and targets"}
            </p>
          </div>
          
          <div className="flex gap-3">
            {isEmployee ? (
               <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-8 font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                 <PlayCircle className="w-5 h-5 mr-2" />
                 Start Timer
               </Button>
            ) : (
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 font-bold shadow-lg shadow-slate-200">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </motion.div>

        {/* Weekly Overview - Tailored to Role */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card rounded-[32px] border border-white bg-white/50 backdrop-blur-2xl shadow-2xl shadow-slate-200/40 p-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-slate-800">
                  {isEmployee ? "Weekly Progress" : "Performance Overview"}
                </CardTitle>
                <CardDescription className="font-medium text-slate-500">
                  {isEmployee ? "Your hours vs weekly target" : "Average team productivity"}
                </CardDescription>
              </div>
              {isEmployee && (
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">40.0h</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Goal</p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {weeklyStats.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                    className="relative group p-6 rounded-[24px] bg-white/40 border border-white hover:bg-white/80 transition-all shadow-sm"
                  >
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{day.day}</p>
                    <div className="space-y-3">
                      <p className="text-3xl font-black text-slate-800">{day.hours}h</p>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(day.hours / day.target) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                          className={`h-full rounded-full ${day.hours >= day.target ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search & Filters - Hidden for Employee if not needed */}
        {!isEmployee && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="glass-card p-4 rounded-2xl border border-white bg-white/40 backdrop-blur-lg flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder={isHR ? "Search company wide..." : "Search team members..."}
                className="w-full pl-12 pr-4 h-12 bg-white/60 border border-white rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-slate-400 text-slate-700 outline-none"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 h-12 bg-white/60 border border-white rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-600 outline-none"
              />
              <Button variant="outline" className="h-12 px-6 rounded-xl border-white bg-white/60 font-bold text-slate-600 hover:bg-white transition-all">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                Filter
              </Button>
            </div>
          </motion.div>
        )}

        {/* Time Entries - Roles modify the structure */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {isEmployee ? "Recent Activity" : "Daily Time Logs"}
            </h2>
          </div>
          
          <div className="grid gap-4">
            {Object.keys(groupedEntries).map((department, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
              >
                <Card className="glass-card rounded-[28px] border border-white bg-white/50 backdrop-blur-xl shadow-xl shadow-slate-200/20 overflow-hidden">
                  {/* Departments only shown for HR/Manager */}
                  {(isHR || isManager) && (
                    <button 
                      onClick={() => setOpenDept(openDept === department ? null : department)}
                      className="w-full flex items-center justify-between p-6 hover:bg-white/40 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-1.5 bg-primary rounded-full" />
                        <div className="text-left">
                          <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">{department}</CardTitle>
                          <CardDescription className="font-bold text-primary/70">{groupedEntries[department].length} Active Logs</CardDescription>
                        </div>
                      </div>
                      {openDept === department ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-slate-400" />}
                    </button>
                  )}

                  <AnimatePresence initial={isEmployee}>
                    {((openDept === department) || isEmployee) && (
                      <motion.div
                        initial={isEmployee ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <CardContent className={`p-6 space-y-4 ${isHR || isManager ? 'pt-2' : ''}`}>
                          {groupedEntries[department].map((entry, index) => (
                            <div
                              key={index}
                              className="group flex flex-col lg:flex-row lg:items-center justify-between p-5 bg-white/60 border border-white/80 rounded-2xl hover:shadow-lg hover:shadow-slate-200/50 transition-all gap-6"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                                  <AvatarImage src={entry.avatar} />
                                  <AvatarFallback className="font-black bg-slate-100">{entry.employee[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-black text-slate-800 text-lg">{isEmployee ? "Today's Work" : entry.employee}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] border-primary/20 text-primary font-bold">{entry.project}</Badge>
                                    {isEmployee && <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase tracking-tighter">Verified</Badge>}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 lg:max-w-2xl px-4">
                                <div className="space-y-1 text-center md:text-left">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Check In</p>
                                  <p className="font-black text-slate-700">{entry.checkIn}</p>
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Check Out</p>
                                  <p className="font-black text-slate-700">{entry.checkOut}</p>
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Break</p>
                                  <p className="font-black text-slate-700">{entry.breakTime}</p>
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                  <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Total</p>
                                  <p className="text-lg font-black text-slate-900 leading-none">{entry.totalHours}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between lg:justify-end gap-4">
                                <Badge className={`h-8 px-4 rounded-lg font-black uppercase text-[10px] tracking-widest ${
                                  entry.status === "Completed" ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-600"
                                }`} variant="outline">
                                  {entry.status}
                                </Badge>
                                {isEmployee && entry.status === "In Progress" && (
                                  <Button size="sm" variant="ghost" className="rounded-xl hover:bg-rose-50 text-rose-500 font-bold">
                                    <PauseCircle className="w-4 h-4 mr-2" /> Stop
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
