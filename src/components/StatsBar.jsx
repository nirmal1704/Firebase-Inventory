export function StatsBar({ itemCount, totalQuantity, lowStockCount }) {
  const stats = [
    {
      label: 'Unique items',
      value: itemCount,
      bg: 'bg-lavender/80',
      emoji: '🏷️',
    },
    {
      label: 'Total units',
      value: totalQuantity,
      bg: 'bg-mint/80',
      emoji: '📊',
    },
    {
      label: 'Low stock alerts',
      value: lowStockCount,
      bg: lowStockCount > 0 ? 'bg-coral/70' : 'bg-sky/70',
      emoji: lowStockCount > 0 ? '⚠️' : '✨',
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3 stagger-in">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} cartoon-border wiggle-hover rounded-2xl px-4 py-4`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-hand text-2xl text-ink-soft">{stat.label}</p>
              <p className="font-display text-3xl font-bold text-ink">{stat.value}</p>
            </div>
            <span className="text-2xl" aria-hidden>
              {stat.emoji}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
