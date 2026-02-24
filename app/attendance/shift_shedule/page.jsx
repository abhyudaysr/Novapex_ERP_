"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, UserPlus, Pencil, Trash2, LayoutGrid, MapPin, UserCheck } from "lucide-react"

export default function ShiftSchedulePage() {
  const [userRole, setUserRole] = useState("hr") // Logic: Role-based state

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const shifts = [
    { id: 1, name: "Morning Shift", start: "09:00 AM", end: "05:00 PM" },
    { id: 2, name: "Evening Shift", start: "01:00 PM", end: "09:00 PM" },
    { id: 3, name: "Night Shift", start: "09:00 PM", end: "05:00 AM" },
  ]

  const schedules = [
    { id: 1, employee: "Alice Johnson", department: "HR", shift: "Morning Shift", date: "2025-09-30", status: "Assigned" },
    { id: 2, employee: "Bob Smith", department: "IT", shift: "Evening Shift", date: "2025-09-30", status: "Pending" },
    { id: 3, employee: "Charlie Lee", department: "Finance", shift: "Night Shift", date: "2025-09-30", status: "Assigned" },
    { id: 4, employee: "David Kim", department: "IT", shift: "Morning Shift", date: "2025-09-30", status: "Assigned" },
    { id: 5, employee: "Ella Brown", department: "HR", shift: "Evening Shift", date: "2025-09-30", status: "Pending" },
  ]

  // Logic: Filter schedules based on role
  const filteredSchedules = schedules.filter(s => {
    if (isHR) return true
    if (isManager) return s.department === "IT" // Simulated Manager's department
    if (isEmployee) return s.employee === "Alice Johnson" // Simulated own schedule
    return false
  })

  // Logic: Grouping preserved for HR/Manager views
  const groupedSchedules = filteredSchedules.reduce((acc, sched) => {
    if (!acc[sched.department]) acc[sched.department] = []
    acc[sched.department].push(sched)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header - Role Sensitive Actions */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {isEmployee ? "My Work" : "Shift"} <span className="text-primary">{isEmployee ? "Schedule" : "& Scheduling"}</span>
            </h1>
            <p className="text-slate-500 font-medium">
              {isHR ? "Global workforce shift configuration" : isManager ? "Departmental roster management" : "Your assigned working hours and location"}
            </p>
          </div>
          
          {(isHR || isManager) && (
            <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 rounded-2xl h-12 px-6 font-bold flex items-center gap-2 transition-all">
              <UserPlus className="w-5 h-5" />
              {isHR ? "Add Shift Type" : "Assign Staff"}
            </Button>
          )}
        </motion.div>

        {/* Shift Definitions - Only shown to HR/Managers */}
        {!isEmployee && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card rounded-[32px] border border-white bg-white/50 backdrop-blur-2xl shadow-2xl shadow-slate-200/40 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <Clock className="w-5 h-5 text-primary" />
                  Defined Shift Templates
                </CardTitle>
                <CardDescription className="font-medium">Configuration for standard working windows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-white/60 overflow-hidden bg-white/30">
                  <table className="min-w-full divide-y divide-white/40">
                    <thead className="bg-slate-100/50">
                      <tr>
                        <th className="py-4 px-6 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Shift Name</th>
                        <th className="py-4 px-6 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Window</th>
                        {isHR && <th className="py-4 px-6 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Manage</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40">
                      {shifts.map((shift) => (
                        <tr key={shift.id} className="hover:bg-white/60 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-700">{shift.name}</td>
                          <td className="py-4 px-6">
                             <div className="flex gap-2">
                               <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-100 font-bold">{shift.start}</Badge>
                               <span className="text-slate-400 font-black">→</span>
                               <Badge variant="outline" className="bg-indigo-50/50 text-indigo-600 border-indigo-100 font-bold">{shift.end}</Badge>
                             </div>
                          </td>
                          {isHR && (
                            <td className="py-4 px-6 text-right">
                              <Button variant="ghost" size="sm" className="rounded-lg h-8 w-8 p-0">
                                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Employee View: Personalized Hero Card */}
        {isEmployee && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <Card className="glass-card rounded-[40px] border-none bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-4">
                    <Badge className="bg-primary text-white border-none px-4 py-1">UPCOMING SHIFT</Badge>
                    <h2 className="text-5xl font-black">Morning Shift</h2>
                    <div className="flex items-center gap-6 text-slate-300 font-bold">
                      <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Tomorrow, Sep 30</div>
                      <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> 09:00 AM - 05:00 PM</div>
                    </div>
                  </div>
                  <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-14 px-8 font-black text-lg">
                    <MapPin className="w-5 h-5 mr-2" /> View Location
                  </Button>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
             </Card>
          </motion.div>
        )}

        {/* Roster View - Grouped for HR/Manager, Individual for Employee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card rounded-[32px] border border-white bg-white/50 backdrop-blur-2xl shadow-2xl shadow-slate-200/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <Calendar className="w-5 h-5 text-primary" />
                {isEmployee ? "Shift History" : "Staff Roster"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {Object.entries(groupedSchedules).map(([department, deptSchedules], idx) => (
                <div key={department} className="space-y-4">
                  {!isEmployee && (
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-1 bg-primary rounded-full" />
                      <h2 className="text-lg font-black text-slate-800 tracking-tight">{department}</h2>
                    </div>
                  )}
                  
                  <div className="rounded-2xl border border-white/60 overflow-hidden bg-white/30">
                    <table className="min-w-full divide-y divide-white/40">
                      <thead className="bg-slate-100/50">
                        <tr>
                          {!isEmployee && <th className="py-4 px-6 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Employee</th>}
                          <th className="py-4 px-6 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Shift Window</th>
                          <th className="py-4 px-6 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                          <th className="py-4 px-6 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                          {!isEmployee && <th className="py-4 px-6 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/40">
                        {deptSchedules.map((schedule) => (
                          <tr key={schedule.id} className="hover:bg-white/60 transition-colors">
                            {!isEmployee && <td className="py-4 px-6 font-bold text-slate-800">{schedule.employee}</td>}
                            <td className="py-4 px-6">
                               <div className="flex items-center gap-2 font-semibold text-slate-600">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {schedule.shift}
                               </div>
                            </td>
                            <td className="py-4 px-6 text-sm font-medium text-slate-500">{schedule.date}</td>
                            <td className="py-4 px-6">
                              <Badge className={`font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-lg ${
                                schedule.status === "Assigned" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                              }`} variant="outline">
                                {schedule.status}
                              </Badge>
                            </td>
                            {!isEmployee && (
                              <td className="py-4 px-6 text-right">
                                <div className="flex justify-end gap-1">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></Button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}