"use client"

import { useState } from "react"
import { 
  Settings, Building2, Users, Shield, 
  Bell, Database, Palette, ChevronRight, 
  Plus, History, Activity, Sparkles 
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const settingsCards = [
    {
      id: "company",
      title: "Organization",
      description: "Entity details, branding, and tax profiles.",
      icon: Building2,
      href: "/settings/company",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "users",
      title: "Workforce",
      description: "Manage users, roles, and access hierarchies.",
      icon: Users,
      href: "/settings/users",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: "security",
      title: "Security",
      description: "2FA, audit logs, and encryption policies.",
      icon: Shield,
      href: "/settings/security",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      id: "notifications",
      title: "Alerts",
      description: "Webhook triggers and email relay settings.",
      icon: Bell,
      href: "/settings/notifications",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: "system",
      title: "Infrastructure",
      description: "API keys, DB health, and server logs.",
      icon: Database,
      href: "/settings/system",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      id: "appearance",
      title: "Interface",
      description: "Theme engine, spacing, and custom CSS.",
      icon: Palette,
      href: "/settings/appearance",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <Settings className="w-7 h-7 animate-[spin_4s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic">CORE_SETTINGS</h1>
              <p className="text-slate-500 font-medium">Global configuration hub for Novapex ERP.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Enterprise Edition v2.1</span>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main Grid */}
          <div className="xl:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingsCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={card.href}
                    className="group block h-full bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden"
                  >
                    <div className={`${card.bg} ${card.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <card.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-2 flex items-center justify-between">
                      {card.title}
                      <ChevronRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-300" />
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {card.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom Quick-Action Panel */}
            <section className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-2 italic">Rapid Provisioning</h2>
                  <p className="text-slate-400 text-sm font-medium">Quickly execute administrative commands across the cluster.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "New User", icon: Plus, bg: "bg-white text-slate-900" },
                    { label: "Backup Now", icon: Database, bg: "bg-slate-800 text-white" },
                    { label: "View Audit Logs", icon: History, bg: "bg-slate-800 text-white" }
                  ].map((action, i) => (
                    <button key={i} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${action.bg}`}>
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Abstract Background Element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* System Pulse */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment Health</h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Core Services", status: "Operational", color: "text-emerald-500" },
                  { label: "Primary Database", status: "Healthy", color: "text-emerald-500" },
                  { label: "S3 Storage", status: "Connected", color: "text-emerald-500" },
                  { label: "Mail Server", status: "Degraded", color: "text-amber-500" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-xs font-bold text-slate-500">{item.label}</span>
                    <span className={`text-[10px] font-black uppercase ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Stream */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Audit Log</h3>
                <Activity className="w-4 h-4 text-slate-300" />
              </div>
              <div className="space-y-6">
                {[
                  { user: "Admin", action: "Updated API Keys", time: "12m ago" },
                  { user: "Sarah", action: "Changed Logo", time: "1h ago" },
                  { user: "System", action: "Auto-backup Success", time: "4h ago" },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1 h-8 bg-slate-100 rounded-full" />
                    <div>
                      <p className="text-xs font-black text-slate-900 leading-none mb-1">{log.action}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">By {log.user} • {log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}