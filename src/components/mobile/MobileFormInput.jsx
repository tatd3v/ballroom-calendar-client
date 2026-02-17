import { forwardRef } from 'react'

const MobileFormInput = forwardRef(({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  className = '',
  ...props 
}, ref) => {
  const baseInputClasses = "w-full px-4 py-3 rounded-xl border bg-white dark:bg-white/5 text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-white/40 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
  const errorClasses = error ? "border-red-500 dark:border-red-500" : "border-lavender-100 dark:border-white/10"
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-ink dark:text-white mb-2">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${baseInputClasses} ${errorClasses}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
})

MobileFormInput.displayName = 'MobileFormInput'

export default MobileFormInput
