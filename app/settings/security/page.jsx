"use client"

import { useState } from "react"
import { 
  ArrowLeft, Shield, Key, Lock, Fingerprint, 
  ShieldCheck, AlertTriangle, History, Info, Save
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SecuritySettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const securityLogs = [
    { action: "Password changed", user: "Admin", time: "2 hours ago", status: "success" },
    { action: "Failed login attempt", user: "Unknown", time: "1 day ago", status: "warning" },
    { action: "2FA enabled", user: "Sarah Johnson", time: "2 days ago", status: "success" },
    { action: "Permission updated", user: "Admin", time: "3 days ago", status: "info" },
  ]

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link href="/settings" className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 hover:bg-slate-900 transition-all">
              <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
            </Link>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900">Security Vault</h1>
              <p className="text-slate-500 font-medium">Protect your data and manage access protocols.</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Protocols
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          <div className="xl:col-span-3 space-y-8">
            
            {/* Password Policy Card */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl text-slate-900">
                    <Key className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Password Requirements</h2>
                </div>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest">Active Policy</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Minimum Length</label>
                  <div className="relative">
                    <input type="number" defaultValue="12" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Characters</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Expiry Period</label>
                  <div className="relative">
                    <input type="number" defaultValue="90" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Days</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Must contain uppercase",
                  "Must contain numbers",
                  "Must contain symbols",
                  "Block common passwords"
                ].map((req, i) => (
                  <label key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-bold text-slate-700">{req}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Global MFA Toggle */}
            <section className="bg-slate-900 rounded-[32px] p-8 text-white overflow-hidden relative group">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-[24px] bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <Fingerprint className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight mb-2">Two-Factor Force</h2>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                      Mandate 2FA for every administrative and employee account. Highly recommended for remote-first organizations.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative w-20 h-10 rounded-full transition-all duration-300 flex items-center px-1 ${twoFactorEnabled ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}
                >
                  <motion.div 
                    animate={{ x: twoFactorEnabled ? 40 : 0 }}
                    className="w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center"
                  >
                    {twoFactorEnabled ? <ShieldCheck className="w-4 h-4 text-blue-600" /> : <Shield className="w-4 h-4 text-slate-400" />}
                  </motion.div>
                </button>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />
            </section>

            {/* Session Management */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Access Control</h2>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-[24px] border border-slate-100 gap-6">
                  <div className="flex gap-4">
                    <Info className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-black text-slate-900">Idle Session Timeout</h4>
                      <p className="text-xs text-slate-500 font-medium">Auto-logout users after inactivity.</p>
                    </div>
                  </div>
                  <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-blue-500 transition-all">
                    <option>15 Minutes</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>4 Hours</option>
                  </select>
                </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Security Score Widget */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm text-center">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Security Health</h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364" strokeDashoffset="54.6" className="text-emerald-500" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">85</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Excellent</span>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500 leading-relaxed px-2">Enable Login Alerts to reach 100% security coverage.</p>
            </div>

            {/* Real-time Audit Log */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Audit</h3>
                <History className="w-4 h-4 text-slate-300" />
              </div>
              <div className="space-y-4">
                {securityLogs.map((log, i) => (
                  <div key={i} className="group relative pl-4 border-l-2 border-slate-100 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-black text-slate-800">{log.action}</p>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${log.status === 'success' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400">{log.user}</span>
                      <span className="text-[10px] font-medium text-slate-400">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Widget */}
            <div className="bg-rose-50 rounded-[32px] p-6 border border-rose-100 flex gap-4">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="text-[11px] font-bold text-rose-700 leading-relaxed">
                3 Failed login attempts detected from a new IP in London. <Link href="#" className="underline decoration-rose-300">Review log</Link>.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}