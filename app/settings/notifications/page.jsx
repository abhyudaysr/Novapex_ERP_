"use client"

import { useState } from "react"
import { 
  ArrowLeft, Bell, Mail, MessageSquare, Smartphone, 
  Volume2, ShieldAlert, Zap, Clock, CheckCircle2, AlertCircle 
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function NotificationSettingsPage() {
  const [channels, setChannels] = useState({
    email: true,
    push: true,
    sms: false
  })

  const [notificationTypes, setNotificationTypes] = useState([
    { id: "employee_updates", label: "Employee Updates", desc: "New hires, departures, and profile changes", enabled: true, icon: Zap },
    { id: "attendance_alerts", label: "Attendance Alerts", desc: "Late arrivals, absences, and overtime", enabled: true, icon: Clock },
    { id: "payroll_reminders", label: "Payroll Reminders", desc: "Processing and payment notifications", enabled: true, icon: MessageSquare },
    { id: "leave_requests", label: "Leave Requests", desc: "New requests and approval status", enabled: true, icon: Mail },
    { id: "system_updates", label: "System Updates", desc: "Maintenance and feature announcements", enabled: false, icon: ShieldAlert },
  ])

  const toggleType = (id) => {
    setNotificationTypes(types => 
      types.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t)
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <Link href="/settings" className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 hover:bg-slate-900 transition-all">
            <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Notifications</h1>
            <p className="text-slate-500 font-medium">Control how and when you receive alerts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main Controls */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Delivery Channels */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black tracking-tight">Delivery Channels</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'email', label: 'Email', icon: Mail, color: 'text-orange-500' },
                  { id: 'push', label: 'Push', icon: Bell, color: 'text-blue-500' },
                  { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-emerald-500' }
                ].map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setChannels(prev => ({ ...prev, [channel.id]: !prev[channel.id] }))}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 ${
                      channels[channel.id] ? "border-slate-900 bg-slate-900 text-white" : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                    }`}
                  >
                    <channel.icon className={`w-6 h-6 ${channels[channel.id] ? 'text-white' : channel.color}`} />
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold">{channel.label}</span>
                      <div className={`w-2 h-2 rounded-full ${channels[channel.id] ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-300'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Event Triggers */}
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Event Triggers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notificationTypes.map((type) => (
                  <div
                    key={type.id}
                    className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-start justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 p-2 rounded-xl ${type.enabled ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900">{type.label}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{type.desc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleType(type.id)}
                      className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${type.enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <motion.div 
                        animate={{ x: type.enabled ? 20 : 0 }} 
                        className="w-5 h-5 bg-white rounded-full shadow-sm" 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Quiet Hours */}
            <section className="bg-slate-900 rounded-[32px] p-8 text-white overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-black tracking-tight">Quiet Hours</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4 w-full">
                    <p className="text-slate-400 text-sm font-medium">Automatic "Do Not Disturb" mode. All non-emergency notifications will be batched for the morning.</p>
                    <div className="flex gap-4">
                       <div className="flex-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 block mb-2">From</label>
                          <input type="time" defaultValue="22:00" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-bold outline-none focus:border-blue-500" />
                       </div>
                       <div className="flex-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 block mb-2">Until</label>
                          <input type="time" defaultValue="07:00" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-bold outline-none focus:border-blue-500" />
                       </div>
                    </div>
                  </div>
                  <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                      <div className="absolute inset-4 rounded-full border-2 border-dashed border-blue-500/30 animate-spin-slow" />
                      <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Analytics */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Delivery Health</h3>
              <div className="space-y-6">
                {[
                  { label: "Delivered", value: "98%", icon: CheckCircle2, color: "text-emerald-500" },
                  { label: "Open Rate", value: "64%", icon: Zap, color: "text-blue-500" },
                  { label: "Bounced", value: "2%", icon: AlertCircle, color: "text-rose-500" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-sm font-bold text-slate-600">{stat.label}</span>
                    </div>
                    <span className="font-black text-slate-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Recent History</h3>
              <div className="space-y-4">
                {[
                  { msg: "Payroll processed", time: "2h ago", type: "success" },
                  { msg: "System maintenance", time: "5h ago", type: "info" },
                  { msg: "Failed login attempt", time: "1d ago", type: "alert" },
                ].map((item, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[13px] font-black text-slate-800 group-hover:text-blue-600 transition-colors">{item.msg}</p>
                      <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full w-1/3 rounded-full ${item.type === 'alert' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
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