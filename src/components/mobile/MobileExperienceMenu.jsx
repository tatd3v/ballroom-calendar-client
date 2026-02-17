import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  X,
  User,
  Sun,
  Moon,
  Globe,
  Check,
  LogOut
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { changeAppLanguage } from '../../utils/locale'

/**
 * Shared mobile experience menu that centralizes navigation, preferences, and user actions.
 * Adheres to SOLID by isolating presentation from parent logic via declarative "sections" config.
 */
export default function MobileExperienceMenu({
  open,
  onClose,
  title,
  subtitle,
  sections = [],
  showUserCard = true,
  enablePreferences = true,
  enableLogout = true
}) {
  const { theme, toggleTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  const handleClose = () => {
    if (onClose) onClose()
  }

  const handleLanguageChange = (lng) => {
    if (lng === i18n.language) {
      setLanguageDropdownOpen(false)
      return
    }
    changeAppLanguage(i18n, lng)
    setLanguageDropdownOpen(false)
  }

  const footerItems = useMemo(() => {
    if (!enableLogout || !user) return []
    return [{
      id: 'logout',
      label: t('nav.logout', 'Logout'),
      onClick: () => {
        logout()
        handleClose()
      },
      className: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10',
      icon: LogOut
    }]
  }, [enableLogout, user, logout, t])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-ink rounded-t-3xl p-6 space-y-5 shadow-2xl border border-primary/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            {subtitle && (
              <p className="text-xs uppercase tracking-[0.3em] text-primary/70 font-bold">{subtitle}</p>
            )}
            <h2 className="text-2xl font-black text-ink dark:text-white">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors"
            aria-label={t('modal.close', 'Close')}
          >
            <X className="w-5 h-5 text-ink/70 dark:text-white/70" />
          </button>
        </div>

        {showUserCard && user && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 dark:bg-white/5 border border-primary/10">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink dark:text-white truncate">{user.name || user.email}</p>
              <p className="text-xs text-ink/60 dark:text-white/60 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {sections.map((section) => (
          <div key={section.id || section.title} className="space-y-3">
            {section.title && (
              <h3 className="text-xs font-semibold text-ink/60 dark:text-white/60 uppercase tracking-widest px-1">
                {section.title}
              </h3>
            )}
            <div className="grid gap-3">
              {section.items.map((item) => (
                <button
                  key={item.id || item.label}
                  onClick={() => {
                    item.onClick?.()
                    if (item.closeOnClick !== false) handleClose()
                  }}
                  className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left bg-primary/5 dark:bg-white/5 border border-primary/10 transition-colors hover:border-primary/40 ${item.className || ''}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-ink flex items-center justify-center shadow-sm">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-ink dark:text-white">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-ink/60 dark:text-white/60">{item.description}</p>
                      )}
                    </div>
                  </div>
                  {item.trailing && item.trailing}
                  {!item.trailing && (
                    <svg className="w-4 h-4 text-ink/30 dark:text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {enablePreferences && (
          <div className="pt-3 border-t border-primary/10">
            <h3 className="text-xs font-semibold text-ink/60 dark:text-white/60 uppercase tracking-widest px-1 mb-3">
              {t('settings.preferences', 'Preferences')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-primary/10 hover:border-primary/40 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                <span className="text-xs font-semibold text-ink dark:text-white">
                  {theme === 'dark' ? t('theme.lightMode', 'Light') : t('theme.darkMode', 'Dark')}
                </span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setLanguageDropdownOpen((prev) => !prev)}
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
                        onClick={() => handleLanguageChange(lng)}
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
        )}

        {footerItems.length > 0 && (
          <div className="pt-3 border-t border-primary/10">
            {footerItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${item.className || ''}`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
