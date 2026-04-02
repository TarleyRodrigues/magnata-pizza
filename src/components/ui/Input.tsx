import { forwardRef }              from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:  string
  error?:  string
  hint?:   string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold font-sans text-magnata-muted uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'bg-white/[0.04] border rounded-lg px-3.5 py-3',
            'font-sans text-sm text-magnata-cream placeholder:text-magnata-dim',
            'outline-none transition-all duration-200',
            'focus:ring-1',
            error
              ? 'border-red-600/60 focus:border-red-500 focus:ring-red-500/20'
              : 'border-magnata-border focus:border-magnata-gold focus:ring-magnata-gold/20',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-sans">{error}</p>}
        {hint && !error && <p className="text-xs text-magnata-dim font-sans">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
