// ─── Barrel: re-exporta todos os componentes UI ──────────
export { Button }           from './Button'
export { Input }            from './Input'
export { Modal }            from './Modal'
export { OrderStatusBadge } from './OrderStatusBadge'

import type { ReactNode }         from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Badge ────────────────────────────────────────────────
type BadgeVariant = 'gold' | 'red' | 'green' | 'blue' | 'gray'

const BADGE_STYLES: Record<BadgeVariant, string> = {
  gold:  'bg-magnata-gold-dim text-magnata-gold border-magnata-border',
  red:   'bg-red-900/20 text-red-400 border-red-900/40',
  green: 'bg-green-900/20 text-green-400 border-green-900/40',
  blue:  'bg-blue-900/20 text-blue-400 border-blue-900/40',
  gray:  'bg-white/5 text-magnata-muted border-white/10',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'gold', className = '' }: BadgeProps) {
  return (
    <span className={[
      'inline-flex items-center px-2 py-0.5 rounded-full',
      'text-[10px] font-bold font-sans tracking-wide border',
      BADGE_STYLES[variant],
      className,
    ].join(' ')}>
      {children}
    </span>
  )
}

// ─── Spinner ─────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      className={`animate-spin text-magnata-gold ${className}`}
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
      <path className="opacity-80" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )
}

// ─── Toast ────────────────────────────────────────────────
interface ToastProps {
  message: string
  type?:   'success' | 'error' | 'info'
  show:    boolean
}

const TOAST_STYLES = {
  success: 'border-magnata-gold/40 text-magnata-cream',
  error:   'border-red-500/40 text-red-300',
  info:    'border-blue-500/40 text-blue-300',
}

export function Toast({ message, type = 'success', show }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1     }}
          exit={{    opacity: 0, y: 10, scale: 0.96  }}
          className={[
            'fixed bottom-6 right-4 sm:right-6 z-[100]',
            'bg-magnata-card border rounded-xl px-4 py-3',
            'font-sans text-sm shadow-2xl max-w-xs',
            TOAST_STYLES[type],
          ].join(' ')}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── StepBar (progress indicator no modal) ────────────────
interface StepBarProps {
  total:   number
  current: number
  labels:  string[]
}

export function StepBar({ total, current, labels }: StepBarProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={[
              'h-1 flex-1 rounded-full transition-all duration-300',
              i < current  ? 'bg-magnata-gold' :
              i === current ? 'bg-magnata-gold/60' :
              'bg-white/10',
            ].join(' ')}
          />
        ))}
      </div>
      <p className="text-xs text-magnata-dim font-sans">
        Passo {current + 1}/{total}: <span className="text-magnata-muted">{labels[current]}</span>
      </p>
    </div>
  )
}

// ─── QtyControl ───────────────────────────────────────────
interface QtyControlProps {
  value:    number
  onChange: (v: number) => void
  min?:     number
  max?:     number
}

export function QtyControl({ value, onChange, min = 1, max = 99 }: QtyControlProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full border border-magnata-border text-magnata-gold
                   flex items-center justify-center hover:border-magnata-gold/50 transition-colors"
      >
        <svg className="w-3 h-3" viewBox="0 0 12 2" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 1h10"/>
        </svg>
      </button>
      <span className="font-serif text-xl font-bold text-magnata-cream w-6 text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full border border-magnata-border text-magnata-gold
                   flex items-center justify-center hover:border-magnata-gold/50 transition-colors"
      >
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 1v10M1 6h10"/>
        </svg>
      </button>
    </div>
  )
}

// ─── SelectCard ──────────────────────────────────────────
interface SelectCardProps {
  selected:  boolean
  onClick:   () => void
  children:  ReactNode
  className?: string
}

export function SelectCard({ selected, onClick, children, className = '' }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'border rounded-xl p-3 text-left w-full transition-all duration-200 cursor-pointer',
        selected
          ? 'border-magnata-gold bg-magnata-gold-dim'
          : 'border-magnata-border bg-white/[0.02] hover:border-magnata-gold/40',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}

// ─── Skeleton loader ─────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/[0.06] rounded-xl ${className}`} />
  )
}
