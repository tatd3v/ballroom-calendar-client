import { useState, useCallback } from 'react'

/**
 * Custom hook for mobile menu state management
 * Follows Single Responsibility Principle - only handles menu state
 */
export function useMobileMenu(initialState = false) {
  const [menuOpen, setMenuOpen] = useState(initialState)

  const openMenu = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev)
  }, [])

  return {
    menuOpen,
    setMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu
  }
}
