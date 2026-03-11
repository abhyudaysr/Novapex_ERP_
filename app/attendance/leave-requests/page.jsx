"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar, Plus, Search, Check, X, ArrowLeft,
  FileText, Loader2, ChevronDown, ChevronUp, RefreshCw,
} from "lucide-react"

const LEAVE_TYPES   = ["Annual Leave", "Sick Leave", "Personal Leave"]
const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected", "Cancelled"]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function statusStyle(status) {
  if (status === "Approved")  return { bg: "var(--green-bg)",  text: "var(--green)"  }
  if (status === "Pending")   return { bg: "var(--amber-bg)",  text: "var(--amber)"  }
  if (status === "Rejected")  return { bg: "var(--red-bg)",    text: "var(--red)"    }
  if (status === "Cancelled") return { bg: "var(--surface-3)", text: "var(--t4)"     }
  return { bg: "var(--surface-3)", text: "var(--t4)" }
}

// ─────────────────────────────────────────────────────────────────────────────
// BALANCE BARS — expandable row shown below each table row
// ─────────────────────────────────────────────────────────────────────────────
function BalanceRow({ balance }) {
  if (!balance || Object.keys(balance).length === 0) {
    return (
      <div className="px-6 py-3 text-xs" style={{ color: "var(--t4)" }}>
        Balance data not available for this employee.
      </div>
    )
  }

  const COLORS = {
    annual:   { bar: "var(--blue)",   bg: "var(--blue-bg)"   },
    sick:     { bar: "var(--amber)",  bg: "var(--amber-bg)"  },
    personal: { bar: "var(--purple)", bg: "var(--purple-bg)" },
  }

  return (
    <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4"
      style={{ background: "var(--surface-2)", borderTop: "1px solid var(--b1)" }}>
      {Object.entries(balance).map(([type, data]) => {
        const used      = data.used  ?? 0
        const total     = data.total ?? 0
        const remaining = Math.max(total - used, 0)
        const pct       = total > 0 ? Math.round((used / total) * 100) : 0
        const c         = COLORS[type] || { bar: "var(--accent)", bg: "var(--accent-bg)" }

        return (
          <div key={type} className="p-3 rounded-xl"
            style={{ background: "var(--surface-3)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider capitalize"
                style={{ color: "var(--t4)" }}>{type} Leave</span>
              <span className="text-xs font-bold tabular-nums" style={{ color: c.bar }}>
                {remaining} left
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1.5"
              style={{ background: "var(--b1)" }}>
              <motion.div className="h-full rounded-full" style={{ background: c.bar }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }} />
            </div>
            <p className="text-[9px]" style={{ color: "var(--t4)" }}>
              {used} used · {remaining} remaining · {total} total
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLY LEAVE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ApplyModal({ sessionCompany, onClose, onSubmit, isSubmitting, error }) {
  const [form, setForm] = useState({
    leaveType: "Annual Leave", startDate: "", endDate: "", reason: "",
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="w-full max-w-lg rounded-[24px] overflow-hidden"
        style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-xl)" }}>

        <div className="relative px-6 py-5 flex items-center justify-between"
          style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent) 40%, var(--blue) 70%, transparent)" }} />
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.02em" }}>
              New Leave Application
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--t4)" }}>
              Request will be routed within {sessionCompany}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: "var(--t4)" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface-3)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red)" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--t4)" }}>Leave Type</label>
            <select value={form.leaveType} onChange={e => set("leaveType", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t1)" }}>
              {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["startDate", "endDate"].map(field => (
              <div key={field}>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--t4)" }}>
                  {field === "startDate" ? "Start Date" : "End Date"}
                </label>
                <input type="date" value={form[field]} onChange={e => set(field, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t1)" }} />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--t4)" }}>
              Reason <span style={{ fontWeight: 400, textTransform: "none" }}>(min 8 chars)</span>
            </label>
            <textarea value={form.reason} onChange={e => set("reason", e.target.value)}
              rows={3} placeholder="Describe the reason for your leave request…"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t1)" }} />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "var(--surface-2)", color: "var(--t3)", border: "1px solid var(--b1)" }}>
              Cancel
            </button>
            <button onClick={() => onSubmit(form)} disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: isSubmitting ? "var(--surface-3)" : "var(--accent)",
                color: isSubmitting ? "var(--t4)" : "white" }}>
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSubmitting ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function LeaveRequestsPage() {
  // ── Session ─────────────────────────────────────────────────────────
  const [userRole,       setUserRole]       = useState("employee")
  const [sessionEmail,   setSessionEmail]   = useState("")
  const [sessionCompany, setSessionCompany] = useState("")

  // ── Data ─────────────────────────────────────────────────────────────
  const [leaveRequests,  setLeaveRequests]  = useState([])
  const [stats,          setStats]          = useState(null)
  const [isLoading,      setIsLoading]      = useState(true)
  const [errorMessage,   setErrorMessage]   = useState("")

  // ── UI ───────────────────────────────────────────────────────────────
  const [searchTerm,     setSearchTerm]     = useState("")
  const [statusFilter,   setStatusFilter]   = useState("All")
  const [expandedRow,    setExpandedRow]    = useState(null)
  const [showModal,      setShowModal]      = useState(false)
  const [isSubmitting,   setIsSubmitting]   = useState(false)
  const [submitError,    setSubmitError]    = useState("")
  const [successMsg,     setSuccessMsg]     = useState("")
  const [activeActionId, setActiveActionId] = useState("")

  const isHR       = userRole === "hr"
  const isManager  = userRole === "manager"
  const isEmployee = userRole === "employee"

  // ── Bootstrap ─────────────────────────────────────────────────────────
  useEffect(() => {
    const role    = (sessionStorage.getItem("userRole") || "employee").toLowerCase()
    const email   = sessionStorage.getItem("userEmail")    || localStorage.getItem("userEmail")    || localStorage.getItem("rememberedEmail")   || `${role}@novapex.com`
    const company = sessionStorage.getItem("companyName")  || localStorage.getItem("companyName")  || localStorage.getItem("rememberedCompany") || "Novapex Systems"
    setUserRole(role)
    setSessionEmail(email)
    setSessionCompany(company)
    loadData(email, company, true)
  }, [])

  // ── Fetch — scoped by email + company (multi-tenant safe) ──────────────
  const loadData = async (email, company, withLoader = false) => {
    if (!email || !company) return
    if (withLoader) setIsLoading(true)
    try {
      setErrorMessage("")
      const res  = await fetch(
        `/api/leave?email=${encodeURIComponent(email)}&company=${encodeURIComponent(company)}`,
        { cache: "no-store" }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Unable to sync leave data.")
      setLeaveRequests(data.requests || [])
      setStats(data.stats || null)
      // Sync role from API actor (authoritative)
      if (data.actor?.role) setUserRole(String(data.actor.role).toLowerCase())
    } catch (e) {
      setErrorMessage(e.message || "Leave synchronisation failed.")
    } finally {
      if (withLoader) setIsLoading(false)
    }
  }

  // ── Filtering ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return leaveRequests.filter(r => {
      const matchSearch = !searchTerm.trim() ||
        [r.employee, r.department, r.leaveType, r.status, r.reason]
          .some(v => String(v || "").toLowerCase().includes(searchTerm.toLowerCase()))
      const matchStatus = statusFilter === "All" || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [leaveRequests, searchTerm, statusFilter])

  // ── Approve / Reject / Cancel ──────────────────────────────────────────
  const handleAction = async (requestId, action) => {
    const key = `${requestId}:${action}`
    setActiveActionId(key)
    setErrorMessage("")
    try {
      const res  = await fetch("/api/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sessionEmail, company: sessionCompany, requestId, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Unable to update leave request.")
      await loadData(sessionEmail, sessionCompany)
    } catch (e) {
      setErrorMessage(e.message)
    } finally {
      setActiveActionId("")
    }
  }

  // ── Submit new leave ───────────────────────────────────────────────────
  const handleSubmit = async (form) => {
    if (!sessionEmail || !sessionCompany) { setSubmitError("Missing session. Please log in again."); return }
    if (!form.startDate || !form.endDate || !form.reason.trim()) { setSubmitError("Please complete all fields."); return }
    setIsSubmitting(true)
    setSubmitError("")
    try {
      const res  = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sessionEmail, company: sessionCompany, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Unable to submit leave request.")
      setShowModal(false)
      setSuccessMsg("Leave request submitted successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)
      await loadData(sessionEmail, sessionCompany)
    } catch (e) {
      setSubmitError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8"
        style={{ background: "var(--surface-0)" }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--t4)" }}>
            Syncing Leave Workspace
          </p>
        </div>
      </div>
    )
  }

  const showEmployeeCol = isHR || isManager

  // Grid template based on role
  const gridCols = showEmployeeCol
    ? "minmax(140px,1.5fr) minmax(110px,1fr) minmax(120px,1.2fr) 90px 90px 46px minmax(72px,auto) minmax(130px,1fr)"
    : "minmax(140px,1.5fr) 90px 90px 46px minmax(72px,auto) minmax(120px,1fr)"

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <ApplyModal
            sessionCompany={sessionCompany}
            onClose={() => { setShowModal(false); setSubmitError("") }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={submitError}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6"
        style={{ background: "var(--surface-0)" }}>

        {/* ══ HEADER ═════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link href="/attendance"
              className="inline-flex items-center gap-1.5 text-xs font-semibold mb-3 group"
              style={{ color: "var(--t4)" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--accent-t)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--t4)"}>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Back to {isEmployee ? "Dashboard" : "Attendance"}
            </Link>
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--t1)", letterSpacing: "-0.04em" }}>
              {isEmployee ? "My Leaves" : "Leave Management"}
            </h1>
            <p className="text-sm font-medium mt-1" style={{ color: "var(--t3)" }}>
              {isHR      ? "Company-wide leave tracking with tenant-safe approvals"
               : isManager ? "Review requests routed to you from your team"
               :             "Apply for leave and track your approvals"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1"
              style={{ color: "var(--accent-t)" }}>
              {sessionCompany}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => loadData(sessionEmail, sessionCompany)}
              className="p-2.5 rounded-xl transition-all hover:scale-105"
              style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t4)" }}>
              <RefreshCw className="w-4 h-4" />
            </button>
            {!isEmployee && (
              <Link href="/attendance/reports"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t2)" }}>
                <FileText className="w-4 h-4" /> Reports
              </Link>
            )}
            {(isEmployee || isHR) && (
              <button onClick={() => { setSubmitError(""); setShowModal(true) }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: "var(--accent)", boxShadow: "var(--glow-accent)" }}>
                <Plus className="w-4 h-4" /> New Application
              </button>
            )}
          </div>
        </motion.div>

        {/* ══ TOASTS ═════════════════════════════════════════════════ */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ background: "var(--green-bg)", border: "1px solid var(--green)", color: "var(--green)" }}>
              <Check className="w-4 h-4" />
              <span className="text-sm font-semibold">{successMsg}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ background: "var(--red-bg)", border: "1px solid var(--red)", color: "var(--red)" }}>
              <X className="w-4 h-4" />
              <span className="text-sm font-semibold flex-1">{errorMessage}</span>
              <button onClick={() => setErrorMessage("")}><X className="w-3.5 h-3.5" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ STAT CARDS ═════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Pending Requests",   value: stats?.pendingRequests   ?? 0,     color: "var(--amber)",  show: !isEmployee },
            { label: "Approved This Month", value: stats?.approvedThisMonth ?? 0,     color: "var(--green)",  show: !isEmployee },
            { label: "Annual Balance",      value: stats?.annualBalance     || "N/A", color: "var(--blue)",   show: isEmployee  },
            { label: "Sick Leave Left",     value: stats?.sickLeaveLeft     || "N/A", color: "var(--purple)", show: isEmployee  },
            { label: "Total Approved Days", value: stats?.totalApprovedDays ?? 0,     color: "var(--blue)",   show: isHR        },
          ].filter(s => s.show).map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-[22px] p-5"
              style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>
              <p className="text-3xl font-bold tabular-nums" style={{ color: s.color, letterSpacing: "-0.04em" }}>
                {String(s.value)}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: "var(--t4)" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ══ SEARCH + STATUS FILTER ══════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--t4)" }} />
            <input type="text" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={showEmployeeCol
                ? "Search employee, department, leave type, status, reason…"
                : "Search leave type, status, or reason…"}
              className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none"
              style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", color: "var(--t1)" }} />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(f => {
              const count = f === "All" ? null : leaveRequests.filter(r => r.status === f).length
              return (
                <button key={f} onClick={() => setStatusFilter(f)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: statusFilter === f ? "var(--accent)" : "var(--surface-1)",
                    color:      statusFilter === f ? "white" : "var(--t3)",
                    border:     `1px solid ${statusFilter === f ? "var(--accent)" : "var(--b1)"}`,
                  }}>
                  {f}
                  {count !== null && count > 0 && (
                    <span className="ml-1.5 text-[9px] opacity-80">{count}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ══ TABLE ═══════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-[22px] overflow-hidden"
          style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>

          {/* Column headers */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, transparent, var(--accent) 40%, var(--blue) 70%, transparent)" }} />
            <div className="grid text-[9px] font-bold uppercase tracking-wider px-5 py-3 overflow-x-auto"
              style={{
                gridTemplateColumns: gridCols,
                background: "var(--surface-2)",
                borderBottom: "1px solid var(--b1)",
                color: "var(--t4)",
                minWidth: showEmployeeCol ? "820px" : "560px",
              }}>
              {showEmployeeCol && <span>Employee</span>}
              {showEmployeeCol && <span>Department</span>}
              <span>Leave Type</span>
              <span>Start</span>
              <span>End</span>
              <span className="text-center">Days</span>
              <span className="text-center">Status</span>
              <span>Actions</span>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center px-6">
              <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--b2)" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--t3)" }}>No leave requests found</p>
              <p className="text-xs mt-1" style={{ color: "var(--t4)" }}>
                Try adjusting your search or filter, or submit a new application.
              </p>
            </div>
          ) : filtered.map((r, i) => {
            const isPending      = r.status === "Pending"
            const isExpanded     = expandedRow === r.id
            const sc             = statusStyle(r.status)
            const isActioning    = activeActionId.startsWith(`${r.id}:`)

            return (
              <motion.div key={r.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.025 }}
                style={{ borderBottom: "1px solid var(--b1)" }}>

                {/* ── Main row ─────────────────────────────────── */}
                <div
                  className="grid items-center px-5 py-3.5 cursor-pointer transition-colors overflow-x-auto"
                  style={{
                    gridTemplateColumns: gridCols,
                    background: isExpanded ? "var(--accent-bg)" : "transparent",
                    minWidth: showEmployeeCol ? "820px" : "560px",
                  }}
                  onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = "var(--surface-2)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = isExpanded ? "var(--accent-bg)" : "transparent" }}
                  onClick={() => setExpandedRow(isExpanded ? null : r.id)}>

                  {/* Employee — HR / Manager only */}
                  {showEmployeeCol && (
                    <p className="text-sm font-semibold truncate pr-2" style={{ color: "var(--t1)" }}>
                      {r.employee}
                    </p>
                  )}

                  {/* Department — HR / Manager only */}
                  {showEmployeeCol && (
                    <span className="text-xs truncate" style={{ color: "var(--t3)" }}>
                      {r.department}
                    </span>
                  )}

                  {/* Leave type */}
                  <span className="text-xs font-semibold truncate pr-2" style={{ color: "var(--t2)" }}>
                    {r.leaveType}
                  </span>

                  {/* Dates */}
                  <span className="text-[11px] tabular-nums" style={{ color: "var(--t3)", fontFamily: "var(--font-mono)" }}>
                    {r.startDate}
                  </span>
                  <span className="text-[11px] tabular-nums" style={{ color: "var(--t3)", fontFamily: "var(--font-mono)" }}>
                    {r.endDate}
                  </span>

                  {/* Days */}
                  <span className="text-center text-sm font-bold" style={{ color: "var(--t1)" }}>
                    {r.days}
                  </span>

                  {/* Status */}
                  <span className="flex justify-center">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold whitespace-nowrap"
                      style={{ background: sc.bg, color: sc.text }}>
                      {r.status}
                    </span>
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>

                    {/* HR / Manager: Approve + Reject on pending */}
                    {(isHR || isManager) && isPending && (
                      <>
                        <button onClick={() => handleAction(r.id, "approve")} disabled={isActioning}
                          title="Approve"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105"
                          style={{ background: "var(--green-bg)", color: "var(--green)" }}>
                          {activeActionId === `${r.id}:approve`
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Check className="w-3 h-3" />}
                          Approve
                        </button>
                        <button onClick={() => handleAction(r.id, "reject")} disabled={isActioning}
                          title="Reject"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105"
                          style={{ background: "var(--red-bg)", color: "var(--red)" }}>
                          {activeActionId === `${r.id}:reject`
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <X className="w-3 h-3" />}
                          Reject
                        </button>
                      </>
                    )}

                    {/* Employee: Cancel own pending */}
                    {isEmployee && isPending && (
                      <button onClick={() => handleAction(r.id, "cancel")} disabled={isActioning}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-105"
                        style={{ background: "var(--red-bg)", color: "var(--red)" }}>
                        {activeActionId === `${r.id}:cancel`
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <X className="w-3 h-3" />}
                        Cancel
                      </button>
                    )}

                    {/* Expand toggle — always shown (balance + detail) */}
                    <button
                      onClick={() => setExpandedRow(isExpanded ? null : r.id)}
                      title={isExpanded ? "Collapse" : "View balance & details"}
                      className="p-1.5 rounded-lg ml-auto transition-all hover:scale-110"
                      style={{
                        background: isExpanded ? "var(--accent-bg)" : "var(--surface-3)",
                        color:      isExpanded ? "var(--accent)"    : "var(--t4)",
                      }}>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* ── Expanded detail + balance ─────────────────── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden">

                      {/* Info strip: reason + approver + applied/decided */}
                      <div className="px-6 py-3 flex flex-wrap gap-6"
                        style={{ background: "var(--surface-2)", borderTop: "1px solid var(--b1)" }}>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--t4)" }}>Reason</p>
                          <p className="text-xs italic" style={{ color: "var(--t2)" }}>"{r.reason}"</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--t4)" }}>Approver</p>
                          <p className="text-xs font-semibold" style={{ color: "var(--t2)" }}>{r.approver}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--t4)" }}>Applied</p>
                          <p className="text-xs tabular-nums" style={{ color: "var(--t2)", fontFamily: "var(--font-mono)" }}>{r.appliedDate}</p>
                        </div>
                        {r.decidedAt && (
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--t4)" }}>Decided</p>
                            <p className="text-xs tabular-nums" style={{ color: "var(--t2)", fontFamily: "var(--font-mono)" }}>{r.decidedAt}</p>
                          </div>
                        )}
                      </div>

                      {/* Balance bars — from API response per employee */}
                      <BalanceRow balance={r.balance} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <p className="text-xs text-center pb-4" style={{ color: "var(--t4)" }}>
            Showing {filtered.length} of {leaveRequests.length} records · {sessionCompany}
          </p>
        )}
      </div>
    </>
  )
}