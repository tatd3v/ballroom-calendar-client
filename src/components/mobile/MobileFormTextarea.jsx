import { forwardRef } from 'react'

const MobileFormTextarea = forwardRef(({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  rows = 4,
  className = '',
  ...props 
}, ref) => {
  const baseTextareaClasses = "w-full px-4 py-3 rounded-xl border bg-white dark:bg-white/5 text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-white/40 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
  const errorClasses = error ? "border-red-500 dark:border-red-500" : "border-lavender-100 dark:border-white/10"
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-ink dark:text-white mb-2">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`${baseTextareaClasses} ${errorClasses}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
})

MobileFormTextarea.displayName = 'MobileFormTextarea'

export default MobileFormTextarea
