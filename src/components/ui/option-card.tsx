interface OptionCardProps {
  label: string
  description: string
  icon: string
  isSelected: boolean
  onClick: () => void
  selectedBorderColor: string
  selectedBgColor: string
  hoverBorderColor: string
  hoverBgColor: string
}

export function OptionCard({ 
  label, 
  description, 
  icon, 
  isSelected, 
  onClick, 
  selectedBorderColor, 
  selectedBgColor, 
  hoverBorderColor, 
  hoverBgColor 
}: OptionCardProps) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? `${selectedBorderColor} ${selectedBgColor} shadow-md`
          : `border-gray-200 hover:${hoverBorderColor} hover:${hoverBgColor} hover:shadow-sm`
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <div className="font-medium text-gray-900">{label}</div>
      </div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  )
}
