"use client"

import { cn } from '@/lib/utils'

interface AcademyLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function AcademyLogo({ size = 'md', showText = true, className }: AcademyLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Minimalist Geometric Quran/Book Icon Badge */}
      <div className={cn(
        "relative rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30",
        sizeClasses[size]
      )}>
        {/* Quran/Book Icon - Geometric minimalist design */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cn("text-primary-foreground", iconSizes[size])}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Open book with decorative element */}
          <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" />
          {/* Decorative star/crescent element */}
          <circle cx="12" cy="3" r="1" fill="currentColor" />
        </svg>
        {/* Subtle corner accent */}
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-foreground/30" />
      </div>
      
      {showText && (
        <div>
          <h1 className="font-bold text-lg text-foreground tracking-tight">Hifz Academy</h1>
          <p className="text-xs text-muted-foreground -mt-0.5">Scholar Link</p>
        </div>
      )}
    </div>
  )
}

// Larger variant for sign-in page
export function AcademyLogoLarge({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-12 h-12 relative rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-6 h-6 text-primary-foreground"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
        </svg>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-foreground/30" />
      </div>
      <div>
        <h1 className="font-bold text-xl text-foreground">Hifz Academy</h1>
        <p className="text-sm text-muted-foreground">Scholar Link</p>
      </div>
    </div>
  )
}
