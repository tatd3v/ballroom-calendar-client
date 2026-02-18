import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import { useTheme } from '../context/ThemeContext'
import useMobile from '../hooks/useMobile'
import { InlineLoader } from '../components/ui/CustomLoader'
import { 
  AlertTriangle, 
  CheckCircle, 
  CalendarDays, 
  MapPin, 
  Clock,
  Plus,
  Search,
  Save, 
  Edit, 
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X, 
  Settings,
  Filter,
  Upload,
  Image,
  Star
} from 'lucide-react'

export default function AdminPage() {
  // Context hooks first
  const { user, canEditCity } = useAuth()
  const { events, cities, cityColors, selectedCity, setSelectedCity, addEvent, updateEvent, deleteEvent } = useEvents()
  const { t, i18n } = useTranslation()
  const isMobile = useMobile()
  const location = useLocation()
  
  // State hooks
  const [editingEvent, setEditingEvent] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(null)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [timeFilter, setTimeFilter] = useState('upcoming30')
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    start: '',
    description: '',
    time: '',
    location: '',
    imageUrl: ''
  })
  
  // Refs and constants
  const ITEMS_PER_PAGE = 10
  const cityDropdownRef = useRef(null)
  const timeDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setCityDropdownOpen(false)
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setTimeDropdownOpen(false)
      }
    }
    if (cityDropdownOpen || timeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [cityDropdownOpen, timeDropdownOpen])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCity, events?.length])

  const handleEdit = useCallback((event) => {
    setFormData({
      title: event.title,
      city: event.city,
      start: event.start,
      end: event.end || '',
      description: event.description || '',
      imageUrl: event.imageUrl || ''
    })
    setImagePreview(event.imageUrl || null)
    setEditingEvent(event)
    setShowForm(true)
  }, [])

  // Handle edit state from navigation
  useEffect(() => {
    if (location.state?.editingEvent) {
      handleEdit(location.state.editingEvent)
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title)
    }
  }, [location.state, handleEdit])

  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // Move mobile check to the end after all hooks have been called
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

  const userEvents = user.role === 'admin' 
    ? selectedCity === 'all' 
      ? (events || [])
      : (events || []).filter(e => e.city === selectedCity)
    : (events || []).filter(e => e.city === user.city)

  // Debug logging
  console.log('Admin Debug:', {
    userRole: user?.role,
    selectedCity,
    eventsLength: events?.length,
    userEventsLength: userEvents.length,
    firstEvent: events?.[0]
  })

  const totalPages = Math.max(1, Math.ceil(userEvents.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginatedEvents = userEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid file type. Only JPEG, PNG, and WebP are allowed.', 'error')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB.', 'error')
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const token = localStorage.getItem('token')
      const response = await fetch('/api/events/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const result = await response.json()
      setFormData({ ...formData, imageUrl: result.imageUrl })
      setImagePreview(result.imageUrl)
      showToast('Image uploaded successfully!')
    } catch (error) {
      showToast('Failed to upload image: ' + error.message, 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' })
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData)
        showToast(t('admin.eventUpdated'))
      } else {
        await addEvent(formData)
        showToast(t('admin.eventCreated'))
      }
      setFormData(emptyForm)
      setEditingEvent(null)
      setShowForm(false)
    } catch (err) {
      showToast(err.message || t('admin.somethingWrong'), 'error')
    }
  }

  const handleDelete = async (id) => {
    if (confirm(t('admin.confirmDelete'))) {
      try {
        await deleteEvent(id)
        showToast(t('admin.eventDeleted'))
      } catch (err) {
        showToast(err.message || t('admin.failedDelete'), 'error')
      }
    }
  }

  const handleCancel = () => {
    setFormData(emptyForm)
    setImagePreview(null)
    setEditingEvent(null)
    setShowForm(false)
  }

  const inputClasses = "w-full px-3.5 py-2.5 border border-lavender-100 dark:border-lavender/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white dark:bg-ink-700 text-ink dark:text-ink-100 placeholder:text-ink-300 dark:placeholder-ink-400 transition-all duration-200"

  return (
    <div className="space-y-5">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-24 right-4 z-50 animate-slide-down flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold ${
          toast.type === 'error' 
            ? 'bg-orange-50 dark:bg-orange/10 text-orange border border-orange-100 dark:border-orange/30' 
            : 'bg-lime-50 dark:bg-lime/10 text-lime-500 border border-lime-100 dark:border-lime/30'
        }`}>
          {toast.type === 'error' 
            ? <AlertTriangle className="w-4 h-4" /> 
            : <CheckCircle className="w-4 h-4" />
          }
          {toast.message}
        </div>
      )}

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

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 animate-fade-in-up border border-lavender/10 dark:border-lavender/20 shadow-xl shadow-lavender/5 dark:shadow-black/40">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-6 rounded-full bg-gradient-to-b from-primary to-orange" />
            <h2 className="font-bold text-ink dark:text-ink-100">
              {editingEvent ? t('admin.editEvent') : t('admin.newEvent')}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink-400 dark:text-ink-300 mb-1.5 uppercase tracking-wide">{t('admin.title')}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClasses}
                  placeholder={t('admin.eventTitle')}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-400 dark:text-ink-300 mb-1.5 uppercase tracking-wide">{t('admin.city')}</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={inputClasses}
                  required
                >
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-400 dark:text-ink-300 mb-1.5 uppercase tracking-wide">{t('admin.startDate')}</label>
                <input
                  type="date"
                  value={formData.start}
                  onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-400 dark:text-ink-300 mb-1.5 uppercase tracking-wide">{t('admin.endDate')}</label>
                <input
                  type="date"
                  value={formData.end}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-400 dark:text-ink-300 mb-1.5 uppercase tracking-wide">{t('admin.description')}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={inputClasses + " resize-none"}
                rows={3}
                placeholder={t('admin.eventDescription')}
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-xs font-bold text-ink-400 dark:text-ink-300 mb-1.5 uppercase tracking-wide">{t('admin.eventImage')}</label>
              
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Event preview" 
                    className="w-full h-48 object-cover rounded-xl border border-lavender-100 dark:border-lavender/20"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-lavender-200 dark:border-lavender/30 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label 
                    htmlFor="image-upload" 
                    className={`cursor-pointer flex flex-col items-center gap-3 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploadingImage ? (
                      <InlineLoader size="large" />
                    ) : (
                      <Upload className="w-8 h-8 text-ink-400 dark:text-ink-500" />
                    )}
                    <div className="text-sm">
                      <span className="text-primary font-semibold hover:text-primary-600 transition-colors">
                        {uploadingImage ? 'Uploading...' : 'Click to upload'}
                      </span>
                      <span className="text-ink-400 dark:text-ink-500 ml-1">
                        or drag and drop
                      </span>
                    </div>
                    <p className="text-xs text-ink-400 dark:text-ink-500">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 border border-lavender-100 dark:border-lavender/20 rounded-xl text-sm font-semibold text-ink-400 dark:text-ink-300 hover:bg-lavender-50 dark:hover:bg-ink-600 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                {t('admin.cancel')}
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-primary/20 hover:shadow-glow-primary transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                {editingEvent ? t('admin.update') : t('admin.create')}
              </button>
            </div>
          </form>
        </div>
      )}

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
            {t('admin.showing')} <span className="font-bold text-ink dark:text-ink-100">{userEvents.length === 0 ? 0 : startIndex + 1}</span>{t('admin.to')}<span className="font-bold text-ink dark:text-ink-100">{Math.min(startIndex + ITEMS_PER_PAGE, userEvents.length)}</span> {t('admin.of')} <span className="font-bold text-ink dark:text-ink-100">{userEvents.length}</span> {t('admin.entries')}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-lavender/10 dark:border-lavender/20 hover:bg-lavender/10 dark:hover:bg-ink-600 text-ink-400 dark:text-ink-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg font-semibold transition-colors ${
                    page === safePage
                      ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20'
                      : 'border border-lavender/10 dark:border-lavender/20 hover:bg-lavender/10 dark:hover:bg-ink-600 text-ink-400 dark:text-ink-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
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
