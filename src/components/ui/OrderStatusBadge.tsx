import type { OrderStatus } from '@/types'

interface StatusConfig {
  label: string
  emoji: string
  badge: string
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending:    { label: 'Aguardando',   emoji: '⏳', badge: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/40' },
  confirmed:  { label: 'Confirmado',   emoji: '✅', badge: 'bg-green-900/20  text-green-400  border-green-700/40'  },
  preparing:  { label: 'Preparando',   emoji: '👨‍🍳', badge: 'bg-blue-900/20   text-blue-400   border-blue-700/40'   },
  delivering: { label: 'Em Entrega',   emoji: '🛵', badge: 'bg-orange-900/20 text-orange-400 border-orange-700/40' },
  delivered:  { label: 'Entregue',     emoji: '🎉', badge: 'bg-teal-900/20   text-teal-400   border-teal-700/40'   },
  cancelled:  { label: 'Cancelado',    emoji: '❌', badge: 'bg-red-900/20    text-red-400    border-red-700/40'    },
}

export const STATUS_FLOW: OrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'delivering', 'delivered',
]

interface OrderStatusBadgeProps {
  status: OrderStatus
  size?:  'sm' | 'md'
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={[
      'inline-flex items-center gap-1 rounded-full border font-sans font-semibold whitespace-nowrap',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
      cfg.badge,
    ].join(' ')}>
      <span>{cfg.emoji}</span>
      {cfg.label}
    </span>
  )
}
