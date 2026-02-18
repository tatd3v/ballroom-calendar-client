import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  ChevronRight,
  Bookmark,
  UserRound,
  MapPin,
  Clock,
  Menu,
  Sun,
  Moon,
  Plus,
  Globe,
} from 'lucide-react'
import { useEvents } from '../../context/EventContext'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import MobileExperienceMenu from './MobileExperienceMenu'
import { formatTimeWithMeridiem, parseDateOnlyToLocal } from '../../utils/time'
import { getLocaleCode, changeAppLanguage } from '../../utils/locale'
import { getEventUrl } from '../../utils/slugify'

export default function MobileCalendarExperience() {
  const navigate = useNavigate()
  const { filteredEvents, events, cities, cityColors, selectedCity, setSelectedCity, loading } = useEvents()
  const { theme, toggleTheme } = useTheme()
  const { i18n, t } = useTranslation()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const locale = getLocaleCode(i18n.language)
  const monthLabel = useMemo(() => {
    return new Date().toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  }, [locale])

  const groupedEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcoming = filteredEvents.filter((event) => {
      if (!event?.start) return true
      const start = parseDateOnlyToLocal(event.start)
      if (!start || Number.isNaN(start.getTime())) return true
      return start >= today
    })

    const groups = upcoming.reduce((acc, event) => {
      if (!event?.start) return acc
      const key = event.start
      if (!acc[key]) acc[key] = []
      acc[key].push(event)
      return acc
    }, {})

    return Object.entries(groups)
      .sort((a, b) => {
        const dateA = parseDateOnlyToLocal(a[0])
        const dateB = parseDateOnlyToLocal(b[0])
        return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
      })
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => {
          const dateA = parseDateOnlyToLocal(a.start)
          const dateB = parseDateOnlyToLocal(b.start)
          return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
        }),
      }))
  }, [filteredEvents])

  const formatDayHeading = (date) => {
    const parsed = parseDateOnlyToLocal(date)
    if (!parsed) return date
    return parsed.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }

  const getTimeDisplay = (event) => {
    if (event.time) return formatTimeWithMeridiem(event.time, { fallbackLabel: '' })
    if (event.start) {
      const parsed = parseDateOnlyToLocal(event.start)
      if (parsed && !Number.isNaN(parsed.getTime())) {
        const h = parsed.getHours(), m = parsed.getMinutes()
        if (h || m) return formatTimeWithMeridiem(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`, { fallbackLabel: '' })
      }
    }
    return t('mobile.allDay', { defaultValue: 'All day' })
  }

  const handleEventSelect = (event) => {
    navigate(getEventUrl(event))
  }

  const activeCityColor = cityColors[selectedCity] || '#ED0086'

  const handleNavigate = (path) => {
    navigate(path)
  }

  const menuSections = useMemo(() => {
    const baseItems = []

    if (!user) {
      baseItems.push({
        id: 'events',
        label: t('mobile.menu.events', { defaultValue: 'Events' }),
        icon: CalendarDays,
        onClick: () => handleNavigate('/'),
      })
    }

    if (user) {
      baseItems.push({
        id: 'manage',
        label: t('mobile.menu.manage', { defaultValue: 'Manage events' }),
        icon: Bookmark,
        onClick: () => handleNavigate('/admin'),
      })
    } else {
      baseItems.push({
        id: 'login',
        label: t('mobile.menu.login', { defaultValue: 'Login' }),
        icon: UserRound,
        onClick: () => handleNavigate('/login'),
      })
    }

    return [
      {
        id: 'primary-nav',
        items: baseItems,
      },
    ]
  }, [t, user, handleNavigate])

  const renderEventCard = (event) => {
    const timeLabel = getTimeDisplay(event)
    const color = cityColors[event.city] || activeCityColor
    return (
      <button
        key={event.id}
        onClick={() => handleEventSelect(event)}
        className="w-full text-left p-4 rounded-xl flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4"
        style={{
          borderLeftColor: color,
          background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderLeft: `4px solid ${color}`,
        }}
      >
        {event.imageUrl ? (
          <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-lavender/60 dark:bg-white/10 flex items-center justify-center">
            <CalendarDays className="w-7 h-7 text-ink/40 dark:text-white/40" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-0.5">
            <h4 className="font-bold text-ink dark:text-white text-base truncate">{event.title}</h4>
            <span
              className="ml-2 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {event.city}
            </span>
          </div>
          <p className="text-ink/70 dark:text-white/60 text-sm flex items-center gap-1">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{event.location || event.city}</span>
          </p>
          <p className="text-ink/70 dark:text-white/60 text-sm flex items-center gap-1 mt-1">
            <Clock className="w-4 h-4 shrink-0" />
            {timeLabel}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-ink/30 dark:text-white/30 shrink-0" />
      </button>
    )
  }

  const handleFabClick = () => {
    if (user) {
      navigate('/admin', { state: { openCreate: true } })
    } else {
      navigate('/login')
    }
  }

  const handleLanguageToggle = () => {
    changeAppLanguage(i18n, i18n.language === 'es' ? 'en' : 'es')
  }

  return (
    <div className="font-display dark:bg-background-dark text-ink dark:text-white min-h-screen pb-28">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-ink dark:text-white">{t('calendar.title')}</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">{t('nav.subtitle')}</p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label={t('mobile.openMenu')}
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <MobileExperienceMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={t('calendar.title')}
        subtitle={t('nav.subtitle')}
        sections={menuSections}
        showUserCard={Boolean(user)}
        enableLogout={Boolean(user)}
      />

      <main>
        <section className="px-4 py-6 bg-white dark:bg-background-dark border-b border-primary/5 space-y-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setSelectedCity('all')}
              className={`flex-none px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
                selectedCity === 'all' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
              }`}
            >
              {t('filter.allCities')}
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`flex-none px-5 py-2 rounded-full font-semibold text-sm transition-colors border ${
                  selectedCity === city ? 'text-white border-transparent' : 'text-ink dark:text-white/80 border-primary/10'
                }`}
                style={{
                  backgroundColor: selectedCity === city ? cityColors[city] : 'rgba(255,255,255,0.1)',
                  boxShadow: selectedCity === city ? `0 10px 30px ${cityColors[city]}33` : undefined,
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 space-y-6 mt-6">
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="animate-pulse bg-white/70 dark:bg-white/5 h-24 rounded-2xl" />
              ))}
            </div>
          )}

          {!loading && groupedEvents.length === 0 && (
            <div className="pt-10 flex flex-col items-center text-center opacity-60">
              <CalendarDays className="w-12 h-12 text-primary/50" />
              <p className="mt-2 text-sm font-medium">
                {t('calendar.noEvents', { defaultValue: 'No events scheduled for this week' })}
              </p>
            </div>
          )}

          {groupedEvents.map((group) => (
            <div key={group.date}>
              <h3 className="text-base font-black uppercase tracking-widest text-ink/70 dark:text-white/70 mb-3 px-1">
                {formatDayHeading(group.date)}
              </h3>
              <div className="space-y-3">
                {group.items.map(renderEventCard)}
              </div>
            </div>
          ))}
        </section>
      </main>

      {user && (
        <button
          onClick={handleFabClick}
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center z-40 active:scale-90 transition-transform"
          aria-label={t('mobile.createOrManage')}
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
