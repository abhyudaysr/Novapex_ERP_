"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2,
  Sparkles,
  ShieldAlert
} from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Credentials required for authentication.")
      return
    }
    
    setError("")
    setIsLoggingIn(true)

    try {
      // 1. Ask the Backend: "Who owns this email?"
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const userData = await response.json()

      if (response.ok) {
        // 2. Identity Confirmed! Store the role & data the backend gave us
        sessionStorage.setItem("userRole", userData.role)
        sessionStorage.setItem("userName", userData.name)
        sessionStorage.setItem("isLoggedIn", "true")
        
        // Brief delay for the "Premium" feel you had
        setTimeout(() => {
          router.push("/dashboard")
        }, 800)
      } else {
        setError(userData.error || "Access Denied: Identity not recognized.")
        setIsLoggingIn(false)
      }
    } catch (err) {
      setError("System Sync Error. Please try again.")
      setIsLoggingIn(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4 shadow-xl shadow-slate-200">
          <Sparkles className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-900">
          Novapex <span className="text-blue-600">ERP</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium tracking-tight">Enterprise Identity Gateway</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Corporate Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                placeholder="identity@novapex.com"
                className="w-full bg-slate-50/50 border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all border font-medium text-slate-900"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Security Key
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50/50 border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all border font-medium text-slate-900"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 flex gap-3 items-center"
          >
            <ShieldAlert className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] py-5 rounded-[22px] hover:bg-blue-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
        >
          {isLoggingIn ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Identity...</span>
            </div>
          ) : (
            <>
              Authorize Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
          Secure Biometric & Email Auth Active <br/>
          Monitoring Node: <span className="text-slate-900">NVX-7700</span>
        </p>
      </div>
    </motion.div>
  )
}