import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase }                               from '@/lib/supabase'
import type { Order, CartItem, CartExtra }        from '@/types'

export const orderKeys = {
  mine:  (userId: string) => ['orders', 'mine',  userId] as const,
  admin: ()               => ['orders', 'admin']         as const,
  one:   (id: string)     => ['orders', 'one',   id]     as const,
}

// ─── Pedidos do cliente logado ────────────────────────────
export function useMyOrders(userId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.mine(userId ?? ''),
    enabled:  !!userId,
    queryFn:  async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, items:order_items(*), order_extras(*)`)
        .eq('user_id', userId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Order[]
    },
  })
}

// ─── Criar pedido ─────────────────────────────────────────
interface CreateOrderParams {
  userId:   string
  profile:  { name: string; phone: string; address: string; address_ref?: string | null }
  items:    CartItem[]
  extras:   CartExtra[]
  payMethod: string
  notes?:   string
}

export function useCreateOrder() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateOrderParams): Promise<Order> => {
      const { userId, profile, items, extras, payMethod, notes } = params

      const subtotal = items.reduce((s, i) => s + i.totalPrice, 0)
      const extTotal = extras.reduce((s, e) => s + e.price * e.qty, 0)
      const total    = subtotal + extTotal

      // 1. Criar o pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id:          userId,
          status:           'pending',
          pay_method:       payMethod,
          subtotal,
          total,
          notes:            notes ?? null,
          delivery_name:    profile.name,
          delivery_phone:   profile.phone,
          delivery_address: profile.address,
          delivery_ref:     profile.address_ref ?? null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Inserir os itens
      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(
            items.map(item => ({
              order_id:        order.id,
              pizza_name:      item.pizzaName,
              is_half_half:    item.isHalfHalf,
              size:            item.size,
              qty:             item.qty,
              unit_price:      item.unitPrice,
              total_price:     item.totalPrice,
              borda_name:      item.borda?.name ?? null,
              borda_flavor:    item.borda?.flavor ?? null,
              borda_price:     item.borda?.price ?? null,
              adicionais_json: item.adicionais,
            }))
          )
        if (itemsError) throw itemsError
      }

      // 3. Inserir os extras
      if (extras.length > 0) {
        const { error: extrasError } = await supabase
          .from('order_extras')
          .insert(
            extras.map(e => ({
              order_id:    order.id,
              extra_name:  e.name,
              extra_type:  e.type,
              qty:         e.qty,
              unit_price:  e.price,
              total_price: e.price * e.qty,
            }))
          )
        if (extrasError) throw extrasError
      }

      return order as Order
    },

    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: orderKeys.mine(vars.userId) })
    },
  })
}
