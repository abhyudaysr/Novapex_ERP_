"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageHeader } from "@/components/page-header"
import { useState, useEffect } from "react"
import { 
  Search, 
  Plus, 
  Mail, 
  Briefcase, 
  Users, 
  UserCheck, 
  UserMinus,
  ExternalLink,
  MoreHorizontal,
  Lock
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState("hr") // Default for safety

  useEffect(() => {
    const stored = sessionStorage.getItem("userRole")
    if (stored) setUserRole(stored.toLowerCase())
    
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const employees = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@novapex.com", department: "Engineering", position: "Senior Architect", status: "Active", joinDate: "2022-03-15", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, name: "Mike Chen", email: "m.chen@novapex.com", department: "Sales", position: "Sales Manager", status: "Active", joinDate: "2021-08-22", avatar: "https://i.pravatar.cc/150?u=mike" },
    { id: 3, name: "Emily Rodriguez", email: "e.rodriguez@novapex.com", department: "Marketing", position: "Lead Designer", status: "Active", joinDate: "2023-01-10", avatar: "https://i.pravatar.cc/150?u=emily" },
    { id: 4, name: "David Kim", email: "d.kim@novapex.com", department: "Engineering", position: "Frontend Dev", status: "On Leave", joinDate: "2022-11-05", avatar: "https://i.pravatar.cc/150?u=david" },
    { id: 5, name: "Lisa Wang", email: "l.wang@novapex.com", department: "HR", position: "Talent Head", status: "Active", joinDate: "2020-06-18", avatar: "https://i.pravatar.cc/150?u=lisa" },
    { id: 6, name: "Alex Thompson", email: "a.thompson@novapex.com", department: "Finance", position: "Controller", status: "Active", joinDate: "2023-04-12", avatar: "https://i.pravatar.cc/150?u=alex" },
  ]

  // Role-Based Visibility Logic
  // Managers only see their department (e.g., Engineering), Employees only see themselves
  const accessibleEmployees = employees.filter(emp => {
    if (isHR) return true;
    if (isManager) return emp.department === "Engineering"; // Mocking manager's dept
    if (isEmployee) return emp.email === "sarah.j@novapex.com"; // Mocking self-view
    return false;
  });

  const departments = isHR ? ["all", "Engineering", "Sales", "Marketing", "HR", "Finance"] : [];

  const filteredEmployees = accessibleEmployees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-10 animate-pulse">
        <div className="flex justify-between items-center"><div className="h-10 w-64 bg-slate-200 rounded-2xl" /><div className="h-14 w-44 bg-slate-200 rounded-2xl" /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-[32px]" />)}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-50 rounded-[40px]" />)}</div>
      </div>
    )
  }

  return (
    <div className="page-shell p-8 max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      <PageHeader
        eyebrow="People Grid"
        statusLabel={isEmployee ? "Self View" : isManager ? "Team Scope" : "HR Control"}
        title={`${isEmployee ? "My Profile" : "Workforce"} ${isEmployee ? "Identity" : "Universe"}`}
        description={
          isHR
            ? "Orchestrating your global talent pool."
            : isManager
              ? "Managing your direct team performance."
              : "Your corporate identity and career details."
        }
      >
        {isHR && (
          <Link href="/employees/add">
            <Button className="bg-slate-900 hover:bg-blue-600 text-white shadow-2xl shadow-slate-200 h-11 px-6 rounded-xl flex gap-2 font-black transition-all group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Onboard Talent
            </Button>
          </Link>
        )}
      </PageHeader>

      {/* Workforce Snapshots - Only for HR/Managers */}
      {!isEmployee && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[32px] border-none bg-blue-50/50 p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white"><Users className="w-6 h-6" /></div>
            <div><p className="text-[10px] font-black uppercase tracking-widest text-blue-600/60">{isHR ? "Total Headcount" : "Team Size"}</p><p className="text-2xl font-black text-slate-900">{accessibleEmployees.length}</p></div>
          </Card>
          <Card className="rounded-[32px] border-none bg-emerald-50/50 p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-2xl text-white"><UserCheck className="w-6 h-6" /></div>
            <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Active Now</p><p className="text-2xl font-black text-slate-900">{accessibleEmployees.filter(e => e.status === "Active").length}</p></div>
          </Card>
          <Card className="rounded-[32px] border-none bg-amber-50/50 p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-2xl text-white"><UserMinus className="w-6 h-6" /></div>
            <div><p className="text-[10px] font-black uppercase tracking-widest text-amber-600/60">On Leave</p><p className="text-2xl font-black text-slate-900">{accessibleEmployees.filter(e => e.status === "On Leave").length}</p></div>
          </Card>
        </div>
      )}

      {/* Search & Intelligence Filters - Hidden for Employee */}
      {!isEmployee && (
        <div className="section-shell p-4 rounded-[32px]">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 bg-slate-50 border-none h-14 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-100 transition-all font-medium"
              />
            </div>
            {isHR && (
              <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl overflow-x-auto no-scrollbar">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setFilterDepartment(dept)}
                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      filterDepartment === dept ? "bg-white text-blue-600 shadow-sm scale-[1.02]" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Employee Grid */}
      <div className={`grid grid-cols-1 ${!isEmployee ? 'md:grid-cols-2 xl:grid-cols-3' : 'max-w-md mx-auto'} gap-8`}>
        <AnimatePresence mode="popLayout">
          {filteredEmployees.map((employee) => (
            <motion.div key={employee.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <Card className="group relative border-none shadow-xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500">
                <div className="p-8 pt-10 flex flex-col items-center text-center">
                  <div className="absolute top-6 left-6">
                    <Badge className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase border-none ${employee.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                      {employee.status}
                    </Badge>
                  </div>
                  {isHR && (
                    <button className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  )}

                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-100 rounded-[32px] rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                    <Avatar className="h-28 w-28 rounded-[32px] border-4 border-white shadow-2xl relative z-10 group-hover:scale-105 transition-transform">
                      <AvatarImage src={employee.avatar} className="object-cover" />
                      <AvatarFallback className="bg-slate-900 text-white font-black text-2xl">{employee.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{employee.name}</h3>
                  <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-1 mb-8">{employee.position}</p>
                  
                  <div className="w-full space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm px-2">
                      <span className="text-slate-400 font-bold flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                      <span className="text-slate-800 font-black truncate max-w-[140px]">{employee.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm px-2">
                      <span className="text-slate-400 font-bold flex items-center gap-2"><Briefcase className="w-4 h-4" /> Unit</span>
                      <Badge variant="outline" className="rounded-lg border-slate-100 font-black text-[10px]">{employee.department}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button 
                      variant="ghost" 
                      className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50"
                      disabled={!isHR} // Only HR can edit others' data
                    >
                      {isHR ? "Edit Data" : <><Lock className="w-3 h-3 mr-2" /> Read Only</>}
                    </Button>
                    <Link href={`/employees/profiles`} className="w-full">
                      <Button className="w-full h-12 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200 flex gap-2">
                        View Profile <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
