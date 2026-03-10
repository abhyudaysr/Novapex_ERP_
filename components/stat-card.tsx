import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
  note?: string
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  note,
  className,
}: StatCardProps) {
  const trendColors = {
    up: "var(--green)",
    down: "var(--red)",
    neutral: "var(--t3)",
  }

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
      <Card
        className={cn(
          "relative overflow-hidden rounded-[24px] border transition-all duration-300",
          className,
        )}
        style={{
          background: "linear-gradient(160deg, var(--surface-1) 0%, color-mix(in srgb, var(--surface-1) 88%, var(--accent) 12%) 100%)",
          borderColor: "var(--b1)",
          boxShadow: "var(--sh-sm)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full blur-3xl"
          style={{ background: "var(--accent-bg)" }}
        />
        <CardContent className="relative p-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: "var(--t4)" }}>
              {title}
            </h3>
            {icon && (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "var(--surface-2)", color: "var(--accent)" }}
              >
                {icon}
              </div>
            )}
          </div>
          <div className="mb-3 text-3xl font-black tracking-tight" style={{ color: "var(--t1)" }}>
            {value}
          </div>
          <div className="flex items-center justify-between gap-3">
            {change ? (
              <Badge
                variant="outline"
                className="rounded-full border px-2.5 py-1 text-[10px] font-black"
                style={{
                  borderColor: "var(--b1)",
                  background: "var(--surface-2)",
                  color: trendColors[trend],
                }}
              >
                <TrendIcon className="mr-1.5 h-3 w-3" />
                {change}
              </Badge>
            ) : (
              <span />
            )}
            {note && (
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--t4)" }}>
                {note}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
