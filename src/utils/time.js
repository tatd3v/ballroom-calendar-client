export const formatTimeWithMeridiem = (time, { fallbackLabel = 'All day', includeMeridiem = true } = {}) => {
  if (!time || typeof time !== 'string') {
    return fallbackLabel
  }

  const normalized = time.length === 5 ? `${time}:00` : time
  const parsed = new Date(`1970-01-01T${normalized}`)
  if (Number.isNaN(parsed.getTime())) {
    return fallbackLabel
  }

  const hours = parsed.getHours()
  const minutes = parsed.getMinutes()
  const displayHours = ((hours + 11) % 12) + 1
  const minuteString = minutes.toString().padStart(2, '0')
  const meridiem = hours >= 12 ? 'PM' : 'AM'

  return includeMeridiem ? `${displayHours}:${minuteString} ${meridiem}` : `${displayHours}:${minuteString}`
}

export const parseDateOnlyToLocal = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return null
  }

  const trimmed = dateString.trim()

  // Extract the date portion (YYYY-MM-DD) from ISO strings like "2025-03-15T00:00:00.000Z".
  // We must NOT use getFullYear/getMonth/getDate on a UTC-midnight Date object because
  // those return local-time components — in UTC-5 (Colombia) that shifts the date back one day.
  const datePart = trimmed.length > 10 ? trimmed.slice(0, 10) : trimmed

  const [year, month, day] = datePart.split('-').map(Number)
  if ([year, month, day].some(value => Number.isNaN(value))) {
    return null
  }

  // Create at noon local time so DST edge-cases never shift the day
  return new Date(year, month - 1, day, 12, 0, 0)
}

export const formatDateWithLocale = (dateString, {
  locale = 'en-US',
  fallbackLabel = 'Date to be announced',
  options = { month: 'short', day: 'numeric', year: 'numeric' },
} = {}) => {
  const parsed = parseDateOnlyToLocal(dateString)
  if (!parsed) {
    return fallbackLabel
  }

  // Format without timezone to ensure consistent display across all timezones
  // The date will always show as stored in the database
  const formatter = new Intl.DateTimeFormat(locale, options)

  return formatter.format(parsed)
}
