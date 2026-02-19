/**
 * Utility functions for event operations
 * Follows Single Responsibility Principle - each function has one clear purpose
 */

/**
 * Converts event data to form data format
 */
export const eventToFormData = (event) => {
  if (!event) return null
  
  return {
    title: event.title || '',
    city: event.city || '',
    start: event.start || event.date || '',
    time: event.time || '',
    location: event.location || '',
    description: event.description || '',
    imageUrl: event.imageUrl || ''
  }
}

/**
 * Converts form data to event data format for API submission
 */
export const formDataToEvent = (formData) => {
  return {
    ...formData,
    date: formData.start,
  }
}

/**
 * Creates an empty form object with optional defaults
 */
export const createEmptyForm = (defaults = {}) => {
  return {
    title: '',
    city: '',
    start: '',
    time: '',
    location: '',
    description: '',
    imageUrl: '',
    ...defaults
  }
}

/**
 * Validates event form data
 */
export const validateEventForm = (formData, requiredFields = ['title', 'city', 'start']) => {
  const errors = {}

  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${field} is required`
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Gets city badge component props
 */
export const getCityBadgeProps = (city, cityColors) => {
  const color = cityColors[city] || '#EE0087'
  return {
    color,
    className: 'text-xs px-2 py-0.5 rounded-full font-semibold',
    style: {
      backgroundColor: `${color}20`,
      color: color
    }
  }
}
