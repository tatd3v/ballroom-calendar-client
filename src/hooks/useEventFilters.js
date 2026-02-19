import { useMemo } from 'react'
import { parseDateOnlyToLocal } from '../utils/time'

/**
 * Custom hook for filtering and sorting events
 * Follows Single Responsibility Principle - handles only event filtering logic
 */
export const useEventFilters = (events, filters = {}) => {
  const {
    searchTerm = '',
    statusFilter = 'all',
    cityFilter = null,
    userCity = null,
    userRole = null
  } = filters

  const filteredAndSortedEvents = useMemo(() => {
    if (!events || events.length === 0) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Apply city filter based on user role
    let filtered = events
    if (userRole !== 'admin' && userCity) {
      filtered = filtered.filter(event => event.city === userCity)
    } else if (cityFilter && cityFilter !== 'all') {
      filtered = filtered.filter(event => event.city === cityFilter)
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const normalizedSearch = searchTerm.trim().toLowerCase()
      filtered = filtered.filter(event => {
        return [event.title, event.city, event.location]
          .filter(Boolean)
          .some(value => value.toLowerCase().includes(normalizedSearch))
      })
    }

    // Apply status filter and add status to events
    filtered = filtered.map(event => {
      const dateVal = event.start || event.date
      const startDate = dateVal ? parseDateOnlyToLocal(dateVal) : null
      const status = startDate && !Number.isNaN(startDate.getTime()) && startDate < today ? 'past' : 'live'
      return { ...event, status }
    })

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = parseDateOnlyToLocal(a.start || a.date)?.getTime() || 0
      const dateB = parseDateOnlyToLocal(b.start || b.date)?.getTime() || 0
      return dateA - dateB
    })
  }, [events, searchTerm, statusFilter, cityFilter, userCity, userRole])

  return filteredAndSortedEvents
}

/**
 * Hook for grouping events by date
 */
export const useGroupedEvents = (events) => {
  return useMemo(() => {
    if (!events || events.length === 0) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Filter upcoming events
    const upcoming = events.filter((event) => {
      if (!event?.start) return true
      const start = parseDateOnlyToLocal(event.start)
      if (!start || Number.isNaN(start.getTime())) return true
      return start >= today
    })

    // Group by date
    const groups = upcoming.reduce((acc, event) => {
      if (!event?.start) return acc
      const key = event.start
      if (!acc[key]) acc[key] = []
      acc[key].push(event)
      return acc
    }, {})

    // Sort groups and items within groups
    return Object.entries(groups)
      .sort((a, b) => {
        const dateA = parseDateOnlyToLocal(a[0])
        const dateB = parseDateOnlyToLocal(b[0])
        return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
      })
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => {
          const dateA = parseDateOnlyToLocal(a.start)
          const dateB = parseDateOnlyToLocal(b.start)
          return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
        }),
      }))
  }, [events])
}
