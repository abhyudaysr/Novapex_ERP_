import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ title, value, change, trend = "neutral", icon, className }: StatCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-muted-foreground",
  }

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 hover:-translate-y-1", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">{value}</div>
          {change && (
            <Badge variant="outline" className={cn("text-xs", trendColors[trend])}>
              {change}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
