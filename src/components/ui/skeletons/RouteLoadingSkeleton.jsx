import SkeletonBlock from './SkeletonBlock'

/**
 * Lightweight skeleton used as Suspense fallback for lazy-loaded routes.
 * Renders inside Layout's <Outlet> so only the content area needs skeleton.
 * Single Responsibility: shows structural placeholder during JS bundle loading.
 */
export default function RouteLoadingSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Page title area */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-56" />
          <SkeletonBlock className="h-4 w-40" />
        </div>
        <SkeletonBlock className="h-10 w-36 rounded-xl" />
      </div>

      {/* Filter/action bar */}
      <div className="flex gap-2">
        {['w-20', 'w-24', 'w-20', 'w-28', 'w-20'].map((w, i) => (
          <SkeletonBlock key={i} className={`h-9 ${w} rounded-full`} />
        ))}
      </div>

      {/* Main content block */}
      <SkeletonBlock className="h-96 w-full rounded-2xl" />

      {/* Secondary content rows */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-xl border border-lavender/10 dark:border-white/5">
            <SkeletonBlock className="w-12 h-12 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
