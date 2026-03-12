"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Banknote, 
  ShieldCheck, 
  ArrowUpRight, 
  TrendingDown,
  FileText,
  Lock
} from "lucide-react"

type Status = "Paid" | "Pending"

interface Employee {
  id: number
  name: string
  department: string
  baseSalary: number
  bonus: number
  deductions: number
  status: Status
}

const initialPayrollData: Employee[] = [
  { id: 1, name: "Alice Johnson", department: "Engineering", baseSalary: 6500, bonus: 800, deductions: 300, status: "Paid" },
  { id: 2, name: "Bob Smith", department: "Design", baseSalary: 6000, bonus: 700, deductions: 200, status: "Pending" },
  { id: 3, name: "Charlie Lee", department: "Engineering", baseSalary: 8500, bonus: 1200, deductions: 700, status: "Paid" },
  { id: 4, name: "David Brown", department: "HR", baseSalary: 5500, bonus: 500, deductions: 200, status: "Paid" },
  { id: 5, name: "Eva Williams", department: "Finance", baseSalary: 7000, bonus: 600, deductions: 400, status: "Pending" },
]

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<Employee[]>(initialPayrollData)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"All" | Status>("All")
  const [period, setPeriod] = useState("September 2025")
  const [lockedStatus, setLockedStatus] = useState<Record<number, boolean>>({})
  const [userRole, setUserRole] = useState("hr")

  useEffect(() => {
    const stored = sessionStorage.getItem("userRole")
    if (stored) setUserRole(stored.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const updateStatus = (id: number, newStatus: Status) => {
    if (!isHR) return // Guard for safety
    setPayroll((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status: newStatus } : emp))
    )
    if (newStatus === "Paid") {
      setLockedStatus((prev) => ({ ...prev, [id]: true }))
    }
  }

  // Role Filtering Logic
  const filteredData = payroll.filter((employee) => {
    // 1. Role access filter
    if (isEmployee) return employee.name === "Alice Johnson" // Mock: Employee only sees self
    if (isManager) return employee.department === "Engineering" // Mock: Manager only sees Engineering
    
    // 2. Search & Filter UI logic for HR/Manager
    const matchesSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "All" || employee.status === filter
    return matchesSearch && matchesFilter
  })

  const groupedPayroll = filteredData.reduce<Record<string, Employee[]>>((acc, emp) => {
    if (!acc[emp.department]) acc[emp.department] = []
    acc[emp.department].push(emp)
    return acc
  }, {})

  const totals = filteredData.reduce(
    (acc, emp) => {
      acc.base += emp.baseSalary
      acc.bonus += emp.bonus
      acc.deductions += emp.deductions
      acc.net += emp.baseSalary + emp.bonus - emp.deductions
      return acc
    },
    { base: 0, bonus: 0, deductions: 0, net: 0 }
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Banknote className="w-10 h-10 text-blue-600" /> {isEmployee ? "My Pay Slip" : "Payroll Engine"}
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            {isEmployee ? "Your compensation breakdown for " : "Disbursement management for "} 
            <span className="text-slate-900 font-bold underline decoration-blue-200">{period}</span>
          </p>
        </div>

        {!isEmployee && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Filter assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64 rounded-2xl border-slate-100 bg-slate-50/50"
              />
            </div>
            {isHR && (
              <Select value={filter} onValueChange={(val: "All" | Status) => setFilter(val)}>
                <SelectTrigger className="w-40 rounded-2xl border-slate-100 bg-white font-bold text-slate-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Global View</SelectItem>
                  <SelectItem value="Paid">Verified Paid</SelectItem>
                  <SelectItem value="Pending">Awaiting Action</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      {/* Financial Health Snapshot - ONLY FOR HR */}
      {isHR && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-[32px] border-none shadow-sm bg-blue-600 text-white p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Net Disbursement</p>
            <p className="text-3xl font-black mt-1">${totals.net.toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3" /> +2.4% vs Prev
            </div>
          </Card>
          <Card className="rounded-[32px] border-none shadow-sm bg-white p-6 border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Bonuses</p>
            <p className="text-3xl font-black mt-1 text-slate-900">${totals.bonus.toLocaleString()}</p>
          </Card>
          <Card className="rounded-[32px] border-none shadow-sm bg-white p-6 border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tax & Deductions</p>
            <p className="text-3xl font-black mt-1 text-rose-600">-${totals.deductions.toLocaleString()}</p>
          </Card>
          <Card className="rounded-[32px] border-none shadow-sm bg-slate-900 text-white p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Unit Compliance</p>
            <p className="text-3xl font-black mt-1">100%</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400">
              <ShieldCheck className="w-3 h-3" /> All audits passed
            </div>
          </Card>
        </div>
      )}

      {/* Payroll Groups / Personal View */}
      <div className="space-y-12">
        {Object.keys(groupedPayroll).map((dept, i) => {
          const deptTotal = groupedPayroll[dept].reduce(
            (sum, emp) => sum + (emp.baseSalary + emp.bonus - emp.deductions),
            0
          )

          return (
            <motion.div
              key={dept}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              {!isEmployee && (
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-600 rounded-full" />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{dept} Unit</h2>
                  </div>
                  {isHR && (
                    <Badge variant="outline" className="rounded-xl border-slate-200 font-bold px-4 py-1 text-slate-600 bg-white">
                      Unit Net: ${deptTotal.toLocaleString()}
                    </Badge>
                  )}
                </div>
              )}

              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {isEmployee ? "Profile" : "Employee Profile"}
                        </th>
                        <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Base</th>
                        <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-emerald-600">Bonus</th>
                        <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-rose-500">Deductions</th>
                        <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Net Pay</th>
                        {!isEmployee && <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Transaction Status</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {groupedPayroll[dept].map((emp) => {
                        const netSalary = emp.baseSalary + emp.bonus - emp.deductions
                        const isLocked = lockedStatus[emp.id] || emp.status === "Paid"
                        
                        return (
                          <tr key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-6 px-8">
                              <p className="font-bold text-slate-900">{emp.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: NPX-00{emp.id}</p>
                            </td>
                            <td className="py-6 px-4 font-medium text-slate-600">${emp.baseSalary.toLocaleString()}</td>
                            <td className="py-6 px-4 font-bold text-emerald-600">+${emp.bonus.toLocaleString()}</td>
                            <td className="py-6 px-4 font-bold text-rose-400">-${emp.deductions.toLocaleString()}</td>
                            <td className="py-6 px-4">
                              <span className="text-lg font-black text-slate-900">${netSalary.toLocaleString()}</span>
                            </td>
                            {!isEmployee && (
                              <td className="py-6 px-8 text-right">
                                <div className="flex justify-end">
                                  {!isHR || isLocked ? (
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border ${
                                      emp.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                    }`}>
                                      {emp.status === "Paid" ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-3 h-3" />} 
                                      {emp.status.toUpperCase()}
                                    </div>
                                  ) : (
                                    <Select
                                      value={emp.status}
                                      onValueChange={(val: Status) => updateStatus(emp.id, val)}
                                    >
                                      <SelectTrigger className="w-36 rounded-2xl font-black text-[10px] uppercase tracking-widest py-5 bg-amber-50 text-amber-700 border-amber-200">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Paid" className="font-bold">Mark as Paid</SelectItem>
                                        <SelectItem value="Pending" className="font-bold">Stay Pending</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Floating Action Bar - Only for HR */}
      {isHR && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 py-7 shadow-2xl flex gap-3 font-black">
            <FileText className="w-5 h-5 text-blue-400" />
            Generate Payroll Report (PDF/CSV)
          </Button>
        </div>
      )}
    </div>
  )
}