interface StatItem {
  value: string | number
  label: string
  valueColor?: string
}

interface StatsGridProps {
  stats: StatItem[]
  columns?: number
  className?: string
}

export function StatsGrid({ stats, columns = 3, className = "" }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-4 text-center ${className}`}>
      {stats.map((stat, index) => (
        <div key={index}>
          <div className={`text-2xl font-bold ${stat.valueColor || "text-blue-600"}`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-500">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
