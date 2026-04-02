import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef }                      from 'react'
import { supabase }                               from '@/lib/supabase'
import type { Order, OrderStatus }                from '@/types'
import { orderKeys }                              from '@/features/orders/useOrders'

// ─── Todos os pedidos (admin) ─────────────────────────────
export function useAdminOrders() {
  return useQuery({
    queryKey: orderKeys.admin(),
    queryFn:  async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, items:order_items(*), order_extras(*)`)
        .order('created_at', { ascending: false })
        .limit(100)
      if (error) throw error
      return data as Order[]
    },
    staleTime: 0, // admin sempre quer dados frescos
  })
}

// ─── Realtime: escuta novos pedidos e mudanças de status ──
export function useAdminOrdersRealtime() {
  const qc  = useQueryClient()
  const ref = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    ref.current = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          // Invalida a query para refetch automático
          qc.invalidateQueries({ queryKey: orderKeys.admin() })
          // Som de notificação para novos pedidos
          playNotification()
        }
      )
      .subscribe()

    return () => {
      ref.current?.unsubscribe()
    }
  }, [qc])
}

function playNotification() {
  try {
    const ctx  = new AudioContext()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  } catch { /* silencia erros de autoplay */ }
}

// ─── Atualizar status do pedido ───────────────────────────
const STATUS_TIMESTAMPS: Partial<Record<OrderStatus, string>> = {
  confirmed:  'confirmed_at',
  preparing:  'preparing_at',
  delivering: 'delivering_at',
  delivered:  'delivered_at',
  cancelled:  'cancelled_at',
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const tsField = STATUS_TIMESTAMPS[status]
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          ...(tsField ? { [tsField]: new Date().toISOString() } : {}),
        })
        .eq('id', orderId)
        .select()
        .single()
      if (error) throw error
      return data as Order
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.admin() })
    },
  })
}

// ─── Estatísticas do dia ──────────────────────────────────
export function useTodayStats(orders: Order[]) {
  const today = new Date().toDateString()
  const todayOrders = orders.filter(
    o => new Date(o.created_at).toDateString() === today
  )
  const pending  = todayOrders.filter(o => o.status === 'pending').length
  const active   = todayOrders.filter(o => ['confirmed','preparing','delivering'].includes(o.status)).length
  const revenue  = todayOrders
    .filter(o => !['pending','cancelled'].includes(o.status))
    .reduce((s, o) => s + o.total, 0)
  const avgTicket = active > 0 ? revenue / active : 0

  return { total: todayOrders.length, pending, active, revenue, avgTicket }
}
