"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ArrowRight, Clock, Briefcase, TrendingUp, ShieldCheck, 
  Trophy, Target, DollarSign, Users2, FileSpreadsheet, 
  BarChart3 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const salesCourses = [
  {
    id: 1,
    name: "Sales Fundamentals",
    code: "SAL101",
    duration: "6 Weeks",
    level: "Beginner",
    avgWinRateBoost: "+12%",
    teamCompletion: 85,
    status: "Completed",
    image: "https://images.unsplash.com/photo-1678166010410-2c1c769712ba?w=600&auto=format&fit=crop&q=60",
    details: "Learn the basics of sales techniques, prospecting, and relationship management.",
  },
  {
    id: 2,
    name: "Advanced Negotiation Skills",
    code: "SAL201",
    duration: "10 Weeks",
    level: "Intermediate",
    avgWinRateBoost: "+24%",
    teamCompletion: 42,
    status: "In Progress",
    image: "https://plus.unsplash.com/premium_photo-1664201889896-6a42c19e953a?w=600&auto=format&fit=crop&q=60",
    details: "Master persuasion, objection handling, and closing deals with confidence.",
  },
  {
    id: 3,
    name: "CRM & Sales Analytics",
    code: "SAL301",
    duration: "8 Weeks",
    level: "Advanced",
    avgWinRateBoost: "+18%",
    teamCompletion: 15,
    status: "Locked",
    image: "https://images.unsplash.com/photo-1737690974141-c964afbdf986?w=600&auto=format&fit=crop&q=60",
    details: "Utilize CRM tools and data-driven analytics to boost sales performance.",
  },
]

export default function SalesCoursesPage() {
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" />
              {isHR ? "Human Capital ROI" : isManager ? "Pipeline Acceleration" : "Revenue Excellence"}
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900">
              Sales <span className="text-blue-600">Mastery</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
              {isHR ? "Managing sales incentive certifications and department-wide competency tracking." : 
               isManager ? "Identifying high-potential closers and coaching team negotiation gaps." : 
               "Equip yourself with the tactics to shorten sales cycles and crush your quarterly quota."}
            </p>
          </div>

          <div className="flex gap-3">
            {isHR && (
              <Button className="bg-slate-900 text-white rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-wider">
                <DollarSign className="w-4 h-4 mr-2" /> Incentive Rules
              </Button>
            )}
            {isManager && (
              <Button className="bg-blue-600 text-white rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-wider shadow-lg shadow-blue-200">
                <BarChart3 className="w-4 h-4 mr-2" /> Win-Rate Report
              </Button>
            )}
          </div>
        </motion.div>

        {/* Sales Performance Metrics - Employee Only */}
        {isEmployee && (
           <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
           >
              {[
                { label: "Current Rank", val: "#4", icon: <Trophy className="text-amber-500 w-4 h-4"/> },
                { label: "Certifications", val: "02", icon: <ShieldCheck className="text-blue-500 w-4 h-4"/> },
                { label: "Win Rate", val: "68%", icon: <Target className="text-rose-500 w-4 h-4"/> },
                { label: "Team Avg", val: "62%", icon: <Users2 className="text-slate-400 w-4 h-4"/> },
              ].map((m, i) => (
                <div key={i} className="bg-white border border-white p-4 rounded-3xl shadow-sm flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{m.label}</span>
                    {m.icon}
                  </div>
                  <span className="text-xl font-black text-slate-900">{m.val}</span>
                </div>
              ))}
           </motion.div>
        )}

        {/* Courses List */}
        <div className="space-y-6">
          {salesCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group relative flex flex-col md:flex-row bg-white/70 backdrop-blur-md rounded-[32px] overflow-hidden border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500">
                
                {/* Image Section */}
                <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-slate-900/90 backdrop-blur-md text-white font-black text-[10px] tracking-widest uppercase rounded-full px-3 py-1">
                      {course.code}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight">
                        {course.name}
                      </h2>
                      <Link href={`/courses/sales/${course.id}`} className="p-2 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium mb-6">
                      {course.details}
                    </p>
                  </div>

                  {/* Role-Based Sales Data */}
                  <div className="flex flex-wrap items-center justify-between gap-6 mt-4 border-t border-slate-50 pt-6">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <Briefcase className="w-4 h-4 text-orange-500" />
                        {course.level}
                      </div>
                      {(isManager || isHR) && (
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                          <Target className="w-4 h-4 text-emerald-500" />
                          {course.avgWinRateBoost} ROI
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {isEmployee && (
                        <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${
                          course.status === "Completed" ? "bg-emerald-50 text-emerald-600" : 
                          course.status === "In Progress" ? "bg-blue-50 text-blue-600" : "text-slate-300"
                        }`}>
                          {course.status}
                        </span>
                      )}
                      {isManager && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                          <FileSpreadsheet className="w-4 h-4" /> {course.teamCompletion}% Completed
                        </div>
                      )}
                      {isHR && (
                        <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">
                          Audit Certification
                        </button>
                      )}
                    </div>
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
