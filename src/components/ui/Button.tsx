import { forwardRef }        from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { motion }            from 'framer-motion'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'whatsapp'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  loading?:  boolean
  fullWidth?: boolean
}

const VARIANTS: Record<Variant, string> = {
  primary:  'bg-gradient-to-r from-magnata-gold to-magnata-gold-light text-magnata-black font-bold hover:shadow-[0_8px_24px_rgba(201,160,48,.35)]',
  outline:  'bg-transparent text-magnata-gold border border-magnata-gold hover:bg-magnata-gold-dim',
  ghost:    'bg-transparent text-magnata-muted hover:text-magnata-cream hover:bg-white/5',
  danger:   'bg-red-900/30 text-red-400 border border-red-900/50 hover:bg-red-900/50',
  whatsapp: 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/30 font-bold',
}

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className = '', children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? {} : { y: -2 }}
        whileTap={disabled || loading ? {} : { scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className={[
          'inline-flex items-center justify-center gap-2 font-sans font-medium',
          'transition-all duration-200 cursor-pointer select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none',
          VARIANTS[variant],
          SIZES[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
