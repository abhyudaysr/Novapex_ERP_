"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Lock, Mail, ArrowRight, Loader2, Sparkles, ShieldAlert,
  Eye, EyeOff, CheckCircle2, AlertTriangle, ShieldCheck,
  KeyRound, Wifi, X, Building2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast, Toaster } from "sonner"

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:          "#020914",
  blue:        "#1d6af5",
  blueMid:     "#3b82f6",
  blueGlow:    "rgba(29,106,245,0.38)",
  bluePale:    "rgba(29,106,245,0.12)",
  teal:        "#2dd4bf",
  tealGlow:    "rgba(45,212,191,0.20)",
  indigo:      "#6366f1",
  green:       "#10d98c",
  red:         "#f43f5e",
  // atmosphere
  atm1:        "rgba(29,106,245,0.20)",
  atm2:        "rgba(45,212,191,0.10)",
  atm3:        "rgba(99,102,241,0.09)",
  atm4:        "rgba(29,106,245,0.10)",
  // card
  card:        "rgba(2, 12, 38, 0.55)",
  cardBorder:  "rgba(59,130,246,0.20)",
  // inputs
  inputBg:     "rgba(255,255,255,0.04)",
  inputBorder: "rgba(59,130,246,0.18)",
  inputFocus:  "rgba(29,106,245,0.10)",
  // text — high contrast so readable in both themes
  textHi:      "#e8f0ff",
  textMid:     "#4a6080",
  textLo:      "#1a2840",
  textTeal:    "#5eead4",
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD STRENGTH
// ─────────────────────────────────────────────────────────────────────────────
function getPasswordStrength(pw: string): number {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 6)  s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const STRENGTH: Record<number, { label: string; color: string }> = {
  1: { label: "Weak",   color: C.red    },
  2: { label: "Fair",   color: "#f59e0b"},
  3: { label: "Good",   color: C.green  },
  4: { label: "Strong", color: C.teal   },
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL-CANVAS ATMOSPHERE
// ─────────────────────────────────────────────────────────────────────────────
function Atmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
      <motion.div className="absolute rounded-full"
        style={{ width: 900, height: 900, left: "-20%", top: "-20%", background: `radial-gradient(circle, ${C.atm1} 0%, transparent 62%)`, filter: "blur(70px)" }}
        animate={{ scale: [1, 1.07, 1], x: [0, 25, 0] }} transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute rounded-full"
        style={{ width: 700, height: 700, right: "-8%", top: "-5%", background: `radial-gradient(circle, ${C.atm2} 0%, transparent 62%)`, filter: "blur(80px)" }}
        animate={{ scale: [1, 1.10, 1], y: [0, -25, 0] }} transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 5 }} />
      <motion.div className="absolute rounded-full"
        style={{ width: 600, height: 600, left: "-5%", bottom: "-10%", background: `radial-gradient(circle, ${C.atm3} 0%, transparent 62%)`, filter: "blur(90px)" }}
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 27, repeat: Infinity, ease: "easeInOut", delay: 9 }} />
      <motion.div className="absolute rounded-full"
        style={{ width: 600, height: 600, right: "5%", bottom: "-5%", background: `radial-gradient(circle, ${C.atm4} 0%, transparent 62%)`, filter: "blur(75px)" }}
        animate={{ scale: [1, 1.12, 1], x: [0, -20, 0] }} transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 7 }} />
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, rgba(59,130,246,0.09) 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
      <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(0deg, rgba(45,212,191,0.007) 0px, rgba(45,212,191,0.007) 1px, transparent 1px, transparent 4px)` }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSPECTIVE GRID
// ─────────────────────────────────────────────────────────────────────────────
function PerspectiveGrid() {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none" style={{ height: "45%", zIndex: 1, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, perspective: "600px", perspectiveOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(63deg)", transformOrigin: "bottom center" }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${(i / 19) * 100}%`, width: "1px", background: `linear-gradient(to bottom, transparent, rgba(29,106,245,${i === 9 || i === 10 ? "0.18" : "0.07"}))` }} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: `${(i / 11) * 100}%`, height: "1px", background: `rgba(29,106,245,${(0.04 + i * 0.022).toFixed(3)})` }} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${C.bg} 0%, transparent 45%)` }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLES — client-only
// ─────────────────────────────────────────────────────────────────────────────
type Pt = { id: number; x: number; dur: number; delay: number; size: number; col: string }
function Particles() {
  const [pts, setPts] = useState<Pt[]>([])
  useEffect(() => {
    setPts(Array.from({ length: 26 }, (_, i) => ({
      id: i, x: 2 + Math.random() * 96,
      dur: 12 + Math.random() * 16, delay: Math.random() * 14,
      size: Math.random() > 0.72 ? 3 : 2,
      col: Math.random() > 0.55 ? C.blue : C.teal,
    })))
  }, [])
  if (!pts.length) return null
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{ zIndex: 1 }}>
      {pts.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, bottom: 0, background: p.col, boxShadow: `0 0 ${p.size * 4}px ${p.col}` }}
          animate={{ y: [0, -800], opacity: [0, 0.75, 0.6, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WIREFRAME SPHERE
// ─────────────────────────────────────────────────────────────────────────────
const RINGS = [
  [90,  0,  0,  28, 1,  C.blue,   0.50],
  [0,   0,  0,  22, -1, C.blue,   0.42],
  [45,  0,  0,  34, 1,  C.teal,   0.28],
  [135, 0,  0,  30, -1, C.teal,   0.22],
  [0,  45,  0,  40, 1,  C.indigo, 0.18],
  [0,  90,  0,  25, -1, C.blue,   0.36],
  [60,  0,  30, 38, 1,  C.teal,   0.20],
  [0,   60, 0,  42, -1, C.blue,   0.26],
  [120, 0,  0,  32, 1,  C.indigo, 0.14],
  [0,  120, 30, 45, -1, C.teal,   0.16],
  [30,  30, 0,  50, 1,  C.blue,   0.10],
  [75,  0,  45, 36, -1, C.indigo, 0.10],
] as const

const DOTS = [0, 72, 144, 216, 288].map((a, i) => ({
  angle: a, radius: 122,
  speed: 6 + i * 1.3,
  size:  i % 2 === 0 ? 5 : 3,
  color: i % 3 === 0 ? C.teal : i % 3 === 1 ? C.blue : C.indigo,
}))

function WireframeSphere() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 320, height: 320, background: `radial-gradient(circle, rgba(29,106,245,0.18) 0%, rgba(45,212,191,0.07) 45%, transparent 68%)`, filter: "blur(36px)" }}
        animate={{ scale: [1, 1.13, 1], opacity: [0.75, 1, 0.75] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      <div style={{ position: "absolute", width: 200, height: 200, perspective: "900px" }}>
        {RINGS.map(([rx, ry, rz, spd, dir, col, opa], i) => (
          <motion.div key={i} className="absolute inset-0"
            style={{ border: `1px solid ${col}`, opacity: opa as number, borderRadius: "50%", rotateX: rx as number, rotateY: ry as number, rotateZ: rz as number }}
            animate={{ rotateZ: [(rz as number), (rz as number) + 360 * (dir as number)] }}
            transition={{ duration: spd as number, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
      <motion.div className="absolute rounded-full z-10"
        style={{ width: 13, height: 13, background: `radial-gradient(circle, ${C.teal}, ${C.blue})`, boxShadow: `0 0 14px ${C.teal}, 0 0 30px ${C.blueGlow}` }}
        animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
      {DOTS.map((d, i) => (
        <motion.div key={i} className="absolute rounded-full z-10"
          style={{ width: d.size, height: d.size, background: d.color, boxShadow: `0 0 8px ${d.color}` }}
          animate={{
            x: Array.from({ length: 37 }, (_, k) => Math.cos(((d.angle + k * 10) * Math.PI) / 180) * d.radius),
            y: Array.from({ length: 37 }, (_, k) => Math.sin(((d.angle + k * 10) * Math.PI) / 180) * d.radius),
          }}
          transition={{ duration: d.speed, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT COUNT-UP
// ─────────────────────────────────────────────────────────────────────────────
function StatCount({ target }: { target: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let s: number | null = null
    const fn = (ts: number) => {
      if (!s) s = ts
      const p = Math.min((ts - s) / 1800, 1)
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(fn)
    }
    const t = setTimeout(() => requestAnimationFrame(fn), 700)
    return () => clearTimeout(t)
  }, [target])
  return <>{v.toLocaleString()}</>
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────
function TopBar({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div className="fixed top-0 left-0 right-0 h-[2px] overflow-hidden" style={{ zIndex: 9999 }}
          key="pb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 h-full"
            style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.teal})` }}
            initial={{ width: "0%" }} animate={{ width: "90%" }} transition={{ duration: 2.2, ease: "easeOut" }} />
          <motion.div className="absolute top-0 left-0 h-full w-20"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)" }}
            animate={{ x: ["-5rem", "110vw"] }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GLASS INPUT
// ─────────────────────────────────────────────────────────────────────────────
function GlassInput({
  id, label, type, value, onChange, placeholder, icon, right, inputRef, autoFocus, autoComplete, disabled,
}: {
  id: string; label: string; type: string; value: string; onChange: (v: string) => void
  placeholder: string; icon: React.ReactNode; right?: React.ReactNode
  inputRef?: React.Ref<HTMLInputElement>; autoFocus?: boolean; autoComplete?: string; disabled?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[9px] font-bold uppercase tracking-[0.35em] transition-colors duration-200"
        style={{ color: focused ? C.textTeal : C.textMid, fontFamily: "ui-monospace, monospace" }}>
        {label}
      </label>
      <div className="relative">
        <AnimatePresence>
          {focused && (
            <motion.div key="ring" className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ borderRadius: "14px", boxShadow: `0 0 0 1px ${C.blue}, 0 0 22px ${C.blueGlow}` }} />
          )}
        </AnimatePresence>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? C.teal : C.textMid }}>
          {icon}
        </div>
        <input id={id} ref={inputRef} type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} autoFocus={autoFocus} autoComplete={autoComplete} disabled={disabled}
          className="w-full pl-11 pr-11 py-3.5 text-sm font-medium outline-none transition-all duration-200"
          style={{
            background: disabled ? "rgba(255,255,255,0.02)" : focused ? C.inputFocus : C.inputBg,
            border: `1px solid ${focused ? C.blue : C.inputBorder}`,
            borderRadius: "14px",
            color: C.textHi,
            caretColor: C.teal,
            opacity: disabled ? 0.5 : 1,
          }}
          aria-label={label}
        />
        {right && <div className="absolute right-4 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY SUGGESTIONS — mock list, in production comes from API
// ─────────────────────────────────────────────────────────────────────────────
const KNOWN_COMPANIES = [
  "Novapex Systems",
  "Focus HR Demo",
  "TechCorp India",
  "Infosys",
  "Wipro",
  "HCL Technologies",
]

function CompanyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused]       = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const wrapRef = useRef<HTMLDivElement>(null)

  const handleChange = (val: string) => {
    onChange(val)
    setSuggestions(
      val.length > 0
        ? KNOWN_COMPANIES.filter(c => c.toLowerCase().includes(val.toLowerCase()))
        : []
    )
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setSuggestions([])
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="space-y-1.5" ref={wrapRef}>
      <label htmlFor="company-input" className="block text-[9px] font-bold uppercase tracking-[0.35em] transition-colors duration-200"
        style={{ color: focused ? C.textTeal : C.textMid, fontFamily: "ui-monospace, monospace" }}>
        Company
      </label>
      <div className="relative">
        {/* Focus ring */}
        <AnimatePresence>
          {focused && (
            <motion.div key="ring" className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ borderRadius: "14px", boxShadow: `0 0 0 1px ${C.blue}, 0 0 22px ${C.blueGlow}`, zIndex: 0 }} />
          )}
        </AnimatePresence>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 z-10"
          style={{ color: focused ? C.teal : C.textMid }}>
          <Building2 className="w-4 h-4" />
        </div>
        <input id="company-input" type="text" value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Enter your company name"
          autoComplete="organization"
          className="w-full pl-11 pr-4 py-3.5 text-sm font-medium outline-none transition-all duration-200"
          style={{
            background: focused ? C.inputFocus : C.inputBg,
            border: `1px solid ${focused ? C.blue : C.inputBorder}`,
            borderRadius: suggestions.length > 0 ? "14px 14px 0 0" : "14px",
            color: C.textHi,
            caretColor: C.teal,
            position: "relative",
            zIndex: 1,
          }}
          aria-label="Company name"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
        />
        {/* Suggestions dropdown */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.ul
              key="suggestions"
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="absolute left-0 right-0 overflow-hidden"
              style={{
                top: "100%",
                background: "rgba(4, 16, 48, 0.97)",
                border: `1px solid ${C.blue}`,
                borderTop: "none",
                borderRadius: "0 0 14px 14px",
                zIndex: 50,
                backdropFilter: "blur(20px)",
              }}
              role="listbox">
              {suggestions.map((s, i) => (
                <motion.li key={s}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all duration-150"
                  style={{ borderBottom: i < suggestions.length - 1 ? `1px solid rgba(59,130,246,0.10)` : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(29,106,245,0.12)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onMouseDown={() => { onChange(s); setSuggestions([]); setFocused(false) }}
                  role="option" aria-selected={value === s}>
                  <Building2 className="w-3 h-3 shrink-0" style={{ color: C.teal }} />
                  <span className="text-sm font-medium" style={{ color: C.textHi }}>{s}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function LoginPage() {

  // State
  const [email,        setEmail]        = useState("")
  const [password,     setPassword]     = useState("")
  const [company,      setCompany]      = useState("")   // ← NEW: company field
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe,   setRememberMe]   = useState(false)
  const [error,        setError]        = useState("")
  const [isLoggingIn,  setIsLoggingIn]  = useState(false)

  const router   = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)
  const [capsLockOn, setCapsLockOn] = useState(false)

  const isEmailValid  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const strengthScore = getPasswordStrength(password)

  useEffect(() => { emailRef.current?.focus() }, [])

  const detectCapsLock = useCallback((e: KeyboardEvent) => {
    if (e.getModifierState) setCapsLockOn(e.getModifierState("CapsLock"))
  }, [])
  useEffect(() => {
    window.addEventListener("keydown", detectCapsLock)
    window.addEventListener("keyup",   detectCapsLock)
    return () => { window.removeEventListener("keydown", detectCapsLock); window.removeEventListener("keyup", detectCapsLock) }
  }, [detectCapsLock])

  // ─── MULTI-TENANT SUBMIT ──────────────────────────────────────────────────
  // Sends { email, password, company } to the API.
  // The API uses `company` to:
  //   1. Look up the company record (get companyId, branding, settings)
  //   2. Validate the user BELONGS to that company
  //   3. Return companyId in session so every subsequent API call filters by it
  // ─────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email)    { setError("Email is required."); return }
    if (!password) { setError("Password is required."); return }
    if (!company)  { setError("Please enter your company name."); return }

    setError(""); setIsLoggingIn(true)

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, company }),   // ← company sent to API
      })
      const userData = await response.json()

      if (response.ok) {
        // Store company context in session — every other page reads this
        sessionStorage.setItem("userRole",    userData.role)
        sessionStorage.setItem("userName",    userData.name)
        sessionStorage.setItem("userEmail",   userData.email ?? email)
        sessionStorage.setItem("isLoggedIn",  "true")
        sessionStorage.setItem("companyId",   userData.companyId   ?? "")   // ← company ID
        sessionStorage.setItem("companyName", userData.companyName ?? company)
        sessionStorage.setItem("companyLogo", userData.companyLogo ?? "")

        if (rememberMe) {
          localStorage.setItem("rememberedEmail",   email)
          localStorage.setItem("rememberedCompany", company)
          localStorage.setItem("userEmail", userData.email ?? email)
        }

        setTimeout(() => router.push("/dashboard"), 800)
      } else {
        setError(userData.error || "Access denied — check your credentials and company name.")
        setIsLoggingIn(false)
      }
    } catch {
      setError("Connection error. Please try again.")
      setIsLoggingIn(false)
    }
  }

  // Pre-fill remembered email/company
  useEffect(() => {
    const re = localStorage.getItem("rememberedEmail")
    const rc = localStorage.getItem("rememberedCompany")
    if (re) setEmail(re)
    if (rc) setCompany(rc)
    if (re || rc) setRememberMe(true)
  }, [])

  const handleResetKey = () => toast("Password Reset Requested", {
    description: "Contact your company admin or IT department.",
    icon: <KeyRound className="w-4 h-4" style={{ color: C.teal }} />,
    duration: 4000,
    style: { background: "rgba(2,12,38,0.97)", color: C.textHi, border: `1px solid ${C.cardBorder}`, borderRadius: "16px" },
  })

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="bottom-center" />
      <TopBar active={isLoggingIn} />

      <div className="fixed inset-0 overflow-hidden" style={{ background: C.bg }}>
        <Atmosphere />
        <PerspectiveGrid />
        <Particles />

        <div className="relative w-full h-full flex items-center" style={{ zIndex: 2 }}>

          {/* ── LEFT PANEL — sphere + stats ──────────────────────────── */}
          <div className="hidden lg:flex flex-col items-start justify-between w-[52%] h-full px-14 py-12 overflow-hidden">

            {/* Brand */}
            <motion.div className="flex items-center gap-3"
              initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`, boxShadow: `0 0 22px ${C.blueGlow}` }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.45em]" style={{ color: C.textMid, fontFamily: "ui-monospace, monospace" }}>Enterprise OS</p>
                <p className="text-[17px] font-black tracking-tighter leading-tight" style={{ color: C.textHi }}>
                  Focus<span style={{ color: C.blue }}>.</span>HR
                </p>
              </div>
            </motion.div>

            {/* Sphere */}
            <div className="flex flex-col items-center w-full">
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
                <WireframeSphere />
              </motion.div>
              <motion.div className="text-center mt-6 space-y-3 max-w-sm"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h2 className="text-[38px] font-black tracking-tighter leading-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${C.textHi} 0%, #93c5fd 45%, ${C.teal} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Workforce<br />Intelligence
                </h2>
                <p className="text-sm font-medium leading-relaxed" style={{ color: C.textMid }}>
                  Next-gen HR OS. Real-time telemetry, autonomous operations, and unified identity at enterprise scale.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="relative flex w-2 h-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: C.green }} />
                    <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: C.green }} />
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-[0.35em]" style={{ color: C.green, fontFamily: "ui-monospace, monospace" }}>All Systems Operational</span>
                </div>
              </motion.div>
            </div>

            {/* Live stats */}
            <div className="w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${C.cardBorder})` }} />
                <p className="text-[8px] font-bold uppercase tracking-[0.35em]" style={{ color: C.textLo, fontFamily: "ui-monospace, monospace" }}>Live Telemetry</p>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${C.cardBorder})` }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Active Nodes",  val: 247,  unit: "online",  color: C.blue,   bar: 78 },
                  { label: "Auth / sec",    val: 1247, unit: "req/s",   color: C.teal,   bar: 65 },
                  { label: "Uptime",        val: 9994, unit: "/ 10k",   color: C.green,  bar: 99 },
                  { label: "Live Sessions", val: 4832, unit: "active",  color: C.indigo, bar: 54 },
                ].map((m, i) => (
                  <motion.div key={m.label}
                    initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.07, type: "spring", stiffness: 180 }}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: `1px solid rgba(59,130,246,0.12)`, backdropFilter: "blur(10px)" }}>
                    <div className="w-0.5 h-8 rounded-full shrink-0" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}70` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: C.textMid, fontFamily: "ui-monospace, monospace" }}>{m.label}</p>
                      <p className="text-base font-black tracking-tight leading-none" style={{ color: C.textHi }}>
                        <StatCount target={m.val} />
                        <span className="text-[9px] font-semibold ml-1" style={{ color: C.textMid }}>{m.unit}</span>
                      </p>
                      <div className="mt-1.5 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <motion.div className="h-full rounded-full" style={{ background: m.color }}
                          initial={{ width: 0 }} animate={{ width: `${m.bar}%` }}
                          transition={{ delay: 0.8 + i * 0.07, duration: 1.1, ease: "easeOut" }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-[8px] font-bold uppercase tracking-[0.25em] mt-5" style={{ color: C.textLo, fontFamily: "ui-monospace, monospace" }}>
                © 2025 Novapex Systems · v3.7.1
              </p>
            </div>
          </div>

          {/* ── RIGHT PANEL — form ───────────────────────────────────── */}
          <div className="flex-1 flex items-center justify-center px-6 py-10 h-full overflow-y-auto">
            <motion.div className="w-full max-w-[400px]"
              initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>

              {/* Mobile brand */}
              <motion.div className="flex items-center gap-3 mb-8 lg:hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`, boxShadow: `0 0 20px ${C.blueGlow}` }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter" style={{ color: C.textHi }}>
                  Focus<span style={{ color: C.blue }}>.</span>HR
                </span>
              </motion.div>

              {/* Glass card */}
              <motion.div
                style={{
                  background: C.card,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: "24px",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  boxShadow: `0 0 0 1px rgba(59,130,246,0.06), 0 40px 100px rgba(0,0,0,0.65), 0 0 60px rgba(29,106,245,0.10)`,
                  overflow: "visible",   // allow dropdown to overflow card
                  position: "relative",
                }}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}>

                {/* Top accent */}
                <motion.div className="absolute top-0 left-0 right-0 h-[1.5px] rounded-t-[24px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${C.blue} 25%, ${C.teal} 70%, transparent)` }}
                  initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.42 }} />

                {/* Corner glows inside card */}
                <div className="absolute top-0 right-0 w-52 h-52 pointer-events-none rounded-tr-[24px] overflow-hidden" aria-hidden="true"
                  style={{ background: `radial-gradient(circle at top right, rgba(45,212,191,0.07), transparent)` }} />
                <div className="absolute bottom-0 left-0 w-44 h-44 pointer-events-none rounded-bl-[24px] overflow-hidden" aria-hidden="true"
                  style={{ background: `radial-gradient(circle at bottom left, rgba(29,106,245,0.07), transparent)` }} />

                <div className="relative px-8 py-8 space-y-5">

                  {/* Header */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.45em] mb-1.5"
                          style={{ color: C.blue, fontFamily: "ui-monospace, monospace" }}>Identity Gateway</p>
                        <h1 className="text-[28px] font-black tracking-tighter leading-none" style={{ color: C.textHi }}>Sign In</h1>
                        <p className="text-[12px] font-medium mt-1.5" style={{ color: C.textMid }}>
                          Authenticate to access your workspace
                        </p>
                      </div>
                      <motion.div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shrink-0 mt-1"
                        style={{ background: `${C.green}0D`, border: `1px solid ${C.green}2A` }}
                        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                        <span className="relative flex w-1.5 h-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: C.green }} />
                          <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ background: C.green }} />
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: C.green, fontFamily: "ui-monospace, monospace" }}>Online</span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* ── FORM ── */}
                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30 }}>
                      <GlassInput id="email-input" label="Corporate Email" type="email"
                        value={email} onChange={setEmail} placeholder="you@company.com"
                        icon={<Mail className="w-4 h-4" />} inputRef={emailRef} autoFocus autoComplete="email"
                        right={
                          <AnimatePresence>
                            {isEmailValid && (
                              <motion.div key="t"
                                initial={{ opacity: 0, scale: 0.3, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.3 }} transition={{ type: "spring", stiffness: 500, damping: 22 }}>
                                <CheckCircle2 className="w-4 h-4" style={{ color: C.green }} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        }
                      />
                    </motion.div>

                    {/* Password */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
                      className="space-y-2">
                      <GlassInput id="pw-input" label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password} onChange={setPassword} placeholder="••••••••"
                        icon={<Lock className="w-4 h-4" />} autoComplete="current-password"
                        right={
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="transition-opacity hover:opacity-70" style={{ color: C.textMid }}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                      {/* CapsLock */}
                      <AnimatePresence>
                        {capsLockOn && (
                          <motion.div key="cap" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="text-[9px] font-bold text-amber-400" style={{ fontFamily: "ui-monospace, monospace" }}>Caps Lock is ON</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Strength meter */}
                      <AnimatePresence>
                        {password.length > 0 && (
                          <motion.div key="str" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-1.5">
                            <div className="flex gap-1.5">
                              {[1,2,3,4].map(b => (
                                <div key={b} className="h-0.5 flex-1 rounded-full"
                                  style={{
                                    background: strengthScore >= b ? (STRENGTH[strengthScore]?.color ?? C.textMid) : "rgba(255,255,255,0.06)",
                                    boxShadow: strengthScore >= b ? `0 0 6px ${STRENGTH[strengthScore]?.color}70` : "none",
                                    transition: "background 0.3s, box-shadow 0.3s",
                                  }} />
                              ))}
                            </div>
                            {strengthScore > 0 && (
                              <p className="text-[9px] font-black uppercase tracking-widest"
                                style={{ color: STRENGTH[strengthScore]?.color, fontFamily: "ui-monospace, monospace" }}>
                                {STRENGTH[strengthScore]?.label} password
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* ── COMPANY FIELD ── (the new multi-tenant field) */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                      style={{ position: "relative", zIndex: 10 }}>
                      <CompanyInput value={company} onChange={setCompany} />
                    </motion.div>

                    {/* Divider with label */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.46 }}
                      className="flex items-center gap-3">
                      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: C.textLo, fontFamily: "ui-monospace, monospace" }}>
                        Access options
                      </span>
                      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </motion.div>

                    {/* Remember + Reset */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}
                      className="flex items-center justify-between">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <div role="checkbox" aria-checked={rememberMe} tabIndex={0}
                          onClick={() => setRememberMe(!rememberMe)}
                          onKeyDown={e => e.key === " " && setRememberMe(v => !v)}
                          className="w-4 h-4 rounded-md flex items-center justify-center cursor-pointer outline-none transition-all"
                          style={{
                            background: rememberMe ? C.blue : C.inputBg,
                            border: `1px solid ${rememberMe ? C.blue : C.inputBorder}`,
                            boxShadow: rememberMe ? `0 0 10px ${C.blueGlow}` : "none",
                          }}>
                          {rememberMe && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 20 }}>
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: C.textMid }}>Remember me</span>
                      </label>
                      <button type="button" onClick={handleResetKey}
                        className="text-[11px] font-bold transition-opacity hover:opacity-70"
                        style={{ color: C.teal, fontFamily: "ui-monospace, monospace" }}>
                        Forgot Password?
                      </button>
                    </motion.div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div key="err" initial={{ opacity: 0, scale: 0.96, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                          style={{ background: `${C.red}0E`, border: `1px solid ${C.red}28` }}
                          role="alert" aria-live="assertive">
                          <ShieldAlert className="w-4 h-4 shrink-0" style={{ color: C.red }} />
                          <span className="text-xs font-semibold flex-1" style={{ color: "#fda4af" }}>{error}</span>
                          <button type="button" onClick={() => setError("")} style={{ color: C.textMid }}>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
                      <motion.button type="submit" disabled={isLoggingIn}
                        whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                        className="relative w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white overflow-hidden outline-none focus-visible:ring-4 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: `linear-gradient(135deg, ${C.blue} 0%, #2563eb 45%, ${C.teal} 100%)`,
                          boxShadow: isLoggingIn ? "none" : `0 8px 36px ${C.blueGlow}, 0 2px 8px rgba(0,0,0,0.4)`,
                          fontFamily: "ui-monospace, monospace",
                        }}>
                        {/* shimmer */}
                        <motion.span aria-hidden="true" className="absolute inset-0 pointer-events-none"
                          style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.14) 50%, transparent 65%)" }}
                          animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear", repeatDelay: 1.3 }} />
                        {!isLoggingIn && (
                          <motion.span aria-hidden="true" className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{ border: `1px solid ${C.teal}30` }}
                            animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2.2, repeat: Infinity }} />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          {isLoggingIn
                            ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying Identity…</span></>
                            : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                          }
                        </span>
                      </motion.button>
                    </motion.div>

                  </form>

                  {/* Security badges */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.60 }}
                    className="flex items-center justify-center gap-2.5"
                    style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: "1.25rem" }}>
                    {[
                      { icon: <ShieldCheck className="w-3 h-3" />, label: "TLS 1.3", color: C.blue  },
                      { icon: <Wifi        className="w-3 h-3" />, label: "E2E Enc", color: C.green },
                      { icon: <Lock        className="w-3 h-3" />, label: "SOC 2",   color: C.teal  },
                    ].map(b => (
                      <div key={b.label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                        style={{ background: `${b.color}0C`, border: `1px solid ${b.color}20` }}>
                        <span style={{ color: b.color }}>{b.icon}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: C.textMid, fontFamily: "ui-monospace, monospace" }}>{b.label}</span>
                      </div>
                    ))}
                  </motion.div>

                </div>
              </motion.div>

              {/* Node ID */}
              <motion.p className="text-center text-[8px] font-bold uppercase tracking-[0.3em] mt-3.5"
                style={{ color: C.textLo, fontFamily: "ui-monospace, monospace" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.80 }}>
                Multi-tenant · <span style={{ color: C.textMid }}>Company-isolated data</span>
                <span className="inline-flex items-center gap-1 ml-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-ping inline-flex" style={{ background: C.green, opacity: 0.75 }} />
                </span>
              </motion.p>

            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
