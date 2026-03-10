"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Plus,
  Search,
  Check,
  X,
  ArrowLeft,
  Info,
  FileText,
  Loader2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

const LEAVE_TYPES = ["Annual Leave", "Sick Leave", "Personal Leave"]

function getInitials(name) {
  return (name || "NA")
    .split(" ")
    .map((token) => token[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function LeaveRequestsPage() {
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [showLeaveBalance, setShowLeaveBalance] = useState(null)
  const [userRole, setUserRole] = useState("employee")
  const [sessionEmail, setSessionEmail] = useState("")
  const [sessionCompany, setSessionCompany] = useState("")
  const [leaveRequests, setLeaveRequests] = useState([])
  const [stats, setStats] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeActionId, setActiveActionId] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [newRequest, setNewRequest] = useState({
    leaveType: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const loadLeaveData = async (
    emailContext,
    companyContext,
    withLoader = false,
  ) => {
    if (!emailContext || !companyContext) return
    if (withLoader) setIsLoading(true)

    try {
      setErrorMessage("")
      const params = new URLSearchParams({
        email: emailContext,
        company: companyContext,
      })
      const response = await fetch(`/api/leave?${params.toString()}`, {
        cache: "no-store",
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Unable to sync leave data.")
      }
      setLeaveRequests(data.requests || [])
      setStats(data.stats || null)
      if (data.actor?.role) {
        setUserRole(String(data.actor.role).toLowerCase())
      }
    } catch (error) {
      setErrorMessage(error.message || "Leave synchronization failed.")
    } finally {
      if (withLoader) setIsLoading(false)
    }
  }

  useEffect(() => {
    const storedRole = (sessionStorage.getItem("userRole") || "employee").toLowerCase()
    const storedEmail =
      sessionStorage.getItem("userEmail") ||
      localStorage.getItem("userEmail") ||
      localStorage.getItem("rememberedEmail") ||
      `${storedRole}@novapex.com`
    const storedCompany =
      sessionStorage.getItem("companyName") ||
      localStorage.getItem("companyName") ||
      localStorage.getItem("rememberedCompany") ||
      "Novapex Systems"

    setUserRole(storedRole)
    setSessionEmail(storedEmail)
    setSessionCompany(storedCompany)
    loadLeaveData(storedEmail, storedCompany, true)
  }, [])

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    if (!normalizedSearch) return leaveRequests

    return leaveRequests.filter((request) =>
      [
        request.employee,
        request.department,
        request.leaveType,
        request.status,
        request.reason,
      ].some((value) =>
        String(value || "").toLowerCase().includes(normalizedSearch),
      ),
    )
  }, [leaveRequests, searchTerm])

  const selectedRequest = useMemo(
    () => leaveRequests.find((request) => request.id === showLeaveBalance) || null,
    [leaveRequests, showLeaveBalance],
  )

  const leaveStats = [
    {
      title: "Pending Requests",
      value: String(stats?.pendingRequests ?? 0),
      color: "text-amber-500",
      show: !isEmployee,
    },
    {
      title: "Approved This Month",
      value: String(stats?.approvedThisMonth ?? 0),
      color: "text-emerald-500",
      show: !isEmployee,
    },
    {
      title: "Annual Balance",
      value: stats?.annualBalance || "N/A",
      color: "text-blue-500",
      show: isEmployee,
    },
    {
      title: "Sick Leave Left",
      value: stats?.sickLeaveLeft || "N/A",
      color: "text-violet-500",
      show: isEmployee,
    },
    {
      title: "Approved Days",
      value: String(stats?.totalApprovedDays ?? 0),
      color: "text-blue-500",
      show: isHR,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200"
      case "Pending":
        return "bg-amber-500/10 text-amber-600 border-amber-200"
      case "Rejected":
        return "bg-rose-500/10 text-rose-600 border-rose-200"
      case "Cancelled":
        return "bg-slate-500/10 text-slate-600 border-slate-200"
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-200"
    }
  }

  const handleLeaveAction = async (requestId, action) => {
    if (!sessionEmail || !sessionCompany) {
      setErrorMessage("Missing session context. Please log in again.")
      return
    }

    const actionKey = `${requestId}:${action}`
    setActiveActionId(actionKey)
    setErrorMessage("")

    try {
      const response = await fetch("/api/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sessionEmail,
          company: sessionCompany,
          requestId,
          action,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Unable to update leave request.")
      }
      await loadLeaveData(sessionEmail, sessionCompany, false)
    } catch (error) {
      setErrorMessage(error.message || "Unable to update leave request.")
    } finally {
      setActiveActionId("")
    }
  }

  const handleCreateRequest = async (event) => {
    event.preventDefault()

    if (!sessionEmail || !sessionCompany) {
      setErrorMessage("Missing session context. Please log in again.")
      return
    }

    if (!newRequest.startDate || !newRequest.endDate || !newRequest.reason.trim()) {
      setErrorMessage("Please complete all fields before submitting.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sessionEmail,
          company: sessionCompany,
          leaveType: newRequest.leaveType,
          startDate: newRequest.startDate,
          endDate: newRequest.endDate,
          reason: newRequest.reason.trim(),
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit leave request.")
      }

      setShowNewRequest(false)
      setNewRequest({
        leaveType: "Annual Leave",
        startDate: "",
        endDate: "",
        reason: "",
      })
      await loadLeaveData(sessionEmail, sessionCompany, false)
    } catch (error) {
      setErrorMessage(error.message || "Unable to submit leave request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-shell p-8 min-h-[60vh] flex items-center justify-center">
        <div className="glass-card rounded-3xl p-8 flex flex-col items-center gap-3 border border-white/60">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Syncing Leave Workspace
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
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
              {isHR
                ? "Company-wide leave tracking with tenant-safe approvals"
                : isManager
                  ? "Review requests routed to you from your company"
                  : "Apply for leave and track your approvals"}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {sessionCompany || "Company context unavailable"}
            </p>
          </div>

          <div className="flex gap-3">
            {!isEmployee && (
              <Link href="/attendance/reports">
                <Button
                  variant="outline"
                  className="h-12 px-6 rounded-2xl border-white bg-white/60"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              </Link>
            )}
            {(isEmployee || isHR) && (
              <Button
                onClick={() => setShowNewRequest(true)}
                className="bg-primary hover:bg-primary/90 shadow-lg h-12 px-6 rounded-2xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            )}
          </div>
        </motion.div>

        {errorMessage && (
          <div className="glass-card rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {leaveStats
            .filter((stat) => stat.show)
            .map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-md"
              >
                <p className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </p>
              </motion.div>
            ))}
        </div>

        <div className="glass-card rounded-3xl border border-white/60 bg-white/50 backdrop-blur-md p-4 md:p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by employee, leave type, status, or reason..."
              className="w-full h-11 rounded-xl border border-white/60 bg-white/80 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request, index) => {
            const isPending = request.status === "Pending"
            const isActionRunning = activeActionId.startsWith(`${request.id}:`)

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.06 }}
                className="glass-card relative overflow-hidden rounded-[32px] border border-white/80 bg-white/70 backdrop-blur-xl shadow-xl p-1"
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border-2 border-white shadow-md">
                        <AvatarImage src={request.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {getInitials(request.employee)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{request.employee}</h3>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight">
                          {request.department}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(request.status)} font-bold rounded-lg px-3 py-1`}
                    >
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
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Start</p>
                      <p className="font-bold text-slate-700">{request.startDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">End</p>
                      <p className="font-bold text-slate-700">{request.endDate}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-white/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Reason</p>
                      <p className="text-sm font-medium text-slate-600 italic">"{request.reason}"</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Approver</p>
                      <p className="font-bold text-slate-700">{request.approver}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
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

                      {(isManager || isHR) && isPending && (
                        <div className="flex flex-1 gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleLeaveAction(request.id, "approve")}
                            disabled={isActionRunning}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold"
                          >
                            {activeActionId === `${request.id}:approve` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4 mr-2" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLeaveAction(request.id, "reject")}
                            disabled={isActionRunning}
                            className="flex-1 border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl font-bold"
                          >
                            {activeActionId === `${request.id}:reject` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      )}

                      {isEmployee && isPending && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLeaveAction(request.id, "cancel")}
                          disabled={isActionRunning}
                          className="flex-1 text-rose-500 hover:bg-rose-50 rounded-xl font-bold"
                        >
                          {activeActionId === `${request.id}:cancel` ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            "Cancel Request"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredRequests.length === 0 && (
          <div className="glass-card rounded-3xl border border-white/60 bg-white/50 backdrop-blur-md p-10 text-center">
            <p className="text-lg font-black text-slate-800 mb-1">No leave requests found</p>
            <p className="text-sm text-slate-500">
              Try a different search term or create a new leave application.
            </p>
          </div>
        )}

        <AnimatePresence>
          {showLeaveBalance && selectedRequest && (
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
                      <p className="font-bold text-primary">{selectedRequest.employee}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowLeaveBalance(null)}
                      className="rounded-full h-10 w-10 p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(selectedRequest.balance || {}).map(([type, data]) => {
                      const percentage =
                        data.total > 0 ? Math.round((data.used / data.total) * 100) : 0
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

                    {!selectedRequest.balance && (
                      <p className="text-sm font-semibold text-slate-500">
                        Leave balance data is not available for this employee.
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => setShowLeaveBalance(null)}
                    className="w-full h-12 rounded-2xl bg-slate-900 text-white font-bold"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNewRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-2xl overflow-hidden glass-card rounded-[36px] border border-white bg-white shadow-2xl"
              >
                <form onSubmit={handleCreateRequest} className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">New Leave Application</h2>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        Request will be routed within {sessionCompany}.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowNewRequest(false)}
                      className="rounded-full h-10 w-10 p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                        Leave Type
                      </span>
                      <select
                        value={newRequest.leaveType}
                        onChange={(event) =>
                          setNewRequest((prev) => ({
                            ...prev,
                            leaveType: event.target.value,
                          }))
                        }
                        className="w-full h-11 rounded-xl border border-white/70 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                      >
                        {LEAVE_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="grid grid-cols-2 gap-3 md:col-span-1">
                      <label className="space-y-2">
                        <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                          Start
                        </span>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            value={newRequest.startDate}
                            onChange={(event) =>
                              setNewRequest((prev) => ({
                                ...prev,
                                startDate: event.target.value,
                              }))
                            }
                            className="w-full h-11 rounded-xl border border-white/70 bg-white pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                          End
                        </span>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            value={newRequest.endDate}
                            onChange={(event) =>
                              setNewRequest((prev) => ({
                                ...prev,
                                endDate: event.target.value,
                              }))
                            }
                            className="w-full h-11 rounded-xl border border-white/70 bg-white pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </label>
                    </div>
                  </div>

                  <label className="space-y-2 block">
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                      Reason
                    </span>
                    <textarea
                      value={newRequest.reason}
                      onChange={(event) =>
                        setNewRequest((prev) => ({
                          ...prev,
                          reason: event.target.value,
                        }))
                      }
                      rows={4}
                      placeholder="Describe your leave reason..."
                      className="w-full rounded-xl border border-white/70 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    />
                  </label>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewRequest(false)}
                      className="rounded-xl h-11 px-6"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl h-11 px-6 bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
