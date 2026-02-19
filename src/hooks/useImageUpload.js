import { useState, useCallback } from 'react'

/**
 * Custom hook for handling image upload operations
 * Follows Single Responsibility Principle - handles only image upload logic
 */
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  const validateImage = useCallback((file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB'
    }

    return null
  }, [])

  const uploadImage = useCallback(async (file) => {
    const validationError = validateImage(file)
    if (validationError) {
      setError(validationError)
      return { success: false, error: validationError }
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const token = localStorage.getItem('calendar_token')
      const headers = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/events/upload-image', {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setPreview(data.imageUrl)
      
      return { success: true, url: data.imageUrl }
    } catch (err) {
      const errorMessage = 'Failed to upload image. Please try again.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setUploading(false)
    }
  }, [validateImage])

  const removeImage = useCallback(() => {
    setPreview(null)
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setPreview(null)
    setError(null)
    setUploading(false)
  }, [])

  return {
    uploading,
    preview,
    error,
    uploadImage,
    removeImage,
    setPreview,
    reset
  }
}
