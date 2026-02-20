import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Settings, LogIn, LogOut, Menu, X, Sparkles, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import useMobile from '../hooks/useMobile'
import LanguageDropdown from './ui/LanguageDropdown'

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const isMobile = useMobile()

  const hideChrome = isMobile

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

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
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg tracking-tight text-ink dark:text-white">{t('calendar.title')}</span>
                <span className="block text-[10px] uppercase tracking-widest text-primary font-semibold">{t('nav.subtitle')}</span>
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
              <LanguageDropdown
                isOpen={languageDropdownOpen}
                onToggle={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                onClose={() => setLanguageDropdownOpen(false)}
                className="ml-1"
              />

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
                <LanguageDropdown
                  isOpen={languageDropdownOpen}
                  onToggle={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  onClose={() => setLanguageDropdownOpen(false)}
                  className="relative flex-1"
                  isMobile={true}
                />
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
