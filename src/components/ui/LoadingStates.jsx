import React from 'react'
import { CustomLoader } from './CustomLoader'

export function LoadingOverlay({ text = 'Loading...', show = true }) {
  if (!show) return null
  
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-ink/50 p-6 rounded-xl shadow-2xl border border-lavender/20 dark:border-white/10">
        <CustomLoader size="large" text={text} />
      </div>
    </div>
  )
}

export function LoadingButton({ loading, children, disabled, size = 'medium', ...props }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`relative ${props.className || ''}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <InlineLoader size={size} />
        </div>
      )}
      <span className={loading ? 'opacity-0' : ''}>
        {children}
      </span>
    </button>
  )
}

export function InlineLoader({ size = 'small' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  return (
    <img 
      src="/vogue-loader.gif"
      alt="Loading..."
      className={`${sizeClasses[size]}`}
    />
  )
}
