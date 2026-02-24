"use client"

import { useState } from "react"
import { 
  ArrowLeft, Database, Server, Zap, HardDrive, 
  Wifi, Shield, Activity, RefreshCw, Trash2, DownloadCloud 
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SystemSettingsPage() {
  const [autoBackup, setAutoBackup] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const systemMetrics = [
    { label: "CPU Usage", value: 45, status: "good", icon: Zap, color: "bg-blue-500" },
    { label: "Memory", value: 67, status: "warning", icon: HardDrive, color: "bg-amber-500" },
    { label: "Storage", value: 23, status: "good", icon: Database, color: "bg-emerald-500" },
    { label: "Latency", value: 12, status: "good", icon: Wifi, color: "bg-indigo-500", suffix: "ms" },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link href="/settings" className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 hover:bg-slate-900 transition-all">
              <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
            </Link>
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic">SYSTEM_OS</h1>
              <p className="text-slate-500 font-medium">Core infrastructure and server-side protocols.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">All Systems Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          <div className="xl:col-span-3 space-y-8">
            
            {/* Real-time Telemetry */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-900 rounded-xl text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">Live Telemetry</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2 text-slate-400">
                        <metric.icon className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{metric.label}</span>
                      </div>
                      <span className="text-lg font-black">{metric.value}{metric.suffix || '%'}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        className={`h-full rounded-full ${metric.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Database & Backups */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Database className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">Persistence Layer</h2>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 mb-1">Automated Snapshots</h3>
                    <p className="text-xs text-slate-500 font-medium">Capture binary backups of the entire database cluster daily.</p>
                  </div>
                  <button
                    onClick={() => setAutoBackup(!autoBackup)}
                    className={`relative w-16 h-8 rounded-full transition-colors flex items-center px-1 ${autoBackup ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <motion.div animate={{ x: autoBackup ? 32 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-md" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cycle Frequency</label>
                    <select className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer">
                      <option>Every 6 Hours</option>
                      <option>Daily (Midnight)</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Archive Retention</label>
                    <select className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer">
                      <option>Last 30 Days</option>
                      <option>Last 90 Days</option>
                      <option>1 Year (Glacier)</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* API & Maintenance */}
            <section className="bg-rose-50 rounded-[32px] p-8 border border-rose-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-rose-900">
                  <Shield className="w-5 h-5" />
                  <h2 className="text-xl font-black tracking-tight">Danger Zone</h2>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-rose-200 flex items-center justify-between gap-6">
                <div>
                  <h3 className="font-black text-rose-900">Maintenance Mode</h3>
                  <p className="text-xs text-rose-600 font-medium">Lock all public API endpoints and display a maintenance screen to users.</p>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-tighter transition-all ${
                    maintenanceMode ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                  }`}
                >
                  {maintenanceMode ? 'Disable' : 'Enable'}
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Versioning */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 text-center">Software Build</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-slate-400">Core Version</span>
                  <span className="text-xs font-black text-blue-400">v2.1.0-stable</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-slate-400">Environment</span>
                  <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-400">Uptime</span>
                  <span className="text-xs font-black">15d 4h 22m</span>
                </div>
              </div>
            </div>

            {/* Action Matrix */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Execution</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: "Run System Check", icon: RefreshCw, bg: "bg-blue-50", text: "text-blue-600" },
                  { label: "Manual Snapshot", icon: DownloadCloud, bg: "bg-emerald-50", text: "text-emerald-600" },
                  { label: "Flush Redis Cache", icon: Trash2, bg: "bg-amber-50", text: "text-amber-600" },
                  { label: "Hard Restart", icon: Server, bg: "bg-rose-50", text: "text-rose-600" },
                ].map((action, i) => (
                  <button key={i} className={`flex items-center gap-4 p-4 ${action.bg} rounded-2xl group hover:scale-[1.02] transition-all`}>
                    <action.icon className={`w-4 h-4 ${action.text} group-hover:rotate-180 transition-transform duration-500`} />
                    <span className={`text-xs font-black uppercase tracking-tighter ${action.text}`}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}