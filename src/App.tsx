import { useState, useCallback }  from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar }                  from '@/components/layout/Navbar'
import { Footer }                  from '@/components/layout/Footer'
import { AuthModal }               from '@/components/auth/AuthModal'
import { CartDrawer }              from '@/components/cart/CartDrawer'
import { Toast }                   from '@/components/ui'
import { HomePage }                from '@/pages/HomePage'
import { DashboardPage }           from '@/pages/DashboardPage'
import { AdminPage }               from '@/pages/AdminPage'
import { useAuth }                 from '@/features/auth/useAuth'
import { useCreateOrder }          from '@/features/orders/useOrders'
import { useCartStore }            from '@/store/cart'
import type { LoginFormData, RegisterFormData } from '@/types'

interface ToastState { message: string; type: 'success' | 'error' | 'info' }

export function App() {
  const { user, profile, loading, login, register, logout } = useAuth()
  const { mutateAsync: createOrder, isPending: isOrdering }  = useCreateOrder()
  const { items, extras, clear: clearCart }                  = useCartStore()

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
    await register(data)
    setAuthOpen(false)
    showToast('Conta criada! Confira seu e-mail para confirmar. ✅')
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

      {toast && (
        <Toast message={toast.message} type={toast.type} show={!!toast} />
      )}
    </div>
  )
}
