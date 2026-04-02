import { useState }                          from 'react'
import { Navigate }                          from 'react-router-dom'
import { OrderStatusBadge }                  from '@/components/ui/OrderStatusBadge'
import { OrderDetailModal }                  from '@/components/admin/OrderDetailModal'
import { Spinner }                           from '@/components/ui'
import { useAdminOrders, useAdminOrdersRealtime, useTodayStats } from '@/features/admin/useAdminOrders'
import { formatBRL }                         from '@/lib/pricing'
import { timeAgo }                           from '@/utils'
import type { Profile, Order, OrderStatus }  from '@/types'

const FILTER_OPTIONS: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all',        label: 'Todos'       },
  { id: 'pending',    label: 'Aguardando'  },
  { id: 'confirmed',  label: 'Confirmados' },
  { id: 'preparing',  label: 'Preparando'  },
  { id: 'delivering', label: 'Em Entrega'  },
  { id: 'delivered',  label: 'Entregues'   },
]

interface AdminPageProps {
  profile: Profile | null
}

export function AdminPage({ profile }: AdminPageProps) {
  // Redireciona se não for admin
  if (profile && profile.role === 'customer') return <Navigate to="/" replace />

  const { data: orders = [], isLoading } = useAdminOrders()
  useAdminOrdersRealtime() // subscription realtime

  const [filter,   setFilter]   = useState<OrderStatus | 'all'>('all')
  const [selected, setSelected] = useState<Order | null>(null)

  const stats   = useTodayStats(orders)
  const shown   = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const countFor = (id: OrderStatus | 'all') =>
    id === 'all' ? orders.length : orders.filter(o => o.status === id).length

  return (
    <div className="min-h-screen pt-16 bg-magnata-black">
      {/* Admin header */}
      <div className="bg-magnata-gold-dim border-b border-magnata-border px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h1 className="font-serif text-xl font-bold text-magnata-cream">⚙️ Painel Admin</h1>
            <p className="font-sans text-xs text-magnata-dim mt-0.5">
              Pizzaria MAGNATA · Tempo Real
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-5 flex-wrap">
            {[
              ['Novos', stats.pending,                 'text-yellow-400'],
              ['Em andamento', stats.active,           'text-blue-400'],
              ['Faturamento', formatBRL(stats.revenue),'text-green-400'],
            ].map(([label, value, color]) => (
              <div key={String(label)} className="text-center">
                <p className={`font-serif text-xl font-bold ${color}`}>{value}</p>
                <p className="font-sans text-[10px] text-magnata-dim">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-all border',
                filter === opt.id
                  ? 'bg-magnata-gold text-magnata-black border-magnata-gold'
                  : 'text-magnata-dim border-white/[0.08] hover:text-magnata-gold hover:border-magnata-gold/40',
              ].join(' ')}
            >
              {opt.label} ({countFor(opt.id)})
            </button>
          ))}
        </div>

        {/* Orders list */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size={32} /></div>
        ) : shown.length === 0 ? (
          <div className="text-center py-20 text-magnata-dim">
            <p className="text-5xl mb-4 opacity-20">🍕</p>
            <p className="font-sans text-sm">Nenhum pedido nesta categoria</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map(order => (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                className="w-full bg-white/[0.03] border border-magnata-border hover:border-magnata-gold/40
                           rounded-xl p-4 text-left transition-all hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1 flex-1">
                    <p className="font-sans text-sm font-semibold text-magnata-cream">
                      #{order.number} — {order.delivery_name}
                    </p>
                    <p className="font-sans text-xs text-magnata-dim">
                      📍 {order.delivery_address}
                    </p>
                    <p className="font-sans text-xs text-magnata-dim/60">
                      {(order.items ?? []).map(i => i.pizza_name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-sans text-xs text-magnata-dim">{timeAgo(order.created_at)}</p>
                      {order.pay_method && (
                        <p className="font-sans text-xs text-magnata-gold mt-0.5">{order.pay_method}</p>
                      )}
                    </div>
                    <OrderStatusBadge status={order.status as OrderStatus} size="sm" />
                    <span className="font-serif text-base font-bold text-magnata-gold whitespace-nowrap">
                      {formatBRL(order.total)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
