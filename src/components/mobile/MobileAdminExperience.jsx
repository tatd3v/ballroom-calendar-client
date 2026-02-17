import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  BarChart3,
  Users,
  Settings,
  Plus,
  Menu,
  Search,
  MoreVertical,
  MapPin,
  Compass,
  Clock,
  Sun,
  Moon,
  Globe,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useEvents } from '../../context/EventContext'
import { useTheme } from '../../context/ThemeContext'
import MobileExperienceMenu from './MobileExperienceMenu'
import BottomNavItem from './BottomNavItem'
import { formatTimeWithMeridiem, formatDateWithLocale } from '../../utils/time'
import { getLocaleCode, changeAppLanguage } from '../../utils/locale'

export default function MobileAdminExperience() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { events, cities, cityColors, selectedCity, setSelectedCity, loading, deleteEvent } = useEvents()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('events')
  const [activeFilter, setActiveFilter] = useState('live')
  const [searchTerm, setSearchTerm] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)

  const goTo = useCallback((path) => {
    navigate(path)
  }, [navigate])

  const handleLanguageToggle = () => {
    changeAppLanguage(i18n, i18n.language === 'es' ? 'en' : 'es')
  }

  const locale = getLocaleCode(i18n.language)

  const managedEventsCount = useMemo(() => {
    if (!user) return 0
    if (user.role === 'admin') return (events || []).length
    return (events || []).filter(event => event.city === user.city).length
  }, [events, user])

  const scopedEvents = useMemo(() => {
    if (!user) return []

    const baseEvents = user.role === 'admin'
      ? (selectedCity === 'all' ? (events || []) : (events || []).filter(event => event.city === selectedCity))
      : (events || []).filter(event => event.city === user.city)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const formatDate = (event) => {
      return formatDateWithLocale(event?.date, {
        locale,
        fallbackLabel: t('admin.dateTBA')
      })
    }

    return baseEvents
      .map(event => {
        const startDate = event.date ? new Date(`${event.date}T00:00:00Z`) : null
        const status = startDate && !Number.isNaN(startDate.getTime()) && startDate < today ? 'past' : 'live'
        return {
          ...event,
          status,
          displayDate: formatDate(event)
        }
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return dateA - dateB
      })
  }, [user, events, selectedCity, locale, t])

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return scopedEvents.filter(event => {
      const matchesFilter = activeFilter === 'all' ? true : event.status === activeFilter
      const matchesSearch = !normalizedSearch
        ? true
        : [event.title, event.city, event.location]
            .filter(Boolean)
            .some(value => value.toLowerCase().includes(normalizedSearch))

      return matchesFilter && matchesSearch
    })
  }, [scopedEvents, activeFilter, searchTerm])

  useEffect(() => {
    if (!openMenuId) return
    const handleClickOutside = (event) => {
      const menuNode = document.querySelector(`[data-event-card="${openMenuId}"]`)
      if (!menuNode || menuNode.contains(event.target)) return
      setOpenMenuId(null)
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [openMenuId])

  const getCityBadge = (city) => {
    const color = cityColors?.[city]
    const style = color
      ? {
          backgroundColor: `${color}22`,
          color,
          borderColor: `${color}55`
        }
      : undefined

    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase border ${color ? '' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
        style={style}
      >
        {city}
      </span>
    )
  }

  const filterOptions = ['all', 'live', 'past']

  const filterLabels = {
    all: t('admin.filterAll'),
    live: t('admin.upcoming'),
    past: t('admin.past'),
  }

  const handleCityPick = (city) => {
    setSelectedCity(city)
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return
    try {
      await deleteEvent(id)
    } catch (error) {
      alert(error.message || t('admin.failedDelete'))
    }
  }

  const menuSections = useMemo(() => {
    return [
      {
        id: 'admin-nav',
        title: t('nav.admin'),
        items: [
          {
            id: 'overview',
            label: t('admin.manageEvents'),
            icon: CalendarDays,
            onClick: () => goTo('/admin')
          },
          {
            id: 'new',
            label: t('admin.addEvent'),
            icon: Plus,
            onClick: () => goTo('/admin/events/new')
          },
          {
            id: 'calendar',
            label: t('calendar.title'),
            icon: Compass,
            onClick: () => goTo('/')
          }
        ]
      }
    ]
  }, [goTo, t])

  return (
    <div className="font-display dark:bg-background-dark text-ink dark:text-white min-h-screen pb-28">
      {/* Header — matches calendar mobile navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <button
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-ink dark:text-white">{t('admin.manageEvents')}</h1>
                <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">{managedEventsCount} {t('admin.totalEvents')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-header: Create + Search + Filters */}
      <div className="px-4 pt-4 pb-2 space-y-3 bg-white dark:bg-background-dark border-b border-primary/5">
        {/* Create Event Button */}
        <button 
          onClick={() => navigate('/admin/events/new')}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>{t('admin.createEvent')}</span>
        </button>

        {/* Search Bar */}
        <div className="mb-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-ink/40 dark:text-white/40" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-lavender/30 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/20 placeholder:text-ink/40 dark:placeholder:text-white/40 text-sm text-ink dark:text-white" 
              placeholder={t('admin.searchPlaceholder')}
              type="text" 
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filterOptions.map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-lavender/40 dark:bg-white/10 text-ink/60 dark:text-white/60 hover:bg-lavender/60 dark:hover:bg-white/20'
              }`}
            >
              {filterLabels[filter]}
            </button>
          ))}
        </div>

        {user?.role === 'admin' && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => handleCityPick('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors border ${
                selectedCity === 'all'
                  ? 'bg-primary text-white border-primary'
                  : 'border-lavender/40 text-ink/70 dark:text-white/70'
              }`}
            >
              {t('admin.allCities')}
            </button>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => handleCityPick(city)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors border ${
                  selectedCity === city
                    ? 'text-white border-transparent'
                    : 'border-lavender/40 text-ink/70 dark:text-white/70'
                }`}
                style={selectedCity === city ? { backgroundColor: cityColors?.[city] || '#ED0086' } : undefined}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      <MobileExperienceMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={t('admin.manageEvents')}
        subtitle={t('nav.subtitle')}
        sections={menuSections}
        showUserCard={Boolean(user)}
        enableLogout={Boolean(user)}
      />

      {/* Main Content */}
      <main className="px-4 py-6 pb-24 space-y-4">
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-white/70 dark:bg-white/5 h-28 rounded-2xl" />
            ))}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-16 opacity-60">
            <CalendarDays className="w-10 h-10 mx-auto mb-3 text-primary/60" />
            <p className="text-sm font-medium text-ink/70 dark:text-white/70">{t('admin.noEvents')}</p>
            <p className="text-xs text-ink/60 dark:text-white/60">{t('admin.createFirst')}</p>
          </div>
        )}

        {filteredEvents.map((event) => (
          <div 
            key={event.id}
            data-event-card={event.id}
            className={`relative bg-white dark:bg-ink/50 rounded-xl p-4 shadow-sm border ${
              event.status === 'live' 
                ? 'border-primary/30 hover:border-primary/50' 
                : 'border-lavender dark:border-ink/30'
            } transition-colors`}
          >
            <div className="flex justify-between items-start mb-3 gap-4">
              <div>
                <h3 className={`text-base font-bold ${
                  event.status === 'past' 
                    ? 'text-ink/40 dark:text-white/40' 
                    : 'text-ink dark:text-white'
                }`}>
                  {event.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full hover:bg-lavender/20 dark:hover:bg-white/5 transition-colors"
                  aria-label={t('admin.actions')}
                  onClick={() => setOpenMenuId(prev => prev === event.id ? null : event.id)}
                >
                  <MoreVertical className="w-5 h-5 text-ink/40 dark:text-white/50" />
                </button>
              </div>
            </div>

            {openMenuId === event.id && (
              <div className="absolute right-4 top-12 z-20 w-36 rounded-2xl border border-lavender/40 dark:border-ink/40 bg-white dark:bg-ink shadow-xl shadow-black/10">
                <button
                  type="button"
                  onClick={() => setOpenMenuId(null)}
                  className="w-full text-left px-4 py-2 text-sm text-ink dark:text-white/80 hover:bg-lavender/10 dark:hover:bg-white/5 transition-colors"
                >
                  {t('admin.edit')}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenMenuId(null)}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  {t('admin.delete')}
                </button>
              </div>
            )}

            {event.imageUrl && (
              <div className="mb-3 rounded-xl overflow-hidden border border-lavender/30 dark:border-ink/40">
                <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover" />
              </div>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink/70 dark:text-white/70">
                <CalendarDays className="w-4 h-4" />
                <span>{event.displayDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-ink/70 dark:text-white/70">
                <MapPin className="w-4 h-4" />
                <span>{event.location || event.city}</span>
                {getCityBadge(event.city)}
              </div>
              {event.time && (
                <div className="flex items-center gap-2 text-sm font-semibold text-ink/70 dark:text-white/70">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeWithMeridiem(event.time)}</span>
                </div>
              )}
              {event.description && (
                <p className="text-sm text-ink/70 dark:text-white/70 line-clamp-3">
                  {event.description}
                </p>
              )}
            </div>

          </div>
        ))}
      </main>

      {/* Bottom Navigation (temporarily disabled until actions are defined)
      <nav className="fixed bottom-0 w-full bg-white dark:bg-background-dark border-t border-primary/10 px-6 py-3 pb-6 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <BottomNavItem 
            icon={CalendarDays} 
            label={t('nav.events', 'Events')} 
            active={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
          />
          <BottomNavItem 
            icon={BarChart3} 
            label={t('nav.analytics', 'Analytics')} 
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
          />
          <BottomNavItem 
            icon={Users} 
            label={t('nav.team', 'Team')} 
            active={activeTab === 'team'}
            onClick={() => setActiveTab('team')}
          />
          <BottomNavItem 
            icon={Settings} 
            label={t('nav.settings', 'Settings')} 
            active={activeTab === 'settings')}
            onClick={() => setActiveTab('settings')}
          />
        </div>
      </nav>
      */}
    </div>
  )
}
