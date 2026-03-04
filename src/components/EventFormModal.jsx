import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import EventFormFields from './ui/EventFormFields'

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
          <EventFormFields
            formData={formData}
            onFormDataChange={onFormDataChange}
            imagePreview={imagePreview}
            uploadingImage={uploadingImage}
            cities={cities}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            inputClasses={inputClasses}
            isMobile={false}
          />

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
