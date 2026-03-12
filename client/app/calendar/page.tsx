"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, ChevronRight, RefreshCw, X, Check,
  Edit2, CalendarDays, Plus, Loader2, AlertCircle,
} from "lucide-react"
import AuthGuard from "@/components/AuthGuard"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — match exactly what /api/leave returns after mapRequestToClient
// ─────────────────────────────────────────────────────────────────────────────
interface LeaveRecord {
  id:            string
  employee:      string   // mapRequestToClient uses "employee" (not employeeName)
  employeeEmail: string
  department:    string   // "department" (not employeeDepartment)
  avatar:        string
  leaveType:     string
  startDate:     string
  endDate:       string
  days:          number
  reason:        string
  status:        string
  appliedDate:   string
  approver:      string
  approverEmail: string
  decidedAt:     string | null
  balance:       {
    annual:   { used: number; total: number }
    sick:     { used: number; total: number }
    personal: { used: number; total: number }
  } | null
}

interface ApiStats {
  pendingRequests:   number
  approvedThisMonth: number
  annualBalance:     string  // "12/20"
  sickLeaveLeft:     string  // "7"
  totalApprovedDays: number
}

interface ParsedBalance {
  annual:   { remaining: number; total: number }
  sick:     { remaining: number; total: number }
  personal: { remaining: number; total: number }
}

type CalView = "leave" | "attendance"

interface ApplyForm {
  leaveType: "Annual Leave" | "Sick Leave" | "Personal Leave"
  startDate: string
  endDate:   string
  reason:    string
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const DOTS: Record<string, { hex: string; label: string; tw: string }> = {
  present:  { hex: "#10b981", label: "Present",         tw: "bg-emerald-500" },
  absent:   { hex: "#ef4444", label: "Absent",          tw: "bg-red-500"     },
  leave:    { hex: "#f59e0b", label: "Leave",           tw: "bg-amber-500"   },
  weekoff:  { hex: "#6b7280", label: "Weekly Off",      tw: "bg-gray-500"    },
  holiday:  { hex: "#fde047", label: "Holiday",         tw: "bg-yellow-300"  },
  multiple: { hex: "#3b82f6", label: "Multiple Events", tw: "bg-blue-500"    },
}

const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const HOLIDAYS: { month: number; day: number; name: string }[] = [
  { month: 0,  day: 26, name: "Republic Day"     },
  { month: 3,  day: 14, name: "Ambedkar Jayanti" },
  { month: 7,  day: 15, name: "Independence Day" },
  { month: 9,  day:  2, name: "Gandhi Jayanti"   },
  { month: 11, day: 25, name: "Christmas"        },
]

const CHECKINS  = ["09:00","09:15","08:55","09:30","09:05","08:45","09:20","09:10"]
const CHECKOUTS = ["18:00","18:30","17:45","18:15","18:00","17:30","18:45","18:20"]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, "0")

function toIso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function isoToDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function inRange(date: Date, start: string, end: string) {
  const t = date.getTime()
  return t >= isoToDate(start).getTime() && t <= isoToDate(end).getTime()
}

function isWeekend(d: Date) { return d.getDay() === 0 || d.getDay() === 6 }

function holidayName(d: Date) {
  return HOLIDAYS.find(h => h.month === d.getMonth() && h.day === d.getDate())?.name ?? ""
}

function statusChip(status: string) {
  if (status === "Approved")  return { bg: "var(--green-bg)",  text: "var(--green)"  }
  if (status === "Pending")   return { bg: "var(--amber-bg)",  text: "var(--amber)"  }
  if (status === "Rejected")  return { bg: "var(--red-bg)",    text: "var(--red)"    }
  if (status === "Cancelled") return { bg: "var(--surface-3)", text: "var(--t4)"     }
  return { bg: "var(--surface-3)", text: "var(--t4)" }
}

/** Parse "12/20" → { remaining:12, total:20 }  |  "7" → { remaining:7, total:10 } */
function parseBal(s: string, fallbackTotal = 0) {
  const parts = (s || "").split("/")
  if (parts.length === 2) {
    const r = parseInt(parts[0], 10), t = parseInt(parts[1], 10)
    if (!isNaN(r) && !isNaN(t)) return { remaining: r, total: t }
  }
  const n = parseInt(parts[0], 10)
  return { remaining: isNaN(n) ? 0 : n, total: fallbackTotal }
}

function mockHours(cin: string, cout: string) {
  const [ih, im] = cin.split(":").map(Number)
  const [oh, om] = cout.split(":").map(Number)
  const diff = oh * 60 + om - ih * 60 - im
  return `${Math.floor(diff / 60)}h ${pad(diff % 60)}m`
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE CLOCK
// ─────────────────────────────────────────────────────────────────────────────
function LiveClock() {
  const [label, setLabel] = useState("")
  useEffect(() => {
    const fmt = () => {
      const n = new Date()
      setLabel(`${pad(n.getDate())}-${MONTHS[n.getMonth()].slice(0,3)}-${n.getFullYear()} ${pad(n.getHours())}:${pad(n.getMinutes())}`)
    }
    fmt()
    const t = setInterval(fmt, 30_000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="text-[11px] font-semibold tabular-nums hidden sm:block"
      style={{ color: "var(--t4)", fontFamily: "var(--font-mono)" }}>
      Today: {label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLY LEAVE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ApplyModal({ defaultDate, onClose, onSubmit, submitting, error }: {
  defaultDate: string
  onClose:    () => void
  onSubmit:   (f: ApplyForm) => void
  submitting: boolean
  error:      string
}) {
  const [form, setForm] = useState<ApplyForm>({
    leaveType: "Annual Leave",
    startDate: defaultDate,
    endDate:   defaultDate,
    reason:    "",
  })
  const set = <K extends keyof ApplyForm>(k: K, v: ApplyForm[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="w-full max-w-md rounded-[24px] overflow-hidden"
        style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-xl)" }}>

        {/* Header */}
        <div className="relative px-6 py-5 flex items-center justify-between"
          style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent) 40%, var(--blue) 70%, transparent)" }} />
          <h3 className="text-base font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.02em" }}>
            Apply for Leave
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--t4)" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-3)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
              style={{ background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red)" }}>
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Leave type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--t4)" }}>Leave Type</label>
            <select value={form.leaveType}
              onChange={e => set("leaveType", e.target.value as ApplyForm["leaveType"])}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--b1)",
                color: "var(--t1)", fontFamily: "var(--font-sans)" }}>
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Personal Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            {(["startDate","endDate"] as const).map(field => (
              <div key={field}>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--t4)" }}>
                  {field === "startDate" ? "Start Date" : "End Date"}
                </label>
                <input type="date" value={form[field]}
                  onChange={e => set(field, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t1)" }} />
              </div>
            ))}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--t4)" }}>
              Reason <span style={{ color: "var(--t4)", fontWeight: 400 }}>(min 8 chars)</span>
            </label>
            <textarea value={form.reason} onChange={e => set("reason", e.target.value)}
              rows={3} placeholder="Describe the reason for your leave request…"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--b1)",
                color: "var(--t1)", fontFamily: "var(--font-sans)" }} />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "var(--surface-2)", color: "var(--t3)", border: "1px solid var(--b1)" }}>
              Cancel
            </button>
            <button onClick={() => onSubmit(form)} disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{
                background: submitting ? "var(--surface-3)" : "var(--accent)",
                color:      submitting ? "var(--t4)" : "white",
                boxShadow:  submitting ? "none" : "var(--glow-accent)",
              }}>
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? "Submitting…" : "Submit Request"}
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
export default function CalendarPage() {
  const todayDate = new Date()

  // ── Session ──────────────────────────────────────────────────────────
  const [userRole,    setUserRole]    = useState("employee")
  const [userName,    setUserName]    = useState("User")
  const [userEmail,   setUserEmail]   = useState("")
  const [companyName, setCompanyName] = useState("")
  const [userId,      setUserId]      = useState("")

  // ── Calendar ─────────────────────────────────────────────────────────
  const [calView,     setCalView]     = useState<CalView>("leave")
  const [viewDate,    setViewDate]    = useState(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  // ── Data ─────────────────────────────────────────────────────────────
  const [records,   setRecords]   = useState<LeaveRecord[]>([])
  const [apiStats,  setApiStats]  = useState<ApiStats | null>(null)
  const [balance,   setBalance]   = useState<ParsedBalance>({
    annual:   { remaining: 20, total: 20 },
    sick:     { remaining: 10, total: 10 },
    personal: { remaining: 5,  total: 5  },
  })
  const [loading,   setLoading]   = useState(true)
  const [fetchErr,  setFetchErr]  = useState("")

  // ── Modal ────────────────────────────────────────────────────────────
  const [showModal,  setShowModal]  = useState(false)
  const [applyDate,  setApplyDate]  = useState(toIso(todayDate))
  const [submitting, setSubmitting] = useState(false)
  const [submitErr,  setSubmitErr]  = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const isHR      = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  // ── Read session ─────────────────────────────────────────────────────
  useEffect(() => {
    const role  = (sessionStorage.getItem("userRole")    || localStorage.getItem("userRole")    || "employee").toLowerCase()
    const name  =  sessionStorage.getItem("userName")    || localStorage.getItem("userName")    || "User"
    const email =  sessionStorage.getItem("userEmail")   || localStorage.getItem("userEmail")   || `${role}@novapex.com`
    const co    =  sessionStorage.getItem("companyName") || localStorage.getItem("companyName") || "Novapex Systems"
    setUserRole(role)
    setUserName(name)
    setUserEmail(email)
    setCompanyName(co)
    setUserId(email.split("@")[0].toUpperCase().slice(0, 8))
  }, [])

  // ── Fetch — correct URL: /api/leave ──────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!userEmail || !companyName) return
    setLoading(true)
    setFetchErr("")
    try {
      const res  = await fetch(
        `/api/leave?email=${encodeURIComponent(userEmail)}&company=${encodeURIComponent(companyName)}`
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load calendar data.")

      setRecords(data.requests ?? [])

      const stats: ApiStats = data.stats
      if (stats) {
        setApiStats(stats)
        setBalance({
          annual:   parseBal(stats.annualBalance, 20),
          sick:     parseBal(stats.sickLeaveLeft, 10),
          personal: { remaining: 4, total: 5 },
        })
      }

      if (data.actor?.name) setUserName(data.actor.name)

    } catch (e: any) {
      setFetchErr(e.message || "Unable to load calendar data.")
    } finally {
      setLoading(false)
    }
  }, [userEmail, companyName])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Month nav ────────────────────────────────────────────────────────
  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  const jumpToday = () => setViewDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1))

  // ── Build 42-cell grid ───────────────────────────────────────────────
  const buildGrid = () => {
    const y = viewDate.getFullYear(), m = viewDate.getMonth()
    const firstDow   = new Date(y, m, 1).getDay()
    const daysInMo   = new Date(y, m + 1, 0).getDate()
    const prevMonLen = new Date(y, m, 0).getDate()
    const grid: { date: Date; current: boolean }[] = []
    for (let i = firstDow - 1; i >= 0; i--)
      grid.push({ date: new Date(y, m - 1, prevMonLen - i), current: false })
    for (let d = 1; d <= daysInMo; d++)
      grid.push({ date: new Date(y, m, d), current: true })
    while (grid.length < 42)
      grid.push({ date: new Date(y, m + 1, grid.length - daysInMo - firstDow + 1), current: false })
    return grid
  }

  // ── Day info map ─────────────────────────────────────────────────────
  const dayInfoMap = useCallback(() => {
    const map: Record<string, {
      dots: typeof DOTS[string][]
      cin?: string; cout?: string; hrs?: string
      dayRecords: LeaveRecord[]
    }> = {}

    const y = viewDate.getFullYear(), m = viewDate.getMonth()
    const days = new Date(y, m + 1, 0).getDate()

    for (let d = 1; d <= days; d++) {
      const date = new Date(y, m, d)
      const key  = toIso(date)
      const wknd = isWeekend(date)
      const hday = holidayName(date)

      if (wknd) { map[key] = { dots: [DOTS.weekoff], dayRecords: [] }; continue }
      if (hday) { map[key] = { dots: [DOTS.holiday], dayRecords: [] }; continue }

      const dayRecs = records.filter(r => inRange(date, r.startDate, r.endDate))
      const dots: typeof DOTS[string][] = []

      if      (dayRecs.length > 1)  dots.push(DOTS.multiple)
      else if (dayRecs.length === 1) dots.push(DOTS.leave)
      else if (date < todayDate)     dots.push(DOTS.present)

      const seed = (d * 7 + m) % CHECKINS.length
      const cin  = CHECKINS[seed]
      const cout = date <= todayDate ? CHECKOUTS[seed] : "--:--"
      const hrs  = date < todayDate  ? mockHours(cin, cout) : undefined

      map[key] = { dots, cin, cout, hrs, dayRecords: dayRecs }
    }
    return map
  }, [viewDate, records])

  const dayInfo = dayInfoMap()
  const grid    = buildGrid()

  // ── Legend counts ────────────────────────────────────────────────────
  const legendCounts = Object.values(dayInfo).reduce<Record<string, number>>((acc, d) => {
    d.dots.forEach(dot => { acc[dot.label] = (acc[dot.label] || 0) + 1 })
    return acc
  }, {})

  // ── Month records for right panel ────────────────────────────────────
  const monthRecords = records.filter(r => {
    const y = viewDate.getFullYear(), m = viewDate.getMonth()
    return isoToDate(r.startDate) <= new Date(y, m + 1, 0) &&
           isoToDate(r.endDate)   >= new Date(y, m, 1)
  })

  // ── Submit leave — correct URL: /api/leave ───────────────────────────
  const handleSubmit = async (form: ApplyForm) => {
    setSubmitting(true)
    setSubmitErr("")
    try {
      const res  = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, company: companyName, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit.")
      setShowModal(false)
      setSuccessMsg("Leave request submitted successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)
      fetchData()
    } catch (e: any) {
      setSubmitErr(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Approve / Reject / Cancel — correct URL: /api/leave ─────────────
  const handleAction = async (requestId: string, action: "approve" | "reject" | "cancel") => {
    try {
      const res  = await fetch("/api/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, company: companyName, requestId, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      fetchData()
    } catch (e: any) {
      setFetchErr(e.message)
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  return (
    <AuthGuard>
      <AnimatePresence>
        {showModal && (
          <ApplyModal
            defaultDate={applyDate}
            onClose={() => { setShowModal(false); setSubmitErr("") }}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={submitErr}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen p-4 md:p-6 max-w-[1500px] mx-auto space-y-4"
        style={{ background: "var(--surface-0)" }}>

        {/* ══ TOP BAR ════════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-[20px] px-5 py-3 flex flex-wrap items-center gap-4 justify-between"
          style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>

          {/* Left: title + user */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg" style={{ background: "var(--accent-bg)" }}>
                <CalendarDays className="w-4 h-4" style={{ color: "var(--accent)" }} />
              </div>
              <h1 className="text-lg font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.025em" }}>
                Calendar
              </h1>
            </div>

            <div className="h-5 w-px hidden sm:block" style={{ background: "var(--b2)" }} />

            {/* User chip */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--blue))" }}>
                {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-semibold leading-tight" style={{ color: "var(--t1)" }}>{userName}</p>
                <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--t4)", fontFamily: "var(--font-mono)" }}>
                  {userId} · {userRole.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Right: view toggle + clock + refresh + apply */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Leave / Attendance radio */}
            <div className="flex items-center gap-4 px-4 py-2 rounded-xl"
              style={{ background: "var(--surface-2)", border: "1px solid var(--b1)" }}>
              {(["leave","attendance"] as CalView[]).map(v => (
                <label key={v} className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="radio" name="calview" value={v}
                    checked={calView === v} onChange={() => setCalView(v)} className="sr-only" />
                  <div className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: calView === v ? "var(--accent)" : "var(--b2)" }}>
                    {calView === v && (
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                    )}
                  </div>
                  <span className="text-xs font-semibold capitalize"
                    style={{ color: calView === v ? "var(--accent-t)" : "var(--t4)" }}>
                    {v}
                  </span>
                </label>
              ))}
            </div>

            <LiveClock />

            <button onClick={fetchData}
              className="p-2 rounded-xl transition-all hover:scale-105"
              style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t4)" }}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={() => { setApplyDate(toIso(todayDate)); setSubmitErr(""); setShowModal(true) }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "var(--accent)", boxShadow: "var(--glow-accent)" }}>
              <Plus className="w-3.5 h-3.5" /> Apply Leave
            </button>
          </div>
        </motion.div>

        {/* Toasts */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ background: "var(--green-bg)", border: "1px solid var(--green)", color: "var(--green)" }}>
              <Check className="w-4 h-4 shrink-0" />
              <span className="text-sm font-semibold">{successMsg}</span>
            </motion.div>
          )}
          {fetchErr && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ background: "var(--red-bg)", border: "1px solid var(--red)", color: "var(--red)" }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm font-semibold flex-1">{fetchErr}</span>
              <button onClick={() => setFetchErr("")}><X className="w-3.5 h-3.5" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ MAIN SPLIT ═════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">

          {/* ─── LEFT: Calendar ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="rounded-[22px] overflow-hidden relative"
            style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>

            {/* Month nav */}
            <div className="relative px-5 py-4 flex items-center justify-between"
              style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent) 40%, var(--blue) 70%, transparent)" }} />
              <button onClick={prevMonth}
                className="p-2 rounded-xl hover:scale-110 transition-all"
                style={{ background: "var(--surface-3)", color: "var(--t3)" }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.025em" }}>
                  {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </h2>
                <button onClick={jumpToday}
                  className="px-3 py-1 rounded-lg text-[10px] font-bold transition-all"
                  style={{ background: "var(--accent-bg)", color: "var(--accent-t)", border: "1px solid var(--b1)" }}>
                  Today
                </button>
              </div>
              <button onClick={nextMonth}
                className="p-2 rounded-xl hover:scale-110 transition-all"
                style={{ background: "var(--surface-3)", color: "var(--t3)" }}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day name headers */}
            <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--b1)" }}>
              {WEEKDAYS.map(d => (
                <div key={d} className="py-2.5 text-center text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: d === "Sun" || d === "Sat" ? "var(--coral)" : "var(--t4)" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10"
                style={{ background: "color-mix(in srgb, var(--surface-1) 80%, transparent)" }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
              </div>
            )}

            {/* Grid cells */}
            <div className="grid grid-cols-7">
              {grid.map(({ date, current }, idx) => {
                const key     = toIso(date)
                const info    = current ? dayInfo[key] : null
                const isToday = current && toIso(date) === toIso(todayDate)
                const isSel   = selectedDay && toIso(selectedDay) === key
                const wknd    = isWeekend(date)
                const hday    = current ? holidayName(date) : ""

                return (
                  <div key={idx}
                    onClick={() => {
                      if (!current) return
                      setSelectedDay(prev => prev && toIso(prev) === key ? null : date)
                    }}
                    className="relative min-h-[76px] p-2 border-b border-r cursor-pointer transition-colors"
                    style={{
                      borderColor: "var(--b1)",
                      background:  isSel   ? "var(--accent-bg)"
                        : isToday  ? "color-mix(in srgb, var(--blue-bg) 55%, transparent)"
                        : wknd && current ? "var(--surface-2)"
                        : "transparent",
                      opacity: current ? 1 : 0.28,
                    }}
                    onMouseEnter={e => { if (current) (e.currentTarget as HTMLElement).style.background = "var(--surface-3)" }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background =
                        isSel    ? "var(--accent-bg)"
                        : isToday ? "color-mix(in srgb, var(--blue-bg) 55%, transparent)"
                        : wknd && current ? "var(--surface-2)" : "transparent"
                    }}>

                    {/* Date number */}
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          background: isToday ? "var(--accent)" : "transparent",
                          color: isToday ? "white" : wknd ? "var(--coral)" : current ? "var(--t2)" : "var(--t4)",
                        }}>
                        {date.getDate()}
                      </span>
                      {hday && (
                        <span className="leading-tight max-w-[54px] truncate px-1 py-0.5 rounded"
                          style={{ background: "rgba(253,224,71,0.22)", color: "#92400e", fontSize: "6px", fontWeight: 700 }}>
                          {hday}
                        </span>
                      )}
                    </div>

                    {/* Attendance times */}
                    {calView === "attendance" && current && !wknd && !hday && info?.cin && date <= todayDate && (
                      <div className="mb-1 space-y-px">
                        <p className="text-[8px] tabular-nums leading-tight"
                          style={{ color: "var(--t4)", fontFamily: "var(--font-mono)" }}>▲ {info.cin}</p>
                        <p className="text-[8px] tabular-nums leading-tight"
                          style={{ color: "var(--t4)", fontFamily: "var(--font-mono)" }}>▼ {info.cout !== "--:--" ? info.cout : "—"}</p>
                        {info.hrs && (
                          <p className="text-[7px]" style={{ color: "var(--t4)", fontFamily: "var(--font-mono)" }}>{info.hrs}</p>
                        )}
                      </div>
                    )}

                    {/* Dots */}
                    {current && info && (
                      <div className="flex flex-wrap gap-0.5">
                        {info.dots.map((dot, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${dot.tw}`} title={dot.label} />
                        ))}
                      </div>
                    )}

                    {/* Selected underline */}
                    {isSel && current && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b"
                        style={{ background: "var(--accent)" }} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="px-5 py-3 flex flex-wrap gap-2"
              style={{ borderTop: "1px solid var(--b1)", background: "var(--surface-2)" }}>
              {Object.entries(DOTS).map(([k, dot]) => (
                <div key={k} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: "var(--surface-3)", border: "1px solid var(--b1)" }}>
                  <div className={`w-2.5 h-2.5 rounded-full ${dot.tw}`} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--t3)" }}>
                    {dot.label}{legendCounts[dot.label] ? ` : ${legendCounts[dot.label]}` : ""}
                  </span>
                </div>
              ))}
            </div>

            {/* Selected day detail */}
            <AnimatePresence>
              {selectedDay && dayInfo[toIso(selectedDay)] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
                  style={{ borderTop: "1px solid var(--b1)" }}>
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold" style={{ color: "var(--t1)" }}>
                        {selectedDay.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setApplyDate(toIso(selectedDay)); setSubmitErr(""); setShowModal(true) }}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white"
                          style={{ background: "var(--accent)" }}>
                          + Apply Leave
                        </button>
                        <button onClick={() => setSelectedDay(null)} style={{ color: "var(--t4)" }}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {dayInfo[toIso(selectedDay)].dayRecords.length === 0 ? (
                      <p className="text-xs py-2 text-center" style={{ color: "var(--t4)" }}>
                        {isWeekend(selectedDay) ? "Weekly Off"
                          : holidayName(selectedDay) || "No leave records for this day."}
                      </p>
                    ) : dayInfo[toIso(selectedDay)].dayRecords.map(r => {
                      const sc = statusChip(r.status)
                      return (
                        <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl mb-2"
                          style={{ background: "var(--surface-2)", border: "1px solid var(--b1)" }}>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold" style={{ color: "var(--t1)" }}>
                              {r.leaveType}
                              {/* use r.employee (the mapped field name from API) */}
                              {(isHR || isManager) && (
                                <span style={{ color: "var(--t4)" }}> · {r.employee}</span>
                              )}
                            </p>
                            <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--t4)" }}>
                              {r.startDate} → {r.endDate} · {r.days}d · {r.reason}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold shrink-0"
                            style={{ background: sc.bg, color: sc.text }}>{r.status}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ─── RIGHT: Records table ─────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-[22px] overflow-hidden flex flex-col"
            style={{
              background: "var(--surface-1)", border: "1px solid var(--b1)",
              boxShadow: "var(--sh-sm)", maxHeight: "calc(100vh - 160px)",
            }}>

            {/* Panel header */}
            <div className="relative px-5 py-4 shrink-0"
              style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--coral) 40%, var(--amber) 70%, transparent)" }} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.015em" }}>
                    Total Records
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: "var(--t4)" }}>
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()} · {monthRecords.length} entries
                  </p>
                </div>
                {apiStats && (
                  <div className="text-right">
                    <p className="text-[10px] font-semibold" style={{ color: "var(--t4)" }}>
                      {apiStats.pendingRequests} pending
                    </p>
                    <p className="text-[10px] font-semibold" style={{ color: "var(--green)" }}>
                      {apiStats.approvedThisMonth} approved this month
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Table column headers */}
            <div className="grid text-[9px] font-bold uppercase tracking-wider px-3 py-2.5 shrink-0"
              style={{
                gridTemplateColumns: (isHR || isManager) ? "80px 80px 1fr 38px 60px 56px" : "80px 80px 1fr 38px 60px",
                background: "var(--surface-2)", borderBottom: "1px solid var(--b1)", color: "var(--t4)",
              }}>
              <span>Start</span>
              <span>End</span>
              <span>Absence Type</span>
              <span className="text-center">Days</span>
              <span className="text-center">Status</span>
              {(isHR || isManager) && <span className="text-center">Action</span>}
            </div>

            {/* Rows */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="py-12 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} />
                </div>
              ) : monthRecords.length === 0 ? (
                <div className="py-14 text-center px-6">
                  <CalendarDays className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--b2)" }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--t4)" }}>No records this month</p>
                  <p className="text-xs mt-1" style={{ color: "var(--t4)" }}>Apply for leave to see records here</p>
                </div>
              ) : monthRecords.map((r, i) => {
                const sc = statusChip(r.status)
                return (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid items-center px-3 py-3 text-xs transition-colors cursor-pointer"
                    style={{
                      gridTemplateColumns: (isHR || isManager) ? "80px 80px 1fr 38px 60px 56px" : "80px 80px 1fr 38px 60px",
                      borderBottom: "1px solid var(--b1)",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>

                    <span className="tabular-nums text-[10px]"
                      style={{ color: "var(--t3)", fontFamily: "var(--font-mono)" }}>
                      {r.startDate.slice(5).replace("-", "/")}
                    </span>
                    <span className="tabular-nums text-[10px]"
                      style={{ color: "var(--t3)", fontFamily: "var(--font-mono)" }}>
                      {r.endDate.slice(5).replace("-", "/")}
                    </span>

                    {/* Absence type — use r.employee (correct mapped name) */}
                    <div className="min-w-0 pr-1">
                      <p className="font-semibold truncate text-[10px]" style={{ color: "var(--t2)" }}>
                        {calView === "attendance" ? "Attendance Regularize" : r.leaveType}
                      </p>
                      {(isHR || isManager) && (
                        <p className="text-[9px] truncate" style={{ color: "var(--t4)" }}>
                          {r.employee}
                        </p>
                      )}
                    </div>

                    <span className="text-center font-bold text-xs" style={{ color: "var(--t1)" }}>
                      {r.days}
                    </span>

                    <span className="flex justify-center">
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap"
                        style={{ background: sc.bg, color: sc.text }}>
                        {r.status}
                      </span>
                    </span>

                    {/* Action — HR / Manager */}
                    {(isHR || isManager) && (
                      <div className="flex items-center justify-center gap-1">
                        {r.status === "Pending" ? (
                          <>
                            <button onClick={() => handleAction(r.id, "approve")} title="Approve"
                              className="p-1 rounded-lg transition-all hover:scale-110"
                              style={{ background: "var(--green-bg)", color: "var(--green)" }}>
                              <Check className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleAction(r.id, "reject")} title="Reject"
                              className="p-1 rounded-lg transition-all hover:scale-110"
                              style={{ background: "var(--red-bg)", color: "var(--red)" }}>
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <button title="View on calendar"
                            onClick={() => setSelectedDay(isoToDate(r.startDate))}
                            className="p-1 rounded-lg transition-all hover:scale-110"
                            style={{ background: "var(--surface-3)", color: "var(--t4)" }}>
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Employee: cancel own pending */}
                    {isEmployee && r.status === "Pending" && (
                      <button onClick={() => handleAction(r.id, "cancel")}
                        className="flex items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-[8px] font-bold transition-all hover:scale-105"
                        style={{ background: "var(--red-bg)", color: "var(--red)" }}>
                        <X className="w-2.5 h-2.5" /> Cancel
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Leave balance footer — real data from API */}
            <div className="px-5 py-4 shrink-0"
              style={{ borderTop: "1px solid var(--b1)", background: "var(--surface-2)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-2.5" style={{ color: "var(--t4)" }}>
                Leave Balance
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Annual",   ...balance.annual,   color: "var(--blue)"   },
                  { label: "Sick",     ...balance.sick,     color: "var(--amber)"  },
                  { label: "Personal", ...balance.personal, color: "var(--purple)" },
                ].map(b => {
                  const pct = b.total > 0 ? (b.remaining / b.total) * 100 : 0
                  return (
                    <div key={b.label} className="p-2.5 rounded-xl text-center"
                      style={{ background: "var(--surface-3)" }}>
                      <p className="text-[9px] font-bold uppercase tracking-wide mb-1.5"
                        style={{ color: "var(--t4)" }}>{b.label}</p>
                      <p className="text-sm font-bold tabular-nums" style={{ color: b.color }}>
                        {b.remaining}
                        <span className="text-[9px] font-normal" style={{ color: "var(--t4)" }}>
                          /{b.total}
                        </span>
                      </p>
                      <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--b1)" }}>
                        <motion.div className="h-full rounded-full" style={{ background: b.color }}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  )
}