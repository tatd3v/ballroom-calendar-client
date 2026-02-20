import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'

export default function EventSearchFilters({ 
  onSearch, 
  onCityFilter, 
  onStatusFilter,
  onClearFilters,
  onReset,
  cities = [],
  statuses = [],
  className = ""
}) {
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  const handleCityChange = (value) => {
    setSelectedCity(value)
    onCityFilter?.(value)
  }

  const handleStatusChange = (value) => {
    setSelectedStatus(value)
    onStatusFilter?.(value)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCity('')
    setSelectedStatus('')
    onClearFilters?.()
  }

  const handleReset = () => {
    handleClearFilters()
    onReset?.()
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-2xl bg-white dark:bg-ink/60 shadow-sm border border-lavender/20 dark:border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="text-ink dark:text-white font-bold text-sm uppercase tracking-wider opacity-60">
            {t('search.title')}
          </h3>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 text-primary hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors"
          >
            <span className="text-xs font-bold">
              {isCollapsed ? t('search.expand') : t('search.collapse')}
            </span>
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Filters Content */}
        {!isCollapsed && (
          <div className="flex flex-wrap items-end gap-4 p-4 pt-2">
            {/* Search Bar */}
            <div className="flex-1 min-w-[300px]">
              <label className="block text-xs font-bold text-ink/50 dark:text-white/50 mb-1 ml-1">
                {t('search.eventName')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 dark:text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-lavender/30 dark:bg-white/5 border border-lavender/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-ink/30 dark:placeholder:text-white/30 text-ink dark:text-white"
                  placeholder={t('search.placeholder')}
                />
              </div>
            </div>

            {/* City Filter */}
            <div className="w-48">
              <label className="block text-xs font-bold text-ink/50 dark:text-white/50 mb-1 ml-1">
                {t('search.city')}
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full h-11 px-4 bg-lavender/30 dark:bg-white/5 border border-lavender/20 dark:border-white/10 rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-ink/70 dark:text-white/70"
                >
                  <option value="">{t('search.allCities')}</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-ink/40 dark:text-white/40" />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-48">
              <label className="block text-xs font-bold text-ink/50 dark:text-white/50 mb-1 ml-1">
                {t('search.status')}
              </label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full h-11 px-4 bg-lavender/30 dark:bg-white/5 border border-lavender/20 dark:border-white/10 rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-ink/70 dark:text-white/70"
                >
                  <option value="">{t('search.allStatuses')}</option>
                  {statuses.map((status) => (
                    <option key={status.value || status} value={status.value || status}>
                      {status.label || status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-ink/40 dark:text-white/40" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleClearFilters}
                className="h-11 px-4 text-primary font-bold text-sm hover:bg-primary/5 rounded-xl transition-all flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                {t('search.clearFilters')}
              </button>
              <button
                onClick={handleReset}
                className="h-11 px-4 text-ink/60 dark:text-white/60 font-bold text-sm hover:text-primary transition-colors flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                {t('search.reset')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
