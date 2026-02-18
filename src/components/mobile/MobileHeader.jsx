import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Menu, 
  X, 
  CalendarDays, 
  Settings,
  Sun,
  Moon,
  Globe
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { changeAppLanguage } from '../../utils/locale'

/**
 * Reusable mobile header component following Single Responsibility Principle
 * Handles only header layout and basic interactions
 */
export default function MobileHeader({ 
  title, 
  subtitle, 
  icon = CalendarDays,
  menuOpen,
  onMenuToggle,
  showPreferences = false,
  onLanguageToggle,
  onThemeToggle,
  theme
}) {
  const { i18n } = useTranslation()

  const handleLanguageToggle = () => {
    if (onLanguageToggle) {
      onLanguageToggle()
    } else {
      changeAppLanguage(i18n, i18n.language === 'es' ? 'en' : 'es')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <button
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label={t('mobile.openMenu')}
            onClick={onMenuToggle}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              {icon === 'settings' ? (
                <Settings className="w-5 h-5 text-white" />
              ) : (
                <CalendarDays className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-ink dark:text-white">{title}</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">{subtitle}</p>
            </div>
          </div>
        </div>
        
        {showPreferences && (
          <div className="flex items-center gap-2">
            <button
              onClick={onThemeToggle || (() => {})}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              aria-label={t('mobile.toggleTheme')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="h-6 w-px bg-primary/20 mx-1" />
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-1 px-2 py-1 hover:bg-primary/10 rounded-lg transition-colors text-sm font-bold text-primary"
            >
              {i18n.language.toUpperCase()}
              <Globe className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
