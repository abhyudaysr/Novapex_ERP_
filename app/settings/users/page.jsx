"use client"

import { useState } from "react"
import { 
  ArrowLeft, Users, Plus, Search, Filter, 
  MoreVertical, Shield, Mail, UserCheck, 
  UserPlus, ShieldAlert, Activity 
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const statColorClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  }

  const users = [
    { id: 1, name: "Sarah Johnson", email: "sarah@techcorp.com", role: "Admin", status: "Active", lastLogin: "2 hours ago", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, name: "Michael Chen", email: "michael@techcorp.com", role: "Manager", status: "Active", lastLogin: "1 day ago", avatar: "https://i.pravatar.cc/150?u=mike" },
    { id: 3, name: "Emily Rodriguez", email: "emily@techcorp.com", role: "Employee", status: "Active", lastLogin: "3 days ago", avatar: "https://i.pravatar.cc/150?u=emily" },
    { id: 4, name: "David Kim", email: "david@techcorp.com", role: "Employee", status: "Inactive", lastLogin: "Jan 10, 2024", avatar: "https://i.pravatar.cc/150?u=david" },
  ]

  const roles = ["Admin", "Manager", "Employee", "HR", "Finance"]

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="page-shell p-6 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link href="/settings" className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 hover:bg-slate-900 transition-all">
              <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
            </Link>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900">Directory</h1>
              <p className="text-slate-500 font-medium">Provision access and manage organizational roles.</p>
            </div>
          </div>
          <button className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all flex items-center gap-3 active:scale-95">
            <UserPlus className="w-4 h-4" />
            Provision New User
          </button>
        </header>

        {/* Quick Stats Glance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Workforce", val: "128", icon: Users, color: "blue" },
            { label: "Active Now", val: "42", icon: Activity, color: "emerald" },
            { label: "Privileged", val: "6", icon: ShieldAlert, color: "rose" },
            { label: "Invites", val: "12", icon: Mail, color: "amber" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.val}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statColorClasses[stat.color]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm mb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-50 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
              <Filter className="w-4 h-4" />
              Advanced
            </button>
          </div>
        </div>

        {/* User Data Grid */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Security Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Pulse</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode='popLayout'>
                {filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={user.id} 
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="" />
                          {user.status === "Active" && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{user.name}</p>
                          <p className="text-xs font-bold text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Shield className={`w-3.5 h-3.5 ${user.role === 'Admin' ? 'text-rose-500' : 'text-blue-500'}`} />
                        <span className="text-xs font-black uppercase tracking-tighter text-slate-700">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500 italic">
                      {user.lastLogin}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-white rounded-xl hover:shadow-sm transition-all text-slate-400 hover:text-slate-900">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <p className="font-black text-slate-900">No matching users found</p>
              <p className="text-xs text-slate-400 mt-1 font-bold">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
