import SkeletonBlock from './SkeletonBlock'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/* Sparse event pill pattern matching typical month view density */
const EVENT_MAP = {
  2: 1, 4: 2, 7: 1, 9: 1, 11: 2, 14: 1,
  16: 2, 18: 1, 21: 1, 23: 2, 25: 1, 28: 1, 30: 2,
}

/**
 * CalendarSkeleton — mirrors EventCalendar's exact wrapper + FullCalendar DOM:
 * - Outer: rounded-2xl p-4 md:p-6 (glass-strong / dark bg)
 * - fc-header-toolbar: [prev][next][today] | [Month title] | [Month][Week][List]
 * - fc-col-header: 7 day-name columns
 * - fc-daygrid: 5 weeks × 7 day cells, day number top-right, event pills below
 */
export default function CalendarSkeleton() {
  return (
    <div className="rounded-2xl p-3 sm:p-4 md:p-6 bg-white dark:bg-[#222222] border border-lavender/10 dark:border-border-dark shadow-xl">

      {/* fc-header-toolbar */}
      <div className="flex items-center justify-between mb-4">
        {/* left chunk: prev next today */}
        <div className="flex items-center gap-1">
          <SkeletonBlock className="h-8 w-8 rounded" />
          <SkeletonBlock className="h-8 w-8 rounded" />
          <SkeletonBlock className="h-8 w-16 rounded ml-1" />
        </div>
        {/* center chunk: month title */}
        <SkeletonBlock className="h-6 w-36" />
        {/* right chunk: Month / Week / List */}
        <div className="flex gap-1">
          <SkeletonBlock className="h-8 w-16 rounded" />
          <SkeletonBlock className="h-8 w-14 rounded" />
          <SkeletonBlock className="h-8 w-12 rounded" />
        </div>
      </div>

      {/* fc-col-header: day-of-week names */}
      <div className="grid grid-cols-7 border-b border-lavender/10 dark:border-border-dark mb-0">
        {DAYS.map((d) => (
          <div key={d} className="py-2 flex justify-center">
            <SkeletonBlock className="h-3 w-8" />
          </div>
        ))}
      </div>

      {/* fc-daygrid-body: 5 weeks */}
      <div className="grid grid-cols-7">
        {Array.from({ length: 35 }).map((_, i) => {
          const eventCount = EVENT_MAP[i] || 0
          const isToday = i === 10
          return (
            <div
              key={i}
              className="min-h-[90px] p-1.5 border-r border-b border-lavender/5 dark:border-border-dark/60 last:border-r-0"
            >
              {/* fc-daygrid-day-top: day number (top-right aligned like FullCalendar) */}
              <div className="flex justify-end mb-1">
                <div className={`h-6 w-6 rounded-full animate-pulse ${
                  isToday ? 'bg-primary/30' : 'bg-ink/10 dark:bg-white/10'
                }`} />
              </div>
              {/* fc-event pills */}
              <div className="space-y-1 px-0.5">
                {Array.from({ length: eventCount }).map((_, j) => (
                  <SkeletonBlock key={j} className="h-5 w-full rounded" />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
