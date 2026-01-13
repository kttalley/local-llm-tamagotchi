function StatItem({ label, value, icon }) {
  const getBarColor = () => {
    if (value < 30) return 'bg-red-500'
    if (value < 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-4" title={label}>{icon}</span>
      <div className="flex-1 pixel-bar">
        <div
          className={`pixel-bar-fill ${getBarColor()}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-[var(--lcd-darkest)] w-8 text-right">
        {Math.round(value)}%
      </span>
    </div>
  )
}

export function StatsBar({ stats }) {
  return (
    <div className="w-full space-y-1.5 mt-2">
      <StatItem label="Hunger" value={stats.hunger} icon="🍖" />
      <StatItem label="Happiness" value={stats.happiness} icon="💖" />
      <StatItem label="Energy" value={stats.energy} icon="⚡" />
    </div>
  )
}
