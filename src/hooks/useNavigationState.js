import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Custom hook for navigation state management
 * Follows Single Responsibility Principle - handles only navigation state
 * Follows DRY principle - centralizes all navigation state logic
 */
export function useNavigationState() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopLanguageOpen, setDesktopLanguageOpen] = useState(false)
  const [mobileLanguageOpen, setMobileLanguageOpen] = useState(false)
  const location = useLocation()

  // Reset all navigation states when route changes
  useEffect(() => {
    setMenuOpen(false)
    setDesktopLanguageOpen(false)
    setMobileLanguageOpen(false)
  }, [location.pathname])

  return {
    menuOpen,
    setMenuOpen,
    desktopLanguageOpen,
    setDesktopLanguageOpen,
    mobileLanguageOpen,
    setMobileLanguageOpen
  }
}
