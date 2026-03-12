"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const allowedPaths = ["/Login", "/signup"]
    // Changed localStorage to sessionStorage to ensure login is required after closing the app
    const isLoggedIn = typeof window !== "undefined" && sessionStorage.getItem("isLoggedIn")
    
    if (!isLoggedIn && !allowedPaths.includes(pathname)) {
      router.replace("/Login")
    }
  }, [pathname, router])

  return <>{children}</>
}