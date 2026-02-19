import { useMemo } from 'react'
import { 
  CalendarDays, 
  Settings, 
  LogOut, 
  User,
  MapPin,
  Globe
} from 'lucide-react'

/**
 * Custom hook for generating mobile menu sections
 * Follows Single Responsibility Principle - handles only menu configuration
 * Follows Open/Closed Principle - can be extended without modification
 */
export const useMobileMenuSections = ({
  user,
  navigate,
  logout,
  t,
  showAdminLink = true,
  showCalendarLink = true,
}) => {
  return useMemo(() => {
    const sections = []

    // Navigation section
    const navigationItems = []

    if (showCalendarLink) {
      navigationItems.push({
        icon: CalendarDays,
        label: t('nav.calendar', 'Calendar'),
        onClick: () => navigate('/'),
        show: true,
      })
    }

    if (user && showAdminLink) {
      navigationItems.push({
        icon: Settings,
        label: t('nav.admin', 'Admin'),
        onClick: () => navigate('/admin'),
        show: true
      })
    }

    if (navigationItems.some(item => item.show)) {
      sections.push({
        title: t('mobile.navigation', 'Navigation'),
        items: navigationItems.filter(item => item.show),
      })
    }

    // Account section (only if user is logged in)
    if (user) {
      sections.push({
        title: t('mobile.account', 'Account'),
        items: [
          {
            icon: User,
            label: t('mobile.profile', 'Profile'),
            onClick: () => {}, // TODO: Implement profile page
            show: false // Hidden for now
          },
          {
            icon: LogOut,
            label: t('nav.logout', 'Logout'),
            onClick: logout,
            show: true,
            destructive: true
          }
        ].filter(item => item.show)
      })
    }

    return sections
  }, [user, navigate, logout, t, showAdminLink, showCalendarLink])
}

/**
 * Hook for generating admin-specific menu sections
 */
export const useAdminMenuSections = ({ navigate, t }) => {
  return useMemo(() => [
    {
      title: t('mobile.quickActions', 'Quick Actions'),
      items: [
        {
          icon: CalendarDays,
          label: t('nav.viewCalendar', 'View Calendar'),
          action: () => navigate('/'),
          show: true
        },
        {
          icon: MapPin,
          label: t('admin.manageCities', 'Manage Cities'),
          action: () => {}, // TODO: Implement cities management
          show: false // Hidden for now
        }
      ].filter(item => item.show)
    }
  ], [navigate, t])
}
