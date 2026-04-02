import { useEffect, useState, useCallback } from 'react'
import type { User, Session }              from '@supabase/supabase-js'
import { supabase }                        from '@/lib/supabase'
import type { Profile, RegisterFormData }  from '@/types'

interface AuthState {
  user:    User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
}

interface AuthActions {
  register: (data: RegisterFormData) => Promise<void>
  login:    (email: string, password: string) => Promise<void>
  logout:   () => Promise<void>
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user:    null,
    profile: null,
    session: null,
    loading: true,
  })

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data as Profile | null
  }, [])

  useEffect(() => {
    // Sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const profile = session?.user ? await fetchProfile(session.user.id) : null
      setState({ user: session?.user ?? null, profile, session, loading: false })
    })

    // Escuta mudanças de sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const profile = session?.user ? await fetchProfile(session.user.id) : null
        setState({ user: session?.user ?? null, profile, session, loading: false })
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const register = useCallback(async (data: RegisterFormData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email:    data.email,
      password: data.password,
      options:  { emailRedirectTo: window.location.origin },
    })
    if (error) throw error

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id:          authData.user.id,
        name:        data.name,
        phone:       data.phone,
        address:     data.address,
        address_ref: data.address_ref || null,
      })
      if (profileError) throw profileError
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return { ...state, register, login, logout }
}
