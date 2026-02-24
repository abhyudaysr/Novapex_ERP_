"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ArrowRight, Clock, BookOpen, Layers, 
  Settings, Users, CheckCircle, PlayCircle, 
  Lock, BarChart 
} from "lucide-react"

const engineeringCourses = [
  {
    id: 1,
    name: "Introduction to Mechanical Engineering",
    code: "ENGR101",
    duration: "10 Weeks",
    level: "Beginner",
    enrolledCount: 124,
    status: "Enrolled", // For Employee view
    image: "https://plus.unsplash.com/premium_photo-1664910842853-0d643f6db30c?w=600&auto=format&fit=crop&q=60",
    details: "An introductory course covering the fundamentals of mechanical engineering, including mechanics, design principles, and practical applications.",
  },
  {
    id: 2,
    name: "Electrical Circuits and Systems",
    code: "ENGR201",
    duration: "12 Weeks",
    level: "Intermediate",
    enrolledCount: 89,
    status: "Completed",
    image: "https://plus.unsplash.com/premium_photo-1661960643553-ccfbf7d921f6?w=600&auto=format&fit=crop&q=60",
    details: "Understand the concepts of current, voltage, resistance, and system design with practical circuit analysis and simulations.",
  },
  {
    id: 3,
    name: "Thermodynamics",
    code: "ENGR202",
    duration: "8 Weeks",
    level: "Intermediate",
    enrolledCount: 56,
    status: "Available",
    image: "https://plus.unsplash.com/premium_photo-1750941684025-570cb67b21d6?w=600&auto=format&fit=crop&q=60",
    details: "Learn the laws of thermodynamics, heat transfer, and energy systems with real-world engineering applications.",
  },
  {
    id: 4,
    name: "Structural Analysis",
    code: "ENGR301",
    duration: "14 Weeks",
    level: "Advanced",
    enrolledCount: 34,
    status: "Locked",
    image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=600&auto=format&fit=crop&q=60",
    details: "Analyze the behavior of structures under various forces, focusing on stability, stress distribution, and failure mechanisms.",
  },
]

export default function EngineeringCoursesPage() {
  const [userRole, setUserRole] = useState("hr")

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Logic */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight text-slate-900">
              Engineering <span className="text-blue-600">Curriculum</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl">
              {isHR ? "Managing technical competency standards and license compliance." : 
               isManager ? "Analyzing department skill gaps and technical certification progress." : 
               "Your personalized technical development roadmap."}
            </p>
          </div>

          {/* Role-Specific Actions */}
          <div className="flex gap-3">
            {isHR && (
              <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                <Settings className="w-4 h-4" /> Manage Quotas
              </button>
            )}
            {isManager && (
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                <BarChart className="w-4 h-4" /> Team Skills Report
              </button>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          {engineeringCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group relative flex flex-col md:flex-row bg-white/70 backdrop-blur-md rounded-[32px] overflow-hidden border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500">
                
                {/* Left: Image Container */}
                <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 font-black border-none px-3 py-1">
                      {course.code}
                    </Badge>
                  </div>
                </div>

                {/* Right: Content Section */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight">
                        {course.name}
                      </h2>
                      
                      {/* Conditional Link Logic */}
                      {isEmployee && course.status === "Locked" ? (
                        <Lock className="w-6 h-6 text-slate-300" />
                      ) : (
                        <Link href={`/courses/engineering/${course.id}`}>
                          <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all cursor-pointer" />
                        </Link>
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium line-clamp-2 mb-6">
                      {course.details}
                    </p>
                  </div>

                  {/* Metadata & Role Features */}
                  <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-100">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <Layers className="w-4 h-4 text-emerald-500" />
                        {course.level}
                      </div>
                      
                      {/* HR/Manager Only Detail */}
                      {(isHR || isManager) && (
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                          <Users className="w-4 h-4 text-amber-500" />
                          {course.enrolledCount} Active
                        </div>
                      )}
                    </div>

                    {/* Employee Status Indicators */}
                    {isEmployee && (
                      <div className="flex items-center">
                        {course.status === "Completed" && (
                          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-tighter">
                            <CheckCircle className="w-4 h-4" /> Certified
                          </div>
                        )}
                        {course.status === "Enrolled" && (
                          <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-colors hover:bg-blue-600 hover:text-white">
                            <PlayCircle className="w-4 h-4" /> Resume Module
                          </button>
                        )}
                        {course.status === "Available" && (
                          <button className="text-slate-400 font-black text-[10px] uppercase hover:text-blue-600">
                            Enroll Now +
                          </button>
                        )}
                      </div>
                    )}

                    {/* Manager Specific Feedback */}
                    {isManager && (
                      <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">
                        Assign to Team
                      </button>
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

function Badge({ children, className }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}