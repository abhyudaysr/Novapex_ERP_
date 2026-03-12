"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  statusLabel?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
    icon?: React.ReactNode
  }
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow = "Workspace",
  statusLabel = "Live",
  action,
  children,
  className,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-[28px] border p-6 md:p-8",
        "mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
      style={{
        background: "linear-gradient(135deg, color-mix(in srgb, var(--surface-1) 88%, var(--accent) 12%) 0%, var(--surface-1) 60%)",
        borderColor: "var(--b1)",
        boxShadow: "var(--sh-sm)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
        style={{ background: "var(--accent-bg)" }}
      />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <span className="eyebrow">{eyebrow}</span>
          <span className="neon-pill" style={{ fontSize: "9px", padding: "2px 8px" }}>
            <Sparkles className="h-3 w-3" />
            {statusLabel}
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl font-medium" style={{ color: "var(--t3)" }}>
            {description}
          </p>
        )}
      </div>
      <div className="relative flex flex-wrap items-center gap-3 md:justify-end">
        {children}
        {action && (
          <Button
            variant={action.variant || "default"}
            onClick={action.onClick}
            className="h-11 rounded-xl px-5 font-bold"
            style={{
              background: action.variant ? undefined : "linear-gradient(135deg, var(--accent) 0%, var(--blue) 100%)",
              boxShadow: action.variant ? undefined : "var(--glow-accent)",
              color: action.variant ? undefined : "#fff",
            }}
          >
            {action.icon}
            {action.label}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
