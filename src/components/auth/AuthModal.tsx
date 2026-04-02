import { useState }         from 'react'
import { useForm }          from 'react-hook-form'
import { zodResolver }      from '@hookform/resolvers/zod'
import { z }                from 'zod'
import { Modal }            from '@/components/ui/Modal'
import { Input }            from '@/components/ui/Input'
import { Button }           from '@/components/ui/Button'
import type { RegisterFormData, LoginFormData } from '@/types'

// ─── Schemas de validação ─────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const registerSchema = z.object({
  name:            z.string().min(3, 'Nome muito curto'),
  email:           z.string().email('Email inválido'),
  password:        z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  phone:           z.string().min(10, 'Telefone inválido').max(15),
  address:         z.string().min(10, 'Endereço muito curto'),
  address_ref:     z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path:    ['confirmPassword'],
})

// ─── Props ────────────────────────────────────────────────
interface AuthModalProps {
  open:       boolean
  defaultTab?: 'login' | 'register'
  onClose:    () => void
  onLogin:    (data: LoginFormData)    => Promise<void>
  onRegister: (data: RegisterFormData) => Promise<void>
}

// ─── Component ───────────────────────────────────────────
export function AuthModal({ open, defaultTab = 'login', onClose, onLogin, onRegister }: AuthModalProps) {
  const [tab, setTab]     = useState<'login' | 'register'>(defaultTab)
  const [error, setError] = useState('')

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { address_ref: '' },
  })

  const handleLogin = loginForm.handleSubmit(async (data) => {
    setError('')
    try {
      await onLogin(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao entrar')
    }
  })

  const handleRegister = registerForm.handleSubmit(async (data) => {
    setError('')
    try {
      await onRegister(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao criar conta')
    }
  })

  const switchTab = (t: typeof tab) => {
    setTab(t)
    setError('')
    loginForm.reset()
    registerForm.reset()
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="px-6 pt-6 pb-4 text-center border-b border-magnata-border">
        <div className="text-4xl mb-2 select-none">🍕</div>
        <h2 className="font-serif text-xl font-black text-magnata-cream tracking-wide">
          Pizzaria MAGNATA
        </h2>

        {/* Tab switcher */}
        <div className="flex mt-5 bg-white/[0.04] rounded-xl p-1 border border-magnata-border">
          {(['login','register'] as const).map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={[
                'flex-1 py-2 text-sm font-sans font-semibold rounded-lg transition-all duration-200',
                tab === t
                  ? 'bg-magnata-gold text-magnata-black'
                  : 'text-magnata-dim hover:text-magnata-muted',
              ].join(' ')}
            >
              {t === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 space-y-3.5 max-h-[65vh] overflow-y-auto">
        {/* ── Login ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              error={loginForm.formState.errors.email?.message}
              {...loginForm.register('email')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••"
              error={loginForm.formState.errors.password?.message}
              {...loginForm.register('password')}
            />
            {error && <p className="text-xs text-red-400 font-sans text-center">{error}</p>}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loginForm.formState.isSubmitting}
            >
              Entrar
            </Button>
          </form>
        )}

        {/* ── Register ── */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <Input
              label="Nome completo *"
              placeholder="João da Silva"
              error={registerForm.formState.errors.name?.message}
              {...registerForm.register('name')}
            />
            <Input
              label="WhatsApp *"
              type="tel"
              placeholder="(62) 9 9999-9999"
              error={registerForm.formState.errors.phone?.message}
              {...registerForm.register('phone')}
            />
            <Input
              label="E-mail *"
              type="email"
              placeholder="seu@email.com"
              error={registerForm.formState.errors.email?.message}
              {...registerForm.register('email')}
            />
            <Input
              label="Senha *"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={registerForm.formState.errors.password?.message}
              {...registerForm.register('password')}
            />
            <Input
              label="Confirmar senha *"
              type="password"
              placeholder="Repita a senha"
              error={registerForm.formState.errors.confirmPassword?.message}
              {...registerForm.register('confirmPassword')}
            />
            <Input
              label="Endereço completo *"
              placeholder="Rua, Número, Bairro, Cidade"
              error={registerForm.formState.errors.address?.message}
              {...registerForm.register('address')}
            />
            <Input
              label="Referência (opcional)"
              placeholder="Ex: próximo ao Extra, portão azul..."
              {...registerForm.register('address_ref')}
            />
            {error && <p className="text-xs text-red-400 font-sans text-center">{error}</p>}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={registerForm.formState.isSubmitting}
            >
              Criar minha conta
            </Button>
          </form>
        )}
      </div>
    </Modal>
  )
}
