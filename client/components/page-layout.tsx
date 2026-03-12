"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Navigation } from "./navigation"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface PageLayoutProps {
  children: React.ReactNode
}

/* ─────────────────────────────────────────────────────────────────────────
   SCROLL REVEAL HOOK
   Watches all .reveal / .reveal-left / .reveal-right / .reveal-scale
   elements via IntersectionObserver and adds .visible when they enter
   the viewport. Works on every page without any per-page code.
───────────────────────────────────────────────────────────────────────── */
function useScrollReveal(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const selectors = [
      ".reveal",
      ".reveal-left",
      ".reveal-right",
      ".reveal-scale",
    ]
    const els = document.querySelectorAll<HTMLElement>(selectors.join(","))

    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            // Unobserve after reveal so it doesn't re-animate on scroll-up
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [enabled])
}

/* ─────────────────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
   Thin gradient line that fills across the top as the user scrolls.
───────────────────────────────────────────────────────────────────────── */
function useScrollProgress(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    // Create the bar element once
    const bar = document.createElement("div")
    bar.className = "scroll-progress"
    bar.style.width = "0%"
    document.body.appendChild(bar)

    const update = () => {
      const scrolled = window.scrollY
      const total =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? (scrolled / total) * 100 : 0
      bar.style.width = `${pct}%`
    }

    window.addEventListener("scroll", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      bar.remove()
    }
  }, [enabled])
}

function AmbientShell() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full blur-[110px] animate-breathe"
        style={{ background: "var(--accent-bg)" }}
      />
      <div
        className="absolute -right-24 top-1/3 h-[26rem] w-[26rem] rounded-full blur-[120px] animate-float-slow"
        style={{ background: "var(--blue-bg)" }}
      />
      <div
        className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full blur-[130px]"
        style={{ background: "var(--coral-bg)" }}
      />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent) 0.7px, transparent 0.7px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   PAGE LAYOUT
───────────────────────────────────────────────────────────────────────── */
export function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const previousPath = useRef(pathname)
  const frameRef = useRef<HTMLDivElement | null>(null)

  // Auth pages manage their own full-screen layout internally.
  // Login uses fixed inset-0 and handles its own background.
  const isAuthPage =
    pathname === "/Login" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/"

  // Activate global scroll effects on non-auth pages
  useScrollReveal(!isAuthPage)
  useScrollProgress(!isAuthPage)

  useEffect(() => {
    if (isAuthPage) return

    const hasSessionAuth = sessionStorage.getItem("isLoggedIn") === "true"
    const hasLegacyAuth = localStorage.getItem("isLoggedIn") === "true"

    if (!hasSessionAuth && !hasLegacyAuth) {
      router.replace("/Login")
    }
  }, [isAuthPage, router])

  useEffect(() => {
    if (isAuthPage) return

    const frame = frameRef.current
    if (!frame) return

    let raf = 0
    const setFrame = (rx: number, ry: number) => {
      frame.style.setProperty("--frame-rx", `${rx.toFixed(2)}deg`)
      frame.style.setProperty("--frame-ry", `${ry.toFixed(2)}deg`)
    }

    const onMove = (event: MouseEvent) => {
      const rect = frame.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      const targetRx = (0.5 - py) * 3.8
      const targetRy = (px - 0.5) * 4.2

      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setFrame(targetRx, targetRy))
    }

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf)
      setFrame(0, 0)
    }

    const onScroll = () => {
      const shift = Math.min(window.scrollY * 0.012, 14)
      frame.style.setProperty("--frame-shift", `${shift.toFixed(2)}px`)
    }

    frame.addEventListener("mousemove", onMove)
    frame.addEventListener("mouseleave", onLeave)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      frame.removeEventListener("mousemove", onMove)
      frame.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isAuthPage, pathname])

  if (isAuthPage) {
    return <>{children}</>
  }

  const routeChanged = previousPath.current !== pathname
  if (routeChanged) {
    previousPath.current = pathname
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: "var(--surface-0)",
        color:            "var(--t1)",
        transition:       "background-color 0.35s cubic-bezier(0.4,0,0.2,1), color 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <AmbientShell />
      <Navigation />

      {/*
        pt-28 clears the floating nav pill (~64px pill + 16px top gap).
        animate-fade-up gives the Image 1/2 "page slides in from below" feel.
      */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
          transition={{ duration: routeChanged ? 0.28 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="container relative z-10 mx-auto px-6 pt-28 pb-20"
          style={{ maxWidth: "1400px" }}
        >
          <div ref={frameRef} className="workspace-frame p-1.5 md:p-2.5">
            {children}
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
