"use client"

import type React from "react"
import { Navigation } from "./navigation"
import { usePathname } from "next/navigation"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/Login" || pathname === "/signup" || pathname === "/";

  return (
    <div className="min-h-screen">
      {!isAuthPage && <Navigation />}
      
      <main className={`flex flex-col ${
        isAuthPage 
          ? "items-center justify-center min-h-screen p-4" 
          : "container mx-auto px-6 pt-32 pb-10 animate-fade-up" // Added pt-32 (128px) for spacing
      }`}>
        <div className={isAuthPage ? "w-full max-w-md glass-card p-8 rounded-[32px]" : "w-full"}>
          {children}
        </div>
      </main>
    </div>
  )
}