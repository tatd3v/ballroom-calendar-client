import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Globe, Check } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { changeAppLanguage } from '../../utils/locale'

/**
 * Mobile preferences component following Single Responsibility Principle
 * Handles only theme and language preferences
 */
export default function MobilePreferences({ 
  onLanguageChange,
  onThemeToggle,
  theme,
  showLanguageDropdown = false 
}) {
  const { t, i18n } = useTranslation()
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(showLanguageDropdown)

  const handleLanguageToggle = () => {
    if (onLanguageChange) {
      onLanguageChange(i18n.language === 'es' ? 'en' : 'es')
    } else {
      changeAppLanguage(i18n, i18n.language === 'es' ? 'en' : 'es')
    }
    setLanguageDropdownOpen(false)
  }

  const handleLanguageSelect = (lng) => {
    if (onLanguageChange) {
      onLanguageChange(lng)
    } else {
      changeAppLanguage(i18n, lng)
    }
    setLanguageDropdownOpen(false)
  }

  return (
    <div className="pt-3 border-t border-primary/10">
      <h3 className="text-xs font-semibold text-ink/60 dark:text-white/60 uppercase tracking-widest px-1 mb-3">
        {t('settings.preferences', 'Preferences')}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onThemeToggle}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-primary/10 hover:border-primary/40 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          <span className="text-xs font-semibold text-ink dark:text-white">
            {theme === 'dark' ? t('theme.lightMode', 'Light') : t('theme.darkMode', 'Dark')}
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-primary/10 hover:border-primary/40 transition-colors w-full"
          >
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold text-ink dark:text-white">
              {i18n.language.toUpperCase()}
            </span>
          </button>

          {languageDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-ink rounded-2xl border border-primary/10 overflow-hidden">
              {['en', 'es'].map((lng) => (
                <button
                  key={lng}
                  onClick={() => handleLanguageSelect(lng)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm ${
                    i18n.language === lng
                      ? 'bg-primary/10 text-primary'
                      : 'text-ink dark:text-white hover:bg-primary/5'
                  }`}
                >
                  <span className="font-semibold uppercase">{lng}</span>
                  {i18n.language === lng && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
