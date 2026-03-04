import { Link } from 'react-router-dom'

/**
 * Desktop navigation link component
 * Follows Single Responsibility Principle - handles only desktop navigation link rendering
 */
export default function NavLink({ to, active, icon: Icon, label }) {
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
