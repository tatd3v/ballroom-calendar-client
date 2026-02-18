import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomLoader from './ui/CustomLoader'

export default function CalendarSkeleton() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="h-8 bg-ink/20 dark:bg-white/10 rounded w-48 mb-2"></div>
          <div className="h-4 bg-ink/10 dark:bg-white/5 rounded w-32"></div>
        </div>
        <div className="h-10 bg-ink/20 dark:bg-white/10 rounded-xl w-40"></div>
      </div>

      {/* Calendar skeleton */}
      <div className="rounded-2xl p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 bg-lavender-100 dark:bg-[#222222] rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-lavender-100 dark:bg-[#222222] rounded-xl animate-pulse" />
            <div className="h-9 w-20 bg-lavender-100 dark:bg-[#222222] rounded-xl animate-pulse" />
            <div className="h-9 w-20 bg-lavender-100 dark:bg-[#222222] rounded-xl animate-pulse" />
          </div>
        </div>
        
        {/* Calendar grid skeleton */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="aspect-square bg-ink/10 dark:bg-white/5 rounded"></div>
          ))}
        </div>
        
        {/* Event cards skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-ink/30 rounded-xl border border-lavender/20 dark:border-white/5">
              <div className="w-12 h-12 bg-lavender/20 dark:bg-white/10 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-ink/20 dark:bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-ink/10 dark:bg-white/5 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered loader */}
      <div className="flex justify-center py-8">
        <CustomLoader size="xlarge" text={t('mobile.loading')} />
      </div>
    </div>
  )
}
