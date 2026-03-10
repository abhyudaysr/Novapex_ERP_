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
      const isLoggedIn =
        sessionStorage.getItem("isLoggedIn") ||
        localStorage.getItem("isLoggedIn")
      
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
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: "var(--surface-0)" }}>
      <div className="relative group">
        {/* Outer Glow Effect */}
        <div
          className="absolute inset-0 blur-[60px] rounded-full transition-all duration-1000 group-hover:scale-110"
          style={{ background: "var(--accent-bg)" }}
        />
        
        {/* Brand Icon */}
        <div
          className="relative w-20 h-20 rounded-[28px] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--blue))",
            boxShadow: "var(--glow-accent)",
          }}
        >
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>

      <div className="mt-10 text-center space-y-2">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] italic" style={{ color: "var(--t1)" }}>
          NOVAPEX_OS
        </h2>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-1 h-1 rounded-full animate-ping" style={{ background: "var(--accent)" }} />
          <p className="text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300" style={{ color: "var(--t4)" }}>
            {status}
          </p>
        </div>
      </div>

      {/* Subtle Progress Rail */}
      <div className="absolute bottom-12 w-48 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
        <div
          className="h-full w-1/3 animate-[loading_2s_ease-in-out_infinite]"
          style={{ background: "linear-gradient(90deg, var(--accent), var(--blue))" }}
        />
      </div>
    </div>
  )
}
