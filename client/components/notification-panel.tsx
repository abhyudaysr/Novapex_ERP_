"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  X, Bell, CheckCheck, CalendarCheck, TrendingUp,
  Megaphone, Users, Clock, Check, Loader2,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface NotificationItem {
  id:      string
  type:    "leave" | "performance" | "announcement" | "meeting" | "system"
  title:   string
  body:    string
  timeAgo: string
  read:    boolean
  link?:   string
}

export interface ApprovalItem {
  id:         string
  employee:   string
  department: string
  leaveType:  string
  days:       number
  startDate:  string
  endDate:    string
  requestId:  string
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — role-aware
// ─────────────────────────────────────────────────────────────────────────────
const NOTIFICATIONS_BY_ROLE: Record<string, NotificationItem[]> = {
  hr: [
    { id: "n1", type: "leave",        title: "Leave request approved",   body: "Jordan Smith's 3-day Annual Leave (Mar 18–20) was approved.",    timeAgo: "1 hour ago",  read: false, link: "/attendance/leave-requests" },
    { id: "n2", type: "performance",  title: "Performance review due",   body: "Q1 self-reviews are due by March 31 for all departments.",        timeAgo: "5 hours ago", read: false },
    { id: "n3", type: "announcement", title: "New HR announcement",      body: "Updated Leave Policy 2025 posted by HR Team.",                    timeAgo: "1 day ago",   read: true,  link: "/dashboard" },
    { id: "n4", type: "meeting",      title: "Team meeting reminder",    body: "All-hands stand-up in 30 minutes — Engineering conference room.", timeAgo: "2 days ago",  read: true },
  ],
  manager: [
    { id: "n1", type: "leave",       title: "Leave request pending",    body: "Jordan Smith has applied for 3-day Annual Leave (Mar 18–20).",    timeAgo: "2 hours ago", read: false, link: "/attendance/leave-requests" },
    { id: "n2", type: "performance", title: "Performance review due",   body: "Your Q1 team reviews are due by March 31.",                       timeAgo: "5 hours ago", read: false },
    { id: "n3", type: "meeting",     title: "Team meeting reminder",    body: "Engineering stand-up in 30 minutes.",                             timeAgo: "1 day ago",   read: true },
  ],
  employee: [
    { id: "n1", type: "leave",        title: "Leave request approved",   body: "Your 3-day Annual Leave (Apr 10–12) has been approved.",          timeAgo: "1 hour ago",  read: false, link: "/attendance/leave-requests" },
    { id: "n2", type: "performance",  title: "Performance review due",   body: "Your Q1 self-review is due by March 31.",                         timeAgo: "5 hours ago", read: false },
    { id: "n3", type: "announcement", title: "New HR announcement",      body: "Updated Leave Policy 2025 posted by HR Team.",                    timeAgo: "1 day ago",   read: true },
    { id: "n4", type: "meeting",      title: "Team meeting reminder",    body: "Engineering stand-up in 30 minutes.",                             timeAgo: "2 days ago",  read: true },
  ],
}

const APPROVALS_BY_ROLE: Record<string, ApprovalItem[]> = {
  hr: [
    { id: "a1", employee: "Jordan Smith", department: "Engineering", leaveType: "Annual Leave",   days: 3, startDate: "2026-03-18", endDate: "2026-03-20", requestId: "LR-1001" },
    { id: "a2", employee: "Leah Baker",   department: "Operations",  leaveType: "Personal Leave", days: 1, startDate: "2026-03-05", endDate: "2026-03-05", requestId: "LR-2001" },
  ],
  manager: [
    { id: "a1", employee: "Jordan Smith", department: "Engineering", leaveType: "Annual Leave", days: 3, startDate: "2026-03-18", endDate: "2026-03-20", requestId: "LR-1001" },
  ],
  employee: [],
}

// ─────────────────────────────────────────────────────────────────────────────
// ICON per notification type
// ─────────────────────────────────────────────────────────────────────────────
function NotifIcon({ type }: { type: NotificationItem["type"] }) {
  const map: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
    leave:        { icon: <CalendarCheck className="w-3.5 h-3.5" />, bg: "var(--green-bg)",  color: "var(--green)"  },
    performance:  { icon: <TrendingUp    className="w-3.5 h-3.5" />, bg: "var(--amber-bg)",  color: "var(--amber)"  },
    announcement: { icon: <Megaphone     className="w-3.5 h-3.5" />, bg: "var(--blue-bg)",   color: "var(--blue)"   },
    meeting:      { icon: <Users         className="w-3.5 h-3.5" />, bg: "var(--accent-bg)", color: "var(--accent)" },
    system:       { icon: <Bell          className="w-3.5 h-3.5" />, bg: "var(--surface-3)", color: "var(--t3)"     },
  }
  const cfg = map[type] || map.system
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.icon}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION BELL
// — Drop-in for navigation.tsx
// — Also listens for the custom "open-notifications" event dispatched by
//   the dashboard's "View All Notifications" button, so that button opens
//   this exact same dropdown (anchored to the bell) instead of a separate panel
// ─────────────────────────────────────────────────────────────────────────────
export function NotificationBell({ userRole = "employee" }: { userRole?: string }) {
  const [open,           setOpen]           = useState(false)
  const [tab,            setTab]            = useState<"notifications" | "approvals">("notifications")
  const [notifications,  setNotifications]  = useState<NotificationItem[]>([])
  const [approvals,      setApprovals]      = useState<ApprovalItem[]>([])
  const [actioning,      setActioning]      = useState("")
  const [sessionEmail,   setSessionEmail]   = useState("")
  const [sessionCompany, setSessionCompany] = useState("")

  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef  = useRef<HTMLDivElement>(null)

  // Load role-aware data
  const loadData = () => {
    const role    = (sessionStorage.getItem("userRole") || localStorage.getItem("userRole") || userRole).toLowerCase()
    const email   = sessionStorage.getItem("userEmail")   || localStorage.getItem("userEmail")   || ""
    const company = sessionStorage.getItem("companyName") || localStorage.getItem("companyName") || ""
    setSessionEmail(email)
    setSessionCompany(company)
    setNotifications(NOTIFICATIONS_BY_ROLE[role] ?? NOTIFICATIONS_BY_ROLE.employee)
    setApprovals(APPROVALS_BY_ROLE[role] ?? [])
  }

  useEffect(() => { loadData() }, [userRole])

  // ── KEY FEATURE: listen for "open-notifications" event from dashboard ──
  // When the dashboard's "View All Notifications" button fires this event,
  // we scroll the page to top then open this bell's own dropdown.
  useEffect(() => {
    const handler = () => {
      loadData()
      setTab("notifications")
      // Scroll to top so the dropdown (anchored below the navbar bell) is visible
      window.scrollTo({ top: 0, behavior: "smooth" })
      // Small delay so scroll starts before panel opens
      setTimeout(() => setOpen(true), 300)
    }
    window.addEventListener("open-notifications", handler)
    return () => window.removeEventListener("open-notifications", handler)
  }, [userRole])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        panelRef.current  && !panelRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) setOpen(false)
    }
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 10)
    return () => { clearTimeout(id); document.removeEventListener("mousedown", handler) }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead    = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const handleApprovalAction = async (item: ApprovalItem, action: "approve" | "reject") => {
    if (!sessionEmail || !sessionCompany) return
    setActioning(`${item.id}:${action}`)
    try {
      const res = await fetch("/api/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sessionEmail, company: sessionCompany, requestId: item.requestId, action }),
      })
      if (res.ok) setApprovals(prev => prev.filter(a => a.id !== item.id))
    } catch { /* silent */ }
    finally { setActioning("") }
  }

  const unreadCount   = notifications.filter(n => !n.read).length
  const approvalCount = approvals.length

  return (
    <div className="relative">
      {/* ── BELL BUTTON ─────────────────────────────────────────── */}
      <button
        ref={buttonRef}
        onClick={() => { loadData(); setOpen(o => !o) }}
        className="relative p-2 rounded-xl transition-all hover:scale-105"
        style={{
          background: open ? "var(--accent-bg)" : "var(--surface-2)",
          border:     "1px solid var(--b1)",
          color:      open ? "var(--accent)"    : "var(--t3)",
        }}>
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
            style={{ background: "var(--red)", fontSize: "9px", lineHeight: 1 }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* ── DROPDOWN PANEL — anchored directly below bell ───────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: -8,  scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.8 }}
            className="absolute right-0 w-[360px] rounded-[20px] overflow-hidden flex flex-col"
            style={{
              top:        "calc(100% + 8px)",
              background: "var(--surface-1)",
              border:     "1px solid var(--b1)",
              boxShadow:  "0 20px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12)",
              maxHeight:  "min(520px, calc(100vh - 100px))",
              zIndex:     9999,
            }}>

            {/* Accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] z-10"
              style={{ background: "linear-gradient(90deg, transparent, var(--accent) 40%, var(--blue) 70%, transparent)" }} />

            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between shrink-0"
              style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
              <div className="flex items-center gap-1">
                {(["notifications", "approvals"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex items-center gap-1.5"
                    style={{
                      background: tab === t ? "var(--accent-bg)" : "transparent",
                      color:      tab === t ? "var(--accent-t)"  : "var(--t4)",
                    }}>
                    {t}
                    {t === "notifications" && unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                        style={{ background: "var(--red)", fontSize: "9px" }}>
                        {unreadCount}
                      </span>
                    )}
                    {t === "approvals" && approvalCount > 0 && (
                      <span className="w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                        style={{ background: "var(--amber)", fontSize: "9px" }}>
                        {approvalCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                {tab === "notifications" && unreadCount > 0 && (
                  <button onClick={markAllRead}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg"
                    style={{ color: "var(--accent-t)", background: "var(--accent-bg)" }}>
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--t4)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-3)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 overscroll-contain">

              {tab === "notifications" && (
                notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--b2)" }} />
                    <p className="text-sm font-semibold" style={{ color: "var(--t4)" }}>All caught up!</p>
                  </div>
                ) : notifications.map((n, i) => (
                  <motion.div key={n.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    onClick={() => markRead(n.id)}
                    className="flex gap-3 px-4 py-3.5 cursor-pointer transition-colors"
                    style={{
                      borderBottom: "1px solid var(--b1)",
                      background: !n.read ? "color-mix(in srgb, var(--accent-bg) 50%, transparent)" : "transparent",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = !n.read ? "color-mix(in srgb, var(--accent-bg) 50%, transparent)" : "transparent"}>
                    <NotifIcon type={n.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold leading-tight" style={{ color: "var(--t1)" }}>{n.title}</p>
                        {!n.read && <div className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: "var(--accent)" }} />}
                      </div>
                      <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "var(--t3)" }}>{n.body}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--t4)" }}>
                          <Clock className="w-2.5 h-2.5" /> {n.timeAgo}
                        </span>
                        {n.link && (
                          <Link href={n.link} onClick={() => setOpen(false)}
                            className="text-[10px] font-semibold" style={{ color: "var(--accent-t)" }}>
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {tab === "approvals" && (
                approvals.length === 0 ? (
                  <div className="py-12 text-center px-6">
                    <Check className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--green)" }} />
                    <p className="text-sm font-semibold" style={{ color: "var(--t3)" }}>All caught up!</p>
                    <p className="text-xs mt-1" style={{ color: "var(--t4)" }}>No pending approvals</p>
                  </div>
                ) : approvals.map(a => (
                  <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--b1)" }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-bold" style={{ color: "var(--t1)" }}>{a.employee}</p>
                        <p className="text-[10px]" style={{ color: "var(--t4)" }}>{a.department}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>Pending</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3 p-2.5 rounded-xl" style={{ background: "var(--surface-2)" }}>
                      <div>
                        <p className="text-[8px] font-bold uppercase mb-0.5" style={{ color: "var(--t4)" }}>Type</p>
                        <p className="text-[10px] font-semibold" style={{ color: "var(--t2)" }}>{a.leaveType}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold uppercase mb-0.5" style={{ color: "var(--t4)" }}>Dates</p>
                        <p className="text-[10px] font-semibold tabular-nums" style={{ color: "var(--t2)" }}>{a.startDate.slice(5)} → {a.endDate.slice(5)}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold uppercase mb-0.5" style={{ color: "var(--t4)" }}>Days</p>
                        <p className="text-[10px] font-bold" style={{ color: "var(--t1)" }}>{a.days}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprovalAction(a, "approve")} disabled={!!actioning.startsWith(a.id)}
                        className="flex-1 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 hover:scale-105 transition-all"
                        style={{ background: "var(--green-bg)", color: "var(--green)" }}>
                        {actioning === `${a.id}:approve` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Approve
                      </button>
                      <button onClick={() => handleApprovalAction(a, "reject")} disabled={!!actioning.startsWith(a.id)}
                        className="flex-1 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 hover:scale-105 transition-all"
                        style={{ background: "var(--red-bg)", color: "var(--red)" }}>
                        {actioning === `${a.id}:reject` ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                        Reject
                      </button>
                      <Link href="/attendance/leave-requests" onClick={() => setOpen(false)}
                        className="px-3 py-2 rounded-xl text-[10px] font-bold hover:scale-105 transition-all"
                        style={{ background: "var(--surface-3)", color: "var(--t3)" }}>
                        View
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 shrink-0"
              style={{ borderTop: "1px solid var(--b1)", background: "var(--surface-2)" }}>
              <Link href="/attendance/leave-requests" onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold hover:opacity-80 transition-all"
                style={{ color: "var(--accent-t)", background: "var(--accent-bg)" }}>
                View All in Leave Management →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NotificationPanel — kept as a no-op export so dashboard/page.tsx imports
// don't break. The real panel is now always the bell dropdown.
// ─────────────────────────────────────────────────────────────────────────────
export function NotificationPanel(_props: { isOpen?: boolean; onClose?: () => void; userRole?: string }) {
  return null
}