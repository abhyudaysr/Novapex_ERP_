import type React from "react"
import type { Metadata } from "next"
import { Sora, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { PageLayout } from "@/components/page-layout"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb-mono",
  display: "swap",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Focus.HR — Enterprise Workforce OS",
  description: "Next-generation HR platform for autonomous workforce management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      // Required by next-themes — prevents flash of wrong theme on first render
      suppressHydrationWarning
      // Custom font variables for modern typography across the design system.
      className={`antialiased ${sora.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body
        // CRITICAL: NO Tailwind bg/text classes here.
        // bg-white / text-slate-900 hardcode hex values and override CSS
        // variables, which prevents dark mode from ever applying.
        // Colour now flows exclusively from globals.css → html element.
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Suspense fallback={<LoadingState />}>
            <PageLayout>{children}</PageLayout>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   LOADING STATE
   Light: indigo spinner on lavender-white
   Dark:  purple glow spinner on near-black
   Adapts automatically from CSS variables — no hard-coded colours.
───────────────────────────────────────────────────────────────────────── */
function LoadingState() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-10"
      style={{ backgroundColor: "var(--surface-0)" }}
    >
      {/* Ambient blur behind spinner */}
      <div
        className="absolute w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--accent-bg) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Spinner ring */}
        <div className="relative w-[72px] h-[72px]">
          {/* Outer animated conic ring */}
          <div
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              background:
                "conic-gradient(var(--accent) 0%, var(--blue) 30%, var(--coral) 60%, transparent 100%)",
              padding: "2.5px",
              borderRadius: "50%",
            }}
          >
            {/* Mask inner circle to create ring shape */}
            <div
              className="w-full h-full rounded-full"
              style={{ background: "var(--surface-0)" }}
            />
          </div>

          {/* Inner branded icon */}
          <div
            className="absolute inset-[10px] rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--blue) 100%)",
              boxShadow: "var(--glow-accent)",
            }}
          >
            {/* Focus.HR wordmark icon (F) */}
            <span
              className="text-white font-bold text-xl leading-none select-none"
              style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.04em" }}
            >
              F
            </span>
          </div>
        </div>

        {/* Brand */}
        <div className="text-center flex flex-col gap-1">
          <h1
            className="text-2xl font-bold"
            style={{
              color:         "var(--t1)",
              letterSpacing: "-0.03em",
              fontFamily:    "var(--font-sans)",
            }}
          >
            Focus
            <span style={{ color: "var(--accent)" }}>.</span>
            HR
          </h1>
          <p
            style={{
              color:         "var(--t4)",
              fontSize:      "10.5px",
              fontFamily:    "var(--font-mono)",
              fontWeight:    600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Initialising Workspace
          </p>
        </div>

        {/* Progress track */}
        <div
          className="w-44 rounded-full overflow-hidden"
          style={{ height: "2px", background: "var(--surface-3)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--accent), var(--blue), var(--coral))",
              animation: "loading 1.6s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          />
        </div>
      </div>
    </div>
  )
}
