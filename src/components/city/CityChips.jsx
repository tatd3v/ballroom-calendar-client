
const cn = (...classes) => classes.filter(Boolean).join(' ')

export default function CityChips({
  cities = [],
  cityColors = {},
  selectedCity = 'all',
  totalEvents = 0,
  counts = {},
  onSelect,
  variant = 'wrap', // 'wrap' | 'scroll'
  allLabel = 'ALL',
  showCounts = true,
}) {
  const handleSelect = (city) => {
    if (typeof onSelect === 'function') {
      onSelect(city)
    }
  }

  const containerClass = variant === 'scroll'
    ? 'flex gap-2 overflow-x-auto no-scrollbar'
    : 'flex flex-wrap gap-2'

  const basePillClass = 'rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 border flex items-center gap-2'
  const sizeClass = variant === 'scroll' ? 'flex-none px-4 py-1.5' : 'px-5 py-2'

  return (
    <div className={containerClass}>
      <button
        type="button"
        onClick={() => handleSelect('all')}
        className={cn(
          basePillClass,
          sizeClass,
          selectedCity === 'all'
            ? 'bg-primary text-white border-transparent shadow-md shadow-primary/20'
            : 'bg-white text-ink-400 border-lavender-100 dark:bg-white/5 dark:text-gray-200 dark:border-border-dark hover:bg-lavender-50 hover:border-lavender-200'
        )}
      >
        <span>{totalEvents}</span>
        <span>{allLabel}</span>
      </button>

      {cities.map((city) => {
        const isActive = selectedCity === city
        const color = cityColors[city] || '#EE0087'
        return (
          <button
            key={city}
            type="button"
            onClick={() => handleSelect(city)}
            className={cn(
              basePillClass,
              sizeClass,
              isActive
                ? 'text-white border-transparent shadow-md'
                : 'bg-white text-ink-400 border-lavender-100 dark:bg-white/5 dark:text-gray-200 dark:border-border-dark hover:bg-lavender-50 hover:border-lavender-200'
            )}
            style={
              isActive
                ? {
                    backgroundColor: color,
                    boxShadow: `0 4px 14px ${color}33`,
                  }
                : undefined
            }
          >
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                isActive ? 'ring-2 ring-white/40 scale-110' : ''
              }`}
              style={{ backgroundColor: color }}
            />
            <span className="truncate max-w-[6rem]">{city}</span>
            {showCounts && (
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  isActive ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                {counts[city] ?? 0}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
