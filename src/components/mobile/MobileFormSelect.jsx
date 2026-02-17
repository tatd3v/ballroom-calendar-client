import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const MobileFormSelect = forwardRef(({ 
  label, 
  value, 
  onChange, 
  options = [],
  required = false,
  error,
  placeholder,
  className = '',
  ...props 
}, ref) => {
  const baseSelectClasses = "w-full px-4 py-3 rounded-xl border bg-white dark:bg-white/5 text-ink dark:text-white focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none"
  const errorClasses = error ? "border-red-500 dark:border-red-500" : "border-lavender-100 dark:border-white/10"
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-ink dark:text-white mb-2">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseSelectClasses} ${errorClasses}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40 dark:text-white/40 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
})

MobileFormSelect.displayName = 'MobileFormSelect'

export default MobileFormSelect
