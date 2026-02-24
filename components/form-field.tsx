"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "date" | "textarea" | "select"
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  options?: { value: string; label: string }[]
  className?: string
  rows?: number
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options = [],
  className,
  rows = 3,
}: FormFieldProps) {
  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            id={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={cn(error && "border-destructive")}
          />
        )
      case "select":
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={cn(error && "border-destructive")}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            id={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={cn(error && "border-destructive")}
          />
        )
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
