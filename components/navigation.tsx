"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    items: [
      { name: "Overview", href: "/dashboard" },
      { name: "Analytics", href: "/dashboard/analytics" },
      { name: "Reports", href: "/dashboard/reports" },
    ],
  },
  {
    name: "Employees",
    items: [
      { name: "All Employees", href: "/employees" },
      { name: "Add Employee", href: "/employees/add" },
      { name: "Departments", href: "/employees/departments" },
      { name: "Profiles", href: "/employees/profiles" },
      { name: "Payroll", href: "/employees/payroll" },
    ],
  },
  {
    name: "Attendance",
    items: [
      { name: "Time Tracking", href: "/attendance/time-tracking" },
      { name: "Leave Requests", href: "/attendance/leave-requests" },
      { name: "Reports", href: "/attendance/reports" },
      { name: "Shift & Schedule", href: "/attendance/shift_shedule" },
    ],
  },
  {
    name: "Performance",
    items: [
      { name: "Reviews", href: "/performance/reviews" },
      { name: "Goals", href: "/performance/goals" },
      { name: "Feedback", href: "/performance/feedback" },
    ],
  },
  {
    name: "Courses",
    items: [
      { name: "Engineering", href: "/courses/engineering" },
      { name: "Marketing", href: "/courses/marketing" },
      { name: "Sales", href: "/courses/sales" },
      { name: "HR", href: "/courses/hr" },
    ]
  }
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Keeping your original localStorage logic
    const userName = localStorage.getItem("userName") || "User"
    const userRole = localStorage.getItem("userRole") || "Employee"
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (isLoggedIn) {
      setUser({ name: userName, role: userRole })
    }

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/Login")
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
  }

  // Helper to determine visibility without changing the navigationItems array
  const isVisible = (itemName: string) => {
    if (!user) return true; // Show everything if user state hasn't loaded to prevent "vanishing"
    const role = user.role.toLowerCase();

    // 1. Employee Restrictions
    if (role === "employee") {
      if (itemName === "Employees") return false;
      if (["Analytics", "Reports", "Reviews"].includes(itemName)) return false;
    }
    
    // 2. Manager Restrictions
    if (role === "manager") {
      if (["Payroll", "Add Employee"].includes(itemName)) return false;
    }

    return true;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <nav className={`w-full max-w-7xl transition-all duration-300 rounded-[24px] px-6 py-3 flex items-center justify-between ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl"
          : "bg-white/40 backdrop-blur-md border border-white/20"
      }`}>

        {/* Logo Section */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">
            Focus.<span className="text-primary">HR</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navigationItems.map((section) => {
            // Check if entire section should be hidden
            if (!isVisible(section.name)) return null;

            return (
              <DropdownMenu key={section.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-xl text-slate-600 font-semibold hover:text-primary hover:bg-primary/5 px-4 py-2 flex gap-1 items-center"
                  >
                    {section.name}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-2 rounded-2xl glass-card border-white/40 mt-2">
                  {section.items.map((item) => {
                    // Check if individual item should be hidden
                    if (!isVisible(item.name)) return null;

                    return (
                      <DropdownMenuItem key={item.name} asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer">
                        <Link href={item.href} className="w-full px-3 py-2 font-medium">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 pl-3 bg-white/50 border border-white/40 rounded-full hover:shadow-md transition-all">
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                  {user ? `${user.name} (${user.role})` : "Guest"}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user ? getInitials(user.name) : "U"}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl glass-card mt-2">
              <DropdownMenuItem className="rounded-xl gap-2 cursor-pointer font-medium">
                <User className="w-4 h-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="rounded-xl gap-2 cursor-pointer font-medium text-rose-500 focus:text-rose-500"
              >
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl bg-primary/10 text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-24 z-40 md:hidden glass-card p-6 rounded-[32px] shadow-2xl overflow-y-auto max-h-[80vh]"
          >
            <div className="space-y-6">
              {navigationItems.map((section) => {
                if (!isVisible(section.name)) return null;

                return (
                  <div key={section.name} className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{section.name}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {section.items.map((item) => {
                        if (!isVisible(item.name)) return null;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:bg-primary/10 hover:text-primary transition-all"
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}