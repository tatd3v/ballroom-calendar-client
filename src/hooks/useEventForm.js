import { useState, useCallback } from 'react'

/**
 * Custom hook for managing event form state and operations
 * Follows Single Responsibility Principle - handles only form state management
 */
export const useEventForm = (initialData = {}) => {
  const emptyForm = {
    title: '',
    city: '',
    start: '',
    time: '',
    location: '',
    description: '',
    organizers: [],
    imageUrl: '',
    ...initialData
  }

  const [formData, setFormData] = useState(emptyForm)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const resetForm = useCallback((data = {}) => {
    setFormData({ ...emptyForm, ...data })
    setImagePreview(data.imageUrl || null)
    setFormErrors({})
  }, [emptyForm])

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateMultipleFields = useCallback((fields) => {
    setFormData(prev => ({ ...prev, ...fields }))
  }, [])

  const setError = useCallback((field, message) => {
    setFormErrors(prev => ({ ...prev, [field]: message }))
  }, [])

  const clearError = useCallback((field) => {
    setFormErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setFormErrors({})
  }, [])

  return {
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    uploadingImage,
    setUploadingImage,
    formErrors,
    resetForm,
    updateField,
    updateMultipleFields,
    setError,
    clearError,
    clearAllErrors
  }
}
