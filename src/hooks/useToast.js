import { useState, useCallback } from 'react'

/**
 * Custom hook for managing toast notifications
 * Follows Single Responsibility Principle - handles only toast state and display
 */
export const useToast = (defaultDuration = 3000) => {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success', duration = defaultDuration) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), duration)
  }, [defaultDuration])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  const showSuccess = useCallback((message, duration) => {
    showToast(message, 'success', duration)
  }, [showToast])

  const showError = useCallback((message, duration) => {
    showToast(message, 'error', duration)
  }, [showToast])

  const showWarning = useCallback((message, duration) => {
    showToast(message, 'warning', duration)
  }, [showToast])

  const showInfo = useCallback((message, duration) => {
    showToast(message, 'info', duration)
  }, [showToast])

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
