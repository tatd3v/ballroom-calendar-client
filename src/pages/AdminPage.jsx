import { useState, useEffect, useCallback } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import { InlineLoader } from '../components/ui/CustomLoader'
import MobileAdminExperience from '../components/mobile/MobileAdminExperience'
import AdminPageSkeleton from '../components/ui/skeletons/AdminPageSkeleton'
import Toast from '../components/ui/Toast'
import EventFormModal from '../components/EventFormModal'
import { formatDateWithLocale, formatTimeWithMeridiem, parseDateOnlyToLocal } from '../utils/time'
import { eventToFormData, formDataToEvent } from '../utils/eventHelpers'
import { useMobile, useToast, useEventForm, useImageUpload, usePagination, useClickOutside } from '../hooks'
import { 
  Plus,
  Edit, 
  Trash,
  Filter,
  ChevronDown,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function AdminPage() {
  // Context hooks
  const { user } = useAuth()
  const { events, cities, cityColors, selectedCity, setSelectedCity, addEvent, updateEvent, deleteEvent, loading } = useEvents()
  const { t, i18n } = useTranslation()
  const isMobile = useMobile()
  const location = useLocation()
  
  // Custom hooks for reusable functionality
  const { toast, showSuccess, showError } = useToast()
  const {
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    resetForm
  } = useEventForm()
  const {
    uploading: uploadingImage,
    uploadImage,
    removeImage: removeImageUpload,
    setPreview: setImageUploadPreview
  } = useImageUpload()
  
  // State hooks
  const [editingEvent, setEditingEvent] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false)
  const [timeFilter, setTimeFilter] = useState('upcoming30')
  
  // Click outside handlers
  const cityDropdownRef = useClickOutside(() => setCityDropdownOpen(false), cityDropdownOpen)
  const timeDropdownRef = useClickOutside(() => setTimeDropdownOpen(false), timeDropdownOpen)

  // Pagination — must be called before any early returns (Rules of Hooks)
  const userEvents = !user || isMobile
    ? []
    : user.role === 'admin'
      ? selectedCity === 'all' ? (events || []) : (events || []).filter(e => e.city === selectedCity)
      : (events || []).filter(e => e.city === user.city)

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedEvents,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(userEvents, 10)

  // ALL useCallback hooks must be declared before any early returns (Rules of Hooks)
  const handleEdit = useCallback((event) => {
    const formDataFromEvent = eventToFormData(event)
    setFormData(formDataFromEvent)
    setImagePreview(event.imageUrl || null)
    setImageUploadPreview(event.imageUrl || null)
    setEditingEvent(event)
    setShowForm(true)
  }, [setFormData, setImagePreview, setImageUploadPreview])

  const handleCancel = useCallback(() => {
    resetForm()
    removeImageUpload()
    setEditingEvent(null)
    setShowForm(false)
  }, [resetForm, removeImageUpload])

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await uploadImage(file)
    if (result.success) {
      setFormData({ ...formData, imageUrl: result.url })
      setImagePreview(result.url)
      showSuccess(t('admin.imageUploaded', 'Image uploaded successfully!'))
    } else {
      showError(result.error)
    }
  }, [uploadImage, formData, setFormData, setImagePreview, showSuccess, showError, t])

  const handleRemoveImage = useCallback(() => {
    setFormData({ ...formData, imageUrl: '' })
    removeImageUpload()
  }, [formData, setFormData, removeImageUpload])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    try {
      const eventData = formDataToEvent(formData)
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData)
        showSuccess(t('admin.eventUpdated', 'Event updated successfully'))
      } else {
        await addEvent(eventData)
        showSuccess(t('admin.eventCreated', 'Event created successfully'))
      }
      handleCancel()
    } catch (err) {
      showError(err.message || t('admin.somethingWrong', 'Something went wrong'))
    }
  }, [formData, editingEvent, updateEvent, addEvent, showSuccess, showError, handleCancel, t])

  const handleDelete = useCallback(async (id) => {
    if (confirm(t('admin.confirmDelete', 'Are you sure you want to delete this event?'))) {
      try {
        await deleteEvent(id)
        showSuccess(t('admin.eventDeleted', 'Event deleted successfully'))
      } catch (err) {
        showError(err.message || t('admin.failedDelete', 'Failed to delete event'))
      }
    }
  }, [deleteEvent, showSuccess, showError, t])

  // Handle edit state from navigation
  useEffect(() => {
    if (location.state?.editingEvent) {
      handleEdit(location.state.editingEvent)
      window.history.replaceState({}, document.title)
    }
  }, [location.state, handleEdit])

  // --- Early returns after ALL hooks ---
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (isMobile) {
    return <MobileAdminExperience initialEditEvent={location.state?.editingEvent} />
  }

  const availableCities = user.role === 'admin' ? cities : [user.city]

  const emptyForm = {
    title: '',
    city: availableCities[0],
    start: '',
    description: '',
    time: '',
    location: '',
    imageUrl: ''
  }

  const timeFilterOptions = [
    { value: 'upcoming30', label: t('admin.upcoming30Days') },
    { value: 'weekend', label: t('admin.thisWeekend') },
    { value: 'nextMonth', label: t('admin.nextMonth') },
  ]

  const getTimeFilterLabel = () => {
    return timeFilterOptions.find(o => o.value === timeFilter)?.label || timeFilterOptions[0].label
  }

  const inputClasses = "w-full px-3.5 py-2.5 border border-lavender-100 dark:border-lavender/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white dark:bg-ink-700 text-ink dark:text-ink-100 placeholder:text-ink-300 dark:placeholder-ink-400 transition-all duration-200"

  if (loading) {
    return <AdminPageSkeleton />
  }

  return (
    <div className="space-y-5">
      {/* Toast notification */}
      <Toast 
        message={toast?.message} 
        type={toast?.type} 
        onClose={() => {}} 
      />

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-ink dark:text-white">{t('admin.manageEvents')}</h2>
          <p className="text-primary/60 dark:text-ink-300 mt-1">{(events || []).length} {t('admin.totalEvents')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {t('admin.addEvent')}
        </button>
      </div>

      {/* Filters & Sort */}
      <div className="bg-white/50 dark:bg-ink-700/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl mb-6 border border-primary/5 dark:border-lavender/10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-primary/80 dark:text-ink-200">
          <Filter className="w-4 h-4" />
          {t('admin.quickFilters')}:
        </div>
        {/* City dropdown */}
        <div className="relative" ref={cityDropdownRef}>
          <button
            onClick={() => { setCityDropdownOpen(!cityDropdownOpen); setTimeDropdownOpen(false) }}
            className="bg-transparent dark:bg-white/5 border border-primary/20 dark:border-lavender/10 rounded-lg text-sm text-ink dark:text-gray-200 focus:ring-primary focus:border-primary py-1.5 transition-colors flex items-center gap-2 px-3"
          >
            <span>{selectedCity === 'all' ? t('admin.allCities') : selectedCity}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {cityDropdownOpen && (
            <div className="absolute left-0 mt-3 w-64 sm:w-72 bg-white dark:bg-[#222222] rounded-xl shadow-2xl border border-primary/10 dark:border-0 dark:lavender-border dark:shadow-black/40 overflow-hidden z-[60]">
              <div className="py-2">
                {[{ value: 'all', label: t('admin.allCities') }, ...cities.map(c => ({ value: c, label: c }))].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSelectedCity(opt.value); setCityDropdownOpen(false) }}
                    className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                      selectedCity === opt.value
                        ? 'bg-primary/5 dark:bg-white/5 cursor-default'
                        : 'hover:bg-primary/5 dark:hover:bg-transparent dark:lavender-hover'
                    }`}
                  >
                    <span className={`font-medium ${
                      selectedCity === opt.value
                        ? 'font-semibold text-ink dark:text-white'
                        : 'text-ink/70 dark:text-gray-200'
                    }`}>{opt.label}</span>
                    {selectedCity === opt.value && <Check className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Time filter dropdown */}
        <div className="relative" ref={timeDropdownRef}>
          <button
            onClick={() => { setTimeDropdownOpen(!timeDropdownOpen); setCityDropdownOpen(false) }}
            className="bg-transparent dark:bg-white/5 border border-primary/20 dark:border-lavender/10 rounded-lg text-sm text-ink dark:text-gray-200 focus:ring-primary focus:border-primary py-1.5 transition-colors flex items-center gap-2 px-3"
          >
            <span>{getTimeFilterLabel()}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {timeDropdownOpen && (
            <div className="absolute left-0 mt-3 w-64 sm:w-72 bg-white dark:bg-[#222222] rounded-xl shadow-2xl border border-primary/10 dark:border-0 dark:lavender-border dark:shadow-black/40 overflow-hidden z-[60]">
              <div className="py-2">
                {timeFilterOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setTimeFilter(opt.value); setTimeDropdownOpen(false) }}
                    className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                      timeFilter === opt.value
                        ? 'bg-primary/5 dark:bg-white/5 cursor-default'
                        : 'hover:bg-primary/5 dark:hover:bg-transparent dark:lavender-hover'
                    }`}
                  >
                    <span className={`font-medium ${
                      timeFilter === opt.value
                        ? 'font-semibold text-ink dark:text-white'
                        : 'text-ink/70 dark:text-gray-200'
                    }`}>{opt.label}</span>
                    {timeFilter === opt.value && <Check className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal - Using reusable component */}
      <EventFormModal
        show={showForm}
        editingEvent={editingEvent}
        formData={formData}
        onFormDataChange={setFormData}
        imagePreview={imagePreview}
        uploadingImage={uploadingImage}
        cities={availableCities}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        onImageUpload={handleImageUpload}
        onImageRemove={handleRemoveImage}
        inputClasses={inputClasses}
      />

      {/* Events table */}
      <div className="bg-white dark:bg-ink-800 border border-lavender/10 dark:border-lavender/20 rounded-xl overflow-hidden shadow-xl shadow-lavender/5 dark:shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lavender/5 dark:bg-ink-700/50 text-primary dark:text-ink-100 font-semibold text-sm uppercase tracking-wider border-b border-lavender/10 dark:border-lavender/20">
                <th className="px-6 py-4 text-ink dark:text-ink-100">{t('admin.event')}</th>
                <th className="px-6 py-4 text-ink dark:text-ink-100">{t('admin.city')}</th>
                <th className="px-6 py-4 text-ink dark:text-ink-100">{t('admin.date')}</th>
                <th className="px-6 py-4 text-ink dark:text-ink-100">{t('admin.status')}</th>
                <th className="px-6 py-4 text-right text-ink dark:text-ink-100">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lavender/5 dark:divide-lavender/10">
              {userEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-lavender/10 dark:bg-ink-700 rounded-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-lavender-300 dark:text-lavender-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-400 dark:text-ink-300">{t('admin.noEvents')}</p>
                        <p className="text-xs text-ink-300 dark:text-ink-400 mt-0.5">{t('admin.createFirst')}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEvents.map(event => (
                  <tr key={event.id} className="group hover:bg-lavender/5 dark:hover:bg-ink-700/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-lavender/10 dark:border-lavender/20">
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: `${cityColors[event.city]}15` }}
                          >
                            <Calendar className="w-6 h-6" style={{ color: cityColors[event.city] }} />
                          </div>
                        </div>
                        <span className="font-bold text-lg text-ink dark:text-ink-100 group-hover:text-ink dark:group-hover:text-white transition-colors">{event.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {event.city}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-ink dark:text-ink-200">{formatDateWithLocale(event.start, {
                          locale: i18n.language === 'es' ? 'es-ES' : 'en-US'
                        })}</span>
                        {event.end && event.end !== event.start && (
                          <span className="text-xs text-ink-400 dark:text-ink-400">{t('admin.to')} {formatDateWithLocale(event.end, {
                            locale: i18n.language === 'es' ? 'es-ES' : 'en-US'
                          })}</span>
                        )}
                        {event.time && (
                          <span className="text-xs text-ink-400 dark:text-ink-400">
                            {formatTimeWithMeridiem(event.time)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {(() => {
                        const startDate = event.start ? parseDateOnlyToLocal(event.start) : null
                        const isPast = startDate && !Number.isNaN(startDate.getTime()) && startDate < new Date()
                        return (
                          <span className={`flex items-center gap-1.5 text-sm font-medium ${
                            isPast ? 'text-gray-600 dark:text-gray-400' : 'text-green-600 dark:text-green-400'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${isPast ? 'bg-gray-500' : 'bg-green-500'}`} />
                            {isPast ? t('admin.past') : t('admin.upcoming')}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 hover:bg-lavender/10 dark:hover:bg-white/10 rounded-lg text-ink-400 dark:text-ink-300 hover:text-ink dark:hover:text-white transition-colors"
                          title={t('admin.edit')}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-500 transition-colors"
                          title={t('admin.delete')}
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-lavender/10 dark:border-lavender/20 bg-lavender/5 dark:bg-ink-700/30">
          <div className="text-sm text-ink-400 dark:text-ink-300">
            {t('admin.showing')} <span className="font-bold text-ink dark:text-ink-100">{paginatedEvents.length === 0 ? 0 : (currentPage - 1) * 10 + 1}</span> {t('admin.to')} <span className="font-bold text-ink dark:text-ink-100">{Math.min(currentPage * 10, userEvents.length)}</span> {t('admin.of')} <span className="font-bold text-ink dark:text-ink-100">{userEvents.length}</span> {t('admin.entries')}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={previousPage}
                disabled={!hasPreviousPage}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-lavender/10 dark:border-lavender/20 hover:bg-lavender/10 dark:hover:bg-ink-600 text-ink-400 dark:text-ink-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-ink-400 dark:text-ink-300 px-3">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={!hasNextPage}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-lavender/10 dark:border-lavender/20 hover:bg-lavender/10 dark:hover:bg-ink-600 text-ink-400 dark:text-ink-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
