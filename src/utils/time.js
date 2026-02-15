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

const getBrowserTimeZone = () => {
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    const options = Intl.DateTimeFormat().resolvedOptions?.()
    return options?.timeZone || 'UTC'
  }
  return 'UTC'
}

export const parseDateOnlyToLocal = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return null
  }

  const [year, month, day] = dateString.split('-').map(Number)
  if ([year, month, day].some(value => Number.isNaN(value))) {
    return null
  }

  return new Date(year, month - 1, day)
}

export const formatDateWithLocale = (dateString, {
  locale = 'en-US',
  fallbackLabel = 'Date to be announced',
  options = { month: 'short', day: 'numeric', year: 'numeric' },
  timeZone,
} = {}) => {
  const parsed = parseDateOnlyToLocal(dateString)
  if (!parsed) {
    return fallbackLabel
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: timeZone || getBrowserTimeZone()
  })

  return formatter.format(parsed)
}
