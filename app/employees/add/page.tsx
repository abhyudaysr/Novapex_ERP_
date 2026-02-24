"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Briefcase, 
  DollarSign, 
  Calendar as CalendarIcon, 
  MapPin, 
  ShieldAlert, 
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Lock
} from "lucide-react"

export default function AddEmployeePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userRole, setUserRole] = useState("hr")
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
    startDate: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
  })

  useEffect(() => {
    const stored = sessionStorage.getItem("userRole")
    if (stored) setUserRole(stored.toLowerCase())
  }, [])

  const isHR = userRole === "hr"
  const isManager = userRole === "manager"
  const isEmployee = userRole === "employee"

  // Immediate redirect for Employees who shouldn't be here
  if (isEmployee) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center p-8">
        <div className="p-6 bg-rose-50 rounded-full mb-6">
          <ShieldAlert className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Access Restricted</h2>
        <p className="text-slate-500 mt-2 max-w-sm">You do not have the required administrative clearances to onboard new personnel.</p>
        <Button onClick={() => router.push('/employees')} className="mt-8 rounded-2xl px-8 py-6 bg-slate-900">Return to Directory</Button>
      </div>
    )
  }

  const departments = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Customer Support"]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    router.push("/employees")
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Onboard <span className="text-blue-600">Talent</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {isHR ? "Initialize a new secure employee profile." : "Adding new member to your direct team."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Section: Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" /> Identity
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Basic biometric and contact parameters required for communication.
            </p>
          </div>
          
          <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
            <CardContent className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-black uppercase tracking-widest text-slate-400">First Name</Label>
                  <Input
                    id="firstName"
                    className="rounded-xl border-slate-100 bg-slate-50/50 py-6"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="e.g. Alexander"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-black uppercase tracking-widest text-slate-400">Last Name</Label>
                  <Input
                    id="lastName"
                    className="rounded-xl border-slate-100 bg-slate-50/50 py-6"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="e.g. Mercer"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Professional Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="rounded-xl border-slate-100 bg-slate-50/50 py-6"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="mercer@novapex.corp"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Secure Line
                  </Label>
                  <Input
                    id="phone"
                    className="rounded-xl border-slate-100 bg-slate-50/50 py-6"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (202) 555-0142"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section: Employment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8 border-t border-slate-50">
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-500" /> Employment
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Define the organizational locus {isHR && "and financial parameters"} for this asset.
            </p>
          </div>

          <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
            <CardContent className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 py-6 h-auto font-medium">
                      <SelectValue placeholder="Select Dept" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-xs font-black uppercase tracking-widest text-slate-400">Position Title</Label>
                  <Input
                    id="position"
                    className="rounded-xl border-slate-100 bg-slate-50/50 py-6"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    placeholder="e.g. Senior Lead Architect"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ROLE PROTECTION: Salary only visible to HR */}
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Annual Compensation
                  </Label>
                  {isHR ? (
                    <Input
                      id="salary"
                      className="rounded-xl border-slate-100 bg-slate-50/50 py-6"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                      placeholder="120,000"
                    />
                  ) : (
                    <div className="h-14 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center px-4 gap-2 text-slate-400 text-xs font-bold">
                      <Lock className="w-4 h-4" /> Restricted to HR Personnel
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <CalendarIcon className="w-3 h-3" /> Effective Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="rounded-xl border-slate-100 bg-slate-50/50 py-6 h-auto block"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section: Crisis Proxy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8 border-t border-slate-50">
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Crisis Proxy
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Mandatory secondary contacts for emergency protocols.
            </p>
          </div>

          <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
            <CardContent className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact" className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Full Name</Label>
                  <Input
                    id="emergencyContact"
                    className="rounded-xl border-slate-100 bg-slate-50/50 py-6"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone" className="text-xs font-black uppercase tracking-widest text-slate-400">Emergency Line</Label>
                  <Input
                    id="emergencyPhone"
                    className="rounded-xl border-slate-100 bg-slate-50/50 py-6"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-center z-50">
          <div className="max-w-5xl w-full flex justify-end gap-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => router.back()}
              className="px-8 py-6 rounded-2xl font-bold text-slate-500 hover:text-slate-900 transition-all"
            >
              Discard Changes
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className={`px-10 py-6 rounded-2xl font-black transition-all shadow-xl flex items-center gap-2 ${
                isSubmitting ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
              }`}
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <><CheckCircle2 className="w-5 h-5" /> Finalize Onboarding</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}