import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import EventCalendar from '../components/EventCalendar'
import CityFilter from '../components/CityFilter'
import CalendarSkeleton from '../components/ui/skeletons/CalendarSkeleton'
import MobileCalendarExperience from '../components/mobile/MobileCalendarExperience'
import { useEvents } from '../context/EventContext'
import { CalendarDays, TrendingUp } from 'lucide-react'
import useMobile from '../hooks/useMobile'
import { getEventUrl } from '../utils/slugify'

export default function CalendarPage() {
  const navigate = useNavigate()
  const isMobile = useMobile()
  const { filteredEvents, selectedCity, loading, events } = useEvents()
  const { t } = useTranslation()

  const handleEventClick = (event) => {
    const eventData = event.extendedProps || event
    if (eventData.id) {
      navigate(getEventUrl(eventData))
    }
  }

  const upcomingCount = filteredEvents.filter(e => new Date(e.start) >= new Date()).length

  if (isMobile) {
    return <MobileCalendarExperience />
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink dark:text-white">
            {t('calendar.title')}
          </h1>
          <p className="text-sm text-ink-300 dark:text-ink-200 mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {filteredEvents.length} {filteredEvents.length !== 1 ? t('calendar.events') : t('calendar.event')}
              {selectedCity !== 'all' && <> {t('calendar.in')} <strong className="text-ink-500 dark:text-ink-100">{selectedCity}</strong></>}
            </span>
            {upcomingCount > 0 && (
              <span className="flex items-center gap-1 text-lime-500">
                <TrendingUp className="w-3.5 h-3.5" />
                {upcomingCount} {t('calendar.upcoming')}
              </span>
            )}
          </p>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold bg-lavender-50 border border-lavender-100 text-ink-400 dark:bg-[#222222] dark:border-border-dark dark:text-gray-400">
            {events.length} {t('calendar.total')}
          </div>
          {selectedCity !== 'all' && (
            <div 
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: 'var(--active-city-color, #EE0087)' }}
            >
              {selectedCity}
            </div>
          )}
        </div>
      </div>

      <CityFilter />

      {loading ? (
        <CalendarSkeleton />
      ) : (
        <EventCalendar onEventClick={handleEventClick} />
      )}
    </div>
  )
}
