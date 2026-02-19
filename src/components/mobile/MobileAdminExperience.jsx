import { useCallback, useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Settings,
  Plus,
  Search,
  MoreVertical,
  MapPin,
  Clock,
  CalendarDays,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useEvents } from '../../context/EventContext'
import { useTheme } from '../../context/ThemeContext'
import MobileExperienceMenu from './MobileExperienceMenu'
import MobileEventFormModal from './MobileEventFormModal'
import MobileHeader from './MobileHeader'
import MobileAdminSkeleton from '../ui/skeletons/MobileAdminSkeleton'
import { formatTimeWithMeridiem, formatDateWithLocale } from '../../utils/time'
import { getLocaleCode } from '../../utils/locale'
import { InlineLoader } from '../ui/CustomLoader'
import { useEventForm, useImageUpload, useEventFilters, useMobileMenuSections } from '../../hooks'
import { eventToFormData, formDataToEvent, createEmptyForm } from '../../utils/eventHelpers'

export default function MobileAdminExperience({ initialEditEvent }) {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { events, cities, cityColors, selectedCity, setSelectedCity, loading, deleteEvent, updateEvent, addEvent } = useEvents()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('live')
  const [searchTerm, setSearchTerm] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)

  // Use custom hooks for form and image management
  const {
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    formErrors,
    setError,
    clearAllErrors,
    resetForm
  } = useEventForm()

  const {
    uploading: uploadingImage,
    uploadImage,
    removeImage: removeImageUpload,
    setPreview: setImageUploadPreview
  } = useImageUpload()

  const goTo = useCallback((path) => {
    navigate(path)
  }, [navigate])

  // Handle initial edit event from navigation
  useEffect(() => {
    if (initialEditEvent) {
      const formDataFromEvent = eventToFormData(initialEditEvent)
      setEditingEvent(initialEditEvent)
      setFormData(formDataFromEvent)
      setImagePreview(initialEditEvent.imageUrl || null)
      setImageUploadPreview(initialEditEvent.imageUrl || null)
      setShowEditForm(true)
      window.history.replaceState({}, document.title)
    }
  }, [initialEditEvent, setFormData, setImagePreview, setImageUploadPreview])

  const handleEdit = useCallback((event) => {
    const formDataFromEvent = eventToFormData(event)
    setEditingEvent(event)
    setFormData(formDataFromEvent)
    setImagePreview(event.imageUrl || null)
    setImageUploadPreview(event.imageUrl || null)
    setShowEditForm(true)
    setOpenMenuId(null)
  }, [setFormData, setImagePreview, setImageUploadPreview])

  const handleCloseEditForm = useCallback(() => {
    setEditingEvent(null)
    setShowEditForm(false)
    resetForm()
    removeImageUpload()
  }, [resetForm, removeImageUpload])

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await uploadImage(file)
    if (result.success) {
      setFormData({ ...formData, imageUrl: result.url })
      setImagePreview(result.url)
    } else {
      setError('image', result.error)
    }
  }, [uploadImage, formData, setFormData, setImagePreview, setError])

  const handleRemoveImage = useCallback(() => {
    setFormData({ ...formData, imageUrl: '' })
    removeImageUpload()
  }, [formData, setFormData, removeImageUpload])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    clearAllErrors()

    try {
      const eventData = formDataToEvent(formData)

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData)
      } else {
        await addEvent(eventData)
      }
      handleCloseEditForm()
    } catch (error) {
      setError('submit', error.message || t('admin.saveFailed', 'Failed to save event. Please try again.'))
    }
  }, [formData, editingEvent, updateEvent, addEvent, handleCloseEditForm, clearAllErrors, setError, t])

  const locale = getLocaleCode(i18n.language)

  const managedEventsCount = useMemo(() => {
    if (!user) return 0
    if (user.role === 'admin') return (events || []).length
    return (events || []).filter(event => event.city === user.city).length
  }, [events, user])

  // Use custom hook for event filtering
  const filteredEvents = useEventFilters(events, {
    searchTerm,
    statusFilter: activeFilter,
    cityFilter: selectedCity,
    userCity: user?.city,
    userRole: user?.role
  })

  // Add display date to filtered events
  const displayEvents = useMemo(() => {
    return filteredEvents.map(event => ({
      ...event,
      displayDate: formatDateWithLocale(event?.start || event?.date, {
        locale,
        fallbackLabel: t('admin.dateTBA')
      })
    }))
  }, [filteredEvents, locale, t])

  // Use custom hook for menu sections
  const menuSections = useMobileMenuSections({
    user,
    navigate,
    logout: () => navigate('/login'),
    t,
    showAdminLink: false
  })

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
      setOpenMenuId(null)
    } catch (error) {
      alert(error.message || t('admin.failedDelete'))
    }
  }


  return (
    <div className="font-display dark:bg-background-dark text-ink dark:text-white min-h-screen pb-28">
      {/* Header - Using reusable MobileHeader component */}
      <MobileHeader
        title={t('admin.manageEvents')}
        subtitle={`${managedEventsCount} ${t('admin.totalEvents')}`}
        icon="settings"
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(true)}
      />

      {/* Sub-header: Create + Search + Filters */}
      <div className="px-4 pt-4 pb-2 space-y-3 bg-white dark:bg-background-dark border-b border-primary/5">
        {/* Create Event Button */}
        <button 
          onClick={() => {
            setEditingEvent(null)
            setFormData({
              title: '',
              city: user?.role === 'admin' ? cities[0] : user?.city,
              start: '',
              time: '',
              location: '',
              description: '',
              imageUrl: ''
            })
            setImagePreview(null)
            setShowEditForm(true)
          }}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          <span>{t('admin.createEvent', 'Create New Event')}</span>
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
      {loading ? (
        <MobileAdminSkeleton />
      ) : (
      <main className="px-4 py-6 pb-24 space-y-4">
        {displayEvents.length === 0 && (
          <div className="text-center py-16 opacity-60">
            <CalendarDays className="w-10 h-10 mx-auto mb-3 text-primary/60" />
            <p className="text-sm font-medium text-ink/70 dark:text-white/70">{t('admin.noEvents')}</p>
            <p className="text-xs text-ink/60 dark:text-white/60">{t('admin.createFirst')}</p>
          </div>
        )}

        {displayEvents.map((event) => (
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
                  onClick={() => handleEdit(event)}
                  className="w-full text-left px-4 py-2 text-sm text-ink dark:text-white/80 hover:bg-lavender/10 dark:hover:bg-white/5 transition-colors"
                >
                  {t('admin.edit')}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(event.id)}
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
            </div>

          </div>
        ))}
      </main>
      )}

      {/* Edit Form Modal - Using reusable component */}
      <MobileEventFormModal
        show={showEditForm}
        editingEvent={editingEvent}
        formData={formData}
        onFormDataChange={setFormData}
        imagePreview={imagePreview}
        uploadingImage={uploadingImage}
        formErrors={formErrors}
        cities={user?.role === 'admin' ? cities : [user?.city]}
        userRole={user?.role}
        onClose={handleCloseEditForm}
        onSubmit={handleSubmit}
        onImageUpload={handleImageUpload}
        onImageRemove={handleRemoveImage}
      />

      <MobileExperienceMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={t('admin.manageEvents')}
        subtitle={`${managedEventsCount} ${t('admin.totalEvents')}`}
        sections={menuSections}
        showUserCard={Boolean(user)}
        userName={user?.name}
        userEmail={user?.email}
        userRole={user?.role}
      />

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
