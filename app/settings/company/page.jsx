"use client"

import { useState } from "react"
import { ArrowLeft, Building2, Upload, Save, MapPin, Phone, Mail, Globe, Briefcase, Users, Info } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CompanySettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [companyData, setCompanyData] = useState({
    name: "TechCorp Solutions",
    industry: "Technology",
    size: "100-500",
    address: "123 Business Ave, Tech City, TC 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@techcorp.com",
    website: "https://www.techcorp.com",
    description: "Leading technology solutions provider specializing in enterprise resource planning and cloud infrastructure.",
  })

  const handleSave = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const inputStyles = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
  const labelStyles = "block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link href="/settings" className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 hover:bg-slate-900 transition-all">
              <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
            </Link>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900">Company Profile</h1>
              <p className="text-slate-500 font-medium">Define your organization's core identity.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* Main Configuration Form */}
          <div className="xl:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12"
            >
              <form onSubmit={handleSave} className="space-y-10">
                
                {/* General Info Section */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">General Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className={labelStyles}>Organization Name</label>
                      <input
                        type="text"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                        className={inputStyles}
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>Industry Sector</label>
                      <select
                        value={companyData.industry}
                        onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                        className={inputStyles}
                      >
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Manufacturing">Manufacturing</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelStyles}>Team Size</label>
                      <select
                        value={companyData.size}
                        onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
                        className={inputStyles}
                      >
                        <option value="1-50">1-50 members</option>
                        <option value="51-200">51-200 members</option>
                        <option value="201-500">201-500 members</option>
                        <option value="500+">500+ members</option>
                      </select>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* Contact Section */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Contact & Location</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className={labelStyles}>Headquarters Address</label>
                      <textarea
                        value={companyData.address}
                        onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                        className={`${inputStyles} resize-none`}
                        rows="3"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="email"
                        value={companyData.email}
                        onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                        className={inputStyles}
                        placeholder="Contact Email"
                      />
                      <input
                        type="tel"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                        className={inputStyles}
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Commit Changes
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Sidebar / Identity View */}
          <aside className="space-y-8">
            {/* Branding Card */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm text-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Brand Identity</h3>
              <div className="relative group mx-auto w-32 h-32 mb-6">
                <div className="w-full h-full bg-slate-100 rounded-[32px] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                  <Building2 className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center shadow-lg hover:bg-slate-900 transition-colors">
                  <Upload className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-black text-slate-900 text-lg">{companyData.name}</h4>
              <p className="text-sm font-bold text-blue-600 mb-6">{companyData.industry}</p>
              
              <div className="pt-6 border-t border-slate-50 space-y-4 text-left">
                <div className="flex items-center gap-3 text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-300" />
                  <span className="text-[11px] font-bold truncate">{companyData.address}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Users className="w-4 h-4 text-slate-300" />
                  <span className="text-[11px] font-bold">{companyData.size} Employees</span>
                </div>
              </div>
            </div>

            

            {/* Platform Help */}
            <div className="bg-blue-600 rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <Info className="w-8 h-8 mb-4 opacity-50" />
                <h3 className="font-black text-xl mb-2">Internal Branding</h3>
                <p className="text-sm font-medium text-blue-100 leading-relaxed">
                  These details appear on generated invoices, employee offer letters, and the public company directory.
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  )
}