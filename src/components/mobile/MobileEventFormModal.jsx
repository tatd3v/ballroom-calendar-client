import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import EventFormFields from '../ui/EventFormFields'

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

          <EventFormFields
            formData={formData}
            onFormDataChange={onFormDataChange}
            imagePreview={imagePreview}
            uploadingImage={uploadingImage}
            cities={cities}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            formErrors={formErrors}
            isMobile={true}
          />

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
