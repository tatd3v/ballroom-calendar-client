import React from 'react'

export default function CustomLoader({ size = 'medium', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32',
    xlarge: 'w-40 h-40'
  }

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-ink/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Your custom vogue-loader.gif */}
        <img 
          src="/vogue-loader.gif"
          alt="Loading..."
          className={`${sizeClasses[size]}`}
        />
        
        {/* Translated loading text */}
        <p className="text-sm text-ink/60 dark:text-white/60 font-medium animate-pulse">
          {text}
        </p>
      </div>
    </div>
  )
}

// Full page loader variant — fixed overlay centered on screen
export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6 bg-white dark:bg-ink-800 rounded-2xl px-10 py-8 shadow-2xl">
        <img 
          src="/vogue-loader.gif"
          alt="Loading..."
          className="w-32 h-32"
        />
        <p className="text-sm text-ink/70 dark:text-white/70 font-medium animate-pulse">{text}</p>
      </div>
    </div>
  )
}

// Inline loader for buttons/cards
export function InlineLoader({ size = 'small' }) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  }

  return (
    <img 
      src="/vogue-loader.gif"
      alt="Loading..."
      className={`${sizeClasses[size]}`}
    />
  )
}
