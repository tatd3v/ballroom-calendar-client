import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.js'
import es from './locales/es.js'

// Get browser language or use saved preference
const getBrowserLanguage = () => {
  // Check if user has saved a language preference
  const savedLang = localStorage.getItem('calendar_lang')
  if (savedLang) return savedLang
  
  // Get browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en'
  
  // Map common language codes to our supported languages
  const langCode = browserLang.toLowerCase().split('-')[0]
  
  // Return supported language or fallback to English
  if (langCode === 'es') return 'es'
  if (langCode === 'en') return 'en'
  
  // Check for Spanish variants
  if (browserLang.toLowerCase().includes('spanish') || 
      browserLang.toLowerCase().includes('español') ||
      browserLang.toLowerCase().includes('es-')) {
    return 'es'
  }
  
  // Default to English for other languages
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es }
  },
  lng: getBrowserLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
