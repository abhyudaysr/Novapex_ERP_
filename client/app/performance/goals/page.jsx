"use client"

import { useState, useEffect } from "react"
import {
  Target, Plus, TrendingUp, Calendar, Flag, CheckCircle2, Clock,
  MoreVertical, ChevronRight, Users, Briefcase, X, Trash2,
  Download, Edit2, Send, Save, ChevronDown,
  AlertCircle, CheckCheck, Loader2, BarChart2, Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AuthGuard from "../../../components/AuthGuard"

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const GOAL_TYPES = ["Technical", "Sales", "Marketing", "HR", "Design", "Finance", "Operations", "Product"]
const PERIODS    = ["H1-2026", "H2-2026", "H1-2027"]
const PRIORITIES = ["High", "Medium", "Low"]

const TEAM_MEMBERS = [
  { name: "Jordan Smith", dept: "Engineering" },
  { name: "Leah Baker",   dept: "Creative"    },
  { name: "Riya Patel",   dept: "Sales"       },
  { name: "James Liu",    dept: "Marketing"   },
]

const MOCK_GOALS = [
  {
    id: 1, title: "Scale Cloud Infrastructure",
    statement: "Optimize AWS instances to reduce latency by 20% across all regions.",
    weightage: 30, category: "Technical", priority: "High",
    startDate: "2026-01-01", dueDate: "2026-03-30",
    status: "active", owner: "Engineering Team", ownerRole: "hr", period: "H1-2026",
    progress: 75, createdBy: "Sarah Johnson",
    steps: [
      { id: "s1", kpi: "Latency < 100ms", completionDate: "2026-02-15", stretchedKPI: "Latency < 80ms" },
      { id: "s2", kpi: "99.9% uptime",    completionDate: "2026-03-01", stretchedKPI: "99.99% uptime"  },
    ],
  },
  {
    id: 2, title: "Revenue Growth Q1",
    statement: "Onboard 15 new enterprise-level clients for the ERP suite.",
    weightage: 40, category: "Sales", priority: "High",
    startDate: "2026-01-01", dueDate: "2026-03-31",
    status: "active", owner: "Sales Department", ownerRole: "manager", period: "H1-2026",
    progress: 40, createdBy: "Sarah Johnson",
    steps: [
      { id: "s3", kpi: "10 demos booked", completionDate: "2026-02-01", stretchedKPI: "15 demos" },
    ],
  },
  {
    id: 3, title: "UI/UX Refresh",
    statement: "Complete the design system documentation for the Novapex rebranding.",
    weightage: 20, category: "Design", priority: "Medium",
    startDate: "2025-12-01", dueDate: "2026-02-10",
    status: "completed", owner: "Creative Lead", ownerRole: "employee", period: "H1-2026",
    progress: 100, createdBy: "Sarah Johnson",
    steps: [
      { id: "s4", kpi: "All components documented", completionDate: "2026-02-10", stretchedKPI: "Interactive Storybook" },
    ],
  },
  {
    id: 4, title: "HR Policy Update",
    statement: "Revise leave policy and publish updated employee handbook for H1.",
    weightage: 10, category: "HR", priority: "Medium",
    startDate: "2026-01-15", dueDate: "2026-04-15",
    status: "active", owner: "HR Team", ownerRole: "hr", period: "H1-2026",
    progress: 55, createdBy: "Sarah Johnson",
    steps: [],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function priorityColor(p) {
  if (p === "High")   return { bg: "var(--red-bg)",   color: "var(--red)"   }
  if (p === "Medium") return { bg: "var(--amber-bg)", color: "var(--amber)" }
  return                     { bg: "var(--green-bg)", color: "var(--green)" }
}

function catColor(c) {
  if (c === "Technical") return "var(--blue)"
  if (c === "Sales")     return "var(--green)"
  if (c === "HR")        return "var(--purple)"
  if (c === "Design")    return "var(--accent)"
  return "var(--t3)"
}

function newStep() {
  return { id: `s${Date.now()}`, kpi: "", completionDate: "", stretchedKPI: "" }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTION STEPS TABLE
// ─────────────────────────────────────────────────────────────────────────────
function ExecutionStepsTable({ steps, onChange }) {
  const update = (id, field, val) =>
    onChange(steps.map(s => s.id === id ? { ...s, [field]: val } : s))
  const remove = (id) => onChange(steps.filter(s => s.id !== id))
  const add    = () => onChange([...steps, newStep()])

  return (
    <div className="rounded-[16px] overflow-hidden" style={{ border: "1px solid var(--b1)" }}>
      {/* Header */}
      <div className="grid px-4 py-2.5 items-center"
        style={{
          gridTemplateColumns: "1fr 140px 1fr 40px",
          background: "var(--surface-2)", borderBottom: "1px solid var(--b1)",
          color: "var(--t4)", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
        <span>KPI / Target</span>
        <span>Completion Date</span>
        <span>Stretched Goal/KPI</span>
        <button onClick={add}
          className="w-6 h-6 rounded-lg flex items-center justify-center ml-auto transition-all hover:scale-110"
          style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="py-5 text-center" style={{ color: "var(--t4)", fontSize: "12px" }}>
          No records found — click + to add a step
        </div>
      ) : steps.map((s, i) => (
        <div key={s.id}
          className="grid items-center px-4 py-2"
          style={{
            gridTemplateColumns: "1fr 140px 1fr 40px",
            borderBottom: i < steps.length - 1 ? "1px solid var(--b1)" : "none",
            background: i % 2 === 0 ? "transparent" : "var(--surface-2)",
          }}>
          <input value={s.kpi} onChange={e => update(s.id, "kpi", e.target.value)}
            placeholder="e.g. Latency < 100ms"
            className="text-xs px-2 py-1.5 rounded-lg outline-none mr-2"
            style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t1)", width: "100%" }} />
          <input type="date" value={s.completionDate} onChange={e => update(s.id, "completionDate", e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg outline-none mr-2"
            style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t1)", width: "100%" }} />
          <input value={s.stretchedKPI} onChange={e => update(s.id, "stretchedKPI", e.target.value)}
            placeholder="e.g. Latency < 80ms"
            className="text-xs px-2 py-1.5 rounded-lg outline-none mr-2"
            style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t1)", width: "100%" }} />
          <button onClick={() => remove(s.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center ml-auto transition-all hover:scale-110"
            style={{ background: "var(--red-bg)", color: "var(--red)" }}>
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GOAL FORM MODAL
// ─────────────────────────────────────────────────────────────────────────────
function GoalFormModal({ onClose, onSave, existingGoals, userRole, userName }) {
  const isHR      = userRole === "hr"
  const isManager = userRole === "manager"

  const usedWeightage = existingGoals
    .filter(g => g.status !== "completed")
    .reduce((sum, g) => sum + g.weightage, 0)

  const [title,      setTitle]      = useState("")
  const [statement,  setStatement]  = useState("")
  const [weightage,  setWeightage]  = useState("")
  const [category,   setCategory]   = useState("")
  const [priority,   setPriority]   = useState("High")
  const [startDate,  setStartDate]  = useState(new Date().toISOString().slice(0, 10))
  const [dueDate,    setDueDate]    = useState("")
  const [period,     setPeriod]     = useState("H1-2026")
  const [onBehalf,   setOnBehalf]   = useState("")
  const [steps,      setSteps]      = useState([])
  const [errors,     setErrors]     = useState({})
  const [saving,     setSaving]     = useState(false)

  const remainingWeightage = 100 - usedWeightage
  const totalAfter = usedWeightage + Number(weightage || 0)

  const validate = () => {
    const e = {}
    if (!title.trim())     e.title     = "Goal name is required"
    if (!statement.trim()) e.statement = "Goal statement is required"
    if (!category)         e.category  = "Goal type is required"
    if (!dueDate)          e.dueDate   = "Target date is required"
    const w = Number(weightage)
    if (!w || w <= 0)      e.weightage = "Weightage must be > 0"
    if (totalAfter > 100)  e.weightage = `Exceeds 100% — only ${remainingWeightage}% available`
    return e
  }

  const handleSave = async (draft) => {
    if (!draft) {
      const e = validate()
      if (Object.keys(e).length) { setErrors(e); return }
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const newGoal = {
      id:        Date.now(),
      title,
      statement,
      weightage: Number(weightage) || 0,
      category:  category || "General",
      priority,
      startDate,
      dueDate,
      status:    draft ? "draft" : "active",
      owner:     onBehalf || userName,
      ownerRole: userRole,
      period,
      progress:  0,
      steps,
      createdBy: userName,
    }
    onSave(newGoal, draft)
    setSaving(false)
  }

  const inputStyle = (field) => ({
    background: "var(--surface-2)",
    border:     `1px solid ${errors[field] ? "var(--red)" : "var(--b1)"}`,
    color:      "var(--t1)",
  })

  const inputClass = "w-full text-sm px-3 py-2.5 rounded-xl outline-none transition-all"

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-6 px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,   scale: 1    }}
        exit={{   opacity: 0, y: -20,  scale: 0.97 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="w-full max-w-3xl rounded-[28px] overflow-hidden flex flex-col"
        style={{
          background: "var(--surface-1)",
          border:     "1px solid var(--b1)",
          boxShadow:  "0 24px 80px rgba(0,0,0,0.28)",
          maxHeight:  "calc(100vh - 48px)",
        }}>

        {/* Header */}
        <div className="px-7 py-5 flex items-center justify-between shrink-0"
          style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: "var(--accent-bg)" }}>
              <Target className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "var(--t1)" }}>Create New Goal</h2>
              <p className="text-[10px] font-semibold" style={{ color: "var(--t4)" }}>Period: {period}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Weightage counter */}
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--t4)" }}>Total Weightage</p>
              <p className="text-xl font-black"
                style={{ color: totalAfter > 100 ? "var(--red)" : totalAfter === 100 ? "var(--green)" : "var(--t1)" }}>
                {totalAfter}%
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl transition-colors" style={{ color: "var(--t4)" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-3)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-7 space-y-5">

          {/* Period + On Behalf Of */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--t4)" }}>
                Calendar Period
              </label>
              <div className="relative">
                <select value={period} onChange={e => setPeriod(e.target.value)}
                  className={inputClass + " appearance-none pr-8"} style={inputStyle("period")}>
                  {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--t4)" }} />
              </div>
            </div>
            {(isHR || isManager) && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--t4)" }}>
                  On Behalf Of <span style={{ fontSize: "9px", fontWeight: 400, textTransform: "none" }}>(optional)</span>
                </label>
                <div className="relative">
                  <select value={onBehalf} onChange={e => setOnBehalf(e.target.value)}
                    className={inputClass + " appearance-none pr-8"} style={inputStyle("onBehalf")}>
                    <option value="">— Self —</option>
                    {TEAM_MEMBERS.map(m => (
                      <option key={m.name} value={m.name}>{m.name} ({m.dept})</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--t4)" }} />
                </div>
              </div>
            )}
          </div>

          {/* Goal Name + Weightage */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--t4)" }}>
                Goal Name <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Scale Cloud Infrastructure"
                className={inputClass} style={inputStyle("title")} />
              {errors.title && <p className="text-[10px] mt-1" style={{ color: "var(--red)" }}>{errors.title}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--t4)" }}>
                Weightage % <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <input type="number" min={1} max={remainingWeightage}
                value={weightage} onChange={e => setWeightage(e.target.value)}
                placeholder={`Max ${remainingWeightage}%`}
                className={inputClass} style={inputStyle("weightage")} />
              {errors.weightage && <p className="text-[10px] mt-1" style={{ color: "var(--red)" }}>{errors.weightage}</p>}
              <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{
                    width:      `${Math.min(totalAfter, 100)}%`,
                    background: totalAfter > 100 ? "var(--red)" : totalAfter === 100 ? "var(--green)" : "var(--accent)",
                  }} />
              </div>
            </div>
          </div>

          {/* Goal Statement */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--t4)" }}>
              Goal Statement <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <textarea value={statement} onChange={e => setStatement(e.target.value)}
              placeholder="Describe the goal in clear, measurable terms..."
              rows={3}
              className={inputClass + " resize-none"}
              style={inputStyle("statement")} />
            {errors.statement && <p className="text-[10px] mt-1" style={{ color: "var(--red)" }}>{errors.statement}</p>}
          </div>

          {/* Goal Type + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--t4)" }}>
                Goal Type <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <div className="relative">
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className={inputClass + " appearance-none pr-8"} style={inputStyle("category")}>
                  <option value="">Select type...</option>
                  {GOAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--t4)" }} />
              </div>
              {errors.category && <p className="text-[10px] mt-1" style={{ color: "var(--red)" }}>{errors.category}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--t4)" }}>
                Priority
              </label>
              <div className="flex gap-2">
                {PRIORITIES.map(p => {
                  const c = priorityColor(p)
                  return (
                    <button key={p} onClick={() => setPriority(p)}
                      className="flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all"
                      style={{
                        background: priority === p ? c.bg    : "var(--surface-2)",
                        color:      priority === p ? c.color : "var(--t4)",
                        border:     `1px solid ${priority === p ? c.color : "var(--b1)"}`,
                      }}>
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Start + Target Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--t4)" }}>
                Start Date <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className={inputClass} style={inputStyle("startDate")} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--t4)" }}>
                Target Date <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className={inputClass} style={inputStyle("dueDate")} />
              {errors.dueDate && <p className="text-[10px] mt-1" style={{ color: "var(--red)" }}>{errors.dueDate}</p>}
            </div>
          </div>

          {/* Execution Steps */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: "var(--t4)" }}>
              Execution Steps
            </label>
            <ExecutionStepsTable steps={steps} onChange={setSteps} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 flex items-center justify-between gap-3 shrink-0"
          style={{ borderTop: "1px solid var(--b1)", background: "var(--surface-2)" }}>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: "var(--surface-3)", color: "var(--t3)" }}>
            Cancel
          </button>
          <div className="flex gap-2">
            <button onClick={() => handleSave(true)} disabled={saving}
              className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
              style={{ background: "var(--amber-bg)", color: "var(--amber)", border: "1px solid var(--amber)" }}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Draft
            </button>
            <button onClick={() => handleSave(false)} disabled={saving}
              className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-white transition-all"
              style={{ background: "var(--accent)" }}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Submit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GOAL CARD
// ─────────────────────────────────────────────────────────────────────────────
function GoalCard({ goal, userRole, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const isHR      = userRole === "hr"
  const isManager = userRole === "manager"
  const pc = priorityColor(goal.priority)

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] overflow-hidden transition-all"
      style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--sh-md)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--sh-sm)"}>
      <div className="p-7">
        {/* Top row */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h3 className="text-lg font-black tracking-tight" style={{ color: "var(--t1)" }}>{goal.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase"
                style={{ background: `color-mix(in srgb, ${catColor(goal.category)} 12%, transparent)`, color: catColor(goal.category) }}>
                {goal.category}
              </span>
              {goal.status === "draft" && (
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase"
                  style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>Draft</span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: "var(--surface-2)", color: "var(--t4)" }}>
                {goal.weightage}% weight
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--t3)" }}>{goal.statement}</p>
            {userRole !== "employee" && (
              <p className="text-[10px] font-bold mt-1 uppercase tracking-wide" style={{ color: "var(--accent-t)" }}>
                Owner: {goal.owner}
              </p>
            )}
          </div>
          {(isHR || isManager) && (
            <div className="flex gap-1.5 ml-4 shrink-0">
              <button onClick={() => onEdit(goal)}
                className="p-2 rounded-xl transition-all hover:scale-105"
                style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-2 rounded-xl transition-all hover:scale-105"
                style={{ background: "var(--surface-2)", color: "var(--t4)" }}>
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--t4)" }}>Execution Progress</span>
            <span className="text-sm font-black" style={{ color: "var(--t1)" }}>{goal.progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
            <motion.div className="h-full rounded-full"
              style={{
                background: goal.progress === 100 ? "var(--green)" : goal.progress >= 60 ? "var(--blue)" : "var(--accent)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-4 pt-4" style={{ borderTop: "1px solid var(--b1)" }}>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" style={{ color: "var(--t4)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--t3)" }}>{goal.dueDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5" style={{ color: pc.color }} />
            <span className="text-xs font-semibold" style={{ color: pc.color }}>{goal.priority} Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" style={{ color: "var(--t4)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--t4)" }}>{goal.period}</span>
          </div>
          <div className="ml-auto flex gap-2">
            {goal.steps.length > 0 && (
              <button onClick={() => setExpanded(e => !e)}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                style={{ background: "var(--surface-2)", color: "var(--t4)" }}>
                {expanded ? "Hide" : `${goal.steps.length} Steps`}
                <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
              </button>
            )}
            <button className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "var(--accent-bg)", color: "var(--accent-t)" }}>
              {userRole === "employee" ? "Update Status" : "Review Progress"}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Steps expand */}
      <AnimatePresence>
        {expanded && (
          <motion.div key="steps"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{   height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ borderTop: "1px solid var(--b1)", overflow: "hidden" }}>
            <div className="px-7 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--t4)" }}>Execution Steps</p>
              <div className="space-y-2">
                {goal.steps.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "var(--surface-2)" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                      style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: "var(--t1)" }}>{s.kpi || "—"}</p>
                      {s.stretchedKPI && (
                        <p className="text-[10px]" style={{ color: "var(--t4)" }}>Stretch: {s.stretchedKPI}</p>
                      )}
                    </div>
                    {s.completionDate && (
                      <span className="text-[9px] font-semibold shrink-0" style={{ color: "var(--t4)" }}>
                        Due {s.completionDate.slice(5)}
                      </span>
                    )}
                    {isManager && (
                      <button className="text-[9px] font-bold px-2 py-1 rounded-lg"
                        style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>
                        Approve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GOAL HISTORY
// ─────────────────────────────────────────────────────────────────────────────
function GoalHistoryView({ goals }) {
  const all = goals.filter(g => g.status !== "active")
  return (
    <div className="rounded-[22px] overflow-hidden"
      style={{ background: "var(--surface-1)", border: "1px solid var(--b1)" }}>
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--b1)" }}>
        <Clock className="w-4 h-4" style={{ color: "var(--accent)" }} />
        <h3 className="text-sm font-bold" style={{ color: "var(--t1)" }}>Goal History</h3>
        <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
          {all.length} records
        </span>
      </div>
      {all.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm" style={{ color: "var(--t4)" }}>No goal history found</p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: "var(--b1)" }}>
          {all.map(g => {
            const pc = priorityColor(g.priority)
            return (
              <div key={g.id} className="px-6 py-4 flex items-center gap-4 transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: g.status === "completed" ? "var(--green-bg)" : "var(--amber-bg)" }}>
                  {g.status === "completed"
                    ? <CheckCheck className="w-4 h-4" style={{ color: "var(--green)" }} />
                    : <Save       className="w-4 h-4" style={{ color: "var(--amber)" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "var(--t1)" }}>{g.title}</p>
                  <p className="text-[10px] font-semibold" style={{ color: "var(--t4)" }}>
                    {g.period} · {g.category} · {g.weightage}% weight
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: g.status === "completed" ? "var(--green-bg)" : "var(--amber-bg)",
                      color:      g.status === "completed" ? "var(--green)"    : "var(--amber)",
                    }}>
                    {g.status}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: pc.bg, color: pc.color }}>
                    {g.progress}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function GoalsPage() {
  const [userRole,     setUserRole]     = useState("hr")
  const [userName,     setUserName]     = useState("User")
  const [activeTab,    setActiveTab]    = useState("active")
  const [viewMode,     setViewMode]     = useState("list")
  const [periodFilter, setPeriodFilter] = useState("H1-2026")
  const [showForm,     setShowForm]     = useState(false)
  const [goals,        setGoals]        = useState(MOCK_GOALS)
  const [toast,        setToast]        = useState(null)

  useEffect(() => {
    const role = (sessionStorage.getItem("userRole") || localStorage.getItem("userRole") || "hr").toLowerCase()
    const name = sessionStorage.getItem("userName") || localStorage.getItem("userName") || "User"
    setUserRole(role)
    setUserName(name)
  }, [])

  const isHR       = userRole === "hr"
  const isManager  = userRole === "manager"
  const isEmployee = userRole === "employee"

  const showToast = (msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaveGoal = (g, draft) => {
    setGoals(prev => [g, ...prev])
    setShowForm(false)
    showToast(draft ? "Goal saved as draft" : "Goal submitted successfully!")
  }

  const visibleGoals = goals.filter(g => {
    const periodMatch = g.period === periodFilter
    if (isEmployee) return periodMatch && g.ownerRole === "employee"
    return periodMatch
  })

  const activeGoals    = visibleGoals.filter(g => g.status === "active")
  const completedGoals = visibleGoals.filter(g => g.status === "completed")
  const draftGoals     = visibleGoals.filter(g => g.status === "draft")
  const displayGoals   = activeTab === "active" ? [...activeGoals, ...draftGoals] : completedGoals

  const totalWeightage = activeGoals.reduce((s, g) => s + g.weightage, 0)
  const avgProgress    = activeGoals.length
    ? Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length)
    : 0

  const roadmapGoal = activeGoals[0]

  return (
    <AuthGuard>
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24 animate-in fade-in duration-700"
        style={{ backgroundColor: "var(--surface-0)" }}>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xl"
              style={{
                background: toast.type === "success" ? "var(--green-bg)"  : "var(--red-bg)",
                color:      toast.type === "success" ? "var(--green)"     : "var(--red)",
                border:     `1px solid ${toast.type === "success" ? "var(--green)" : "var(--red)"}`,
              }}>
              {toast.type === "success"
                ? <CheckCheck  className="w-4 h-4" />
                : <AlertCircle className="w-4 h-4" />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <GoalFormModal
              onClose={() => setShowForm(false)}
              onSave={handleSaveGoal}
              existingGoals={goals.filter(g => g.status !== "completed")}
              userRole={userRole}
              userName={userName}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] mb-2"
              style={{ color: "var(--accent-t)" }}>
              <Target className="w-3 h-3" />
              {isEmployee ? "Personal Goals" : isManager ? "Team Objectives" : "Org Strategy"}
            </div>
            <h1 className="text-4xl font-black tracking-tighter" style={{ color: "var(--t1)", letterSpacing: "-0.04em" }}>
              {isEmployee ? "My" : "Strategic"}{" "}
              <span style={{ color: "var(--accent)" }}>Objectives</span>
            </h1>
            <p className="mt-1 font-medium" style={{ color: "var(--t3)" }}>
              {isHR       && "Aligning organizational targets with long-term mission."}
              {isManager  && "Tracking team performance and milestone velocity."}
              {isEmployee && "Executing your personal growth roadmap."}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Period filter */}
            <div className="relative">
              <select value={periodFilter} onChange={e => setPeriodFilter(e.target.value)}
                className="text-xs font-bold px-4 py-2.5 rounded-xl appearance-none pr-8 outline-none"
                style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t1)" }}>
                {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--t4)" }} />
            </div>
            {/* Add New Goal */}
            <button onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: "var(--accent)", boxShadow: "var(--glow-accent)" }}>
              <Plus className="w-4 h-4" /> Add New Goal
            </button>
            {/* Deploy Global Goal — HR only */}
            {isHR && (
              <button className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: "var(--t1)" }}>
                <Zap className="w-4 h-4" /> Deploy Global Goal
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: isEmployee ? "Personal Goals" : "Active Objectives",
              value: `0${activeGoals.length}`,
              icon:  isEmployee ? <Briefcase className="w-5 h-5" /> : <Target className="w-5 h-5" />,
              color: "var(--blue)", bg: "var(--blue-bg)",
              extra: { label: "Weightage Used", value: `${totalWeightage}%` },
            },
            {
              label: "Completion Rate",
              value: `${avgProgress}%`,
              icon:  <CheckCircle2 className="w-5 h-5" />,
              color: "var(--green)", bg: "var(--green-bg)",
              extra: null,
            },
            {
              label: isHR ? "Org Velocity" : isManager ? "Team Alignment" : "Peer Ranking",
              value: isHR ? "+14%" : "98%",
              icon:  isHR ? <TrendingUp className="w-5 h-5" /> : <Users className="w-5 h-5" />,
              color: "var(--amber)", bg: "var(--amber-bg)",
              extra: null,
            },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-[28px] flex items-center gap-4"
              style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>
              <div className="p-3 rounded-2xl shrink-0" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: "var(--t4)" }}>{s.label}</p>
                <p className="text-2xl font-black" style={{ color: "var(--t1)" }}>{s.value}</p>
              </div>
              {s.extra && (
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--t4)" }}>{s.extra.label}</p>
                  <p className="text-lg font-black"
                    style={{ color: totalWeightage > 100 ? "var(--red)" : totalWeightage === 100 ? "var(--green)" : "var(--t1)" }}>
                    {s.extra.value}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — goals */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "var(--surface-2)", border: "1px solid var(--b1)" }}>
                {[
                  { key: "list",    label: "Active Goals" },
                  { key: "history", label: "Goal History" },
                ].map(v => (
                  <button key={v.key} onClick={() => setViewMode(v.key)}
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    style={{
                      background: viewMode === v.key ? "var(--accent-bg)" : "transparent",
                      color:      viewMode === v.key ? "var(--accent-t)"  : "var(--t4)",
                    }}>
                    {v.label}
                  </button>
                ))}
              </div>
              {viewMode === "list" && (
                <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "var(--surface-2)", border: "1px solid var(--b1)" }}>
                  {["active", "completed"].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)}
                      className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      style={{
                        background: activeTab === t ? "var(--surface-1)" : "transparent",
                        color:      activeTab === t ? "var(--accent-t)"  : "var(--t4)",
                        boxShadow:  activeTab === t ? "var(--sh-sm)"     : "none",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "history" ? (
                <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <GoalHistoryView goals={visibleGoals} />
                </motion.div>
              ) : (
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} className="space-y-5">
                  {displayGoals.length === 0 ? (
                    <div className="py-16 text-center rounded-[28px]"
                      style={{ background: "var(--surface-1)", border: "1px dashed var(--b2)" }}>
                      <Target className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--b2)" }} />
                      <p className="font-semibold" style={{ color: "var(--t4)" }}>No {activeTab} goals for {periodFilter}</p>
                      <button onClick={() => setShowForm(true)}
                        className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                        style={{ background: "var(--accent)" }}>
                        + Add New Goal
                      </button>
                    </div>
                  ) : displayGoals.map(g => (
                    <GoalCard key={g.id} goal={g} userRole={userRole} onEdit={() => setShowForm(true)} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — sidebar */}
          <div className="space-y-6">

            {/* Tracking Roadmap */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="rounded-[28px] p-7 text-white"
              style={{
                background: "linear-gradient(135deg, #05101e 0%, #0d1f35 60%, #05101e 100%)",
                border:     "1px solid rgba(108,92,231,0.2)",
                boxShadow:  "var(--sh-lg)",
              }}>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5" style={{ color: "var(--accent)" }} />
                <h3 className="font-black text-lg tracking-tight">
                  {isEmployee ? "My Roadmap" : "Tracking Roadmap"}
                </h3>
              </div>
              {roadmapGoal && roadmapGoal.steps.length > 0 ? (
                <div className="space-y-5 relative" style={{ paddingLeft: "2px" }}>
                  {roadmapGoal.steps.slice(0, 3).map((s, idx) => (
                    <div key={s.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: idx === 0 ? "var(--accent)" : "rgba(255,255,255,0.05)",
                          border:     idx === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                        }}>
                        {idx === 0
                          ? <CheckCircle2 className="w-4 h-4 text-white" />
                          : <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: idx === 0 ? "white" : "rgba(255,255,255,0.4)" }}>
                          {s.kpi || `Step ${idx + 1}`}
                        </p>
                        <p className="text-[9px] font-semibold uppercase tracking-wider mt-0.5"
                          style={{ color: "rgba(255,255,255,0.3)" }}>
                          Status: {idx === 0 ? "Verified" : "Pending"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>No execution steps yet</p>
              )}
              <button className="w-full mt-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                {isHR ? "Export Org Timeline" : "View Full Timeline"}
              </button>
            </motion.div>

            {/* Alignment Report — HR only */}
            {isHR && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="rounded-[28px] p-7 text-white"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--blue))" }}>
                <div className="flex items-center gap-3 mb-3">
                  <BarChart2 className="w-5 h-5" style={{ color: "rgba(255,255,255,0.8)" }} />
                  <h4 className="font-black text-lg">Alignment Report</h4>
                </div>
                <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.75)" }}>
                  94% of departmental goals align with the 2026 North Star.
                </p>
                <div className="h-1.5 rounded-full my-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                  <div className="h-full rounded-full bg-white" style={{ width: "94%" }} />
                </div>
                <button className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  style={{ background: "white", color: "var(--blue)" }}>
                  <Download className="w-3.5 h-3.5" /> Download Audit
                </button>
              </motion.div>
            )}

            {/* Team Progress — Manager only */}
            {isManager && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="rounded-[28px] p-7"
                style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <Users className="w-5 h-5" style={{ color: "var(--blue)" }} />
                  <h4 className="font-black text-sm" style={{ color: "var(--t1)" }}>Team Progress</h4>
                </div>
                {TEAM_MEMBERS.slice(0, 3).map((m, i) => (
                  <div key={m.name} className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0"
                      style={{ background: ["var(--accent)", "var(--blue)", "var(--green)"][i] }}>
                      {m.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <p className="text-[10px] font-bold truncate" style={{ color: "var(--t2)" }}>{m.name}</p>
                        <p className="text-[9px] font-bold" style={{ color: "var(--t4)" }}>{[72, 85, 60][i]}%</p>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                        <div className="h-full rounded-full" style={{
                          width:      `${[72, 85, 60][i]}%`,
                          background: ["var(--accent)", "var(--blue)", "var(--green)"][i],
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider mt-2 transition-all"
                  style={{ background: "var(--surface-2)", color: "var(--t3)", border: "1px solid var(--b1)" }}>
                  View All Team Goals
                </button>
              </motion.div>
            )}

            {/* My Progress — Employee only */}
            {isEmployee && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="rounded-[28px] p-7"
                style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-sm)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <Target className="w-5 h-5" style={{ color: "var(--green)" }} />
                  <h4 className="font-black text-sm" style={{ color: "var(--t1)" }}>My Progress</h4>
                </div>
                <div className="text-center py-4">
                  <div className="text-4xl font-black mb-1" style={{ color: "var(--green)" }}>{avgProgress}%</div>
                  <p className="text-xs font-semibold" style={{ color: "var(--t4)" }}>Avg goal completion</p>
                </div>
                <div className="h-2 rounded-full overflow-hidden mt-4" style={{ background: "var(--surface-3)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "var(--green)" }}
                    initial={{ width: 0 }} animate={{ width: `${avgProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }} />
                </div>
                <p className="text-[10px] font-semibold mt-3 text-center" style={{ color: "var(--t4)" }}>
                  {totalWeightage}% weightage assigned
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}