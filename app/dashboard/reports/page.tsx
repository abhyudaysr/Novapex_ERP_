"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Plus, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  Loader2,
  FileCheck,
  ShieldAlert,
  UserCheck
} from "lucide-react"

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [userRole, setUserRole] = useState("hr")

  useEffect(() => {
    const stored = sessionStorage.getItem("userRole")
    if (stored) setUserRole(stored.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const allReports = [
    { id: 1, title: "Monthly Attendance Report", description: "Comprehensive attendance tracking for all employees", type: "Attendance", lastGenerated: "2 hours ago", status: "Ready", size: "2.4 MB", roles: ["hr"] },
    { id: 2, title: "Payroll Summary Q4", description: "Quarterly payroll breakdown and analysis", type: "Payroll", lastGenerated: "1 day ago", status: "Ready", size: "1.8 MB", roles: ["hr"] },
    { id: 3, title: "Performance Review Analytics", description: "Employee performance metrics and trends", type: "Performance", lastGenerated: "3 days ago", status: "Ready", size: "3.2 MB", roles: ["hr", "manager"] },
    { id: 4, title: "Team Productivity Report", description: "Efficiency metrics for your direct reports", type: "Analytics", lastGenerated: "5 days ago", status: "Generating", size: "Pending", roles: ["manager"] },
    { id: 5, title: "Employee Satisfaction Survey", description: "Annual satisfaction survey results", type: "Survey", lastGenerated: "1 week ago", status: "Ready", size: "4.1 MB", roles: ["hr"] },
    { id: 6, title: "My Annual Payslip 2025", description: "Personal salary and tax breakdown for the current year", type: "Payroll", lastGenerated: "2 weeks ago", status: "Ready", size: "1.1 MB", roles: ["employee"] },
    { id: 7, title: "Individual Performance Review", description: "Personal feedback and goal assessment", type: "Performance", lastGenerated: "1 month ago", status: "Ready", size: "850 KB", roles: ["employee"] },
    { id: 8, title: "Team Leave Schedule", description: "Upcoming time-off for team coordination", type: "Calendar", lastGenerated: "Today", status: "Ready", size: "500 KB", roles: ["manager"] },
  ]

  const quickReports = [
    { name: "Attendance", icon: <Users className="w-5 h-5" />, description: isEmployee ? "My Logs" : "Status", color: "text-blue-600 bg-blue-50", roles: ["hr", "manager", "employee"] },
    { name: "Approvals", icon: <Clock className="w-5 h-5" />, description: "Pending", color: "text-amber-600 bg-amber-50", roles: ["hr", "manager"] },
    { name: "Payroll", icon: <DollarSign className="w-5 h-5" />, description: isEmployee ? "My Payslips" : "Cycle", color: "text-emerald-600 bg-emerald-50", roles: ["hr", "employee"] },
    { name: "Compliance", icon: <ShieldAlert className="w-5 h-5" />, description: "Audit Files", color: "text-purple-600 bg-purple-50", roles: ["hr"] },
  ]

  const filteredReports = allReports.filter(
    (report) =>
      report.roles.includes(userRole) &&
      (report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const activeQuickAccess = quickReports.filter(q => q.roles.includes(userRole))

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            {isEmployee ? "My Documents" : "Reports"} <span className="text-blue-600">Vault</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isEmployee ? "Access your personal payroll, tax, and performance documents." : "Audit-ready documentation and automated organizational insights."}
          </p>
        </div>
        {!isEmployee && (
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-2xl py-6 px-8 font-bold transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create New Report
          </Button>
        )}
      </div>

      {/* Role-Based Quick Access Tiles */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${activeQuickAccess.length} gap-6`}>
        {activeQuickAccess.map((report) => (
          <motion.button
            key={report.name}
            whileHover={{ y: -5 }}
            className="p-6 bg-white border border-slate-100 rounded-[32px] text-left hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className={`p-3 rounded-2xl w-fit mb-4 transition-colors ${report.color}`}>
              {report.icon}
            </div>
            <h3 className="font-black text-slate-800 tracking-tight">{report.name}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{report.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Repository Section */}
      <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[40px] overflow-hidden bg-white/80 backdrop-blur-md">
        <CardHeader className="p-8 border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-2xl font-black text-slate-900">
                {isEmployee ? "Personal Archives" : "Generated Repository"}
              </CardTitle>
              <CardDescription className="font-medium text-slate-400 mt-1">
                {isEmployee ? "Confidential records for your account" : "Browse and download archival reports"}
              </CardDescription>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder={isEmployee ? "Search my files..." : "Search repository..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-6 bg-slate-50 border-none rounded-2xl w-full md:w-80 focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={report.id}
                    className="group flex flex-col md:flex-row items-start md:items-center justify-between p-8 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="flex gap-6 items-start">
                      <div className={`p-4 rounded-2xl ${report.status === 'Ready' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                        {report.status === 'Ready' ? <FileCheck className="w-6 h-6" /> : <Loader2 className="w-6 h-6 animate-spin" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-black text-slate-800 text-lg tracking-tight">{report.title}</h4>
                          <Badge className="bg-white border-slate-200 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-3 max-w-md">{report.description}</p>
                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {report.lastGenerated}</span>
                          <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> {report.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 md:mt-0 ml-14 md:ml-0">
                      <Button variant="ghost" className="rounded-xl font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-5" disabled={report.status !== "Ready"}>
                        <Eye className="w-4 h-4 mr-2" /> Preview
                      </Button>
                      <Button className={`rounded-xl font-bold px-6 shadow-sm ${report.status === 'Ready' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400'}`} disabled={report.status !== "Ready"}>
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-20 text-center flex flex-col items-center">
                    <div className="p-6 bg-slate-50 rounded-full mb-4">
                        <FileText className="w-12 h-12 text-slate-200" />
                    </div>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No reports found for your access level</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}