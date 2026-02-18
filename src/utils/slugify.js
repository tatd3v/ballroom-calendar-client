/**
 * Convert text to URL-friendly slug
 * @param {string} text - Text to slugify
 * @returns {string} - Slugified text
 */
export function slugify(text) {
  if (!text) return ''
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except -
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
}

/**
 * Generate event URL with slug
 * @param {Object} event - Event object
 * @returns {string} - Event URL path
 */
export function getEventUrl(event) {
  if (!event || !event.title) return '/calendar'
  
  const slug = slugify(event.title)
  return slug ? `/event/${slug}` : '/calendar'
}

/**
 * Find event by slug from events array
 * @param {string} slug - Event slug
 * @param {Array} events - Events array
 * @returns {Object|null} - Found event or null
 */
export function findEventBySlug(slug, events) {
  if (!slug || !events) return null
  
  return events.find(event => slugify(event.title) === slug) || null
}
