import { useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { changeAppLanguage } from '../../utils/locale'

export default function LanguageDropdown({ 
  isOpen, 
  onToggle, 
  onClose,
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  isMobile = false 
}) {
  const { i18n } = useTranslation()
  const dropdownRef = useRef(null)

  const changeLanguage = (lng) => {
    changeAppLanguage(i18n, lng)
    onClose()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const baseButtonClass = "bg-lavender/40 dark:bg-primary/20 rounded-lg text-sm font-bold text-primary flex items-center gap-1 border border-primary/20"
  const finalButtonClass = isMobile 
    ? `${baseButtonClass} py-2 pl-3 pr-2 w-full justify-between ${buttonClassName}`
    : `${baseButtonClass} py-1.5 pl-3 pr-2 ${buttonClassName}`

  const dropdownPosition = isMobile ? "left-0 mt-2 w-full" : "right-0 mt-3 w-64"

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={finalButtonClass}
      >
        <span>{i18n.language.toUpperCase()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className={`absolute ${dropdownPosition} bg-white dark:bg-ink rounded-xl shadow-2xl border border-lavender/50 dark:border-primary/20 overflow-hidden z-[60] ${dropdownClassName}`}>
          <div className="py-2">
            <div className="flex items-center justify-between px-4 py-3 bg-lavender/30 dark:bg-primary/20 cursor-default">
              <span className="font-semibold text-ink dark:text-white">
                {i18n.language === 'en' ? 'English (EN)' : 'Spanish (ES)'}
              </span>
              <Check className="w-5 h-5 text-primary" />
            </div>
            {i18n.language !== 'en' && (
              <button
                onClick={() => changeLanguage('en')}
                className="w-full flex items-center px-4 py-3 hover:bg-lavender/50 dark:hover:bg-ink-700 transition-colors"
              >
                <span className="font-medium text-ink-600 dark:text-gray-300">English (EN)</span>
              </button>
            )}
            {i18n.language !== 'es' && (
              <button
                onClick={() => changeLanguage('es')}
                className="w-full flex items-center px-4 py-3 hover:bg-lavender/50 dark:hover:bg-ink-700 transition-colors"
              >
                <span className="font-medium text-ink-600 dark:text-gray-300">Spanish (ES)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
