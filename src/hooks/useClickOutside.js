import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Custom hook for handling click outside of elements
 * Follows Single Responsibility Principle - handles only outside click detection
 * 
 * @param {Function} callback - Function to call when clicking outside
 * @param {boolean} enabled - Whether the listener is enabled
 * @returns {React.RefObject} - Ref to attach to the element
 */
export const useClickOutside = (callback, enabled = true) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [callback, enabled])

  return ref
}

/**
 * Hook for managing multiple dropdowns with click outside handling
 * 
 * @param {Array<string>} dropdownIds - Array of dropdown identifiers
 * @returns {Object} - Object with state and handlers for each dropdown
 */
export const useDropdowns = (dropdownIds = []) => {
  const [openDropdowns, setOpenDropdowns] = useState({})

  const toggleDropdown = useCallback((id) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

  const openDropdown = useCallback((id) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: true }))
  }, [])

  const closeDropdown = useCallback((id) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: false }))
  }, [])

  const closeAllDropdowns = useCallback(() => {
    setOpenDropdowns({})
  }, [])

  const isOpen = useCallback((id) => {
    return !!openDropdowns[id]
  }, [openDropdowns])

  return {
    openDropdowns,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    closeAllDropdowns,
    isOpen
  }
}
