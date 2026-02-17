import { useEvents } from '../context/EventContext'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { MapPin } from 'lucide-react'
import CityChips from './city/CityChips'

export default function CityFilter() {
  const { cities, cityColors, selectedCity, setSelectedCity, events } = useEvents()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#222222] border border-border-dark shadow-2xl' : 'glass-strong'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="font-bold text-ink dark:text-white text-sm">{t('filter.title')}</h3>
        </div>
        {selectedCity !== 'all' && (
          <button
            onClick={() => setSelectedCity('all')}
            className="text-xs font-medium text-primary hover:text-primary-500 transition-colors"
          >
            {t('filter.clearFilter')}
          </button>
        )}
      </div>

      <CityChips
        cities={cities}
        cityColors={cityColors}
        selectedCity={selectedCity}
        totalEvents={events.length}
        onSelect={setSelectedCity}
        counts={cities.reduce((acc, city) => {
          acc[city] = events.filter((event) => event.city === city).length
          return acc
        }, {})}
      />
    </div>
  )
}
