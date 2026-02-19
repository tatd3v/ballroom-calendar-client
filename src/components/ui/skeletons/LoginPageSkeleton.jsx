import SkeletonBlock from './SkeletonBlock'

/**
 * LoginPageSkeleton — mirrors LoginPage exact structure:
 * - min-h-screen bg-lavender/30 flex flex-col
 * - Centered max-w-md white card (rounded-3xl shadow-2xl p-8)
 * - Logo circle (w-16 h-16 rounded-2xl bg-lavender/60)
 * - Title + subtitle
 * - Email field (label + icon + input)
 * - Password field (label + forgot link + icon + input)
 * - Submit button (full width bg-primary)
 * - "No account?" text row
 * - Divider + Quick Login 2×2 grid
 */
export default function LoginPageSkeleton() {
  return (
    <div className="font-display min-h-screen bg-lavender/30 dark:bg-background-dark flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-ink rounded-3xl shadow-2xl border border-primary/10 p-8 space-y-6">

          {/* Logo + title + subtitle */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-lavender/60 dark:bg-white/10 animate-pulse" />
            <SkeletonBlock className="h-7 w-40 mx-auto" />
            <SkeletonBlock className="h-4 w-64 mx-auto" />
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-16 ml-1" />
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded animate-pulse bg-ink/10 dark:bg-white/10" />
              <div className="w-full h-12 rounded-xl border border-lavender-100 dark:border-white/10 bg-lavender/10 dark:bg-white/5 animate-pulse" />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-3 w-28" />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded animate-pulse bg-ink/10 dark:bg-white/10" />
              <div className="w-full h-12 rounded-xl border border-lavender-100 dark:border-white/10 bg-lavender/10 dark:bg-white/5 animate-pulse" />
            </div>
          </div>

          {/* Submit button */}
          <div className="w-full h-14 rounded-xl animate-pulse bg-primary/30" />

          {/* "No account?" text row */}
          <div className="flex items-center justify-center gap-2">
            <SkeletonBlock className="h-3 w-36" />
            <SkeletonBlock className="h-3 w-24" />
          </div>

          {/* Quick login section */}
          <div className="pt-6 border-t border-lavender-100 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded animate-pulse bg-lime-400/30" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                '#1A1A1A', '#EE0087', '#F15A24', '#BEDF3F'
              ].map((color, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border border-lavender-100 dark:border-white/10 animate-pulse"
                  style={{ backgroundColor: `${color}10` }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <SkeletonBlock className="h-3 w-16" />
                  </div>
                  <SkeletonBlock className="h-3 w-3 rounded" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
