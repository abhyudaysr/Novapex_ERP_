"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ArrowRight, Clock, Users, Award, 
  Edit3, BarChart2, CheckCircle2, 
  Plus, Eye, ShieldCheck 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const hrCourses = [
  {
    id: 1,
    name: "Human Resource Management Basics",
    code: "HR101",
    duration: "6 Weeks",
    level: "Beginner",
    completionRate: "94%",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=60",
    details: "Introduction to HR roles, employee lifecycle, policies, and compliance with labor laws.",
  },
  {
    id: 2,
    name: "Talent Acquisition and Recruitment",
    code: "HR201",
    duration: "8 Weeks",
    level: "Intermediate",
    completionRate: "78%",
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1573496130407-57329f01f769?w=600&auto=format&fit=crop&q=60",
    details: "Master recruitment strategies, onboarding processes, and modern hiring practices.",
  },
  {
    id: 3,
    name: "Performance Management",
    code: "HR202",
    duration: "5 Weeks",
    level: "Intermediate",
    completionRate: "62%",
    status: "Available",
    image: "https://media.istockphoto.com/id/1385097502/photo/shot-of-businessmen-shaking-hands-during-a-team-meeting-in-a-modern-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=ecCBrCxYAjHP3NjzCgZoNk6o9Q5MgU6dRNu1N7izh7k=",
    details: "Learn to design appraisal systems, feedback mechanisms, and performance tracking.",
  },
]

export default function HRCoursesPage() {
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
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6"
        >
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
              <ShieldCheck className="w-4 h-4" /> Professional Development
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900">
              HR <span className="text-blue-600">Specializations</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
              {isHR ? "Curating the standard for organizational excellence and compliance." : 
               isManager ? "Tracking people-management competencies across your leadership pipeline." : 
               "Building your career in strategic human capital management."}
            </p>
          </div>

          {isHR && (
            <Button className="bg-slate-900 hover:bg-blue-600 text-white rounded-2xl h-14 px-8 font-black transition-all shadow-xl shadow-slate-200">
              <Plus className="w-5 h-5 mr-2" /> Add Course
            </Button>
          )}
        </motion.div>

        {/* Courses List */}
        <div className="space-y-6">
          {hrCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group flex flex-col md:flex-row bg-white/70 backdrop-blur-md rounded-[32px] overflow-hidden border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500">
                
                {/* Image Section */}
                <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
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
                      <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight">
                        {course.name}
                      </h2>
                      <div className="flex gap-2">
                        {isHR && (
                          <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                            <Edit3 className="w-5 h-5" />
                          </button>
                        )}
                        <Link href={`/courses/hr/${course.id}`}>
                          <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
                        </Link>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium mb-6">
                      {course.details}
                    </p>
                  </div>

                  {/* Role-Specific Metrics / Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-50">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <Award className="w-4 h-4 text-emerald-500" />
                        {course.level}
                      </div>
                      {(isHR || isManager) && (
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                          <BarChart2 className="w-4 h-4 text-amber-500" />
                          {course.completionRate} Pass Rate
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {isEmployee && (
                        <>
                          {course.status === "Completed" ? (
                            <span className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase italic">
                              <CheckCircle2 className="w-4 h-4" /> Earned
                            </span>
                          ) : course.status === "In Progress" ? (
                            <button className="text-blue-600 font-black text-[10px] uppercase hover:underline">
                              Continue Learning
                            </button>
                          ) : (
                            <button className="text-slate-400 font-black text-[10px] uppercase hover:text-blue-600">
                              Enroll +
                            </button>
                          )}
                        </>
                      )}
                      {isManager && (
                        <button className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase transition-colors">
                          <Eye className="w-4 h-4" /> Team Progress
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