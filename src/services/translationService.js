/**
 * Translation service for handling language changes and event translations
 * Follows Single Responsibility Principle - handles only translation logic
 * Follows DRY principle - centralizes all translation operations
 * Integrates with backend translation service for consistency
 */

// Backend translation service constants (matching backend)
const SOURCE_LANG = 'es' // Matches backend SOURCE_LANG
const BACKEND_CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours (matches backend)
const FRONTEND_CACHE_TTL = 5 * 60 * 1000 // 5 minutes (frontend optimization)

// Translation cache to avoid redundant API calls
const TRANSLATION_CACHE = new Map()
const EVENT_CACHE = new Map() // Separate cache for events

/**
 * Cache management with backend integration
 */
export const translationCache = {
  get: (key, useBackendTTL = false) => {
    const cached = TRANSLATION_CACHE.get(key)
    if (!cached) return null
    
    const ttl = useBackendTTL ? BACKEND_CACHE_TTL : FRONTEND_CACHE_TTL
    if (Date.now() - cached.timestamp > ttl) {
      TRANSLATION_CACHE.delete(key)
      return null
    }
    
    return cached.data
  },
  
  set: (key, data, useBackendTTL = false) => {
    TRANSLATION_CACHE.set(key, {
      data,
      timestamp: Date.now(),
      backendCache: useBackendTTL
    })
  },
  
  clear: () => {
    TRANSLATION_CACHE.clear()
    EVENT_CACHE.clear()
  },
  
  // Generate cache keys matching backend patterns
  getEventsKey: (lang, city = 'all', page = 1) => `events_${lang}_${city}_${page}`,
  getEventKey: (id, lang) => `event_${id}_${lang}`,
  getTranslationKey: (text, sourceLang, targetLang) => `${sourceLang}|${targetLang}|${text}`,
  
  // Event-specific cache with longer TTL (matches backend)
  getEvent: (key) => {
    const cached = EVENT_CACHE.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > BACKEND_CACHE_TTL) {
      EVENT_CACHE.delete(key)
      return null
    }
    
    return cached.data
  },
  
  setEvent: (key, data) => {
    EVENT_CACHE.set(key, {
      data,
      timestamp: Date.now()
    })
  }
}

/**
 * Optimistic language change with backend integration
 * Updates UI immediately, coordinates with backend translation service
 */
export const changeLanguageOptimistic = async (i18n, lng, onBackgroundRefresh = null) => {
  // Immediate UI update
  i18n.changeLanguage(lng)
  localStorage.setItem('calendar_lang', lng)
  
  // Clear frontend cache when switching to different language
  if (lng !== i18n.language) {
    translationCache.clear()
  }
  
  // Background refresh (non-blocking)
  if (onBackgroundRefresh) {
    // Use setTimeout to make it truly non-blocking
    setTimeout(() => {
      onBackgroundRefresh(lng).catch(console.error)
    }, 100)
  }
}

/**
 * Backend-aware background refresh utilities
 * Coordinates with backend translation service
 */
export const backgroundRefresh = {
  /**
   * Refresh events data using backend translation service
   */
  refreshEvents: async (lang, fetchEventsFunction) => {
    try {
      // Trigger background refresh using backend translation
      await fetchEventsFunction(lang, 1, null, false)
    } catch (error) {
      console.warn('Background refresh failed:', error)
    }
  },
  
  /**
   * Refresh single event using backend translation
   */
  refreshEvent: async (id, lang, updateCallback) => {
    try {
      // Use backend translation endpoint
      const response = await fetch(`/api/events/${id}?lang=${lang}`)
      if (response.ok) {
        const updatedEvent = await response.json()
        
        // Cache the translated event
        const cacheKey = translationCache.getEventKey(id, lang)
        translationCache.setEvent(cacheKey, updatedEvent)
        
        if (updateCallback) {
          updateCallback(updatedEvent)
        }
      }
    } catch (error) {
      console.warn('Background event refresh failed:', error)
    }
  },
  
  /**
   * Pre-warm cache for common languages
   */
  preWarmCache: async (fetchEventsFunction) => {
    const commonLangs = ['en', 'es']
    
    for (const lang of commonLangs) {
      try {
        await backgroundRefresh.refreshEvents(lang, fetchEventsFunction)
      } catch (error) {
        console.warn(`Cache pre-warming failed for ${lang}:`, error)
      }
    }
  }
}

/**
 * Translation performance monitoring with backend metrics
 */
export const translationMetrics = {
  trackLanguageChange: (fromLang, toLang, duration, cacheHit = false) => {
    console.log(`Language change: ${fromLang} → ${toLang} took ${duration}ms ${cacheHit ? '(cache hit)' : '(cache miss)'}`)
  },
  
  trackCacheHit: (key, type = 'frontend') => {
    console.log(`${type} cache hit for: ${key}`)
  },
  
  trackCacheMiss: (key, type = 'frontend') => {
    console.log(`${type} cache miss for: ${key}`)
  },
  
  trackBackendCall: (endpoint, duration, eventCount = 0) => {
    console.log(`Backend translation call to ${endpoint} took ${duration}ms for ${eventCount} events`)
  }
}

/**
 * Backend translation service integration utilities
 */
export const backendIntegration = {
  /**
   * Check if backend translation is needed
   */
  needsTranslation: (targetLang) => {
    return targetLang !== SOURCE_LANG
  },
  
  /**
   * Get source language (matches backend)
   */
  getSourceLanguage: () => SOURCE_LANG,
  
  /**
   * Build API URL with language parameter
   */
  buildApiUrl: (baseUrl, lang, additionalParams = {}) => {
    const url = new URL(baseUrl, window.location.origin)
    url.searchParams.set('lang', lang)
    
    // Add additional parameters like limit, page, etc.
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value)
      }
    })
    
    return url.toString()
  }
}
