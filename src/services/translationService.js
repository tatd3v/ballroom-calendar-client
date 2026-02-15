const CACHE_KEY = 'event_translations'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// In-memory cache for current session
const memoryCache = new Map()

function getStorageCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    // Prune expired entries
    const now = Date.now()
    const valid = {}
    for (const [key, entry] of Object.entries(parsed)) {
      if (now - entry.timestamp < CACHE_TTL) {
        valid[key] = entry
      }
    }
    return valid
  } catch {
    return {}
  }
}

function setStorageCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Storage full — clear old translations
    localStorage.removeItem(CACHE_KEY)
  }
}

function cacheKey(text, sourceLang, targetLang) {
  return `${sourceLang}|${targetLang}|${text}`
}

/**
 * Translate a single text string using MyMemory API (free, no key required).
 * Rate limit: 5000 chars/day for anonymous, 50000 with email.
 */
async function translateText(text, sourceLang = 'es', targetLang = 'en') {
  if (!text || !text.trim()) return text
  if (sourceLang === targetLang) return text

  const key = cacheKey(text, sourceLang, targetLang)

  // Check memory cache first
  if (memoryCache.has(key)) return memoryCache.get(key)

  // Check localStorage cache
  const storageCache = getStorageCache()
  if (storageCache[key]) {
    memoryCache.set(key, storageCache[key].text)
    return storageCache[key].text
  }

  try {
    const langPair = `${sourceLang}|${targetLang}`
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Translation API error')
    
    const data = await response.json()
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      let translated = data.responseData.translatedText
      // MyMemory sometimes returns all-caps for short strings — fix casing
      if (translated === translated.toUpperCase() && text !== text.toUpperCase()) {
        translated = translated.charAt(0).toUpperCase() + translated.slice(1).toLowerCase()
      }
      
      // Cache the result
      memoryCache.set(key, translated)
      storageCache[key] = { text: translated, timestamp: Date.now() }
      setStorageCache(storageCache)
      
      return translated
    }
    
    return text // Fallback to original
  } catch (error) {
    console.warn('Translation failed for:', text.substring(0, 30), error.message)
    return text // Fallback to original
  }
}

/**
 * Translate an array of events' title and description fields.
 * Assumes events are stored in `sourceLang` and need translation to `targetLang`.
 * Returns a new array with translated fields.
 */
export async function translateEvents(events, sourceLang, targetLang) {
  if (!events || events.length === 0) return events
  if (sourceLang === targetLang) return events

  // Batch all translation promises
  const translationPromises = events.map(async (event) => {
    const [translatedTitle, translatedDescription] = await Promise.all([
      translateText(event.title, sourceLang, targetLang),
      event.description ? translateText(event.description, sourceLang, targetLang) : Promise.resolve(event.description)
    ])

    return {
      ...event,
      title: translatedTitle,
      description: translatedDescription,
      _originalTitle: event._originalTitle || event.title,
      _originalDescription: event._originalDescription || event.description,
    }
  })

  return Promise.all(translationPromises)
}

/**
 * Clear the translation cache (useful for debugging or manual refresh).
 */
export function clearTranslationCache() {
  memoryCache.clear()
  localStorage.removeItem(CACHE_KEY)
}

export default translateText
