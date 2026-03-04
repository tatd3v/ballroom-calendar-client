import { useTranslation } from 'react-i18next'

/**
 * Application footer component
 * Follows Single Responsibility Principle - handles only footer rendering
 */
export default function AppFooter() {
  const { t } = useTranslation()

  return (
    <footer className="mt-auto border-t border-lavender-100 dark:border-ink-700 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-ink-300 dark:text-ink-200">
        <span>{t('footer.title')}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse-soft" />
          <span>{t('footer.online')}</span>
        </div>
      </div>
    </footer>
  )
}
