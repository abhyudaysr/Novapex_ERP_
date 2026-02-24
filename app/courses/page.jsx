"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowRight, BookOpen, Clock, BarChart3, Rocket, 
  GraduationCap, Award, CheckCircle, ShieldCheck, 
  PlusCircle, Users 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const coursesData = [
  {
    department: "Engineering",
    slug: "engineering",
    icon: <Rocket className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1650530415027-dc9199f473ec?q=80&w=1333&auto=format&fit=crop",
    courses: [
      {
        title: "Full Stack Web Development",
        description: "Learn modern web development using React, Node.js, and databases.",
        duration: "12 Weeks",
        level: "Intermediate",
        enrolled: 45
      },
      {
        title: "DevOps Fundamentals",
        description: "Introduction to CI/CD, Docker, Kubernetes, and cloud deployment.",
        duration: "8 Weeks",
        level: "Beginner",
        enrolled: 12
      },
    ],
  },
  {
    department: "Human Resources",
    slug: "hr",
    icon: <BookOpen className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1531535807748-218331acbcb4?q=80&w=1074&auto=format&fit=crop",
    courses: [
      {
        title: "HR Analytics",
        description: "Use data-driven approaches to improve HR decision-making.",
        duration: "6 Weeks",
        level: "Intermediate",
        enrolled: 8
      },
      {
        title: "Talent Acquisition Strategies",
        description: "Master recruitment, onboarding, and retention best practices.",
        duration: "4 Weeks",
        level: "Beginner",
        enrolled: 30
      },
    ],
  },
  {
    department: "Finance",
    slug: "finance",
    icon: <BarChart3 className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1170&auto=format&fit=crop",
    courses: [
      {
        title: "Corporate Finance Essentials",
        description: "Understand financial statements, budgeting, and forecasting.",
        duration: "10 Weeks",
        level: "Intermediate",
        enrolled: 15
      },
      {
        title: "Payroll Management",
        description: "Learn payroll processing, compliance, and reporting.",
        duration: "5 Weeks",
        level: "Beginner",
        enrolled: 22
      },
    ],
  },
  {
    department: "Management",
    slug: "management",
    icon: <Users className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1170&auto=format&fit=crop",
    courses: [
      {
        title: "Project Management (PMP)",
        description: "Comprehensive training for PMP certification.",
        duration: "14 Weeks",
        level: "Advanced",
        enrolled: 5
      },
      {
        title: "Leadership & Team Building",
        description: "Develop leadership skills and manage high-performing teams.",
        duration: "6 Weeks",
        level: "Intermediate",
        enrolled: 18
      },
    ],
  },
]

export default function CoursesPage() {
  const [userRole, setUserRole] = useState("hr")

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Hub Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20"
        >
          <div className="text-left">
            <div className="flex items-center gap-2 mb-4">
               <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 font-black text-[10px] uppercase">
                {userRole} Portal
               </Badge>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-4">
              Novapex <span className="text-blue-600">Academy</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
              {isHR ? "Managing organizational intellectual capital and compliance." : 
               isManager ? "Developing your team's specialized skillsets." : 
               "Your personalized journey to professional mastery."}
            </p>
          </div>

          <div className="flex gap-4">
            {isEmployee && (
              <Button className="h-14 px-8 rounded-2xl bg-slate-900 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-slate-200">
                <Award className="w-4 h-4 mr-2" /> My Certificates
              </Button>
            )}
            {isHR && (
              <Button className="h-14 px-8 rounded-2xl bg-blue-600 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-blue-200">
                <PlusCircle className="w-4 h-4 mr-2" /> Create Course
              </Button>
            )}
          </div>
        </motion.div>

        {/* Learner Progress Bar - Employee Only */}
        {isEmployee && (
           <Card className="mb-16 rounded-[32px] border-none bg-blue-600 p-8 text-white shadow-2xl shadow-blue-200 overflow-hidden relative">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic">Next Milestone</h2>
                    <p className="text-blue-100 font-medium">Complete DevOps Fundamentals to earn Junior Cloud Badge</p>
                  </div>
                </div>
                <div className="w-full md:w-64 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase italic">
                    <span>Course Progress</span>
                    <span>68%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[68%]" />
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-10">
                <GraduationCap size={300} />
              </div>
           </Card>
        )}

        {/* Department Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {coursesData.map((dept, deptIdx) => (
            <motion.div
              key={dept.department}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: deptIdx * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Image & Title Overlay */}
              <div className="relative w-full h-72">
                <Image
                  src={dept.image}
                  alt={dept.department}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-2 text-blue-400 mb-2 font-black uppercase tracking-widest text-xs">
                      {dept.icon}
                      {isHR ? "Compliance Hub" : "Department"}
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">
                      {dept.department}
                    </h2>
                  </div>
                  <Link 
                    href={`/courses/${dept.slug}`}
                    className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 shadow-lg"
                  >
                    {isHR ? "Audit" : "Explore"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Course Previews */}
              <div className="p-10 flex-1 bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-slate-300" /> 
                  {isManager ? "Assigned to Team" : "Available Programs"}
                </h3>
                <div className="grid gap-6">
                  {dept.courses.map((course, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-[24px] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all group/item"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-slate-800 group-hover/item:text-blue-600 transition-colors">
                          {course.title}
                        </h4>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                          {isHR && (
                             <span className="flex items-center gap-1 text-slate-500">
                               <Users className="w-3 h-3" /> {course.enrolled} Enrolled
                             </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" /> {course.duration}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className={`inline-block px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${
                          course.level === 'Advanced' ? 'bg-orange-100 text-orange-600' : 
                          course.level === 'Intermediate' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {course.level}
                        </span>
                        
                        {isManager ? (
                          <Button variant="ghost" className="text-blue-600 font-black text-[10px] uppercase p-0 h-auto hover:bg-transparent">
                            Assign to Member +
                          </Button>
                        ) : isEmployee ? (
                          <button className="text-slate-300 hover:text-emerald-500 transition-colors">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        ) : (
                           <ShieldCheck className="w-5 h-5 text-slate-200" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}