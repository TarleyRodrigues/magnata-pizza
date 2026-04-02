import { useState, useCallback }   from 'react'
import { Routes, Route, Navigate }  from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import { Navbar }                   from '@/components/layout/Navbar'
import { Footer }                   from '@/components/layout/Footer'
import { AuthModal }                from '@/components/auth/AuthModal'
import { CartDrawer }               from '@/components/cart/CartDrawer'
import { Toast }                    from '@/components/ui'
import { HomePage }                 from '@/pages/HomePage'
import { DashboardPage }            from '@/pages/DashboardPage'
import { AdminPage }                from '@/pages/AdminPage'
import { useAuth }                  from '@/features/auth/useAuth'
import { useCreateOrder }           from '@/features/orders/useOrders'
import { useCartStore }             from '@/store/cart'
import { formatBRL }                from '@/lib/pricing'
import type { LoginFormData, RegisterFormData } from '@/types'

interface ToastState { message: string; type: 'success' | 'error' | 'info' }

export function App() {
  const { user, profile, loading, login, register, logout } = useAuth()
  const { mutateAsync: createOrder, isPending: isOrdering }  = useCreateOrder()
  const { items, extras, clear: clearCart }                  = useCartStore()
  const cartCount = useCartStore(s => s.itemCount())
  const cartTotal = useCartStore(s => s.total())

  const [authOpen,  setAuthOpen]  = useState(false)
  const [cartOpen,  setCartOpen]  = useState(false)
  const [authTab,   setAuthTab]   = useState<'login' | 'register'>('login')
  const [toast,     setToast]     = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const openAuth = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }, [])

  const handleLogin = useCallback(async (data: LoginFormData) => {
    await login(data.email, data.password)
    setAuthOpen(false)
    showToast('Bem-vindo de volta! 🍕')
  }, [login, showToast])

  const handleRegister = useCallback(async (data: RegisterFormData) => {
    try {
      await register(data)
      setAuthOpen(false)
      showToast('Conta criada! Confira seu e-mail para confirmar. ✅')
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      // Conta criada mas requer confirmação de e-mail — não é um erro real
      if (msg.startsWith('Conta criada!')) {
        setAuthOpen(false)
        showToast(msg, 'info')
        return
      }
      throw e
    }
  }, [register, showToast])

  const handleLogout = useCallback(async () => {
    await logout()
    clearCart()
    showToast('Até logo! 👋')
  }, [logout, clearCart, showToast])

  const handleCheckout = useCallback(async (payMethod: string, notes: string) => {
    if (!user || !profile) { openAuth('login'); return }

    try {
      await createOrder({
        userId:    user.id,
        profile:   {
          name:        profile.name,
          phone:       profile.phone,
          address:     profile.address,
          address_ref: profile.address_ref,
        },
        items,
        extras,
        payMethod,
        notes: notes || undefined,
      })
      clearCart()
      setCartOpen(false)
      showToast('✅ Pedido realizado! Acompanhe na sua conta.')
    } catch {
      showToast('Erro ao enviar pedido. Tente novamente.', 'error')
    }
  }, [user, profile, createOrder, items, extras, clearCart, showToast, openAuth])

  if (loading) {
    return (
      <div className="min-h-screen bg-magnata-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-pulse select-none">🍕</div>
          <p className="font-serif text-magnata-gold text-xl tracking-widest">MAGNATA</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-magnata-black text-magnata-cream">
      <Navbar
        profile={profile}
        onLoginClick={() => openAuth('login')}
        onCartClick={() => {
          if (!user) { openAuth('login'); return }
          setCartOpen(true)
        }}
        onLogout={handleLogout}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onAuthRequired={() => openAuth('login')}
                isAuthenticated={!!user}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              user
                ? <DashboardPage profile={profile} />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="/admin"
            element={
              user && (profile?.role === 'admin' || profile?.role === 'owner')
                ? <AdminPage profile={profile} />
                : <Navigate to="/" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global modals */}
      <AuthModal
        open={authOpen}
        defaultTab={authTab}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
        isOrdering={isOrdering}
      />

      {/* Floating cart button — aparece quando há itens no carrinho */}
      <AnimatePresence>
        {cartCount > 0 && !cartOpen && (
          <motion.button
            key="floating-cart"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1   }}
            exit={{    opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => {
              if (!user) { openAuth('login'); return }
              setCartOpen(true)
            }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                       flex items-center gap-3 px-5 py-3 rounded-2xl
                       bg-gradient-to-r from-magnata-gold to-magnata-gold-light
                       text-magnata-black shadow-[0_8px_32px_rgba(201,160,48,.45)]
                       hover:shadow-[0_12px_40px_rgba(201,160,48,.6)]
                       hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span className="relative">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="absolute -top-2 -right-2 bg-magnata-black text-magnata-gold
                               text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            </span>
            <span className="font-sans font-bold text-sm">Ver carrinho</span>
            <span className="font-serif font-black text-sm">
              {formatBRL(cartTotal)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {toast && (
        <Toast message={toast.message} type={toast.type} show={!!toast} />
      )}
    </div>
  )
}
