import { useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useEvents } from '../context/EventContext'
import { 
  changeLanguageOptimistic, 
  translationCache, 
  backgroundRefresh, 
  translationMetrics, 
  backendIntegration 
} from '../services/translationService'

/**
 * Custom hook for translation management with backend integration
 * Follows Single Responsibility Principle - handles only translation state and logic
 * Follows DRY principle - centralizes translation operations
 * Integrates with backend translation service for consistency
 */
export function useTranslationManager() {
  const { i18n } = useTranslation()
  const { fetchEvents } = useEvents()
  const languageChangeStartRef = useRef(null)
  const currentLangRef = useRef(i18n.language)
  
  // Update current language ref when i18n language changes
  useEffect(() => {
    currentLangRef.current = i18n.language
  }, [i18n.language])

  /**
   * Optimistic language change with backend integration
   * Updates UI immediately, coordinates with backend translation service
   */
  const changeLanguage = useCallback(async (targetLang) => {
    const startTime = Date.now()
    const currentLang = currentLangRef.current
    
    languageChangeStartRef.current = startTime
    
    // Check if backend translation is needed
    const needsBackendTranslation = backendIntegration.needsTranslation(targetLang)
    
    // Change language immediately (optimistic UI update)
    await changeLanguageOptimistic(
      i18n, 
      targetLang, 
      (lang) => backgroundRefresh.refreshEvents(lang, fetchEvents)
    )
    
    // Track performance
    const duration = Date.now() - startTime
    translationMetrics.trackLanguageChange(currentLang, targetLang, duration)
    
    // Log backend integration info
    if (needsBackendTranslation) {
      console.log(`Backend translation will be used for ${targetLang}`)
    }
  }, [i18n, fetchEvents])

  /**
   * Enhanced language change with backend-aware caching
   * Uses backend translation service intelligently
   */
  const changeLanguageWithCache = useCallback(async (targetLang) => {
    const startTime = Date.now()
    const currentLang = currentLangRef.current
    
    languageChangeStartRef.current = startTime
    
    // Check if we have cached data for target language
    const cacheKey = translationCache.getEventsKey(targetLang, 'all', 1)
    const cachedEvents = translationCache.get(cacheKey, true) // Use backend TTL
    
    const isCacheHit = !!cachedEvents
    
    // Change language immediately
    i18n.changeLanguage(targetLang)
    localStorage.setItem('calendar_lang', targetLang)
    
    if (cachedEvents) {
      // Use cached data immediately, refresh in background
      translationMetrics.trackCacheHit(cacheKey, 'backend')
      setTimeout(() => {
        backgroundRefresh.refreshEvents(targetLang, fetchEvents)
      }, 100)
    } else {
      // No cache, fetch immediately but non-blocking
      translationMetrics.trackCacheMiss(cacheKey, 'backend')
      setTimeout(() => {
        backgroundRefresh.refreshEvents(targetLang, fetchEvents)
      }, 100)
    }
    
    // Track performance
    const duration = Date.now() - startTime
    translationMetrics.trackLanguageChange(currentLang, targetLang, duration, isCacheHit)
    
    // Log backend integration info
    const needsBackendTranslation = backendIntegration.needsTranslation(targetLang)
    if (needsBackendTranslation) {
      console.log(`Backend translation service will handle ${targetLang} translations`)
    }
  }, [fetchEvents])

  /**
   * Get current language with fallback and backend awareness
   */
  const getCurrentLanguage = useCallback(() => {
    return currentLangRef.current || localStorage.getItem('calendar_lang') || 'en'
  }, [])
  
  /**
   * Get source language (matches backend)
   */
  const getSourceLanguage = useCallback(() => {
    return backendIntegration.getSourceLanguage()
  }, [])
  
  /**
   * Check if current language needs backend translation
   */
  const needsBackendTranslation = useCallback((targetLang = null) => {
    const lang = targetLang || getCurrentLanguage()
    return backendIntegration.needsTranslation(lang)
  }, [getCurrentLanguage])

  /**
   * Check if language change is in progress
   */
  const isLanguageChanging = useCallback(() => {
    return languageChangeStartRef.current !== null
  }, [])

  /**
   * Clear translation cache
   */
  const clearCache = useCallback(() => {
    translationCache.clear()
  }, [])

  return {
    changeLanguage,
    changeLanguageWithCache,
    getCurrentLanguage,
    getSourceLanguage,
    needsBackendTranslation,
    isLanguageChanging,
    clearCache,
    // Expose cache and backend integration for advanced usage
    cache: translationCache,
    backend: backendIntegration,
    // Expose background refresh utilities
    refreshEvents: backgroundRefresh.refreshEvents,
    refreshEvent: backgroundRefresh.refreshEvent,
    preWarmCache: () => backgroundRefresh.preWarmCache(fetchEvents)
  }
}
