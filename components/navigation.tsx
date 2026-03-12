"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard,
  Sun, Moon, Search, ArrowRight,
} from "lucide-react"

// ── NEW: Notification bell component ─────────────────────────────────────────
import { NotificationBell } from "@/components/notification-panel"

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH INDEX
// ─────────────────────────────────────────────────────────────────────────────
const SEARCH_ROUTES = [
  { title: "Dashboard Overview",  href: "/dashboard",                 category: "Dashboard",   roles: ["hr","manager","employee"], keywords: "home stats overview summary central" },
  { title: "Analytics",           href: "/dashboard/analytics",       category: "Dashboard",   roles: ["hr","manager"],            keywords: "metrics charts data analysis trends intelligence" },
  { title: "Reports Vault",       href: "/dashboard/reports",         category: "Dashboard",   roles: ["hr","manager"],            keywords: "export documents vault reports archive" },
  { title: "All Employees",       href: "/employees",                 category: "Employees",   roles: ["hr","manager"],            keywords: "staff team list people directory workforce" },
  { title: "Add Employee",        href: "/employees/add",             category: "Employees",   roles: ["hr"],                      keywords: "new hire onboard recruit add employee" },
  { title: "Departments",         href: "/employees/departments",     category: "Employees",   roles: ["hr","manager"],            keywords: "teams groups divisions departments structure" },
  { title: "My Profile",          href: "/employees/profiles",        category: "Employees",   roles: ["hr","manager","employee"], keywords: "profile personal info account my details" },
  { title: "Payroll",             href: "/employees/payroll",         category: "Employees",   roles: ["hr"],                      keywords: "salary pay compensation benefits payslip payroll" },
  { title: "Time Tracking",       href: "/attendance/time-tracking",  category: "Attendance",  roles: ["hr","manager","employee"], keywords: "clock hours timesheet punch in out time" },
  { title: "Leave Requests",      href: "/attendance/leave-requests", category: "Attendance",  roles: ["hr","manager","employee"], keywords: "leave vacation sick off request annual casual" },
  { title: "Attendance Reports",  href: "/attendance/reports",        category: "Attendance",  roles: ["hr","manager"],            keywords: "attendance report summary logs history" },
  { title: "Shift Schedule",      href: "/attendance/shift_shedule",  category: "Attendance",  roles: ["hr","manager","employee"], keywords: "shift roster schedule timetable rota" },
  { title: "Performance Reviews", href: "/performance/reviews",       category: "Performance", roles: ["hr","manager"],            keywords: "review appraisal evaluation grade score" },
  { title: "Goals & KPIs",        href: "/performance/goals",         category: "Performance", roles: ["hr","manager","employee"], keywords: "goals targets kpi objectives okr milestones" },
  { title: "Feedback",            href: "/performance/feedback",      category: "Performance", roles: ["hr","manager","employee"], keywords: "feedback 360 rating peer review comments" },
  { title: "Engineering Courses", href: "/courses/engineering",       category: "Courses",     roles: ["hr","manager","employee"], keywords: "engineering tech coding training learn development" },
  { title: "Marketing Courses",   href: "/courses/marketing",         category: "Courses",     roles: ["hr","manager","employee"], keywords: "marketing training courses learn campaigns" },
  { title: "Sales Courses",       href: "/courses/sales",             category: "Courses",     roles: ["hr","manager","employee"], keywords: "sales training courses learn pipeline" },
  { title: "HR Courses",          href: "/courses/hr",                category: "Courses",     roles: ["hr","manager","employee"], keywords: "hr human resources training learn compliance" },
  { title: "System Settings",     href: "/settings",                  category: "Settings",    roles: ["hr"],                      keywords: "config admin system settings configuration" },
  { title: "User Management",     href: "/settings/users",            category: "Settings",    roles: ["hr"],                      keywords: "users permissions roles access management" },
  { title: "Calendar & Events",   href: "/calendar",                  category: "Calendar",    roles: ["hr","manager","employee"], keywords: "calendar events schedule meetings planning" },
] as const

type SearchRoute = typeof SEARCH_ROUTES[number]

// ─────────────────────────────────────────────────────────────────────────────
// NAV STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────
const navigationItems = [
  {
    name: "Dashboard",
    items: [
      { name: "Overview",  href: "/dashboard"           },
      { name: "Analytics", href: "/dashboard/analytics"  },
      { name: "Reports",   href: "/dashboard/reports"    },
    ],
  },
  {
    name: "Employees",
    items: [
      { name: "All Employees", href: "/employees"             },
      { name: "Add Employee",  href: "/employees/add"         },
      { name: "Departments",   href: "/employees/departments"  },
      { name: "Profiles",      href: "/employees/profiles"    },
      { name: "Payroll",       href: "/employees/payroll"     },
    ],
  },
  {
    name: "Attendance",
    items: [
      { name: "Time Tracking",    href: "/attendance/time-tracking"  },
      { name: "Leave Requests",   href: "/attendance/leave-requests" },
      { name: "Reports",          href: "/attendance/reports"        },
      { name: "Shift & Schedule", href: "/attendance/shift_shedule"  },
    ],
  },
  {
    name: "Performance",
    items: [
      { name: "Reviews",  href: "/performance/reviews"  },
      { name: "Goals",    href: "/performance/goals"    },
      { name: "Feedback", href: "/performance/feedback" },
    ],
  },
  {
    name: "Courses",
    items: [
      { name: "Engineering", href: "/courses/engineering" },
      { name: "Marketing",   href: "/courses/marketing"   },
      { name: "Sales",       href: "/courses/sales"       },
      { name: "HR",          href: "/courses/hr"          },
    ],
  },
]

export function Navigation() {
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [user,        setUser]        = useState<{ name: string; role: string } | null>(null)
  const [mounted,     setMounted]     = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [companyLogo, setCompanyLogo] = useState<string>("")

  // ── Search ─────────────────────────────────────────────────────────────
  const [searchOpen,      setSearchOpen]      = useState(false)
  const [searchQuery,     setSearchQuery]     = useState("")
  const [searchResults,   setSearchResults]   = useState<SearchRoute[]>([])
  const [activeResultIdx, setActiveResultIdx] = useState(-1)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef     = useRef<HTMLInputElement>(null)

  const router              = useRouter()
  const pathname            = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const userName   = sessionStorage.getItem("userName")    || localStorage.getItem("userName")    || "User"
    const userRole   = sessionStorage.getItem("userRole")    || localStorage.getItem("userRole")    || "Employee"
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true" || localStorage.getItem("isLoggedIn") === "true"
    const company    = sessionStorage.getItem("companyName") || localStorage.getItem("companyName") || ""
    const logo       = sessionStorage.getItem("companyLogo") || localStorage.getItem("companyLogo") || ""

    if (isLoggedIn) setUser({ name: userName, role: userRole })
    setCompanyName(company)
    setCompanyLogo(logo)

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) closeSearch()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Search filter
  const getFilteredResults = useCallback((query: string): SearchRoute[] => {
    if (!query.trim() || !user) return []
    const role  = user.role.toLowerCase()
    const lower = query.toLowerCase()
    return SEARCH_ROUTES.filter(route => {
      if (!route.roles.includes(role as any)) return false
      return (
        route.title.toLowerCase().includes(lower) ||
        route.keywords.toLowerCase().includes(lower) ||
        route.category.toLowerCase().includes(lower)
      )
    }).slice(0, 8)
  }, [user])

  useEffect(() => {
    setSearchResults(getFilteredResults(searchQuery))
    setActiveResultIdx(-1)
  }, [searchQuery, getFilteredResults])

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
    setActiveResultIdx(-1)
  }

  const navigateToResult = (href: string) => {
    router.push(href)
    closeSearch()
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { closeSearch(); return }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveResultIdx(i => Math.min(i + 1, searchResults.length - 1)) }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveResultIdx(i => Math.max(i - 1, -1)) }
    if (e.key === "Enter" && activeResultIdx >= 0) navigateToResult(searchResults[activeResultIdx].href)
  }

  const groupedResults = searchResults.reduce<Record<string, SearchRoute[]>>((acc, r) => {
    acc[r.category] = [...(acc[r.category] || []), r]
    return acc
  }, {})

  const handleLogout = () => {
    const keys = ["isLoggedIn","userRole","userName","userEmail","companyId","companyName","companyLogo"]
    keys.forEach(k => { sessionStorage.removeItem(k); localStorage.removeItem(k) })
    router.push("/Login")
  }

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)

  const isVisible = (itemName: string) => {
    if (!user) return true
    const role = user.role.toLowerCase()
    if (role === "employee") {
      if (itemName === "Employees") return false
      if (["Analytics", "Reports", "Reviews"].includes(itemName)) return false
    }
    if (role === "manager") {
      if (["Payroll", "Add Employee"].includes(itemName)) return false
    }
    return true
  }

  const profileHref = user?.role?.toLowerCase() === "employee" ? "/employees/profiles" : "/settings/users"
  const isDark      = mounted ? theme === "dark" : false

  const pillStyle: React.CSSProperties = {
    background: scrolled
      ? isDark ? "rgba(10,10,24,0.95)" : "rgba(238,237,248,0.90)"
      : isDark ? "rgba(10,10,24,0.75)" : "rgba(238,237,248,0.72)",
    backdropFilter: "blur(20px) saturate(1.5)",
    WebkitBackdropFilter: "blur(20px) saturate(1.5)",
    border: "1px solid var(--b1)",
    boxShadow: scrolled ? "var(--sh-md)" : "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <nav
        className="w-full max-w-7xl transition-all duration-300 rounded-[24px] px-5 py-3 flex items-center justify-between gap-4"
        style={pillStyle}
      >
        {/* ── LOGO ──────────────────────────────────────────────── */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
          {companyLogo ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10 shadow-md shrink-0">
              <img src={companyLogo} alt={companyName || "Company"} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg shadow-lg group-hover:rotate-12 transition-transform shrink-0"
              style={{ background: "var(--accent)", boxShadow: "var(--glow-accent)" }}>
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
          )}
          <span className="text-xl font-bold tracking-tight hidden sm:block"
            style={{ color: "var(--t1)", letterSpacing: "-0.03em" }}>
            {companyName
              ? <span>{companyName}</span>
              : <>Focus<span style={{ color: "var(--accent)" }}>.</span>HR</>
            }
          </span>
        </Link>

        {/* ── DESKTOP NAV ───────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {navigationItems.map((section) => {
            if (!isVisible(section.name)) return null
            const isSectionActive = section.items.some(item => pathname.startsWith(item.href))
            return (
              <DropdownMenu key={section.name}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost"
                    className="rounded-xl font-semibold px-3.5 py-2 flex gap-1 items-center transition-colors text-sm"
                    style={{
                      color:      isSectionActive ? "var(--accent-t)" : "var(--t3)",
                      background: isSectionActive ? "var(--accent-bg)" : "transparent",
                    }}>
                    {section.name}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52 p-2 rounded-2xl mt-2"
                  style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-lg)" }}>
                  {section.items.map((item) => {
                    if (!isVisible(item.name)) return null
                    return (
                      <DropdownMenuItem key={item.name} asChild className="rounded-xl cursor-pointer">
                        <Link href={item.href}
                          className="w-full px-3 py-2 font-medium rounded-lg transition-colors text-sm"
                          style={{
                            color:      pathname === item.href ? "var(--accent-t)" : "var(--t2)",
                            background: pathname === item.href ? "var(--accent-bg)" : "transparent",
                          }}>
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}
        </div>

        {/* ── RIGHT CONTROLS ────────────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Global Search */}
          <div ref={searchContainerRef} className="relative hidden md:block">
            <AnimatePresence initial={false} mode="wait">
              {searchOpen ? (
                <motion.div key="expanded"
                  initial={{ width: 36, opacity: 0.5 }} animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 36, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="flex items-center rounded-xl overflow-visible"
                  style={{ background: "var(--surface-3)", border: "1px solid var(--b2)" }}>
                  <div className="p-2 shrink-0" style={{ color: "var(--t4)" }}>
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input ref={searchInputRef} value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search features..."
                    className="flex-1 bg-transparent text-sm outline-none pr-2 min-w-0"
                    style={{ color: "var(--t1)", caretColor: "var(--accent)", fontFamily: "var(--font-sans)" }}
                    autoFocus />
                  <button onClick={closeSearch} className="p-1.5 mr-1 rounded-lg transition-colors"
                    style={{ color: "var(--t4)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--t2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--t4)"}>
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ) : (
                <motion.button key="collapsed"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={openSearch}
                  className="p-2 rounded-xl transition-all hover:scale-105"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t3)" }}
                  aria-label="Search">
                  <Search className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Search results dropdown */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="absolute top-full mt-2 right-0 w-80 rounded-2xl overflow-hidden"
                  style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-xl)", zIndex: 100 }}>
                  {searchQuery.trim() === "" ? (
                    <div className="px-5 py-6 text-center">
                      <Search className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--b2)" }} />
                      <p className="text-xs font-semibold" style={{ color: "var(--t4)" }}>
                        Type to search pages, features & docs
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: "var(--t4)" }}>
                        Results are filtered to your role
                      </p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="px-5 py-6 text-center">
                      <p className="text-sm font-semibold" style={{ color: "var(--t3)" }}>
                        No results for "{searchQuery}"
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: "var(--t4)" }}>Try different keywords</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto py-2">
                      {Object.entries(groupedResults).map(([category, routes]) => (
                        <div key={category}>
                          <div className="px-4 pt-3 pb-1">
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em]"
                              style={{ color: "var(--t4)", fontFamily: "var(--font-mono)" }}>
                              {category}
                            </span>
                          </div>
                          {routes.map((route) => {
                            const globalIdx = searchResults.indexOf(route)
                            const isActive  = globalIdx === activeResultIdx
                            return (
                              <button key={route.href}
                                onClick={() => navigateToResult(route.href)}
                                onMouseEnter={() => setActiveResultIdx(globalIdx)}
                                className="w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors"
                                style={{
                                  background: isActive ? "var(--accent-bg)" : "transparent",
                                  color:      isActive ? "var(--accent-t)"  : "var(--t2)",
                                }}>
                                <div className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ background: isActive ? "var(--accent)" : "var(--b2)" }} />
                                <span className="text-sm font-medium flex-1">{route.title}</span>
                                {isActive && <ArrowRight className="w-3 h-3 shrink-0" style={{ color: "var(--accent)" }} />}
                              </button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── NOTIFICATION BELL — now functional ────────────────
              Replaced the old <Link><Bell /></Link> with NotificationBell.
              Clicking opens the slide panel; "View All Notifications"
              inside the panel links to /attendance/leave-requests.
          ─────────────────────────────────────────────────────── */}
          <NotificationBell userRole={user?.role?.toLowerCase() ?? "employee"} />

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl transition-all hover:scale-110"
              style={{ background: "var(--surface-2)", border: "1px solid var(--b1)", color: "var(--t3)" }}
              aria-label="Toggle theme">
              {isDark
                ? <Sun  className="w-4 h-4" style={{ color: "var(--amber)" }} />
                : <Moon className="w-4 h-4" style={{ color: "var(--blue)"  }} />
              }
            </button>
          )}

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 p-1 pl-3 rounded-full transition-all"
                style={{ background: "var(--surface-2)", border: "1px solid var(--b1)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-sm)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}>
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-semibold leading-tight" style={{ color: "var(--t2)" }}>
                    {user ? user.name : "Guest"}
                  </p>
                  {companyName && (
                    <p className="text-[9px] leading-tight" style={{ color: "var(--t4)" }}>{companyName}</p>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--blue))" }}>
                  {user ? getInitials(user.name) : "U"}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl mt-2"
              style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", boxShadow: "var(--sh-lg)" }}>
              <div className="px-3 py-2 mb-1" style={{ borderBottom: "1px solid var(--b1)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--t1)" }}>{user?.name}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
                  style={{ color: "var(--accent-t)" }}>{user?.role}</p>
              </div>
              <DropdownMenuItem asChild className="rounded-xl gap-2 cursor-pointer font-medium"
                style={{ color: "var(--t2)" }}>
                <Link href={profileHref}><User className="w-4 h-4" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}
                className="rounded-xl gap-2 cursor-pointer font-medium"
                style={{ color: "var(--red)" }}>
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-xl transition-colors"
            style={{ background: "var(--accent-bg)", color: "var(--accent-t)" }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed inset-x-4 top-24 z-40 md:hidden p-6 rounded-[32px] shadow-2xl overflow-y-auto max-h-[80vh]"
            style={{ background: "var(--surface-1)", border: "1px solid var(--b1)", backdropFilter: "blur(24px)", boxShadow: "var(--sh-lg)" }}>

            {/* Mobile search */}
            <div className="mb-6">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--b1)" }}>
                <Search className="w-4 h-4 shrink-0" style={{ color: "var(--t4)" }} />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--t1)", caretColor: "var(--accent)" }} />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 rounded-2xl overflow-hidden"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--b1)" }}>
                  {searchResults.map(r => (
                    <button key={r.href}
                      onClick={() => { navigateToResult(r.href); setMobileOpen(false) }}
                      className="w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3 transition-colors"
                      style={{ color: "var(--t2)", borderBottom: "1px solid var(--b1)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--accent-bg)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase"
                        style={{ background: "var(--surface-3)", color: "var(--t4)" }}>{r.category}</span>
                      {r.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {navigationItems.map((section) => {
                if (!isVisible(section.name)) return null
                return (
                  <div key={section.name} className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--t4)" }}>
                      {section.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {section.items.map((item) => {
                        if (!isVisible(item.name)) return null
                        return (
                          <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}
                            className="p-3 rounded-xl text-sm font-semibold transition-all"
                            style={{ background: "var(--surface-2)", color: "var(--t2)" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent-t)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--t2)"}>
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}