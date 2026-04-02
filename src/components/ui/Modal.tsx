import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence }   from 'framer-motion'

interface ModalProps {
  open:      boolean
  onClose:   () => void
  children:  ReactNode
  maxWidth?: string
  title?:    string
}

export function Modal({ open, onClose, children, maxWidth = 'max-w-lg', title }: ModalProps) {
  // Fecha com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Bloqueia scroll do body
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{    opacity: 0, y: 40, scale: 0.97  }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className={[
              'relative z-10 w-full',
              'bg-magnata-surf border border-magnata-border rounded-t-2xl sm:rounded-2xl',
              'flex flex-col max-h-[92vh] sm:max-h-[85vh]',
              maxWidth,
            ].join(' ')}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-magnata-border shrink-0">
                <h2 className="font-serif text-lg font-bold text-magnata-cream">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-magnata-dim hover:text-magnata-cream transition-colors p-1"
                  aria-label="Fechar"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            )}
            <div className="overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
