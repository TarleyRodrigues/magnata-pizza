import { Link }              from 'react-router-dom'
import { motion }            from 'framer-motion'
import { useCartStore }      from '@/store/cart'
import type { Profile }      from '@/types'

interface NavbarProps {
  profile:      Profile | null
  onLoginClick: () => void
  onCartClick:  () => void
  onLogout:     () => void
}

export function Navbar({ profile, onLoginClick, onCartClick, onLogout }: NavbarProps) {
  const count = useCartStore(s => s.itemCount())

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16">
      {/* Glassmorphism bar */}
      <div className="absolute inset-0 bg-magnata-black/90 backdrop-blur-xl border-b border-magnata-border" />

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl select-none">🍕</span>
          <span className="font-serif text-xl font-black tracking-[0.2em] text-magnata-gold">
            MAGNATA
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {profile ? (
            <>
              <Link
                to={profile.role === 'admin' || profile.role === 'owner' ? '/admin' : '/dashboard'}
                className="hidden sm:block text-xs font-sans text-magnata-muted hover:text-magnata-cream transition-colors px-3 py-1.5"
              >
                {profile.role === 'customer' ? `👤 ${profile.name.split(' ')[0]}` : '⚙️ Admin'}
              </Link>
              <button
                onClick={onLogout}
                className="text-xs font-sans text-magnata-dim hover:text-magnata-muted transition-colors px-2 py-1.5"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="text-xs font-sans text-magnata-muted hover:text-magnata-cream transition-colors px-3 py-1.5"
            >
              Entrar / Cadastrar
            </button>
          )}

          {/* Cart button */}
          <motion.button
            onClick={onCartClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-magnata-gold-dim border border-magnata-border hover:border-magnata-gold/50
                       rounded-xl p-2.5 transition-colors"
            aria-label="Carrinho"
          >
            <svg className="w-5 h-5 text-magnata-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-magnata-gold text-magnata-black
                           text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center font-sans"
              >
                {count > 9 ? '9+' : count}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  )
}
