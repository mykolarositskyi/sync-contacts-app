import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface SettingsSectionHeaderProps {
  icon: LucideIcon
  title: string
  description: string
  iconBgColor: string
  iconColor: string
  children?: ReactNode
  showHeaderOnly?: boolean
}

export function SettingsSectionHeader({ 
  icon: Icon, 
  title, 
  description, 
  iconBgColor, 
  iconColor, 
  children,
  showHeaderOnly = false 
}: SettingsSectionHeaderProps) {
  if (showHeaderOnly) {
    return (
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
