import { useEvents } from '../context/EventContext'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { MapPin, Globe } from 'lucide-react'

export default function CityFilter() {
  const { cities, cityColors, selectedCity, setSelectedCity, events } = useEvents()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const getCityCount = (city) => events.filter(e => e.city === city).length

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
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCity('all')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-2 ${
            selectedCity === 'all'
              ? 'bg-primary text-white border-transparent shadow-md shadow-primary/20'
              : isDark
                ? 'bg-white/5 border-border-dark text-gray-200 hover:border-primary/40'
                : 'bg-white text-ink-400 border-lavender-100 hover:bg-lavender-50 hover:border-lavender-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          {t('filter.allCities')}
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            selectedCity === 'all' ? 'bg-white/20' : 'bg-white/10'
          }`}>
            {events.length}
          </span>
        </button>
        
        {cities.map(city => {
          const count = getCityCount(city)
          const isActive = selectedCity === city
          return (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border ${
                isActive
                  ? 'text-white border-transparent shadow-md'
                  : isDark
                    ? 'bg-white/5 border-border-dark text-gray-200 hover:border-primary/40'
                    : 'bg-white text-ink-400 border-lavender-100 hover:bg-lavender-50 hover:border-lavender-200'
              }`}
              style={isActive ? { 
                backgroundColor: cityColors[city],
                boxShadow: `0 4px 14px ${cityColors[city]}33`
              } : {}}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  isActive ? 'ring-2 ring-white/40 scale-110' : ''
                }`}
                style={{ backgroundColor: cityColors[city] }}
              />
              {city}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                isActive ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
