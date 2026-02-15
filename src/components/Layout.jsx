import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Settings, LogIn, LogOut, Menu, X, Sparkles, Moon, Sun, Globe, ChevronDown, Check } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import useMobile from '../hooks/useMobile'
import { changeAppLanguage } from '../utils/locale'

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const languageDropdownRef = useRef(null)
  const isMobile = useMobile()

  const hideChrome = isMobile

  const isActive = (path) => location.pathname === path

  const changeLanguage = (lng) => {
    changeAppLanguage(i18n, lng)
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false)
      }
    }

    if (languageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [languageDropdownOpen])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-ink text-white' : ''}`}>
      {!hideChrome && (
        <>
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-orange to-lime" />

      <header className={`sticky top-0 z-50 w-full border-b ${theme === 'dark' ? 'bg-ink/80 glass-header border-border-dark' : 'glass-header border-primary/10'}`} style={theme !== 'dark' ? { background: 'rgba(255, 255, 255, 0.7)' } : undefined}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-orange flex items-center justify-center shadow-sm group-hover:shadow-glow-primary transition-shadow duration-300">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-ink dark:text-white tracking-tight">{t('calendar.title')}</span>
                <span className="block text-[10px] font-medium text-ink-300 dark:text-ink-200 -mt-0.5 tracking-wide">{t('nav.subtitle')}</span>
              </div>
            </Link>

            <button 
              className="md:hidden p-2.5 rounded-xl text-ink-400 dark:text-ink-200 hover:bg-lavender dark:hover:bg-ink-700 hover:text-primary transition-all duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" active={isActive('/')} icon={CalendarDays} label={t('nav.calendar')} />

              {user && (
                <NavLink to="/admin" active={isActive('/admin')} icon={Settings} label={t('nav.manage')} />
              )}

              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-ink-400 dark:text-ink-200 hover:bg-orange-50 dark:hover:bg-orange/10 hover:text-orange transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </button>
              ) : (
                <NavLink to="/login" active={isActive('/login')} icon={LogIn} label={t('nav.login')} />
              )}

              {user && (
                <div className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-50 to-lavender-50 dark:from-primary/20 dark:to-lavender/10 text-primary rounded-full text-xs font-bold border border-primary-100 dark:border-primary/30">
                  <Sparkles className="w-3 h-3" />
                  {user.role === 'admin' ? t('nav.admin') : user.city}
                </div>
              )}

              <div className="ml-2 h-6 w-px bg-lavender-100 dark:bg-ink-600" />

              {/* Language selector */}
              <div className="ml-1 relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="bg-lavender/40 dark:bg-primary/20 rounded-lg py-1.5 pl-3 pr-2 text-sm font-bold text-primary flex items-center gap-1 border border-primary/20"
                >
                  <span>{i18n.language.toUpperCase()}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-ink rounded-xl shadow-2xl border border-lavender/50 dark:border-primary/20 overflow-hidden z-[60]">
                    <div className="py-2">
                      <div className="flex items-center justify-between px-4 py-3 bg-lavender/30 dark:bg-primary/20 cursor-default">
                        <span className="font-semibold text-ink dark:text-white">
                          {i18n.language === 'en' ? 'English (EN)' : 'Spanish (ES)'}
                        </span>
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      {i18n.language !== 'en' && (
                        <button
                          onClick={() => {
                            changeLanguage('en')
                            setLanguageDropdownOpen(false)
                          }}
                          className="w-full flex items-center px-4 py-3 hover:bg-lavender/50 dark:hover:bg-ink-700 transition-colors"
                        >
                          <span className="font-medium text-ink-600 dark:text-gray-300">English (EN)</span>
                        </button>
                      )}
                      {i18n.language !== 'es' && (
                        <button
                          onClick={() => {
                            changeLanguage('es')
                            setLanguageDropdownOpen(false)
                          }}
                          className="w-full flex items-center px-4 py-3 hover:bg-lavender/50 dark:hover:bg-ink-700 transition-colors"
                        >
                          <span className="font-medium text-ink-600 dark:text-gray-300">Spanish (ES)</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="ml-1 w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 dark:bg-white/5 text-primary hover:bg-white/10 transition-all duration-200"
                title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </nav>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            menuOpen ? 'max-h-80 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}>
            <nav className="pt-2 border-t border-lavender-100 dark:border-ink-600 space-y-1 animate-fade-in">
              <MobileNavLink to="/" active={isActive('/')} icon={CalendarDays} label={t('nav.calendar')} onClick={() => setMenuOpen(false)} />

              {user && (
                <MobileNavLink to="/admin" active={isActive('/admin')} icon={Settings} label={t('nav.manage')} onClick={() => setMenuOpen(false)} />
              )}

              {user ? (
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-ink-400 dark:text-ink-200 hover:bg-orange-50 dark:hover:bg-orange/10 hover:text-orange w-full transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                  <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-primary-50 dark:bg-primary/20 text-primary rounded-full">
                    {user.role === 'admin' ? t('nav.admin') : user.city}
                  </span>
                </button>
              ) : (
                <MobileNavLink to="/login" active={isActive('/login')} icon={LogIn} label={t('nav.login')} onClick={() => setMenuOpen(false)} />
              )}

              {/* Mobile: Language + Theme */}
              <div className="flex items-center gap-2 px-4 pt-2">
                <div className="relative flex-1">
                  <button
                    onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                    className="w-full bg-lavender/40 dark:bg-primary/20 rounded-lg py-2 pl-3 pr-2 text-sm font-bold text-primary flex items-center justify-between border border-primary/20"
                  >
                    <span>{i18n.language.toUpperCase()}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {languageDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-full bg-white dark:bg-ink rounded-xl shadow-2xl border border-lavender/50 dark:border-primary/20 overflow-hidden z-[60]">
                      <div className="py-2">
                        <div className="flex items-center justify-between px-4 py-3 bg-lavender/30 dark:bg-primary/20 cursor-default">
                          <span className="font-semibold text-ink dark:text-white">
                            {i18n.language === 'en' ? 'English (EN)' : 'Spanish (ES)'}
                          </span>
                          <Check className="w-5 h-5 text-primary" />
                        </div>
                        {i18n.language !== 'en' && (
                          <button
                            onClick={() => {
                              changeLanguage('en')
                              setLanguageDropdownOpen(false)
                            }}
                            className="w-full flex items-center px-4 py-3 hover:bg-lavender/50 dark:hover:bg-ink-700 transition-colors"
                          >
                            <span className="font-medium text-ink-600 dark:text-gray-300">English (EN)</span>
                          </button>
                        )}
                        {i18n.language !== 'es' && (
                          <button
                            onClick={() => {
                              changeLanguage('es')
                              setLanguageDropdownOpen(false)
                            }}
                            className="w-full flex items-center px-4 py-3 hover:bg-lavender/50 dark:hover:bg-ink-700 transition-colors"
                          >
                            <span className="font-medium text-ink-600 dark:text-gray-300">Spanish (ES)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 dark:bg-white/5 text-primary hover:bg-white/10 transition-all duration-200"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
        </>
      )}

      <main className={hideChrome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 py-5 md:py-8'}>
        <div className={hideChrome ? '' : 'animate-fade-in-up'}>
          <Outlet />
        </div>
      </main>

      {!hideChrome && (
        <footer className="mt-auto border-t border-lavender-100 dark:border-ink-700 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-ink-300 dark:text-ink-200">
            <span>{t('footer.title')}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse-soft" />
              <span>{t('footer.online')}</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

function NavLink({ to, active, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? 'bg-primary text-white shadow-sm shadow-primary/20'
          : 'text-ink-400 dark:text-ink-200 hover:bg-lavender-50 dark:hover:bg-ink-700 hover:text-ink dark:hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}

function MobileNavLink({ to, active, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? 'bg-primary text-white shadow-sm'
          : 'text-ink-400 dark:text-ink-200 hover:bg-lavender-50 dark:hover:bg-ink-700 hover:text-ink dark:hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}
