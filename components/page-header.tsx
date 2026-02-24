"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  children?: React.ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      <div className="flex items-center space-x-4">
        {children}
        {action && (
          <Button variant={action.variant || "default"} onClick={action.onClick} className="transition-colors">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
