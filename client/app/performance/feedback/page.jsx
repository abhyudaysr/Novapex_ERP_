"use client"

import { useState, useEffect } from "react"
import { 
  ArrowLeft, 
  Star, 
  Send, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  UserCircle2,
  Zap,
  ShieldCheck,
  BarChart3
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"

export default function FeedbackPage() {
  const [userRole, setUserRole] = useState("hr")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [feedbackType, setFeedbackType] = useState("peer")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole") || "hr"
    setUserRole(storedRole.toLowerCase())
    // Default feedback type based on role
    if (storedRole.toLowerCase() === "manager") setFeedbackType("direct")
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  const employees = [
    { id: 1, name: "Sarah Johnson", department: "Engineering", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, name: "Michael Chen", department: "Design", avatar: "https://i.pravatar.cc/150?u=mike" },
    { id: 3, name: "Emily Rodriguez", department: "Marketing", avatar: "https://i.pravatar.cc/150?u=emily" },
    { id: 4, name: "David Kim", department: "Sales", avatar: "https://i.pravatar.cc/150?u=david" },
  ]

  const recentFeedback = [
    { id: 1, from: "Sarah Johnson", to: "Michael Chen", type: "Peer Review", rating: 4.5, date: "2024-01-15", sentiment: "Positive" },
    { id: 2, from: "Emily Rodriguez", to: "David Kim", type: "360 Feedback", rating: 4.8, date: "2024-01-14", sentiment: "Positive" },
    { id: 3, from: "Michael Chen", to: "Sarah Johnson", type: "Project Feedback", rating: 4.2, date: "2024-01-13", sentiment: "Neutral" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setSelectedEmployee("")
      setRating(0)
    }, 3000)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/performance">
            <div className="p-4 bg-white shadow-sm border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </div>
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">
              {isHR ? "Feedback" : "360°"} <span className="text-blue-600">{isHR ? "Governance" : "Feedback"}</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {isHR ? "Monitor company-wide cultural alignment." : isManager ? "Coach your team through constructive insights." : "Exchange insights with your colleagues."}
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
            <div className="flex -space-x-3">
                {employees.map(e => (
                    <img key={e.id} src={e.avatar} className="w-10 h-10 rounded-full border-4 border-slate-50 shadow-sm" alt="team" />
                ))}
            </div>
            <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                  {isHR ? "System Integrity" : "Team Participation"}
                </p>
                <p className="text-lg font-black text-blue-600 leading-tight">
                  {isHR ? "100% Secure" : "84%"}
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Feedback Engine */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden"
          >
            <AnimatePresence>
                {isSuccess && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-10"
                    >
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[30px] flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">Feedback Transmitted</h3>
                        <p className="text-slate-500 mt-2 font-medium">Your insights have been shared securely.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MessageSquare className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isHR ? "Audit Feedback" : isManager ? "Managerial Review" : "Peer Insight"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Context Selector - Adjusted for Roles */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Feedback Context</label>
                <div className="grid grid-cols-3 gap-4">
                  {(isHR || isManager ? ["direct", "peer", "manager"] : ["peer", "manager"]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFeedbackType(type)}
                      className={`py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        feedbackType === type
                          ? "border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100"
                          : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      {type === "direct" ? "Direct Report" : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject of Review</label>
                <div className="relative group">
                    <UserCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[24px] outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700 appearance-none"
                        required
                    >
                        <option value="">{isManager ? "Select Direct Report..." : "Identify Team Member..."}</option>
                        {employees.map((e) => (
                        <option key={e.id} value={e.id}>{e.name} — {e.department}</option>
                        ))}
                    </select>
                </div>
              </div>

              {/* Rating Interface */}
              <div className="bg-slate-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h4 className="font-black text-lg">Performance Rating</h4>
                    <p className="text-slate-400 text-xs font-medium">Quantify their contribution this cycle.</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className={`p-1 transition-transform active:scale-90 ${
                        star <= (hoverRating || rating) ? "text-blue-400" : "text-white/10"
                      }`}
                    >
                      <Star className={`w-10 h-10 ${star <= (hoverRating || rating) ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensional Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[(isManager ? "Leadership" : "Collaboration"), "Technical Execution"].map((category) => (
                  <div key={category} className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{category}</label>
                    <textarea
                      className="w-full p-6 bg-slate-50 border-none rounded-[28px] outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-700 min-h-[140px]"
                      placeholder={`Qualitative notes on ${category.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedEmployee || rating === 0}
                className="w-full h-20 bg-slate-900 hover:bg-blue-600 text-white rounded-[28px] font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-20"
              >
                {isSubmitting ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                {isSubmitting ? "Syncing..." : "Submit Review"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
          {/* HR-Specific Analytics Card */}
          {isHR ? (
            <Card className="border-none bg-emerald-600 rounded-[40px] p-8 text-white shadow-xl shadow-emerald-200">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
                <h3 className="font-black text-xl tracking-tight">Compliance</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-emerald-100 font-bold text-sm">Review Coverage</span>
                  <span className="text-2xl font-black">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100 font-bold text-sm">Bias Detection</span>
                  <Badge className="bg-white/20 text-white border-none font-black text-[10px]">ACTIVE</Badge>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="border-none bg-blue-600 rounded-[40px] p-8 text-white shadow-xl shadow-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-blue-300" />
                <h3 className="font-black text-xl tracking-tight">{isManager ? "Team Sentiment" : "Your Impact"}</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-blue-100 font-bold text-sm">{isManager ? "Team Avg" : "Given"}</span>
                  <span className="text-2xl font-black">{isManager ? "4.6" : "12"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100 font-bold text-sm">Sentiment</span>
                  <Badge className="bg-white/20 text-white border-none font-black text-[10px]">POSITIVE</Badge>
                </div>
              </div>
            </Card>
          )}

          {/* Activity Log */}
          <div className="bg-white border border-slate-100 rounded-[40px] p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              {isHR ? <BarChart3 className="w-5 h-5 text-slate-400" /> : <TrendingUp className="w-5 h-5 text-slate-400" />}
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">
                {isHR ? "Global Feed" : isManager ? "Team Activity" : "Recent Exchanges"}
              </h3>
            </div>
            <div className="space-y-4">
              {recentFeedback.map((f) => (
                <div key={f.id} className="p-5 bg-slate-50 rounded-[24px] group hover:bg-slate-100 transition-colors cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{f.type}</span>
                    <Badge className={`border-none font-black text-[9px] ${f.sentiment === "Positive" ? "text-emerald-600" : "text-amber-600"}`}>
                      {f.sentiment}
                    </Badge>
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {isEmployee && f.from !== "Sarah Johnson" ? "Anonymous" : f.from} 
                    <span className="text-slate-400 mx-1">→</span> 
                    {f.to}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, className }) {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${className}`}>
      {children}
    </span>
  )
}