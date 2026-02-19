import SkeletonBlock from './SkeletonBlock'

const CITY_COLORS = ['#EE0087', '#a4c639', '#F15A24', '#6366f1', '#EE0087', '#a4c639', '#F15A24']

/**
 * Mirrors real table row:
 * col1: w-12 h-12 icon box + bold title
 * col2: city badge pill (px-3 py-1 rounded-full)
 * col3: date text + optional time
 * col4: status dot + label
 * col5 (right): edit + delete icon buttons (opacity-0 on hover — we show them faintly)
 */
function TableRowSkeleton({ color }) {
  return (
    <tr className="border-b border-lavender/5 dark:border-lavender/10">
      {/* Event: icon box + title */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-lg shrink-0 animate-pulse flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <div className="w-6 h-6 rounded animate-pulse bg-ink/10 dark:bg-white/10" />
          </div>
          <SkeletonBlock className="h-5 w-44" />
        </div>
      </td>
      {/* City badge */}
      <td className="px-6 py-5">
        <div
          className="inline-flex h-6 w-20 rounded-full animate-pulse"
          style={{ backgroundColor: `${color}20` }}
        />
      </td>
      {/* Date + time */}
      <td className="px-6 py-5">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
      </td>
      {/* Status */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse bg-ink/20 dark:bg-white/20" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
      </td>
      {/* Actions: edit + delete */}
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2 opacity-30">
          <SkeletonBlock className="w-9 h-9 rounded-lg" />
          <SkeletonBlock className="w-9 h-9 rounded-lg" />
        </div>
      </td>
    </tr>
  )
}

/**
 * Full desktop admin page skeleton — replaces the entire page content when loading.
 * Mirrors: page header → filters bar → events table → pagination
 */
export default function AdminPageSkeleton() {
  return (
    <div className="space-y-5">
      {/* Page header: title + event count + "Add Event" button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <SkeletonBlock className="h-9 w-56 mb-2" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        <SkeletonBlock className="h-12 w-36 rounded-lg" />
      </div>

      {/* Filters bar: Filter label + city dropdown + time dropdown */}
      <div className="bg-white/50 dark:bg-ink-700/50 p-3 sm:p-4 rounded-xl mb-6 border border-primary/5 dark:border-lavender/10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-4 h-4 rounded" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
        <SkeletonBlock className="h-8 w-36 rounded-lg" />
        <SkeletonBlock className="h-8 w-44 rounded-lg" />
      </div>

      {/* Events table */}
      <div className="bg-white dark:bg-ink-800 border border-lavender/10 dark:border-lavender/20 rounded-xl overflow-hidden shadow-xl shadow-lavender/5 dark:shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lavender/5 dark:bg-ink-700/50 border-b border-lavender/10 dark:border-lavender/20">
                {['w-20', 'w-12', 'w-12', 'w-14', 'w-16'].map((w, i) => (
                  <th key={i} className="px-6 py-4">
                    <SkeletonBlock className={`h-3 ${w}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lavender/5 dark:divide-lavender/10">
              {CITY_COLORS.map((color, i) => (
                <TableRowSkeleton key={i} color={color} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <SkeletonBlock className="h-9 w-9 rounded-lg" />
        <SkeletonBlock className="h-4 w-12" />
        <SkeletonBlock className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  )
}
