import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Settings, LogIn, LogOut, Menu, X, Sparkles, Moon, Sun } from 'lucide-react'
import useMobile from '../hooks/useMobile'
import { useNavigationState } from '../hooks/useNavigationState'
import LanguageDropdown from './ui/LanguageDropdown'
import NavLink from './ui/NavLink'

/**
 * Application header component
 * Follows Single Responsibility Principle - handles only header rendering and navigation
 */
export default function AppHeader() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const location = useLocation()
  const isMobile = useMobile()
  
  // Use centralized navigation state management
  const navigation = useNavigationState()
  
  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-orange to-lime" />

      <header className={`sticky top-0 z-50 w-full border-b ${theme === 'dark' ? 'bg-ink/80 glass-header border-border-dark' : 'glass-header border-primary/10'}`} style={theme !== 'dark' ? { background: 'rgba(255, 255, 255, 0.7)' } : undefined}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg tracking-tight text-ink dark:text-white">{t('calendar.title')}</span>
                <span className="block text-[10px] uppercase tracking-widest text-primary font-semibold">{t('nav.subtitle')}</span>
              </div>
            </a>

            {/* Mobile menu toggle */}
            <button 
              className="md:hidden p-2.5 rounded-xl text-ink-400 dark:text-ink-200 hover:bg-lavender dark:hover:bg-ink-700 hover:text-primary transition-all duration-200"
              onClick={() => navigation.setMenuOpen(!navigation.menuOpen)}
            >
              {navigation.menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop navigation */}
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
                className="ml-1"
                selfContained={true}
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
            navigation.menuOpen ? 'max-h-80 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}>
            <nav className="pt-2 border-t border-lavender-100 dark:border-ink-600 space-y-1 animate-fade-in">
              <NavLink to="/" active={isActive('/')} icon={CalendarDays} label={t('nav.calendar')} compact={true} onClick={() => navigation.setMenuOpen(false)} />

              {user && (
                <NavLink to="/admin" active={isActive('/admin')} icon={Settings} label={t('nav.manage')} compact={true} onClick={() => navigation.setMenuOpen(false)} />
              )}

              {user ? (
                <button
                  onClick={() => { logout(); navigation.setMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-ink-400 dark:text-ink-200 hover:bg-orange-50 dark:hover:bg-orange/10 hover:text-orange w-full transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                  <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-primary-50 dark:bg-primary/20 text-primary rounded-full">
                    {user.role === 'admin' ? t('nav.admin') : user.city}
                  </span>
                </button>
              ) : (
                <NavLink to="/login" active={isActive('/login')} icon={LogIn} label={t('nav.login')} compact={true} onClick={() => navigation.setMenuOpen(false)} />
              )}

              {/* Mobile: Language + Theme */}
              <div className="flex items-center gap-2 px-4 pt-2">
                <LanguageDropdown
                  className="relative flex-1"
                  isMobile={true}
                  selfContained={true}
                />
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
