import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { InlineLoader } from '../components/ui/CustomLoader'
import useMobile from '../hooks/useMobileMenu'
import MobileHeader from '../components/mobile/MobileHeader'
import MobileExperienceMenu from '../components/mobile/MobileExperienceMenu'
import MobilePreferences from '../components/mobile/MobilePreferences'
import { 
  UserRound, 
  Lock, 
  ArrowRight,
  CalendarDays, 
  Bookmark,
  Compass,
  AlertCircle,
  Mail,
  LockKeyhole,
  Sparkles
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { menuOpen, toggleMenu, closeMenu } = useMobileMenu()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const quickLogin = (email) => {
    setEmail(email)
    setPassword(email === 'admin@events.org' ? 'admin123' : 'org123')
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  const handleLanguageToggle = () => {
    changeAppLanguage(i18n, i18n.language === 'es' ? 'en' : 'es')
  }

  const languageCode = (i18n.language || 'en').toUpperCase()

  const menuSections = useMemo(() => {
    const items = [
      { id: 'events', label: t('mobile.menu.events', { defaultValue: 'Events' }), icon: CalendarDays, onClick: () => handleNavigate('/') },
    ]
    if (user) {
      items.push({ id: 'manage', label: t('mobile.menu.manage', { defaultValue: 'Manage events' }), icon: Bookmark, onClick: () => handleNavigate('/admin') })
    } else {
      items.push({ id: 'login', label: t('mobile.menu.login', { defaultValue: 'Login' }), icon: UserRound, onClick: () => handleNavigate('/login') })
    }
    return [{ id: 'login-nav', items }]
  }, [t, user])

  return (
    <div className="font-display min-h-screen bg-lavender/30 dark:bg-background-dark flex flex-col">
      <MobileHeader
        title={t('calendar.title')}
        subtitle={t('nav.subtitle')}
        menuOpen={menuOpen}
        onMenuToggle={toggleMenu}
      />

      <MobileExperienceMenu
        open={menuOpen}
        onClose={closeMenu}
        title={t('calendar.title')}
        subtitle={t('nav.subtitle')}
        sections={menuSections}
        showUserCard={Boolean(user)}
        enableLogout={Boolean(user)}
      />

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-ink rounded-3xl shadow-2xl border border-primary/10 p-8 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-lavender/60 text-primary flex items-center justify-center mb-4">
            <CalendarDays className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-white">{t('login.title')}</h1>
          <p className="text-sm text-ink/60 dark:text-white/60 mt-2">
            {t('login.subtitle') || t('mobile.loginSubtitle', { defaultValue: "Welcome back! Manage your city's pulse." })}
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-orange-50 dark:bg-orange/10 border border-orange-100 dark:border-orange/30 rounded-xl flex items-center gap-2.5 text-orange text-sm font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink dark:text-white ml-1">{t('login.email')}</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 dark:text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-lavender-100 dark:border-white/10 bg-white dark:bg-white/5 text-ink dark:text-white placeholder:text-ink/40 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                placeholder="manager@events.org"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-ink dark:text-white">{t('login.password')}</label>
              <a
                href="mailto:admin@events.org"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t('login.forgotPassword')}
              </a>
            </div>
            <div className="relative">
              <LockKeyhole className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 dark:text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-lavender-100 dark:border-white/10 bg-white dark:bg-white/5 text-ink dark:text-white placeholder:text-ink/40 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <InlineLoader size="medium" />
                {t('login.signingIn')}
              </>
            ) : (
              <>
                {t('login.signIn')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-ink/60 dark:text-white/60">
          {t('login.noAccount', { defaultValue: "Don't have an account?" })}
          <button type="button" className="text-primary font-bold ml-1 hover:underline">
            {t('login.joinCommunity', { defaultValue: 'Join the community' })}
          </button>
        </div>

        <div className="pt-6 border-t border-lavender-100 dark:border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <p className="text-xs font-bold text-ink/60 dark:text-white/60 uppercase tracking-widest">
              {t('login.quickLogin')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Admin', email: 'admin@events.org', color: '#1A1A1A' },
              { label: 'Bogota', email: 'organizer.bogota@events.org', color: '#EE0087' },
              { label: 'Cali', email: 'organizer.cali@events.org', color: '#F15A24' },
              { label: 'Medellin', email: 'organizer.medellin@events.org', color: '#BEDF3F' },
            ].map(({ label, email: presetEmail, color }) => (
              <button
                key={label}
                type="button"
                onClick={() => quickLogin(presetEmail)}
                className="flex items-center justify-between px-3 py-2 rounded-xl border border-lavender-100 dark:border-white/10 text-xs font-semibold text-ink dark:text-white hover:bg-lavender/30 dark:hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                </span>
                <ArrowRight className="w-3 h-3 text-ink/40 dark:text-white/40" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
