"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ArrowRight, Clock, Target, BarChart, Zap, 
  Trophy, TrendingUp, PieChart, PlusCircle, 
  Megaphone, Briefcase 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const marketingCourses = [
  {
    id: 1,
    name: "Digital Marketing Essentials",
    code: "MKT101",
    duration: "7 Weeks",
    level: "Beginner",
    enrolledTeam: 12,
    budgetAllocated: "$1,200",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1562577308-9e66f0c65ce5?w=600&auto=format&fit=crop&q=60",
    details: "Covers SEO, SEM, content marketing, and social media advertising fundamentals.",
  },
  {
    id: 2,
    name: "Brand Management",
    code: "MKT201",
    duration: "9 Weeks",
    level: "Intermediate",
    enrolledTeam: 4,
    budgetAllocated: "$2,500",
    status: "Recommended",
    image: "https://images.unsplash.com/photo-1645658043538-fc2bb1702cfe?w=600&auto=format&fit=crop&q=60",
    details: "Understand brand positioning, identity creation, and storytelling strategies.",
  },
  {
    id: 3,
    name: "Marketing Analytics",
    code: "MKT301",
    duration: "8 Weeks",
    level: "Advanced",
    enrolledTeam: 2,
    budgetAllocated: "$3,000",
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=600&auto=format&fit=crop&q=60",
    details: "Leverage data to evaluate campaign performance and make strategic decisions.",
  },
]

export default function MarketingCoursesPage() {
  const [userRole, setUserRole] = useState("hr")

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  return (
    <main className="page-shell py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6"
        >
          <div className="text-left space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              {isHR ? "Talent Investment" : isManager ? "Campaign Readiness" : "Growth & Strategy"}
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900">
              Marketing <span className="text-blue-600">Catalyst</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
              {isHR ? "Optimizing the marketing department's learning budget and external certifications." : 
               isManager ? "Upskilling your team to meet Q3 performance benchmarks and ROI goals." : 
               "Master data-driven strategies and brand building to dominate the digital landscape."}
            </p>
          </div>

          <div className="flex gap-4">
             {isHR && (
               <Button className="bg-slate-900 text-white rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest">
                 <PieChart className="w-4 h-4 mr-2" /> Budget Audit
               </Button>
             )}
             {isManager && (
               <Button className="bg-blue-600 text-white rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100">
                 <PlusCircle className="w-4 h-4 mr-2" /> New Campaign Path
               </Button>
             )}
          </div>
        </motion.div>

        {/* Marketing KPI Bar - Employee Only */}
        {isEmployee && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { label: "Skills Gained", value: "12", icon: <TrendingUp className="text-emerald-500"/> },
              { label: "Badges Earned", value: "04", icon: <Trophy className="text-amber-500"/> },
              { label: "Campaign Impact", value: "+22%", icon: <Megaphone className="text-blue-500"/> }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Courses List */}
        <div className="space-y-6">
          {marketingCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="group flex flex-col md:flex-row bg-white/70 backdrop-blur-md rounded-[32px] overflow-hidden border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500">
                
                {/* Image Section */}
                <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md text-slate-900 font-black text-[10px] tracking-widest uppercase rounded-full px-3 py-1">
                      {course.code}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">
                        {course.name}
                      </h2>
                      <Link href={`/courses/marketing/${course.id}`} className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium mb-6">
                      {course.details}
                    </p>
                  </div>

                  {/* Role-Based Meta Data */}
                  <div className="flex flex-wrap items-center justify-between gap-6 mt-4 border-t border-slate-50 pt-6">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <Target className="w-4 h-4 text-rose-500" />
                        {course.level}
                      </div>
                      {isHR && (
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                          <Briefcase className="w-4 h-4 text-amber-500" />
                          {course.budgetAllocated} Budget
                        </div>
                      )}
                      {isManager && (
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                          <BarChart className="w-4 h-4 text-emerald-500" />
                          {course.enrolledTeam} Team Members
                        </div>
                      )}
                    </div>

                    {/* Personal Status - Employee only */}
                    {isEmployee && (
                      <div className="flex items-center gap-3">
                         {course.status === "Completed" ? (
                           <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-tighter">Certified</span>
                         ) : course.status === "In Progress" ? (
                           <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-tighter">Active</span>
                         ) : (
                           <button className="text-slate-400 font-black text-[10px] uppercase hover:text-blue-600">Start Journey +</button>
                         )}
                      </div>
                    )}

                    {/* Manager/HR Actions */}
                    {isManager && (
                      <button className="text-blue-600 font-black text-[10px] uppercase hover:underline">Assign to Campaign Group</button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
