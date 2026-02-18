import React from 'react'

export default function CustomLoader({ size = 'medium', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Your custom vogue-loader.gif */}
      <img 
        src="/vogue-loader.gif"
        alt="Loading..."
        className={`${sizeClasses[size]}`}
      />
      
      {/* Optional loading text */}
      {text && (
        <p className="text-sm text-ink/60 dark:text-white/60 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Full page loader variant
export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-white dark:bg-ink/50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <img 
          src="/vogue-loader.gif"
          alt="Loading..."
          className="w-20 h-20"
        />
        <div className="text-center">
          <p className="text-ink/70 dark:text-white/70 font-medium">{text}</p>
        </div>
      </div>
    </div>
  )
}

// Inline loader for buttons/cards
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
