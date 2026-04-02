import { Navigate }                 from 'react-router-dom'
import { OrderStatusBadge }        from '@/components/ui/OrderStatusBadge'
import { Spinner }                 from '@/components/ui'
import { useMyOrders }             from '@/features/orders/useOrders'
import { formatBRL }               from '@/lib/pricing'
import { timeAgo }                 from '@/utils'
import type { Profile, OrderStatus } from '@/types'

interface DashboardPageProps {
  profile: Profile | null
}

export function DashboardPage({ profile }: DashboardPageProps) {
  if (!profile) return <Navigate to="/" replace />

  const { data: orders = [], isLoading } = useMyOrders(profile.id)

  const active = orders.filter(o =>
    ['pending','confirmed','preparing','delivering'].includes(o.status)
  )

  return (
    <div className="min-h-screen pt-20 max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-black text-magnata-cream mb-1">
          Meus Pedidos
        </h1>
        <p className="font-sans text-sm text-magnata-dim">
          Olá, {profile.name.split(' ')[0]}! 👋
        </p>
      </div>

      {/* Active orders highlight */}
      {active.length > 0 && (
        <div className="mb-6">
          <h2 className="font-sans text-xs font-bold text-magnata-gold uppercase tracking-widest mb-3">
            Em andamento
          </h2>
          {active.map(order => (
            <div key={order.id}
              className="bg-magnata-gold-dim border border-magnata-border rounded-xl p-4 mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-sans text-sm font-bold text-magnata-cream">
                    Pedido #{order.number}
                  </p>
                  <p className="font-sans text-xs text-magnata-dim mt-0.5">
                    {timeAgo(order.created_at)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status as OrderStatus} />
              </div>
              <div className="mt-3 flex justify-between items-end">
                <div className="space-y-0.5">
                  {(order.items ?? []).slice(0, 2).map((item, i) => (
                    <p key={i} className="font-sans text-xs text-magnata-muted">
                      • {item.qty}x {item.pizza_name} ({item.size})
                    </p>
                  ))}
                  {(order.items?.length ?? 0) > 2 && (
                    <p className="font-sans text-xs text-magnata-dim">
                      +{(order.items?.length ?? 0) - 2} mais...
                    </p>
                  )}
                </div>
                <span className="font-serif text-lg font-black text-magnata-gold">
                  {formatBRL(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All orders */}
      <h2 className="font-sans text-xs font-bold text-magnata-dim uppercase tracking-widest mb-3">
        Histórico
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-magnata-dim">
          <p className="text-6xl mb-4 opacity-30 select-none">🍕</p>
          <p className="font-serif text-lg text-magnata-muted mb-2">Nenhum pedido ainda</p>
          <p className="font-sans text-sm">Faça seu primeiro pedido!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id}
              className="bg-white/[0.03] border border-magnata-border rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-sans text-sm font-semibold text-magnata-cream">
                    Pedido #{order.number}
                  </p>
                  <p className="font-sans text-xs text-magnata-dim mt-0.5">
                    {timeAgo(order.created_at)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status as OrderStatus} size="sm" />
              </div>

              <div className="space-y-1 mb-3">
                {(order.items ?? []).map((item, i) => (
                  <p key={i} className="font-sans text-xs text-magnata-muted">
                    • {item.qty}x {item.pizza_name} (Tam. {item.size})
                    {item.borda_name ? ` + ${item.borda_name}` : ''}
                  </p>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-white/[0.05]">
                <p className="font-sans text-xs text-magnata-dim">
                  {order.pay_method ? `💳 ${order.pay_method}` : '⏳ Aguardando confirmação'}
                </p>
                <span className="font-serif text-base font-bold text-magnata-gold">
                  {formatBRL(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
