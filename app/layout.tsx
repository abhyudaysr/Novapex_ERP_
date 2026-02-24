  import type React from "react"
  import type { Metadata } from "next"
  import { GeistSans } from "geist/font/sans"
  import { GeistMono } from "geist/font/mono"
  import { Analytics } from "@vercel/analytics/next"
  import { PageLayout } from "@/components/page-layout"
  import { Suspense } from "react"
  import { Sparkles } from "lucide-react"
  import "./globals.css"

  export const metadata: Metadata = {
    title: "NOVAPEX // Enterprise OS",
    description: "Next-generation ERP for autonomous workforce management",
    generator: "v0.app",
  }

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <html lang="en" className={`antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="font-sans bg-background text-slate-900 selection:bg-blue-500/10 selection:text-blue-600">
          <Suspense fallback={<LoadingState />}>
            <PageLayout>{children}</PageLayout>
          </Suspense>
          <Analytics />
        </body>
      </html>
    )
  }

  /**
   * Branded Loading State
   * Matches the core design language with a soft pulse and brand icon
   */
  function LoadingState() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="relative">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
          
          {/* Brand Icon */}
          <div className="relative w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center shadow-2xl">
            <Sparkles className="w-8 h-8 text-white animate-[spin_3s_linear_infinite]" />
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Initializing Terminal
          </p>
          <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-900 w-1/2 animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    )
  }