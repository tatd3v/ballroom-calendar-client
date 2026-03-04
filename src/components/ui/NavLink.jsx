import { Link } from 'react-router-dom'

/**
 * Unified navigation link component
 * Follows Single Responsibility Principle - handles only navigation link rendering
 * Supports both desktop and mobile layouts via compact prop
 */
export default function NavLink({ to, active, icon: Icon, label, onClick, compact = false }) {
  const paddingClasses = compact ? 'px-4 py-2.5' : 'px-4 py-2'
  const gapClasses = compact ? 'gap-3' : 'gap-2'
  const shadowClasses = active ? (compact ? 'shadow-sm' : 'shadow-sm shadow-primary/20') : ''
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center ${gapClasses} ${paddingClasses} rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? `bg-primary text-white ${shadowClasses}`
          : 'text-ink-400 dark:text-ink-200 hover:bg-lavender-50 dark:hover:bg-ink-700 hover:text-ink dark:hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}
