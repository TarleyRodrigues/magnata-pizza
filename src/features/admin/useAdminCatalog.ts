import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase }                    from '@/lib/supabase'
import { catalogKeys }                 from '@/features/catalog/useCatalog'
import type { Pizza, PizzaSize }       from '@/types'

// ─── Toggle disponibilidade de pizza ─────────────────────
export function useTogglePizzaAvailability() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
      const { error } = await supabase
        .from('pizzas')
        .update({ is_available: isAvailable })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.pizzas }),
  })
}

// ─── Atualizar preço de pizza ─────────────────────────────
export function useUpdatePizzaPrice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ pizzaId, size, price }: { pizzaId: string; size: PizzaSize; price: number }) => {
      const { error } = await supabase
        .from('pizza_prices')
        .upsert({ pizza_id: pizzaId, size, price }, { onConflict: 'pizza_id,size' })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.pizzas }),
  })
}

// ─── Criar pizza promocional ──────────────────────────────
interface CreatePromoPayload {
  name:          string
  description:   string
  allowed_sizes: PizzaSize[]
  prices:        Record<PizzaSize, number>
}

export function useCreatePromoPizza() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreatePromoPayload) => {
      const catResult = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'promocionais')
        .single()
      if (catResult.error) throw catResult.error

      const { data: pizza, error } = await supabase
        .from('pizzas')
        .insert({
          category_id:    catResult.data.id,
          name:           payload.name,
          description:    payload.description,
          tier:           'standard',
          is_promotional: true,
          allowed_sizes:  payload.allowed_sizes,
        })
        .select()
        .single()
      if (error) throw error

      const priceRows = (Object.entries(payload.prices) as [PizzaSize, number][])
        .filter(([size]) => payload.allowed_sizes.includes(size))
        .map(([size, price]) => ({ pizza_id: (pizza as Pizza).id, size, price }))

      const { error: priceError } = await supabase
        .from('pizza_prices')
        .insert(priceRows)
      if (priceError) throw priceError
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.pizzas }),
  })
}

// ─── Atualizar configuração do sistema ───────────────────
export function useUpdateConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      const { error } = await supabase
        .from('system_config')
        .upsert({ key, value }, { onConflict: 'key' })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.config }),
  })
}
