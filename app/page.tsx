"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [status, setStatus] = useState("Authenticating...")

  useEffect(() => {
    // Artificial delay to prevent "flicker" and allow the system to feel robust
    const checkAuth = setTimeout(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      
      if (isLoggedIn === "true") {
        setStatus("Redirecting to Command Center...")
        router.replace("/dashboard")
      } else {
        setStatus("Redirecting to Portal...")
        // Directing to the capital "Login" folder as per your structure
        router.replace("/Login") 
      }
    }, 800)

    return () => clearTimeout(checkAuth)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="relative group">
        {/* Outer Glow Effect */}
        <div className="absolute inset-0 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000" />
        
        {/* Brand Icon */}
        <div className="relative w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center shadow-2xl shadow-slate-200">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>

      <div className="mt-10 text-center space-y-2">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-900 italic">
          NOVAPEX_OS
        </h2>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-opacity duration-300">
            {status}
          </p>
        </div>
      </div>

      {/* Subtle Progress Rail */}
      <div className="absolute bottom-12 w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-slate-900 w-1/3 animate-[loading_2s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}