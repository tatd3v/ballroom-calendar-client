import { X, Save, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import MobileFormInput from './MobileFormInput'
import MobileFormTextarea from './MobileFormTextarea'
import MobileFormSelect from './MobileFormSelect'

/**
 * Reusable mobile event form modal component
 * Follows Single Responsibility Principle - handles only form UI rendering
 * Follows Open/Closed Principle - open for extension via props, closed for modification
 */
export default function MobileEventFormModal({
  show,
  editingEvent,
  formData,
  onFormDataChange,
  imagePreview,
  uploadingImage,
  formErrors,
  cities,
  userRole,
  onClose,
  onSubmit,
  onImageUpload,
  onImageRemove
}) {
  const { t } = useTranslation()

  if (!show) return null

  const handleFieldChange = (field, value) => {
    onFormDataChange({ ...formData, [field]: value })
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end" 
      onClick={onClose}
    >
      <div 
        className="w-full bg-white dark:bg-background-dark rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-background-dark border-b border-lavender/20 dark:border-ink/20 px-4 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-orange" />
            <h2 className="text-xl font-bold text-ink dark:text-white">
              {editingEvent ? t('admin.editEvent', 'Edit Event') : t('admin.newEvent', 'New Event')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-lavender/20 dark:hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-ink/60 dark:text-white/60" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-4 space-y-4">
          {formErrors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400">
              {formErrors.submit}
            </div>
          )}

          <MobileFormInput
            label={t('admin.title', 'Event Title')}
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder={t('admin.eventTitle', 'Enter event title')}
            required
            error={formErrors.title}
          />

          <MobileFormSelect
            label={t('admin.city', 'City')}
            value={formData.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            options={cities}
            required
            error={formErrors.city}
          />

          <div className="grid grid-cols-2 gap-3">
            <MobileFormInput
              label={t('admin.startDate', 'Date')}
              type="date"
              value={formData.start}
              onChange={(e) => handleFieldChange('start', e.target.value)}
              required
              error={formErrors.start}
            />

            <MobileFormInput
              label={t('admin.time', 'Time')}
              type="time"
              value={formData.time}
              onChange={(e) => handleFieldChange('time', e.target.value)}
              error={formErrors.time}
            />
          </div>

          <MobileFormInput
            label={t('admin.location', 'Location')}
            value={formData.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            placeholder={t('admin.eventLocation', 'Enter venue or location')}
            error={formErrors.location}
          />

          <MobileFormTextarea
            label={t('admin.description', 'Description')}
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder={t('admin.eventDescription', 'Enter event description')}
            rows={4}
            error={formErrors.description}
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-white mb-2">
              {t('admin.eventImage', 'Event Image')}
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Event preview" 
                  className="w-full h-48 object-cover rounded-xl border border-lavender-100 dark:border-white/10"
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
              <div className="border-2 border-dashed border-lavender-200 dark:border-white/20 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="mobile-image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={onImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <label 
                  htmlFor="mobile-image-upload" 
                  className={`cursor-pointer flex flex-col items-center gap-3 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploadingImage ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  ) : (
                    <Upload className="w-8 h-8 text-ink/40 dark:text-white/40" />
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
            {formErrors.image && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.image}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-background-dark pb-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-lavender-100 dark:border-white/10 rounded-xl text-sm font-semibold text-ink dark:text-white hover:bg-lavender/10 dark:hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
              {t('admin.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
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
