import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import RichTextEditor from './RichTextEditor'

/**
 * Reusable event form fields component
 * Follows Single Responsibility Principle - handles only form field rendering
 * Follows DRY principle - eliminates duplication between desktop and mobile forms
 */
export default function EventFormFields({
  formData,
  onFormDataChange,
  imagePreview,
  uploadingImage,
  cities,
  onImageUpload,
  onImageRemove,
  inputClasses = "w-full px-3.5 py-2.5 border border-lavender-100 dark:border-lavender/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white dark:bg-ink-700 text-ink dark:text-ink-100 placeholder:text-ink-300 dark:placeholder-ink-400 transition-all duration-200",
  formErrors = {},
  isMobile = false
}) {
  const { t } = useTranslation()
  const [organizerInput, setOrganizerInput] = useState('')

  const handleFieldChange = (field, value) => {
    onFormDataChange({ ...formData, [field]: value })
  }

  const handleOrganizerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const name = organizerInput.trim()
      if (name && !(formData.organizers || []).includes(name)) {
        handleFieldChange('organizers', [...(formData.organizers || []), name])
      }
      setOrganizerInput('')
    }
  }

  const removeOrganizer = (name) => {
    handleFieldChange('organizers', (formData.organizers || []).filter(o => o !== name))
  }

  const FieldWrapper = ({ children, error }) => {
    if (isMobile) {
      return (
        <div>
          {children}
          {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
        </div>
      )
    }
    return <>{children}</>
  }

  const InputField = ({ label, name, type = 'text', placeholder, required, error, ...props }) => (
    <FieldWrapper error={error}>
      <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[name] || ''}
        onChange={(e) => handleFieldChange(name, e.target.value)}
        className={inputClasses}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </FieldWrapper>
  )

  const SelectField = ({ label, name, options, required, error, ...props }) => (
    <FieldWrapper error={error}>
      <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={formData[name] || ''}
        onChange={(e) => handleFieldChange(name, e.target.value)}
        className={inputClasses}
        required={required}
        {...props}
      >
        <option value="">{t('admin.selectCity', 'Select a city')}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </FieldWrapper>
  )

  const uploadId = isMobile ? 'mobile-image-upload' : 'desktop-image-upload'
  const uploadPadding = isMobile ? 'p-6' : 'p-8'
  const uploadIconSize = isMobile ? 'w-8 h-8' : 'w-10 h-10'
  const spinnerSize = isMobile ? 'h-8 w-8' : 'h-10 w-10'

  return (
    <div className="space-y-4">
      {/* Title */}
      <InputField
        label={t('admin.title', 'Event Title')}
        name="title"
        placeholder={t('admin.eventTitle', 'Enter event title')}
        required
        error={formErrors.title}
      />

      {/* City */}
      <SelectField
        label={t('admin.city', 'City')}
        name="city"
        options={cities}
        required
        error={formErrors.city}
      />

      {/* Date and Time */}
      <div className={isMobile ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-2 gap-4'}>
        <InputField
          label={t('admin.startDate', 'Date')}
          name="start"
          type="date"
          required
          error={formErrors.start}
        />
        <InputField
          label={t('admin.time', 'Time')}
          name="time"
          type="time"
          error={formErrors.time}
        />
      </div>

      {/* Location */}
      <InputField
        label={t('admin.location', 'Location')}
        name="location"
        placeholder={t('admin.eventLocation', 'Enter venue or location')}
        error={formErrors.location}
      />

      {/* Description */}
      <FieldWrapper error={formErrors.description}>
        <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
          {t('admin.description', 'Description')}
        </label>
        <RichTextEditor
          value={formData.description || ''}
          onChange={(html) => handleFieldChange('description', html)}
          placeholder={t('admin.eventDescription', 'Enter event description')}
        />
      </FieldWrapper>

      {/* Organizers */}
      <div>
        <label className="block text-sm font-semibold text-ink dark:text-white mb-1.5">
          {t('admin.organizers', 'Organizers')}
        </label>
        <div className={`border ${isMobile ? 'border-lavender/20 dark:border-white/10 bg-white dark:bg-white/5' : 'border-lavender-100 dark:border-lavender/20 bg-white dark:bg-ink-700'} rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all p-2 flex flex-wrap gap-1.5 min-h-[44px]`}>
          {(formData.organizers || []).map((name, index) => (
            <span key={`${name}-${index}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
              {name}
              <button type="button" onClick={() => removeOrganizer(name)} className="hover:text-primary/60 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={organizerInput}
            onChange={(e) => setOrganizerInput(e.target.value)}
            onKeyDown={handleOrganizerKeyDown}
            onBlur={() => {
              const name = organizerInput.trim()
              if (name && !(formData.organizers || []).includes(name)) {
                handleFieldChange('organizers', [...(formData.organizers || []), name])
              }
              setOrganizerInput('')
            }}
            className={`flex-1 min-w-[140px] text-sm bg-transparent ${isMobile ? 'text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-white/40' : 'text-ink dark:text-ink-100 placeholder:text-ink-300 dark:placeholder-ink-400'} outline-none px-1.5 py-0.5`}
            placeholder={t('admin.organizersPlaceholder', 'Type a name and press Enter')}
          />
        </div>
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
          <div className={`border-2 border-dashed ${isMobile ? 'border-lavender-200 dark:border-white/20' : 'border-lavender-200 dark:border-lavender/30'} rounded-xl ${uploadPadding} text-center hover:border-primary/50 transition-colors`}>
            <input
              type="file"
              id={uploadId}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
            <label 
              htmlFor={uploadId} 
              className={`cursor-pointer flex flex-col items-center gap-3 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploadingImage ? (
                <div className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-primary`}></div>
              ) : (
                <Upload className={`${uploadIconSize} text-ink/40 dark:text-white/40`} />
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
    </div>
  )
}
