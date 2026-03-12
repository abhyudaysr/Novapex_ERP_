"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  ArrowLeft,
  Users,
  Clock,
  Zap,
  Target,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { downloadJsonFile, downloadTextFile, slugifyFileName } from "@/lib/client/download"

const BASE_MONTHLY_TRENDS = [
  { month: "Jan", attendance: 92.5, target: 95 },
  { month: "Feb", attendance: 94.2, target: 95 },
  { month: "Mar", attendance: 93.8, target: 95 },
  { month: "Apr", attendance: 95.1, target: 95 },
  { month: "May", attendance: 94.5, target: 95 },
  { month: "Jun", attendance: 96.2, target: 95 },
]

const BASE_DEPARTMENTS = [
  { department: "Engineering", attendance: 96.2, employees: 45, color: "bg-blue-500" },
  { department: "Sales", attendance: 93.8, employees: 28, color: "bg-emerald-500" },
  { department: "Marketing", attendance: 91.5, employees: 22, color: "bg-violet-500" },
  { department: "Design", attendance: 94.7, employees: 12, color: "bg-amber-500" },
  { department: "HR", attendance: 97.1, employees: 8, color: "bg-rose-500" },
]

const PERIOD_MULTIPLIER = {
  week: 0.99,
  month: 1,
  quarter: 1.015,
  year: 1.03,
}

const DEPARTMENT_TREND_OFFSETS = {
  All: 0,
  Engineering: 0.9,
  Sales: -0.7,
  Marketing: -1.1,
  Design: 0.2,
  HR: 1.2,
}

export default function AttendanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [userRole, setUserRole] = useState("hr")
  const [activeDepartment, setActiveDepartment] = useState("All")
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isClaimingBadge, setIsClaimingBadge] = useState(false)
  const [badgeClaimed, setBadgeClaimed] = useState(false)
  const [systemMessage, setSystemMessage] = useState("")

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const departmentOptions = useMemo(() => {
    if (isManager) return ["Engineering"]
    return ["All", ...BASE_DEPARTMENTS.map((item) => item.department)]
  }, [isManager])

  useEffect(() => {
    if (!departmentOptions.includes(activeDepartment)) {
      setActiveDepartment(departmentOptions[0] || "All")
    }
  }, [departmentOptions, activeDepartment])

  const reportStats = [
    {
      title: isEmployee ? "My Consistency" : "Average Attendance",
      value: isEmployee ? "98.2%" : "94.5%",
      change: "+2.1%",
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      show: true,
    },
    {
      title: isEmployee ? "Punctuality" : "On-Time Arrivals",
      value: isEmployee ? "92.0%" : "87.2%",
      change: "+1.5%",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      show: true,
    },
    {
      title: isEmployee ? "Overtime (Hrs)" : "Total Overtime",
      value: isEmployee ? "12" : "245",
      change: "-8.3%",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      show: true,
    },
    {
      title: "Leave Utilization",
      value: "68.4%",
      change: "+5.2%",
      icon: Calendar,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      show: isHR || isManager,
    },
    {
      title: "Productivity Score",
      value: "A+",
      change: "Top 5%",
      icon: Zap,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      show: isEmployee,
    },
  ]

  const visibleDepartmentAttendance = useMemo(() => {
    const managerScoped = isManager
      ? BASE_DEPARTMENTS.filter((item) => item.department === "Engineering")
      : BASE_DEPARTMENTS

    if (activeDepartment === "All") return managerScoped
    return managerScoped.filter((item) => item.department === activeDepartment)
  }, [activeDepartment, isManager])

  const monthlyTrends = useMemo(() => {
    const multiplier = PERIOD_MULTIPLIER[selectedPeriod] || 1
    const offset = DEPARTMENT_TREND_OFFSETS[activeDepartment] || 0

    return BASE_MONTHLY_TRENDS.map((row) => {
      const value = Math.max(70, Math.min(100, row.attendance * multiplier + offset))
      return {
        ...row,
        attendance: Number(value.toFixed(1)),
      }
    })
  }, [selectedPeriod, activeDepartment])

  const showMessage = (message) => {
    setSystemMessage(message)
    window.setTimeout(() => setSystemMessage(""), 2400)
  }

  const handleDepartmentFilter = (department) => {
    setActiveDepartment(department)
    setIsFilterMenuOpen(false)
    showMessage(`Filter applied: ${department}.`)
  }

  const handleExport = () => {
    setIsExporting(true)
    const payload = {
      generatedAt: new Date().toISOString(),
      companyName: sessionStorage.getItem("companyName") || "Unknown Company",
      role: userRole,
      selectedPeriod,
      activeDepartment,
      summaryStats: reportStats.filter((stat) => stat.show),
      trends: monthlyTrends,
      departments: visibleDepartmentAttendance,
    }

    window.setTimeout(() => {
      const label = isEmployee ? "my-attendance-insight" : "attendance-report"
      const fileName = `${slugifyFileName(label)}-${selectedPeriod}-${Date.now()}.json`
      downloadJsonFile(fileName, payload)
      setIsExporting(false)
      showMessage("Attendance report exported.")
    }, 400)
  }

  const handleClaimBadge = () => {
    if (badgeClaimed) {
      showMessage("Badge already claimed for this cycle.")
      return
    }
    setIsClaimingBadge(true)

    window.setTimeout(() => {
      const userName = sessionStorage.getItem("userName") || "Employee"
      const company = sessionStorage.getItem("companyName") || "Company"
      const content = [
        "Novapex Attendance Excellence Badge",
        `Awarded To: ${userName}`,
        `Company: ${company}`,
        `Date: ${new Date().toLocaleDateString()}`,
        "Criteria: Attendance rate above 98% with punctuality consistency.",
      ].join("\n")
      downloadTextFile(`attendance-badge-${slugifyFileName(userName)}.txt`, content)
      setBadgeClaimed(true)
      setIsClaimingBadge(false)
      showMessage("Badge claimed and downloaded.")
    }, 600)
  }

  return (
    <div className="page-shell p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-1">
            <Link href="/attendance">
              <Button variant="ghost" size="sm" className="hover:bg-white/50 -ml-2 mb-2 group transition-all">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to {isEmployee ? "Dashboard" : "Attendance"}
              </Button>
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {isEmployee ? "My Insight" : "Attendance"} <span className="text-primary">Reports</span>
            </h1>
            <p className="text-slate-500 font-medium">
              {isHR
                ? "Global workforce analytics"
                : isManager
                  ? "Departmental performance metrics"
                  : "Your personal productivity summary"}
            </p>
          </div>

          <div className="relative flex gap-3">
            {!isEmployee && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsFilterMenuOpen((current) => !current)}
                  className="glass-card border-white/60 bg-white/40 backdrop-blur-md rounded-xl font-bold"
                >
                  <Filter className="w-4 h-4 mr-2 text-slate-500" />
                  Filter: {activeDepartment}
                </Button>

                <AnimatePresence>
                  {isFilterMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-14 z-40 min-w-[220px] rounded-2xl border border-white/70 bg-white/95 p-2 shadow-2xl backdrop-blur-md"
                    >
                      {departmentOptions.map((department) => (
                        <button
                          key={department}
                          onClick={() => handleDepartmentFilter(department)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                            activeDepartment === department
                              ? "bg-primary text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {department}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 font-bold shadow-lg shadow-slate-200"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isEmployee ? "Download PDF" : "Export Report"}
            </Button>
          </div>
        </motion.div>

        {systemMessage && (
          <div className="glass-card rounded-2xl border border-blue-200/60 bg-blue-50/70 px-4 py-3 text-sm font-semibold text-blue-700">
            {systemMessage}
          </div>
        )}

        {!isEmployee && (
          <div className="flex p-1 bg-slate-200/50 backdrop-blur-md rounded-2xl w-fit border border-white/50">
            {["week", "month", "quarter", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  selectedPeriod === period ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportStats
            .filter((s) => s.show)
            .map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-[28px] border border-white/80 bg-white/60 backdrop-blur-xl shadow-xl shadow-slate-200/30 group hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                    <div
                      className={`flex items-center text-xs font-bold ${
                        stat.change.startsWith("+") || stat.change.includes("Top")
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change} {isEmployee ? "this period" : `vs last ${selectedPeriod}`}
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-[32px] border border-white bg-white/50 backdrop-blur-2xl p-8 shadow-2xl shadow-slate-200/40"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-800">{isEmployee ? "Personal Growth" : "Presence Trends"}</h3>
                <p className="text-sm font-medium text-slate-500">
                  {isEmployee ? "Your attendance over time" : `Attendance vs Target (95%) - ${selectedPeriod}`}
                </p>
              </div>
              <BarChart3 className="text-primary w-6 h-6" />
            </div>

            <div className="space-y-6">
              {monthlyTrends.map((month, index) => (
                <div key={month.month} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-600">{month.month}</span>
                    <span
                      className={`text-sm font-black ${
                        month.attendance >= month.target ? "text-emerald-500" : "text-amber-500"
                      }`}
                    >
                      {month.attendance}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${month.attendance}%` }}
                      transition={{ duration: 1, delay: 0.4 + index * 0.08 }}
                      className={`h-full rounded-full ${
                        month.attendance >= month.target ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {isEmployee ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-[32px] border border-white bg-gradient-to-br from-primary to-blue-700 p-8 shadow-2xl text-white overflow-hidden relative"
            >
              <div className="relative z-10">
                <Target className="w-12 h-12 mb-6 opacity-80" />
                <h3 className="text-3xl font-black mb-2">Yearly Milestone</h3>
                <p className="text-blue-100 font-medium mb-8">
                  You've maintained a 98% attendance rate, placing you in the top 5% of the company.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Upcoming Reward</p>
                    <p className="text-lg font-black">Performance Bonus Eligible</p>
                  </div>
                  <Button
                    className="w-full bg-white text-primary hover:bg-blue-50 font-black rounded-xl h-12"
                    onClick={handleClaimBadge}
                    disabled={isClaimingBadge}
                  >
                    {isClaimingBadge ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Claiming...
                      </>
                    ) : badgeClaimed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Badge Claimed
                      </>
                    ) : (
                      "Claim Badge"
                    )}
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-[32px] border border-white bg-white/50 backdrop-blur-2xl p-8 shadow-2xl shadow-slate-200/40"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {isManager ? "Team Breakdown" : "Department Performance"}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    {isManager ? "Engineering Team Metrics" : "Live breakdown by sector"}
                  </p>
                </div>
                <PieChart className="text-primary w-6 h-6" />
              </div>

              <div className="grid gap-4">
                {visibleDepartmentAttendance.map((dept) => (
                  <div
                    key={dept.department}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/80 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-10 rounded-full ${dept.color} opacity-80 transition-opacity`} />
                      <div>
                        <p className="font-bold text-slate-800">{dept.department}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                          {dept.employees} active users
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-800">{dept.attendance}%</p>
                      <Badge
                        variant="outline"
                        className="border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase"
                      >
                        Excellent
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {!isEmployee && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[32px] border border-white/80 bg-slate-900 p-8 shadow-2xl text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-primary" />
              <h3 className="text-xl font-black">Presence Analysis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { time: "09:00 AM", label: "Peak In-Flow", percentage: 85, color: "bg-blue-400" },
                { time: "12:30 PM", label: "Maximum Presence", percentage: 94, color: "bg-emerald-400" },
                { time: "06:00 PM", label: "Peak Out-Flow", percentage: 72, color: "bg-amber-400" },
              ].map((peak, i) => (
                <div key={i} className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black">{peak.time}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-primary">{peak.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${peak.percentage}%` }}
                      className={`h-full ${peak.color}`}
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{peak.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
