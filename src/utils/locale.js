/**
 * Locale utility functions for internationalization
 * Follows Single Responsibility Principle - handles only locale-related operations
 * Follows DRY principle - centralizes all locale logic
 * Provides backward compatibility while encouraging modern patterns
 */

import { changeLanguageOptimistic, backendIntegration } from '../services/translationService'

// Supported languages configuration
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    localeCode: 'en-US',
    rtl: false
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    localeCode: 'es-ES',
    rtl: false
  }
}

// Default language configuration
export const DEFAULT_LANGUAGE = 'en'
export const STORAGE_KEY = 'calendar_lang'

/**
 * Get locale code for internationalization APIs
 * @param {string} language - Language code ('en' or 'es')
 * @returns {string} Locale code (e.g., 'en-US', 'es-ES')
 * @throws {Error} If language is not supported
 */
export const getLocaleCode = (language) => {
  if (!language || typeof language !== 'string') {
    console.warn(`[locale] Invalid language provided: ${language}, using default: ${DEFAULT_LANGUAGE}`)
    return SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE].localeCode
  }
  
  const normalizedLang = language.toLowerCase().trim()
  
  if (!SUPPORTED_LANGUAGES[normalizedLang]) {
    console.warn(`[locale] Unsupported language: ${language}, falling back to: ${DEFAULT_LANGUAGE}`)
    return SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE].localeCode
  }
  
  return SUPPORTED_LANGUAGES[normalizedLang].localeCode
}

/**
 * Get language configuration object
 * @param {string} language - Language code
 * @returns {Object} Language configuration
 */
export const getLanguageConfig = (language) => {
  const normalizedLang = language?.toLowerCase().trim()
  return SUPPORTED_LANGUAGES[normalizedLang] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE]
}

/**
 * Get all supported languages
 * @returns {Array} Array of supported language configurations
 */
export const getSupportedLanguages = () => {
  return Object.values(SUPPORTED_LANGUAGES)
}

/**
 * Check if a language is supported
 * @param {string} language - Language code to check
 * @returns {boolean} Whether the language is supported
 */
export const isLanguageSupported = (language) => {
  if (!language || typeof language !== 'string') return false
  return Object.keys(SUPPORTED_LANGUAGES).includes(language.toLowerCase().trim())
}

/**
 * Get the current language from localStorage
 * @returns {string} Current language code
 */
export const getCurrentLanguage = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE
  } catch (error) {
    console.warn('[locale] Failed to get current language from localStorage:', error)
    return DEFAULT_LANGUAGE
  }
}

/**
 * Save language to localStorage
 * @param {string} language - Language code to save
 * @returns {boolean} Whether the save was successful
 */
export const saveLanguage = (language) => {
  try {
    if (!isLanguageSupported(language)) {
      console.warn(`[locale] Cannot save unsupported language: ${language}`)
      return false
    }
    
    localStorage.setItem(STORAGE_KEY, language)
    return true
  } catch (error) {
    console.error('[locale] Failed to save language to localStorage:', error)
    return false
  }
}

/**
 * Legacy language change function - maintained for backward compatibility
 * @deprecated Use useTranslationManager hook instead
 * @param {Object} i18n - i18next instance
 * @param {string} lng - Language code
 * @returns {boolean} Whether the change was successful
 */
export const changeAppLanguage = (i18n, lng) => {
  try {
    if (!i18n || typeof i18n.changeLanguage !== 'function') {
      console.error('[locale] Invalid i18n instance provided')
      return false
    }
    
    if (!isLanguageSupported(lng)) {
      console.warn(`[locale] Unsupported language: ${lng}, using default: ${DEFAULT_LANGUAGE}`)
      lng = DEFAULT_LANGUAGE
    }
    
    i18n.changeLanguage(lng)
    saveLanguage(lng)
    
    console.log(`[locale] Language changed to: ${lng}`)
    return true
  } catch (error) {
    console.error('[locale] Failed to change language:', error)
    return false
  }
}

/**
 * Optimized language change with backend integration
 * Uses new translation service for better performance
 * @param {Object} i18n - i18next instance
 * @param {string} lng - Language code
 * @param {Function} onBackgroundRefresh - Optional background refresh callback
 * @returns {Promise<boolean>} Whether the change was successful
 */
export const changeAppLanguageOptimistic = async (i18n, lng, onBackgroundRefresh = null) => {
  try {
    if (!i18n || typeof i18n.changeLanguage !== 'function') {
      console.error('[locale] Invalid i18n instance provided')
      return false
    }
    
    if (!isLanguageSupported(lng)) {
      console.warn(`[locale] Unsupported language: ${lng}, using default: ${DEFAULT_LANGUAGE}`)
      lng = DEFAULT_LANGUAGE
    }
    
    console.log(`[locale] Starting optimistic language change to: ${lng}`)
    
    const success = await changeLanguageOptimistic(i18n, lng, onBackgroundRefresh)
    
    if (success) {
      console.log(`[locale] Optimistic language change completed: ${lng}`)
    } else {
      console.warn(`[locale] Optimistic language change failed: ${lng}`)
    }
    
    return success
  } catch (error) {
    console.error('[locale] Failed to change language optimistically:', error)
    return false
  }
}

/**
 * Backend integration utilities
 * Matches backend translation service patterns
 * Provides a clean interface for backend locale operations
 */
export const backendLocale = {
  /**
   * Get source language (matches backend SOURCE_LANG)
   * @returns {string} Source language code
   */
  getSourceLanguage: () => {
    try {
      return backendIntegration.getSourceLanguage()
    } catch (error) {
      console.error('[locale] Failed to get source language:', error)
      return DEFAULT_LANGUAGE
    }
  },
  
  /**
   * Check if translation is needed for target language
   * @param {string} targetLang - Target language code
   * @returns {boolean} Whether translation is needed
   */
  needsTranslation: (targetLang) => {
    try {
      if (!targetLang || typeof targetLang !== 'string') {
        console.warn('[locale] Invalid target language provided')
        return false
      }
      return backendIntegration.needsTranslation(targetLang)
    } catch (error) {
      console.error('[locale] Failed to check translation need:', error)
      return false
    }
  },
  
  /**
   * Build API URL with language parameter
   * @param {string} baseUrl - Base URL
   * @param {string} lang - Language code
   * @param {Object} additionalParams - Additional query parameters
   * @returns {string} Complete URL with language parameter
   */
  buildApiUrl: (baseUrl, lang, additionalParams = {}) => {
    try {
      if (!baseUrl || typeof baseUrl !== 'string') {
        throw new Error('Invalid base URL provided')
      }
      
      if (!lang || typeof lang !== 'string') {
        console.warn('[locale] Invalid language provided, using default')
        lang = DEFAULT_LANGUAGE
      }
      
      return backendIntegration.buildApiUrl(baseUrl, lang, additionalParams)
    } catch (error) {
      console.error('[locale] Failed to build API URL:', error)
      throw error
    }
  }
}

/**
 * Utility functions for locale validation and normalization
 */
export const localeUtils = {
  /**
   * Normalize language code to standard format
   * @param {string} language - Language code to normalize
   * @returns {string} Normalized language code
   */
  normalize: (language) => {
    if (!language || typeof language !== 'string') return DEFAULT_LANGUAGE
    return language.toLowerCase().trim()
  },
  
  /**
   * Validate language code
   * @param {string} language - Language code to validate
   * @returns {boolean} Whether the language is valid
   */
  isValid: (language) => {
    return isLanguageSupported(language)
  },
  
  /**
   * Get language display name
   * @param {string} language - Language code
   * @param {boolean} nativeName - Whether to return native name
   * @returns {string} Language display name
   */
  getDisplayName: (language, nativeName = false) => {
    const config = getLanguageConfig(language)
    return nativeName ? config.nativeName : config.name
  },
  
  /**
   * Check if language is RTL (right-to-left)
   * @param {string} language - Language code
   * @returns {boolean} Whether the language is RTL
   */
  isRTL: (language) => {
    const config = getLanguageConfig(language)
    return config.rtl
  }
}

/**
 * Constants for locale operations
 */
export const LOCALE_CONSTANTS = {
  DEFAULT_LANGUAGE,
  STORAGE_KEY,
  SUPPORTED_LANGUAGES: Object.keys(SUPPORTED_LANGUAGES),
  SUPPORTED_LOCALE_CODES: Object.values(SUPPORTED_LANGUAGES).map(lang => lang.localeCode)
}
