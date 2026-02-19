import { X, Save, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * Reusable desktop event form modal component
 * Follows Single Responsibility Principle - handles only form UI rendering
 * Follows Open/Closed Principle - open for extension via props
 */
export default function EventFormModal({
  show,
  editingEvent,
  formData,
  onFormDataChange,
  imagePreview,
  uploadingImage,
  cities,
  onClose,
  onSubmit,
  onImageUpload,
  onImageRemove,
  inputClasses = "w-full px-3.5 py-2.5 border border-lavender-100 dark:border-lavender/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white dark:bg-ink-700 text-ink dark:text-ink-100 placeholder:text-ink-300 dark:placeholder-ink-400 transition-all duration-200"
}) {
  const { t } = useTranslation()

  if (!show) return null

  const handleFieldChange = (field, value) => {
    onFormDataChange({ ...formData, [field]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-ink-800 border-b border-lavender-100 dark:border-lavender/20 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-ink dark:text-white">
            {editingEvent ? t('admin.editEvent', 'Edit Event') : t('admin.newEvent', 'New Event')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-lavender/10 dark:hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-ink-400 dark:text-ink-200" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
              {t('admin.title', 'Event Title')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className={inputClasses}
              placeholder={t('admin.eventTitle', 'Enter event title')}
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
              {t('admin.city', 'City')} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              className={inputClasses}
              required
            >
              <option value="">{t('admin.selectCity', 'Select a city')}</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
                {t('admin.startDate', 'Date')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.start}
                onChange={(e) => handleFieldChange('start', e.target.value)}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
                {t('admin.time', 'Time')}
              </label>
              <input
                type="time"
                value={formData.time || ''}
                onChange={(e) => handleFieldChange('time', e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
              {t('admin.location', 'Location')}
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              className={inputClasses}
              placeholder={t('admin.eventLocation', 'Enter venue or location')}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
              {t('admin.description', 'Description')}
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className={inputClasses}
              rows={4}
              placeholder={t('admin.eventDescription', 'Enter event description')}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
              {t('admin.eventImage', 'Event Image')}
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Event preview" 
                  className="w-full h-48 object-cover rounded-xl border border-lavender-100 dark:border-lavender/20"
                />
                <button
                  type="button"
                  onClick={onImageRemove}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-lavender-200 dark:border-lavender/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="desktop-image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={onImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <label 
                  htmlFor="desktop-image-upload" 
                  className={`cursor-pointer flex flex-col items-center gap-3 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploadingImage ? (
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  ) : (
                    <Upload className="w-10 h-10 text-ink/40 dark:text-white/40" />
                  )}
                  <div className="text-sm">
                    <span className="text-primary font-semibold">
                      {uploadingImage ? t('admin.uploading', 'Uploading...') : t('admin.clickToUpload', 'Click to upload')}
                    </span>
                    <span className="text-ink/40 dark:text-white/40 ml-1">
                      {t('admin.orDragDrop', 'or drag and drop')}
                    </span>
                  </div>
                  <p className="text-xs text-ink/40 dark:text-white/40">
                    PNG, JPG, WebP {t('admin.upTo', 'up to')} 5MB
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-lavender-100 dark:border-lavender/20 rounded-xl text-sm font-semibold text-ink dark:text-white hover:bg-lavender/10 dark:hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
              {t('admin.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Save className="w-4 h-4" />
              {editingEvent ? t('admin.update', 'Update') : t('admin.create', 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
