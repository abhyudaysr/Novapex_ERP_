"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users, TrendingUp, Settings, FileText, Calendar, Bell, ArrowRight,
  Zap, Target, Award, PieChart, CheckCircle2, Briefcase, Loader2,
  Megaphone, PartyPopper, ListTodo, Inbox, BookOpen, Share2,
  Gift, Star, Check, ChevronRight, X, Paperclip, BadgeCheck,
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AuthGuard from "../../components/AuthGuard"
import Chatbot from "../../components/ui/chatbot"

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — all widgets (replace with API calls when backend is ready)
// ─────────────────────────────────────────────────────────────────────────────

const CELEBRATIONS = [
  { id: 1, name: "Sarah Johnson", type: "birthday",     date: "Today",    avatar: "SJ", years: null },
  { id: 2, name: "Mike Chen",     type: "anniversary",  date: "Today",    avatar: "MC", years: 3    },
  { id: 3, name: "Alex Rodriguez",type: "birthday",     date: "Tomorrow", avatar: "AR", years: null },
  { id: 4, name: "Priya Sharma",  type: "anniversary",  date: "Tomorrow", avatar: "PS", years: 5    },
]

const ANNOUNCEMENTS = {
  ceo: [
    { id: 1, title: "Q1 2025 — Record Growth 🚀",      body: "We achieved 23% YoY revenue growth in Q1. Every single team contributed to this milestone. Thank you!", time: "1 day ago",  priority: "high"   },
    { id: 2, title: "Company Vision Update",             body: "Our 5-year roadmap has been refreshed. Full document available in the Documents section.",              time: "1 week ago", priority: "medium" },
  ],
  hr: [
    { id: 1, title: "Updated Leave Policy 2025",         body: "Annual leave quota increased to 24 days effective Q2. Carry-forward rules also updated. Please review.",  time: "2 hours ago", priority: "high"   },
    { id: 2, title: "New Health Insurance Provider",     body: "Starting April 1, BlueCross will be our primary health insurer. Enrollment closes March 25.",             time: "3 days ago",  priority: "medium" },
    { id: 3, title: "Town Hall — March 28, 4 PM",        body: "Quarterly all-hands on Friday. Attendance is mandatory. Link shared on company email.",                   time: "5 days ago",  priority: "medium" },
  ],
}

const THINGS_TO_DO: Record<string, Array<{ id: string; task: string; priority: "high"|"medium"|"low"; href: string }>> = {
  hr: [
    { id: "t1", task: "Review 8 pending leave requests",     priority: "high",   href: "/attendance/leave-requests" },
    { id: "t2", task: "Complete Q1 performance reviews",     priority: "high",   href: "/performance/reviews"       },
    { id: "t3", task: "Update employee handbook (policy v3)",priority: "medium", href: "/dashboard/reports"         },
    { id: "t4", task: "Schedule team-building event",        priority: "low",    href: "/calendar"                  },
    { id: "t5", task: "Onboard 3 new Engineering hires",     priority: "medium", href: "/employees/add"             },
  ],
  manager: [
    { id: "t1", task: "Approve 4 leave requests from team",  priority: "high",   href: "/attendance/leave-requests" },
    { id: "t2", task: "Submit reviews for 3 team members",   priority: "high",   href: "/performance/reviews"       },
    { id: "t3", task: "1:1 sync with junior engineers",      priority: "medium", href: "/calendar"                  },
    { id: "t4", task: "Update team goals for Q2",            priority: "medium", href: "/performance/goals"         },
  ],
  employee: [
    { id: "t1", task: "Submit leave request for April 10",   priority: "medium", href: "/attendance/leave-requests" },
    { id: "t2", task: "Complete React Certification module", priority: "medium", href: "/courses/engineering"       },
    { id: "t3", task: "Update your profile & skills",        priority: "low",    href: "/employees/profiles"        },
    { id: "t4", task: "Submit Q1 self-appraisal form",       priority: "high",   href: "/performance/feedback"      },
  ],
}

const NOTIFICATIONS_DATA = [
  { id: "n1", title: "Leave request approved",       desc: "Your 3-day leave (April 10–12) has been approved.",      time: "1 hour ago",  read: false, type: "success" },
  { id: "n2", title: "Performance review due",       desc: "Your Q1 self-review is due by March 31.",                time: "5 hours ago", read: false, type: "warning" },
  { id: "n3", title: "New HR announcement",          desc: "Updated Leave Policy 2025 posted by HR Team.",           time: "1 day ago",   read: true,  type: "info"    },
  { id: "n4", title: "Team meeting reminder",        desc: "Engineering stand-up in 30 minutes.",                    time: "2 days ago",  read: true,  type: "info"    },
]

const APPROVALS_DATA = [
  { id: "a1", name: "Riya Patel",    type: "Annual Leave",   days: 3, dates: "Apr 10–12", dept: "Engineering",  status: "pending" },
  { id: "a2", name: "James Liu",     type: "Sick Leave",     days: 1, dates: "Apr 3",     dept: "Marketing",    status: "pending" },
  { id: "a3", name: "Noor Al-Amin",  type: "Personal Leave", days: 2, dates: "Apr 15–16", dept: "Sales",        status: "pending" },
  { id: "a4", name: "Tom Eriksson",  type: "Annual Leave",   days: 5, dates: "Apr 20–24", dept: "Engineering",  status: "pending" },
]

const DOCUMENTS: Record<string, Array<{ id: string; title: string; meta: string; href: string }>> = {
  hr: [
    { id: "d1", title: "Leave Policy 2025",          meta: "PDF · 1.2 MB",  href: "/dashboard/reports" },
    { id: "d2", title: "Employee Handbook v3",       meta: "PDF · 3.4 MB",  href: "/dashboard/reports" },
    { id: "d3", title: "Payroll Structure",          meta: "XLSX · 800 KB", href: "/employees/payroll" },
    { id: "d4", title: "Designation Structure",      meta: "PDF · 500 KB",  href: "/dashboard/reports" },
    { id: "d5", title: "Insurance Announcement",     meta: "PDF · 450 KB",  href: "/dashboard/reports" },
  ],
  manager: [
    { id: "d1", title: "Leave Policy 2025",          meta: "PDF · 1.2 MB",  href: "/dashboard/reports" },
    { id: "d2", title: "Employee Handbook v3",       meta: "PDF · 3.4 MB",  href: "/dashboard/reports" },
    { id: "d4", title: "Designation Structure",      meta: "PDF · 500 KB",  href: "/dashboard/reports" },
    { id: "d5", title: "Insurance Announcement",     meta: "PDF · 450 KB",  href: "/dashboard/reports" },
  ],
  employee: [
    { id: "d1", title: "Leave Policy 2025",          meta: "PDF · 1.2 MB",  href: "/dashboard/reports" },
    { id: "d2", title: "Employee Handbook v3",       meta: "PDF · 3.4 MB",  href: "/dashboard/reports" },
    { id: "d5", title: "Insurance Announcement",     meta: "PDF · 450 KB",  href: "/dashboard/reports" },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// CELEBRATIONS STRIP
// ─────────────────────────────────────────────────────────────────────────────
function CelebrationsStrip() {
  const [wished, setWished]       = useState<Set<number>>(new Set())
  const todayItems    = CELEBRATIONS.filter(c => c.date === "Today")
  const tomorrowItems = CELEBRATIONS.filter(c => c.date === "Tomorrow")
  if (todayItems.length === 0 && tomorrowItems.length === 0) return null

  const handleWish = (id: number) => setWished(prev => new Set([...prev, id]))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-[22px] overflow-hidden"
      style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
        <div className="p-2 rounded-xl" style={{ background: "rgba(251,191,36,0.15)" }}>
          <PartyPopper className="w-4 h-4" style={{ color: "var(--amber)" }} />
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.015em" }}>Celebrations</h3>
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--t4)" }}>
            Birthdays & Work Anniversaries
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold"
            style={{ background: "rgba(251,191,36,0.12)", color: "var(--amber)" }}>
            {todayItems.length} Today
          </span>
        </div>
      </div>

      {/* Scrollable row */}
      <div className="flex gap-4 overflow-x-auto px-6 py-4 no-scrollbar">
        {CELEBRATIONS.map(c => (
          <motion.div key={c.id}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: c.id * 0.06 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl shrink-0"
            style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", minWidth: "260px" }}>
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: c.type === "birthday"
                  ? "linear-gradient(135deg, var(--amber), #f97316)"
                  : "linear-gradient(135deg, var(--accent), var(--blue))" }}>
                {c.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ background: c.type === "birthday" ? "var(--amber)" : "var(--accent)", fontSize: "8px" }}>
                {c.type === "birthday" ? "🎂" : "⭐"}
              </div>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--t1)" }}>{c.name}</p>
              <p className="text-[10px]" style={{ color: "var(--t4)" }}>
                {c.type === "birthday" ? "Birthday" : `${c.years}-Year Anniversary`} · {c.date}
              </p>
            </div>
            {/* WISH button */}
            {c.date === "Today" && (
              <AnimatePresence mode="wait">
                {wished.has(c.id) ? (
                  <motion.div key="wished"
                    initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                    className="px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1"
                    style={{ background: "var(--green-bg)", color: "var(--green)" }}>
                    <Check className="w-3 h-3" /> Wished!
                  </motion.div>
                ) : (
                  <motion.button key="wish"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleWish(c.id)}
                    className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-white transition-all"
                    style={{ background: c.type === "birthday" ? "var(--amber)" : "var(--accent)" }}>
                    WISH 🎉
                  </motion.button>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENTS PANEL (CEO Speaks + HR Announcements)
// ─────────────────────────────────────────────────────────────────────────────
function AnnouncementsPanel({ isHR }: { isHR: boolean }) {
  const [activeTab, setActiveTab] = useState<"ceo"|"hr">("hr")
  const items = activeTab === "ceo" ? ANNOUNCEMENTS.ceo : ANNOUNCEMENTS.hr

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-[22px] overflow-hidden h-full"
      style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>

      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
        <div className="p-2 rounded-xl" style={{ background: "var(--blue-bg)" }}>
          <Megaphone className="w-4 h-4" style={{ color: "var(--blue)" }} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.015em" }}>Announcements</h3>
        </div>
        {isHR && (
          <button className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-white"
            style={{ background: "var(--accent)" }}>
            + Post
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--b1)" }}>
        {[
          { key: "ceo", label: "CEO Speaks" },
          { key: "hr",  label: "HR Announcement" },
        ].map(tab => (
          <button key={tab.key}
            onClick={() => setActiveTab(tab.key as "ceo"|"hr")}
            className="flex-1 py-3 text-xs font-bold transition-all relative"
            style={{ color: activeTab === tab.key ? "var(--accent-t)" : "var(--t4)" }}>
            {tab.label}
            {activeTab === tab.key && (
              <motion.div layoutId="ann-tab-line" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full"
                style={{ background: "var(--accent)" }} />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 overflow-y-auto" style={{ maxHeight: "260px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="space-y-3">
            {items.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm" style={{ color: "var(--t4)" }}>No records found</p>
              </div>
            ) : items.map(item => (
              <div key={item.id} className="p-4 rounded-[16px] transition-all cursor-pointer"
                style={{ background: "var(--surface-2)", border: "1px solid var(--b1)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b2)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b1)"}>
                <div className="flex items-start gap-2 mb-1.5">
                  {item.priority === "high" && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold mt-0.5 shrink-0"
                      style={{ background: "var(--red-bg)", color: "var(--red)" }}>IMPORTANT</span>
                  )}
                  <p className="text-sm font-semibold leading-tight" style={{ color: "var(--t1)" }}>{item.title}</p>
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--t3)" }}>{item.body}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--t4)" }}>{item.time}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// THINGS TO DO
// ─────────────────────────────────────────────────────────────────────────────
function ThingsToDoPanel({ userRole }: { userRole: string }) {
  const [done, setDone] = useState<Set<string>>(new Set())
  const tasks = THINGS_TO_DO[userRole] || THINGS_TO_DO.employee
  const toggle = (id: string) => setDone(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const completedCount = tasks.filter(t => done.has(t.id)).length

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45 }}
      className="rounded-[22px] overflow-hidden h-full"
      style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>

      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
        <div className="p-2 rounded-xl" style={{ background: "var(--purple-bg)" }}>
          <ListTodo className="w-4 h-4" style={{ color: "var(--purple)" }} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.015em" }}>Things To Do</h3>
          <p className="text-[10px] font-semibold" style={{ color: "var(--t4)" }}>
            {completedCount}/{tasks.length} completed
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: "var(--purple)" }}
            animate={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }} />
        </div>
      </div>

      {/* Tasks */}
      <div className="px-5 pb-5 space-y-2 overflow-y-auto" style={{ maxHeight: "260px" }}>
        {tasks.map((task, i) => (
          <motion.div key={task.id}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.06 }}>
            <Link href={task.href}>
              <div className="flex items-center gap-3 px-3 py-3 rounded-[14px] group cursor-pointer transition-all"
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                {/* Checkbox */}
                <button onClick={e => { e.preventDefault(); toggle(task.id) }}
                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{ borderColor: done.has(task.id) ? "var(--purple)" : "var(--b2)",
                    background: done.has(task.id) ? "var(--purple)" : "transparent" }}>
                  {done.has(task.id) && <Check className="w-3 h-3 text-white" />}
                </button>
                {/* Task text */}
                <p className="text-sm flex-1 leading-tight transition-all"
                  style={{ color: done.has(task.id) ? "var(--t4)" : "var(--t2)",
                    textDecoration: done.has(task.id) ? "line-through" : "none" }}>
                  {task.task}
                </p>
                {/* Priority */}
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase"
                  style={{
                    background: task.priority === "high" ? "var(--red-bg)" : task.priority === "medium" ? "var(--amber-bg)" : "var(--green-bg)",
                    color:      task.priority === "high" ? "var(--red)"    : task.priority === "medium" ? "var(--amber)"    : "var(--green)",
                  }}>
                  {task.priority}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS + APPROVALS
// ─────────────────────────────────────────────────────────────────────────────
function NotificationsPanel({ userRole }: { userRole: string }) {
  const [tab,      setTab]      = useState<"notifications"|"approvals">("notifications")
  const [notifs,   setNotifs]   = useState(NOTIFICATIONS_DATA)
  const [approvals, setApprovals] = useState(APPROVALS_DATA)
  const unread = notifs.filter(n => !n.read).length
  const isHR  = userRole === "hr"
  const isManager = userRole === "manager"

  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-[22px] overflow-hidden h-full"
      style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--b1)", background: "var(--surface-2)" }}>
        {[
          { key: "notifications", label: "Notifications", badge: unread },
          { key: "approvals",     label: "Approvals",     badge: (isHR || isManager) ? approvals.length : 0 },
        ].map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key as any)}
            className="flex-1 py-3.5 text-xs font-bold transition-all flex items-center justify-center gap-2 relative"
            style={{ color: tab === t.key ? "var(--accent-t)" : "var(--t4)" }}>
            {t.label}
            {t.badge > 0 && (
              <span className="w-4 h-4 rounded-full text-white flex items-center justify-center text-[8px] font-black"
                style={{ background: t.key === "approvals" ? "var(--amber)" : "var(--red)" }}>
                {t.badge}
              </span>
            )}
            {tab === t.key && (
              <motion.div layoutId="notif-tab-line" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full"
                style={{ background: "var(--accent)" }} />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
        <AnimatePresence mode="wait">
          {tab === "notifications" ? (
            <motion.div key="notifs"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="divide-y" style={{ borderColor: "var(--b1)" }}>
              {notifs.map(n => (
                <div key={n.id}
                  onClick={() => markRead(n.id)}
                  className="flex gap-3 px-5 py-4 cursor-pointer transition-all group"
                  style={{ background: !n.read ? "var(--accent-bg)" : "transparent" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = !n.read ? "var(--accent-bg)" : "transparent"}>
                  {/* Dot */}
                  <div className="relative flex shrink-0 mt-1.5">
                    {!n.read && (
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-60"
                        style={{ background: n.type === "success" ? "var(--green)" : n.type === "warning" ? "var(--amber)" : "var(--blue)" }} />
                    )}
                    <span className="relative inline-flex rounded-full w-2 h-2"
                      style={{ background: n.type === "success" ? "var(--green)" : n.type === "warning" ? "var(--amber)" : "var(--blue)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-tight" style={{ color: "var(--t1)" }}>{n.title}</p>
                    <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--t3)" }}>{n.desc}</p>
                    <p className="text-[10px] mt-1 font-semibold uppercase tracking-wider" style={{ color: "var(--t4)" }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="approvals"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {(!isHR && !isManager) ? (
                <div className="py-12 text-center px-6">
                  <BadgeCheck className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--b2)" }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--t4)" }}>No pending approvals</p>
                  <p className="text-xs mt-1" style={{ color: "var(--t4)" }}>You're all caught up!</p>
                </div>
              ) : approvals.length === 0 ? (
                <div className="py-12 text-center px-6">
                  <p className="text-sm" style={{ color: "var(--t4)" }}>No records found</p>
                </div>
              ) : approvals.map(a => (
                <div key={a.id} className="px-5 py-4 transition-all"
                  style={{ borderBottom: "1px solid var(--b1)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "var(--t1)" }}>{a.name}</p>
                      <p className="text-[10px]" style={{ color: "var(--t4)" }}>
                        {a.type} · {a.days}d · {a.dates} · {a.dept}
                      </p>
                    </div>
                    <span className="text-[9px] px-2 py-1 rounded-full font-bold shrink-0"
                      style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>
                      PENDING
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/attendance/leave-requests"
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center text-white"
                      style={{ background: "var(--green)" }}>
                      Approve
                    </Link>
                    <Link href="/attendance/leave-requests"
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center"
                      style={{ background: "var(--red-bg)", color: "var(--red)" }}>
                      Decline
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer link */}
      <div className="px-5 py-3" style={{ borderTop: "1px solid var(--b1)", background: "var(--surface-2)" }}>
        <Link href="/attendance/leave-requests"
          className="flex items-center justify-center gap-2 text-xs font-semibold w-full"
          style={{ color: "var(--accent-t)" }}>
          View All {tab === "approvals" ? "Leave Requests" : "Notifications"}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS + SHARE INFO
// ─────────────────────────────────────────────────────────────────────────────
function DocumentsAndShare({ userRole, isHR }: { userRole: string; isHR: boolean }) {
  const docs = DOCUMENTS[userRole] || DOCUMENTS.employee
  const [shareText, setShareText] = useState("")
  const [shared, setShared] = useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Important Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-[22px] overflow-hidden"
        style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
          <div className="p-2 rounded-xl" style={{ background: "var(--blue-bg)" }}>
            <BookOpen className="w-4 h-4" style={{ color: "var(--blue)" }} />
          </div>
          <h3 className="text-sm font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.015em" }}>Important Documents</h3>
          <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>
            {docs.length} files
          </span>
        </div>
        <div className="p-3">
          {docs.map((doc, i) => (
            <motion.div key={doc.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.06 }}>
              <Link href={doc.href}
                className="flex items-center gap-3 px-3 py-3 rounded-[14px] group transition-all"
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-bg)" }}>
                  <Paperclip className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--t1)" }}>{doc.title}</p>
                  <p className="text-[10px]" style={{ color: "var(--t4)" }}>{doc.meta}</p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--accent)" }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Share Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-[22px] overflow-hidden"
        style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
          <div className="p-2 rounded-xl" style={{ background: "var(--green-bg)" }}>
            <Share2 className="w-4 h-4" style={{ color: "var(--green)" }} />
          </div>
          <h3 className="text-sm font-bold" style={{ color: "var(--t1)", letterSpacing: "-0.015em" }}>Share Information</h3>
        </div>
        <div className="p-5">
          {(isHR || true) ? (
            /* Everyone can share info */
            <>
              <textarea
                value={shareText}
                onChange={e => setShareText(e.target.value)}
                placeholder="Share an update with your team..."
                rows={4}
                className="w-full text-sm rounded-2xl px-4 py-3 resize-none outline-none transition-all"
                style={{
                  background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t1)",
                  fontFamily: "var(--font-sans)", caretColor: "var(--accent)",
                }}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b2)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b1)"}
              />
              <div className="mt-3 flex items-center gap-2 justify-between">
                <p className="text-[10px]" style={{ color: "var(--t4)" }}>
                  Visible to: {isHR ? "All employees" : "Your team"}
                </p>
                <AnimatePresence mode="wait">
                  {shared ? (
                    <motion.span key="ok"
                      initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                      className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      style={{ background: "var(--green-bg)", color: "var(--green)" }}>
                      <Check className="w-3 h-3" /> Shared!
                    </motion.span>
                  ) : (
                    <motion.button key="share"
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { if (shareText.trim()) { setShared(true); setTimeout(() => setShared(false), 2500); setShareText("") }}}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                      style={{ background: shareText.trim() ? "var(--green)" : "var(--surface-3)",
                        color: shareText.trim() ? "white" : "var(--t4)" }}>
                      Post Update
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Sample shared items */}
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--t4)" }}>Recent</p>
                {[
                  { user: "HR Team", msg: "Q1 appraisal forms are now open.", time: "2h ago" },
                  { user: "John Manager", msg: "Engineering sprint #14 starts Monday.", time: "1d ago" },
                ].map((item, i) => (
                  <div key={i} className="px-3 py-2.5 rounded-[14px] flex gap-3"
                    style={{ background: "var(--surface-2)" }}>
                    <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-[8px] font-bold"
                      style={{ background: i === 0 ? "var(--accent)" : "var(--blue)" }}>
                      {item.user[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold" style={{ color: "var(--t3)" }}>{item.user} · {item.time}</p>
                      <p className="text-xs" style={{ color: "var(--t2)" }}>{item.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm" style={{ color: "var(--t4)" }}>No records found</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT — all existing logic + new widgets stitched in
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalEmployees: 0, presentToday: 0, onLeave: 0, pendingRequests: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [userRole,  setUserRole]  = useState("employee")
  const [userData,  setUserData]  = useState<any>(null)

  // ── DATA — unchanged ──────────────────────────────────────────────────
  const recentActivities = [
    { id: 1, action: "New employee added",        user: "Sarah Johnson",  time: "2 hours ago", type: "success" },
    { id: 2, action: "Leave request approved",    user: "Mike Chen",      time: "4 hours ago", type: "info"    },
    { id: 3, action: "Employee Settings updated", user: "System",         time: "1 day ago",   type: "success" },
    { id: 4, action: "Performance review due",    user: "Alex Rodriguez", time: "2 days ago",  type: "warning" },
  ]
  const upcomingEvents = [
    { id: 1, title: "Team Meeting",        date: "Today, 2:00 PM",    department: "Engineering", icon: <Calendar className="w-4 h-4" /> },
    { id: 2, title: "Performance Reviews", date: "Tomorrow, 9:00 AM", department: "HR",          icon: <TrendingUp className="w-4 h-4" /> },
    { id: 3, title: "Quarterly Planning",  date: "Friday, 10:00 AM",  department: "Management",  icon: <Bell className="w-4 h-4" /> },
  ]

  // ── FETCH — unchanged ─────────────────────────────────────────────────
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const savedRole = (sessionStorage.getItem("userRole") || "employee").toLowerCase()
        const email   = sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail") || localStorage.getItem("rememberedEmail") || `${savedRole}@novapex.com`
        const company = sessionStorage.getItem("companyName") || localStorage.getItem("companyName") || localStorage.getItem("rememberedCompany") || "Novapex Systems"
        const res = await fetch("/api/user", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, company }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Unable to load dashboard context.")
        setUserData(data)
        const role = (data.role || savedRole).toLowerCase()
        setUserRole(role)
        if      (role === "hr")      setStats({ totalEmployees: 247, presentToday: 198, onLeave: 12, pendingRequests: 8 })
        else if (role === "manager") setStats({ totalEmployees: 12,  presentToday: 10,  onLeave: 1,  pendingRequests: 4 })
        else                         setStats({ totalEmployees: 0,   presentToday: 0,   onLeave: 0,  pendingRequests: 0 })
      } catch (e) { console.error("Dashboard Sync Error:", e) }
      finally { setIsLoading(false) }
    }
    fetchDashboardData()
  }, [])

  const isEmployee = userRole === "employee"
  const isHR       = userRole === "hr"
  const isManager  = userRole === "manager"

  // ── LOADING ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: "var(--surface-0)" }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--accent)" }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--t4)" }}>
            Synchronizing Workspace
          </p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="space-y-8 pb-24 p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">

        {/* ═══════════════════ HEADER — unchanged ═══════════════════ */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] mb-2"
              style={{ color: "var(--accent-t)" }}>
              <Zap className="w-3 h-3 fill-current" /> Security Level: {userRole.toUpperCase()}
            </div>
            <h1 className="text-5xl font-bold tracking-tighter" style={{ color: "var(--t1)", letterSpacing: "-0.04em" }}>
              Nova<span style={{ color: "var(--accent)" }}>pex</span> Central
            </h1>
            <p className="mt-1 font-medium text-lg" style={{ color: "var(--t3)" }}>
              Welcome back, <span className="font-bold" style={{ color: "var(--t1)" }}>{userData?.name || "User"}</span>.
              {isHR       && ` Strategic workforce oversight for ${userData?.dept || "HR"}.`}
              {isManager  && ` Managing the ${userData?.dept || "Engineering"} team.`}
              {isEmployee && " Your personalized career suite."}
            </p>
          </div>
          <AnimatePresence mode="wait">
            {!isEmployee ? (
              <motion.div key="admin" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <button className="px-8 py-4 rounded-2xl flex gap-3 items-center font-bold transition-all hover:-translate-y-1 active:scale-95 text-white"
                  style={{ background: "var(--t1)", boxShadow: "var(--sh-lg)" }}>
                  <FileText className="w-5 h-5" /> Export {isManager ? "Team" : "Intelligence"}
                </button>
              </motion.div>
            ) : (
              <motion.div key="emp" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <button className="px-8 py-4 rounded-2xl flex gap-3 items-center font-bold transition-all hover:-translate-y-1 active:scale-95 text-white"
                  style={{ background: "var(--accent)", boxShadow: "var(--glow-accent)" }}>
                  <Award className="w-5 h-5" /> View My Achievements
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══════════════════ STAT CARDS — unchanged ═══════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: "s1", label: isHR ? "Workforce" : isManager ? "Direct Reports" : "Leave Balance",
              value: isHR ? stats.totalEmployees : isManager ? `${stats.totalEmployees} Members` : "24 Days",
              accentColor: "var(--blue)", accentBg: "var(--blue-bg)",
              icon: isEmployee ? <Calendar className="w-4 h-4" /> : <Users className="w-4 h-4" />,
              extra: isHR ? "+12 New Hires" : isManager ? `Dept: ${userData?.dept || "Engineering"}` : "Current Year" },
            { id: "s2", label: "Active Pulse",   value: stats.presentToday, accentColor: "var(--green)", accentBg: "var(--green-bg)", progress: true },
            { id: "s3", label: "Off Duty Today", value: stats.onLeave,      accentColor: "var(--amber)", accentBg: "var(--amber-bg)", extra: "Scheduled Leaves" },
            { id: "s4", label: isHR ? "Gatekeeper" : isManager ? "Team Requests" : "Performance Index",
              value: isHR ? stats.pendingRequests : isManager ? `${stats.pendingRequests} Pending` : "9.2/10",
              accentColor: (isHR || isManager) ? "var(--red)" : "var(--purple)",
              accentBg:    (isHR || isManager) ? "var(--red-bg)" : "var(--purple-bg)",
              icon: isEmployee ? <Target className="w-4 h-4" /> : <PieChart className="w-4 h-4" />,
              extra: isEmployee ? "Top 5% of Team" : "Action Required" },
          ].map((stat, i) => (
            <motion.div key={stat.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-7 rounded-[28px] cursor-default transition-all duration-300"
              style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-md)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-sm)"}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--t4)" }}>{stat.label}</p>
                <div className="p-2 rounded-xl" style={{ background: stat.accentBg, color: stat.accentColor }}>
                  {(stat as any).icon || <TrendingUp className="w-4 h-4" />}
                </div>
              </div>
              <div className="text-4xl font-bold tracking-tight" style={{ color: stat.accentColor, letterSpacing: "-0.04em" }}>
                {stat.value}
              </div>
              {(stat as any).progress ? (
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--green)" }}>Efficiency</span>
                    <span className="text-[10px] font-bold" style={{ color: "var(--t4)" }}>82%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: "var(--green)" }}
                      initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.2, ease: "circOut", delay: 0.3 }} />
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <span className="px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest"
                    style={{ background: stat.accentBg, color: stat.accentColor }}>
                    {(stat as any).extra}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ═══════════════════ NEW: CELEBRATIONS STRIP ══════════════ */}
        <CelebrationsStrip />

        {/* ═══════════════════ NEW: ANNOUNCEMENTS + THINGS TO DO + NOTIFICATIONS ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1"><AnnouncementsPanel isHR={isHR} /></div>
          <div className="lg:col-span-1"><ThingsToDoPanel userRole={userRole} /></div>
          <div className="lg:col-span-1"><NotificationsPanel userRole={userRole} /></div>
        </div>

        {/* ═══════════════════ ACTIVITY + MISSION BRIEFING — unchanged ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main panel */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 rounded-[36px] overflow-hidden"
            style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-md)" }}>
            <div className="p-8 flex justify-between items-center"
              style={{ borderBottom: "1px solid var(--b1)", background: "var(--surface-2)" }}>
              <div>
                <h3 className="text-2xl font-bold tracking-tight" style={{ color: "var(--t1)" }}>
                  {isHR ? "System Intelligence Logs" : isManager ? "Team Performance Velocity" : "My Career Growth Index"}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "var(--t4)" }}>Live Telemetry Data</p>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all hover:gap-4"
                style={{ color: "var(--accent-t)" }}>
                {isEmployee ? "Growth Map" : isManager ? "Team Reports" : "Full History"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8">
              {(isEmployee || isManager) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {[
                      { label: isManager ? "Project Completion"  : "Technical Proficiency", val: 85, color: "var(--blue)"  },
                      { label: isManager ? "Team Synergy"        : "Project Delivery",       val: 92, color: "var(--green)" },
                      { label: isManager ? "Resource Allocation" : "Collaboration",          val: 78, color: "var(--amber)" },
                    ].map((skill, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--t4)" }}>{skill.label}</span>
                          <span className="text-sm font-bold" style={{ color: "var(--t1)" }}>{skill.val}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                          <motion.div className="h-full rounded-full" style={{ background: skill.color }}
                            initial={{ width: 0 }} animate={{ width: `${skill.val}%` }} transition={{ duration: 1, delay: idx * 0.2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-3xl p-6 flex flex-col justify-center"
                    style={{ background: "var(--surface-2)", border: "1px dashed var(--b2)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--t3)" }}>
                        {isManager ? "Management Tip" : "Quarterly Milestone"}
                      </span>
                    </div>
                    <p className="text-sm font-bold leading-relaxed" style={{ color: "var(--t2)" }}>
                      {isManager
                        ? "Three team members are approaching their 'Senior II' promotion eligibility. Schedule a sync to discuss."
                        : "You are on track to complete your Senior Certification this month. Keep up the momentum!"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentActivities.map(a => (
                    <div key={a.id}
                      className="flex items-center gap-5 p-5 rounded-[20px] cursor-pointer group transition-all"
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                      <div className="w-2.5 h-2.5 rounded-full shadow-lg shrink-0"
                        style={{ background: a.type === "success" ? "var(--green)" : a.type === "warning" ? "var(--red)" : "var(--blue)" }} />
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{ color: "var(--t1)" }}>{a.action}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "var(--t4)" }}>
                          {a.user} • {a.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Mission Briefing — Full Calendar button now navigates ── */}
          <motion.div
            className="rounded-[36px] p-8 text-white relative overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(135deg, #05101e 0%, #091827 60%, #05101e 100%)", border: "1px solid rgba(0,212,168,0.18)" }}
            whileHover={{ scale: 1.01 }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,168,0.7), rgba(79,168,255,0.4), transparent)" }} />
            <h3 className="text-2xl font-bold mb-8 tracking-tight text-white">Mission Briefing</h3>
            <div className="space-y-5 relative z-10">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center gap-4 group/item cursor-pointer">
                  <div className="p-2.5 rounded-xl transition-all duration-300 group-hover/item:bg-teal-500"
                    style={{ background: "rgba(0,212,168,0.12)", color: "#00d4a8", border: "1px solid rgba(0,212,168,0.18)" }}>
                    {event.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight text-white/90 group-hover/item:text-white transition-colors">{event.title}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Calendar — now a real navigation button ── */}
            <Link href="/calendar">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full mt-10 py-4 rounded-2xl font-bold text-slate-900 relative z-10 text-center cursor-pointer"
                style={{ background: "linear-gradient(135deg, #00d4a8, #4fa8ff)", boxShadow: "0 8px 28px rgba(0,212,168,0.25)" }}>
                Full Calendar →
              </motion.div>
            </Link>

            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px]" style={{ background: "rgba(0,212,168,0.08)" }} />
            <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-[60px]" style={{ background: "rgba(79,168,255,0.05)" }} />
          </motion.div>
        </div>

        {/* ═══════════════════ NEW: DOCUMENTS + SHARE INFO ══════════ */}
        <DocumentsAndShare userRole={userRole} isHR={isHR} />

        {/* ═══════════════════ COMMAND GATES — unchanged ════════════ */}
        <div className={`grid grid-cols-1 gap-8 ${isEmployee ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {[
            { title: "Attendance",  href: "/attendance",          gradient: "from-teal-600 to-cyan-700",  glow: "rgba(0,212,168,0.25)", desc: "Clock-in & Logs",    roles: ["hr","manager","employee"] },
            { title: "Performance", href: "/performance",         gradient: "from-blue-600 to-indigo-700", glow: "rgba(79,168,255,0.22)", desc: "KPIs & Reviews",    roles: ["hr","manager","employee"] },
            { title: isHR ? "Core Settings" : "Team Oversight",
              href:  isHR ? "/settings" : "/employees/profiles",
              gradient: "from-slate-700 to-slate-900", glow: "rgba(0,0,0,0.30)",
              desc:  isHR ? "System Config" : "Member Oversight", roles: ["hr","manager"] },
          ].map((item, i) => {
            if (!item.roles.includes(userRole)) return null
            return (
              <Link href={item.href} key={i}>
                <motion.div whileHover={{ y: -12, scale: 1.02 }}
                  className={`h-56 rounded-[36px] p-8 flex flex-col justify-between text-white shadow-2xl bg-gradient-to-br ${item.gradient} relative overflow-hidden group`}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${item.glow}`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold tracking-tighter mb-1">{item.title}</h3>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-all">
                      Enter Module <ArrowRight className="w-3 h-3" />
                    </span>
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md group-hover:bg-white transition-all duration-500">
                      <ArrowRight className="w-5 h-5 text-white group-hover:text-slate-900 transition-colors" />
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-25 group-hover:rotate-45 transition-all duration-700">
                    {isManager ? <Briefcase className="w-40 h-40" /> : <Settings className="w-40 h-40" />}
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>

        <Chatbot />
      </div>
    </AuthGuard>
  )
}