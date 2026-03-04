import { Link } from 'react-router-dom'

/**
 * Mobile navigation link component
 * Follows Single Responsibility Principle - handles only mobile navigation link rendering
 */
export default function MobileNavLink({ to, active, icon: Icon, label, onClick }) {
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
