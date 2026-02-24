"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, Phone, MapPin, Calendar, User, 
  DollarSign, Briefcase, Award, History, 
  CreditCard, Plane, Globe, ShieldCheck,
  FileText, Download, Lock, EyeOff
} from "lucide-react"

export default function ProfilesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState("hr") // Default for dev; typically from context/session

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    // Simulating role fetch from session
    const stored = sessionStorage.getItem("userRole")
    if (stored) setUserRole(stored.toLowerCase())
    return () => clearTimeout(timer)
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const employees = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@novapex.com",
      department: "Engineering",
      position: "Senior Systems Architect",
      status: "Active",
      joinDate: "Mar 15, 2022",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Street, San Francisco, CA 94105",
      salary: "$145,000",
      manager: "John Smith",
      skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Kubernetes"],
      performance: 94,
      projects: 8,
      completedTasks: 156,
      passportNo: "P1234567",
      passportExpiry: "2028-05-15",
      visaType: "H1-B",
      visaExpiry: "2026-09-10",
      bankName: "Chase Private Client",
      accountNo: "**** 7890",
      ifscCode: "CHASUS33",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "m.chen@novapex.com",
      department: "Sales",
      position: "Global Sales Director",
      status: "On Leave",
      joinDate: "Aug 22, 2021",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      phone: "+1 (555) 234-5678",
      address: "456 Business Ave, New York, NY 10001",
      salary: "$115,000",
      manager: "Lisa Rodriguez",
      skills: ["CRM", "Negotiation", "B2B Sales", "Forecasting"],
      performance: 88,
      projects: 12,
      completedTasks: 203,
      passportNo: "M9876543",
      passportExpiry: "2027-12-01",
      visaType: "Permanent Resident",
      visaExpiry: "N/A",
      bankName: "Wells Fargo",
      accountNo: "**** 3210",
      ifscCode: "WFBKUS66",
    },
  ]

  // Role-based filtering for the directory
  const accessibleEmployees = employees.filter(emp => {
    if (isHR) return true;
    if (isManager) return emp.department === "Engineering"; // Mock: Manager only sees their dept
    if (isEmployee) return emp.id === 1; // Mock: Employee only sees themselves
    return false;
  })

  const currentEmployee = accessibleEmployees.find((emp) => emp.id === selectedEmployee) || accessibleEmployees[0]

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-slate-100 rounded-2xl w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="h-[600px] bg-slate-50 rounded-[40px]" />
          <div className="lg:col-span-3 h-[600px] bg-slate-50 rounded-[40px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            {isEmployee ? "My Profile" : <>Talent <span className="text-blue-600">Dossier</span></>}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isEmployee ? "View and manage your personal details." : "Personnel records and lifecycle management."}
          </p>
        </div>
        {isHR && (
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 px-8 font-bold shadow-xl flex gap-2">
            <Download className="w-5 h-5" />
            Export Profile PDF
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Employee List - HIDDEN FOR EMPLOYEES */}
        {!isEmployee && (
          <Card className="border-slate-100 shadow-sm rounded-[40px] overflow-hidden">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {accessibleEmployees.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${
                    selectedEmployee === employee.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "bg-transparent text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback className="font-bold text-xs">{employee.name.substring(0,2)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left overflow-hidden">
                    <p className="font-bold text-sm truncate">{employee.name}</p>
                    <p className={`text-[10px] font-medium truncate ${selectedEmployee === employee.id ? "text-blue-100" : "text-slate-400"}`}>
                      {employee.position}
                    </p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Content Area */}
        <div className={`${isEmployee ? "lg:col-span-4" : "lg:col-span-3"} space-y-8`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEmployee.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white">
                {/* Profile Header Banner */}
                <div className="h-32 bg-slate-900 relative">
                  <div className="absolute -bottom-12 left-10 flex items-end gap-6">
                    <Avatar className="h-32 w-32 border-8 border-white shadow-xl rounded-[40px]">
                      <AvatarImage src={currentEmployee.avatar} />
                      <AvatarFallback className="text-3xl font-black">{currentEmployee.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div className="pb-4">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{currentEmployee.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none rounded-lg font-bold">
                          {currentEmployee.position}
                        </Badge>
                        <Badge variant={currentEmployee.status === "Active" ? "default" : "secondary"} className="rounded-lg font-bold">
                          {currentEmployee.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="pt-20 px-10 pb-10">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="bg-slate-50 p-1.5 rounded-2xl w-full h-auto flex flex-wrap lg:grid lg:grid-cols-5 gap-1">
                      <TabsTrigger value="overview" className="rounded-xl py-3 font-bold text-xs data-[state=active]:bg-white">Overview</TabsTrigger>
                      <TabsTrigger value="performance" className="rounded-xl py-3 font-bold text-xs data-[state=active]:bg-white">Performance</TabsTrigger>
                      <TabsTrigger value="skills" className="rounded-xl py-3 font-bold text-xs data-[state=active]:bg-white">Skills</TabsTrigger>
                      <TabsTrigger value="lifecycle" className="rounded-xl py-3 font-bold text-xs data-[state=active]:bg-white">Lifecycle</TabsTrigger>
                      {/* Vault hidden for Managers */}
                      {!isManager && (
                        <TabsTrigger value="vault" className="rounded-xl py-3 font-bold text-xs data-[state=active]:bg-white flex gap-2">
                          <Lock className="w-3 h-3" /> Vault
                        </TabsTrigger>
                      )}
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-10 animate-in fade-in slide-in-from-bottom-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <User className="w-4 h-4" /> Contact Matrix
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                              <div className="p-3 bg-slate-50 rounded-2xl"><Mail className="w-4 h-4 text-slate-400" /></div>
                              <div><p className="text-[10px] font-black text-slate-400 uppercase">Email Address</p><p className="font-bold text-slate-900">{currentEmployee.email}</p></div>
                            </div>
                            <div className="flex items-center gap-4 group">
                              <div className="p-3 bg-slate-50 rounded-2xl"><Phone className="w-4 h-4 text-slate-400" /></div>
                              <div><p className="text-[10px] font-black text-slate-400 uppercase">Secure Line</p><p className="font-bold text-slate-900">{currentEmployee.phone}</p></div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Employment Core
                          </h4>
                          <div className="bg-slate-50 p-6 rounded-[32px] space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-500">Department</span>
                              <span className="text-sm font-black text-slate-900">{currentEmployee.department}</span>
                            </div>
                            {/* Salary only for HR or the Employee themselves */}
                            {(isHR || isEmployee) && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-500">Annual Comp</span>
                                <span className="text-sm font-black text-emerald-600">{currentEmployee.salary}</span>
                              </div>
                            )}
                            {isManager && !isHR && (
                              <div className="flex justify-between items-center opacity-50">
                                <span className="text-sm font-bold text-slate-500">Annual Comp</span>
                                <span className="text-xs font-black text-slate-400 flex items-center gap-1"><EyeOff className="w-3 h-3"/> Restricted</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="mt-10 space-y-8">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Efficiency</p>
                          <p className="text-4xl font-black text-blue-600 mt-1">{currentEmployee.performance}%</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-[32px]">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Tasks</p>
                          <p className="text-4xl font-black text-slate-900 mt-1">{currentEmployee.completedTasks}</p>
                        </div>
                      </div>
                      <div className="p-8 bg-slate-900 rounded-[40px] text-white">
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="font-bold flex items-center gap-2"><Award className="text-blue-400" /> Quarterly Growth Index</h4>
                          {!isEmployee && <Badge className="bg-blue-600">Top Performer</Badge>}
                        </div>
                        <Progress value={currentEmployee.performance} className="h-3 bg-white/10 [&>div]:bg-blue-500" />
                      </div>
                    </TabsContent>

                    {/* Vault Tab (Sensitive Info) */}
                    {!isManager && (
                      <TabsContent value="vault" className="mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="border border-slate-100 rounded-[32px] p-6 space-y-4">
                            <h4 className="font-black text-slate-900 flex items-center gap-2">
                              <Globe className="w-5 h-5 text-blue-600" /> Mobility Records
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                                <span className="text-slate-500 font-bold">Passport ID</span>
                                <span className="font-black text-slate-900">{currentEmployee.passportNo}</span>
                              </div>
                              <div className="flex justify-between text-sm py-2">
                                <span className="text-slate-500 font-bold">Visa Class</span>
                                <span className="font-black text-blue-600">{currentEmployee.visaType}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border border-slate-100 rounded-[32px] p-6 space-y-4">
                            <h4 className="font-black text-slate-900 flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-emerald-600" /> Financial Routing
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                                <span className="text-slate-500 font-bold">Account Segments</span>
                                <span className="font-black text-slate-900">{currentEmployee.accountNo}</span>
                              </div>
                              <div className="flex justify-between text-sm py-2">
                                <span className="text-slate-500 font-bold">Routing Code</span>
                                <span className="font-black text-slate-900">{currentEmployee.ifscCode}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8 p-6 bg-amber-50 rounded-[32px] border border-amber-100 flex gap-4 items-start">
                          <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-bold text-amber-900">Security & Audit Warning</p>
                            <p className="text-xs text-amber-700 mt-1">
                              {isHR ? "As an HR Admin, your access to this vault is logged." : "This is your private data. If any information is incorrect, please contact HR."}
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}