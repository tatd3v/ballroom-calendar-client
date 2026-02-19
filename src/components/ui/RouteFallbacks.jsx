import useMobile from '../../hooks/useMobile'
import CalendarSkeleton from './skeletons/CalendarSkeleton'
import AdminPageSkeleton from './skeletons/AdminPageSkeleton'
import MobileCalendarSkeleton from './skeletons/MobileCalendarSkeleton'
import MobileAdminSkeleton from './skeletons/MobileAdminSkeleton'

/**
 * Shared mobile header placeholder — mirrors MobileHeader (h-16 sticky)
 * Used as the static header part of mobile Suspense fallbacks.
 */
function MobileHeaderPlaceholder() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl animate-pulse" />
          <div className="space-y-1">
            <div className="h-4 w-28 rounded animate-pulse bg-ink/10 dark:bg-white/10" />
            <div className="h-3 w-20 rounded animate-pulse bg-ink/10 dark:bg-white/10" />
          </div>
        </div>
        <div className="w-9 h-9 rounded-lg animate-pulse bg-ink/10 dark:bg-white/10" />
      </div>
    </header>
  )
}

/**
 * CalendarPage Suspense fallback:
 * - Desktop: page header + CityFilter bar + CalendarSkeleton (calendar grid)
 * - Mobile:  MobileHeader placeholder + MobileCalendarSkeleton
 */
export function CalendarPageFallback() {
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="font-display dark:bg-background-dark text-ink dark:text-white min-h-screen pb-28">
        <MobileHeaderPlaceholder />
        <MobileCalendarSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header row: title + stats pills */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="h-9 w-48 rounded animate-pulse bg-ink/10 dark:bg-white/10 mb-2" />
          <div className="h-4 w-56 rounded animate-pulse bg-ink/10 dark:bg-white/10" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-xl animate-pulse bg-ink/10 dark:bg-white/10" />
          <div className="h-8 w-20 rounded-xl animate-pulse bg-primary/20" />
        </div>
      </div>

      {/* CityFilter pills */}
      <div className="flex gap-2">
        <div className="h-9 w-20 rounded-full animate-pulse bg-primary/30" />
        {['w-20', 'w-24', 'w-20', 'w-28'].map((w, i) => (
          <div key={i} className={`h-9 ${w} rounded-full animate-pulse bg-ink/10 dark:bg-white/10`} />
        ))}
      </div>

      {/* Calendar grid */}
      <CalendarSkeleton />
    </div>
  )
}

/**
 * AdminPage Suspense fallback:
 * - Desktop: AdminPageSkeleton (full table layout)
 * - Mobile:  MobileHeader placeholder + MobileAdminSkeleton (event cards only)
 *            Note: sub-header controls are part of MobileAdminExperience, not shown here
 */
export function AdminPageFallback() {
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="font-display dark:bg-background-dark text-ink dark:text-white min-h-screen pb-28">
        <MobileHeaderPlaceholder />
        {/* Sub-header placeholders: create button + search + filter pills */}
        <div className="px-4 pt-4 pb-2 space-y-3 bg-white dark:bg-background-dark border-b border-primary/5">
          <div className="h-12 w-full rounded-xl animate-pulse bg-primary/20" />
          <div className="h-10 w-full rounded-xl animate-pulse bg-ink/10 dark:bg-white/10" />
          <div className="flex gap-2 overflow-hidden pb-1">
            {['w-16', 'w-20', 'w-16', 'w-24', 'w-20'].map((w, i) => (
              <div key={i} className={`h-8 ${w} rounded-full shrink-0 animate-pulse ${i === 0 ? 'bg-primary/30' : 'bg-ink/10 dark:bg-white/10'}`} />
            ))}
          </div>
        </div>
        <MobileAdminSkeleton />
      </div>
    )
  }

  return <AdminPageSkeleton />
}
