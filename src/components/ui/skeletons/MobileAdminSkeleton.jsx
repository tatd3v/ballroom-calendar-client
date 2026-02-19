import SkeletonBlock from './SkeletonBlock'

const BORDER_COLORS = ['border-primary/30', 'border-lavender', 'border-primary/30', 'border-lavender', 'border-lavender']

/**
 * Mirrors real admin event card:
 * - relative bg-white rounded-xl p-4 shadow-sm border
 * - Top row: title (bold) + MoreVertical button
 * - Info rows: CalendarDays+date, MapPin+location+city badge, Clock+time
 */
function AdminCardSkeleton({ borderClass }) {
  return (
    <div className={`relative bg-white dark:bg-ink/50 rounded-xl p-4 shadow-sm border ${borderClass}`}>
      {/* Top: title + MoreVertical */}
      <div className="flex justify-between items-start mb-3 gap-4">
        <SkeletonBlock className="h-5 w-3/5" />
        <div className="w-9 h-9 rounded-full animate-pulse bg-ink/10 dark:bg-white/10 shrink-0" />
      </div>

      {/* Info rows matching: CalendarDays, MapPin+badge, Clock */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-4 h-4 rounded shrink-0" />
          <SkeletonBlock className="h-3 w-28" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-4 h-4 rounded shrink-0" />
          <SkeletonBlock className="h-3 w-36" />
          <SkeletonBlock className="h-5 w-16 rounded-full shrink-0" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-4 h-4 rounded shrink-0" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

/**
 * Mobile admin skeleton — replaces only <main> (the event list).
 * The sub-header (create button + search + filter pills) is always rendered above this.
 * Matches: px-4 py-6 pb-24 space-y-4
 */
export default function MobileAdminSkeleton() {
  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      {BORDER_COLORS.map((cls, i) => (
        <AdminCardSkeleton key={i} borderClass={cls} />
      ))}
    </div>
  )
}
