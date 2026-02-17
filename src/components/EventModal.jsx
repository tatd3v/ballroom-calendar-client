import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { X, MapPin, Calendar, FileText, Clock } from 'lucide-react'
import { useEvents } from '../context/EventContext'
import { useTheme } from '../context/ThemeContext'
import { parseDateOnlyToLocal } from '../utils/time'

export default function EventModal({ event, onClose }) {
  const { cityColors } = useEvents()
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const backdropRef = useRef(null)
  
  if (!event) return null

  const city = event.extendedProps?.city || event.city
  const description = event.extendedProps?.description || event.description
  const color = cityColors[city] || '#EE0087'

  const startDate = parseDateOnlyToLocal(event.start) || new Date(event.start)
  const endDate = event.end ? (parseDateOnlyToLocal(event.end) || new Date(event.end)) : null
  const isMultiDay = endDate && endDate.toDateString() !== startDate.toDateString()
  const isPast = startDate < new Date()

  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US'
  const formatDate = (date) => date.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className={`rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-scale-in ${isDark ? 'bg-[#222222]' : 'bg-white'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div 
          className="px-6 pt-6 pb-4 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)` }}
        >
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          />
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  <MapPin className="w-3 h-3" />
                  {city}
                </span>
                {isPast && (
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-white/10 text-gray-400' : 'bg-ink-50 text-ink-300'}`}>
                    {t('modal.past')}
                  </span>
                )}
              </div>
              <h2 className={`text-xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-ink'}`}>{event.title}</h2>
            </div>
            <button 
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-all duration-200 flex-shrink-0 ${isDark ? 'text-gray-400 hover:bg-white/10 hover:text-primary' : 'text-ink-300 hover:bg-white hover:text-primary hover:shadow-sm'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-3">
          <div className={`flex items-start gap-3 p-3 rounded-xl border ${isDark ? 'bg-[#2A2A2A] border-border-dark' : 'bg-lavender-50 border-lavender-100'}`}>
            <Calendar className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-lavender-500'}`} />
            <div className={`text-sm ${isDark ? 'text-gray-200' : 'text-ink-500'}`}>
              <p className="font-semibold">{formatDate(startDate)}</p>
              {isMultiDay && (
                <p className={`mt-0.5 ${isDark ? 'text-gray-400' : 'text-ink-300'}`}>{t('modal.to')} {formatDate(endDate)}</p>
              )}
            </div>
          </div>

          {description && (
            <div className={`flex items-start gap-3 p-3 rounded-xl border ${isDark ? 'bg-[#2A2A2A] border-border-dark' : 'bg-ink-50 border-ink-100'}`}>
              <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-ink-300'}`} />
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-200' : 'text-ink-500'}`}>{description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? 'border-border-dark' : 'border-lavender-100'}`}>
          <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-ink-300'}`}>
            <Clock className="w-3.5 h-3.5" />
            {isPast ? t('modal.eventPassed') : `${Math.ceil((startDate - new Date()) / (1000 * 60 * 60 * 24))} ${t('modal.daysAway')}`}
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 border ${isDark ? 'text-gray-400 border-border-dark hover:bg-white/5 hover:border-primary/40' : 'text-ink-400 border-lavender-100 hover:bg-lavender-50 hover:border-lavender-200'}`}
          >
            {t('modal.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
