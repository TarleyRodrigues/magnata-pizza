import { useQuery } from '@tanstack/react-query'
import { supabase }  from '@/lib/supabase'
import type { Pizza, Category, Borda, Adicional, Extra, SystemConfig } from '@/types'

// ─── Query Keys (centralizados para invalidação fácil) ───
export const catalogKeys = {
  all:        ['catalog']          as const,
  categories: ['catalog','cats']   as const,
  pizzas:     ['catalog','pizzas'] as const,
  bordas:     ['catalog','bordas'] as const,
  adicionais: ['catalog','adics']  as const,
  extras:     ['catalog','extras'] as const,
  config:     ['config']           as const,
}

// ─── Categories ───────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: catalogKeys.categories,
    queryFn:  async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      if (error) throw error
      return data
    },
  })
}

// ─── Pizzas (com preços) ──────────────────────────────────
export function usePizzas() {
  return useQuery({
    queryKey: catalogKeys.pizzas,
    queryFn:  async (): Promise<Pizza[]> => {
      const { data, error } = await supabase
        .from('pizzas')
        .select(`
          *,
          category:categories(*),
          prices:pizza_prices(*)
        `)
        .eq('is_available', true)
        .order('display_order')
      if (error) throw error
      return data as Pizza[]
    },
    staleTime: 1000 * 60 * 10, // cardápio muda pouco
  })
}

// ─── Pizzas por categoria ─────────────────────────────────
export function usePizzasByCategory(slug: string) {
  const { data: pizzas, ...rest } = usePizzas()
  const filtered = pizzas?.filter(p => p.category?.slug === slug) ?? []
  return { data: filtered, ...rest }
}

// ─── Bordas ───────────────────────────────────────────────
export function useBordas() {
  return useQuery({
    queryKey: catalogKeys.bordas,
    queryFn:  async (): Promise<Borda[]> => {
      const { data, error } = await supabase
        .from('bordas')
        .select('*')
        .eq('is_available', true)
        .order('display_order')
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 10,
  })
}

// ─── Adicionais ───────────────────────────────────────────
export function useAdicionais() {
  return useQuery({
    queryKey: catalogKeys.adicionais,
    queryFn:  async (): Promise<Adicional[]> => {
      const { data, error } = await supabase
        .from('adicionais')
        .select('*')
        .eq('is_available', true)
        .order('display_order')
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 10,
  })
}

// ─── Extras (bebidas + molhos) ────────────────────────────
export function useExtras() {
  return useQuery({
    queryKey: catalogKeys.extras,
    queryFn:  async (): Promise<Extra[]> => {
      const { data, error } = await supabase
        .from('extras')
        .select('*')
        .eq('is_available', true)
        .order('display_order')
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 10,
  })
}

// ─── System Config ────────────────────────────────────────
export function useSystemConfig() {
  return useQuery({
    queryKey: catalogKeys.config,
    queryFn:  async (): Promise<Partial<SystemConfig>> => {
      const { data, error } = await supabase
        .from('system_config')
        .select('key, value')
      if (error) throw error

      return Object.fromEntries(
        (data ?? []).map(row => [row.key, row.value])
      ) as Partial<SystemConfig>
    },
    staleTime: 1000 * 60 * 5,
  })
}
