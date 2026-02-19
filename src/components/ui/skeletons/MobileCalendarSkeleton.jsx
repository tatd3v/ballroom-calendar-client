import { ChevronRight } from 'lucide-react'
import SkeletonBlock from './SkeletonBlock'

const CITY_COLORS = ['#EE0087', '#a4c639', '#F15A24', '#6366f1']

/**
 * Mirrors the real event card: border-l-4, w-16 image, title+city badge, location, time, chevron
 */
function EventCardSkeleton({ color = '#EE0087' }) {
  return (
    <div
      className="w-full p-4 rounded-xl flex gap-4 items-center shadow-sm bg-white dark:bg-ink/60 border border-white/30 dark:border-white/5"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      {/* Image placeholder — w-16 h-16 rounded-lg */}
      <div className="w-16 h-16 shrink-0 rounded-lg animate-pulse bg-lavender/60 dark:bg-white/10" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title + city badge */}
        <div className="flex justify-between items-start gap-2">
          <SkeletonBlock className="h-4 w-3/5" />
          <div
            className="h-4 w-14 shrink-0 rounded animate-pulse"
            style={{ backgroundColor: `${color}25` }}
          />
        </div>
        {/* Location row */}
        <SkeletonBlock className="h-3 w-1/2" />
        {/* Time row */}
        <SkeletonBlock className="h-3 w-1/3" />
      </div>

      <ChevronRight className="w-5 h-5 shrink-0 text-ink/20 dark:text-white/20" />
    </div>
  )
}

/**
 * Day group: uppercase heading + N cards
 */
function DayGroupSkeleton({ cardCount, colorOffset = 0 }) {
  return (
    <div>
      <SkeletonBlock className="h-3 w-20 mb-3" />
      <div className="space-y-3">
        {Array.from({ length: cardCount }).map((_, i) => (
          <EventCardSkeleton key={i} color={CITY_COLORS[(i + colorOffset) % CITY_COLORS.length]} />
        ))}
      </div>
    </div>
  )
}

/**
 * Full mobile calendar skeleton — mirrors MobileCalendarExperience:
 * 1. City filter pills (px-4 py-6 bg-white border-b)
 * 2. Grouped event cards (px-4 space-y-6 mt-6)
 */
export default function MobileCalendarSkeleton() {
  return (
    <div className="pb-24">
      {/* Section 1: City filter pills — matches px-4 py-6 bg-white border-b */}
      <section className="px-4 py-6 bg-white dark:bg-background-dark border-b border-primary/5 dark:border-white/5">
        <div className="flex gap-2 overflow-hidden pb-2">
          {/* Active pill */}
          <div className="flex-none h-9 w-24 rounded-full animate-pulse bg-primary/30" />
          {/* Inactive pills */}
          {['w-20', 'w-24', 'w-20', 'w-28'].map((w, i) => (
            <div key={i} className={`flex-none h-9 ${w} rounded-full animate-pulse bg-ink/10 dark:bg-white/10`} />
          ))}
        </div>
      </section>

      {/* Section 2: Grouped events — matches px-4 space-y-6 mt-6 */}
      <section className="px-4 space-y-6 mt-6">
        <DayGroupSkeleton cardCount={2} colorOffset={0} />
        <DayGroupSkeleton cardCount={1} colorOffset={2} />
        <DayGroupSkeleton cardCount={2} colorOffset={1} />
      </section>
    </div>
  )
}
