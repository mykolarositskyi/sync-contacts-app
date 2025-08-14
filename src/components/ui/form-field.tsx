import { ReactNode } from "react"
import { Label } from "./label"

interface FormFieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
  className?: string
}

export function FormField({ label, htmlFor, children, className = "" }: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </Label>
      {children}
    </div>
  )
}
