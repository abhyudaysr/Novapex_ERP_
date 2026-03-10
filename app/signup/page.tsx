"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignupPage() {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Security keys do not match.")
      setIsLoading(false)
      return
    }

    // Simulate Network Request
    setTimeout(() => {
      sessionStorage.setItem("isLoggedIn", "true")
      sessionStorage.setItem("userRole", "employee")
      sessionStorage.setItem("userName", formData.email.split("@")[0] || "New User")
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex overflow-hidden font-sans" style={{ background: "var(--surface-1)" }}>
      
      {/* Left Pane: Branding & Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 p-16 flex-col justify-between relative" style={{ background: "linear-gradient(145deg, #091627 0%, #111a30 60%, #131b2f 100%)" }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-white font-black tracking-tighter text-2xl italic">NOVAPEX_ERP</span>
          </div>
          
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-6">
            QUANTUM <br />CONTROL.
          </h1>
          <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
            The next generation of enterprise resource planning. Real-time insights, 
            autonomous workflows, and unparalleled security.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {[
            "Military-grade AES-256 Encryption",
            "Real-time cluster synchronization",
            "Zero-latency data processing"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-bold uppercase tracking-widest">{text}</span>
            </div>
          ))}
        </div>

        {/* Decorative background element */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-cyan-500/20 to-transparent pointer-events-none" />
      </div>

      {/* Right Pane: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16" style={{ background: "var(--surface-0)" }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tighter mb-2" style={{ color: "var(--t1)" }}>Create Account</h2>
            <p className="font-medium" style={{ color: "var(--t3)" }}>Join the network and start scaling your operations.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    required
                    className="w-full bg-white border border-slate-200 rounded-[20px] pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                    placeholder="name@company.com"
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    required
                    className="w-full bg-white border border-slate-200 rounded-[20px] pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">Validate Key</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    required
                    className="w-full bg-white border border-slate-200 rounded-[20px] pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <p className="text-xs font-black text-rose-600 uppercase tracking-tighter">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--blue))",
                boxShadow: "var(--glow-accent)",
              }}
            >
              {isLoading ? "Provisioning..." : "Initialize Account"}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-bold text-slate-500">
            Already authenticated?{" "}
            <Link href="/Login" className="text-blue-600 hover:underline">
              Enter Terminal
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
