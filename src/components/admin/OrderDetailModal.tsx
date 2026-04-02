import { Modal }                          from '@/components/ui/Modal'
import { Button }                          from '@/components/ui/Button'
import { OrderStatusBadge, STATUS_FLOW }   from '@/components/ui/OrderStatusBadge'
import { useUpdateOrderStatus }            from '@/features/admin/useAdminOrders'
import { buildWhatsAppMessage, buildWhatsAppURL } from '@/lib/whatsapp'
import { formatBRL }                       from '@/lib/pricing'
import { formatDate }                      from '@/utils'
import type { Order, OrderStatus }         from '@/types'

interface OrderDetailModalProps {
  order:   Order | null
  onClose: () => void
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus()

  if (!order) return null

  const nextStatus = (): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(order.status as OrderStatus)
    return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null
  }

  const handleConfirmAndWA = () => {
    updateStatus(
      { orderId: order.id, status: 'confirmed' },
      {
        onSuccess: (updated) => {
          const msg = buildWhatsAppMessage(updated)
          const url = buildWhatsAppURL(updated.delivery_phone, msg)
          window.open(url, '_blank')
        },
      }
    )
  }

  const handleNextStatus = () => {
    const next = nextStatus()
    if (next) updateStatus({ orderId: order.id, status: next })
  }

  const handleCancel = () => {
    if (confirm('Cancelar este pedido?')) {
      updateStatus({ orderId: order.id, status: 'cancelled' })
      onClose()
    }
  }

  const next = nextStatus()

  return (
    <Modal open={!!order} onClose={onClose} maxWidth="max-w-lg" title={`Pedido #${order.number}`}>
      <div className="px-6 py-5 space-y-5">

        {/* Status */}
        <div className="flex items-center justify-between">
          <OrderStatusBadge status={order.status as OrderStatus} />
          <span className="font-sans text-xs text-magnata-dim">{formatDate(order.created_at)}</span>
        </div>

        {/* Customer */}
        <Section title="Cliente">
          <Row label="Nome"       value={order.delivery_name} />
          <Row label="WhatsApp"   value={order.delivery_phone} gold />
          <Row label="Endereço"   value={order.delivery_address} />
          {order.delivery_ref && <Row label="Referência" value={order.delivery_ref} />}
        </Section>

        {/* Items */}
        <Section title="Itens do Pedido">
          {(order.items ?? []).map((item, i) => (
            <div key={i} className="space-y-1.5 pb-3 border-b border-white/[0.05] last:border-0 last:pb-0">
              <div className="flex justify-between">
                <span className="font-sans text-sm font-semibold text-magnata-cream">
                  {item.qty}x {item.pizza_name}
                </span>
                <span className="font-serif text-sm font-bold text-magnata-gold">
                  {formatBRL(item.total_price)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-white/5 text-magnata-dim px-2 py-0.5 rounded-full font-sans">
                  Tam. {item.size}
                </span>
                {item.borda_name && (
                  <span className="text-[10px] bg-magnata-gold-dim text-magnata-gold px-2 py-0.5 rounded-full font-sans">
                    {item.borda_name}{item.borda_flavor ? ` (${item.borda_flavor})` : ''}
                  </span>
                )}
                {item.adicionais_json?.map((a, j) => (
                  <span key={j} className="text-[10px] bg-white/5 text-magnata-dim px-2 py-0.5 rounded-full font-sans">
                    +{a.name}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {(order.order_extras ?? []).length > 0 && (
            <>
              <p className="text-[10px] font-sans text-magnata-dim uppercase tracking-wider pt-1">Extras</p>
              {order.order_extras!.map((e, i) => (
                <div key={i} className="flex justify-between">
                  <span className="font-sans text-xs text-magnata-muted">{e.qty}x {e.extra_name}</span>
                  <span className="font-sans text-xs text-magnata-gold">{formatBRL(e.total_price)}</span>
                </div>
              ))}
            </>
          )}

          <div className="flex justify-between pt-2 border-t border-magnata-border mt-2">
            <span className="font-sans text-sm font-bold text-magnata-cream">TOTAL</span>
            <span className="font-serif text-xl font-black text-magnata-gold">{formatBRL(order.total)}</span>
          </div>
        </Section>

        {/* Payment */}
        {order.pay_method && (
          <Section title="Pagamento">
            <Row label="Forma" value={order.pay_method} gold />
          </Section>
        )}

        {/* Notes */}
        {order.notes && (
          <Section title="Observações">
            <p className="font-sans text-xs text-magnata-muted">{order.notes}</p>
          </Section>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-1">
          {order.status === 'pending' && (
            <Button
              fullWidth
              variant="whatsapp"
              size="lg"
              loading={isPending}
              onClick={handleConfirmAndWA}
            >
              📲 Confirmar Pedido & Abrir WhatsApp
            </Button>
          )}

          {next && order.status !== 'pending' && (
            <Button
              fullWidth
              variant="outline"
              loading={isPending}
              onClick={handleNextStatus}
            >
              Avançar para: {next.charAt(0).toUpperCase() + next.slice(1)} →
            </Button>
          )}

          <div className="flex gap-2">
            <a
              href={buildWhatsAppURL(order.delivery_phone, buildWhatsAppMessage(order))}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5
                         bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30
                         rounded-xl py-2.5 text-xs font-sans font-bold hover:bg-[#25D366]/20 transition-colors"
            >
              💬 Abrir WA
            </a>
            {!['delivered','cancelled'].includes(order.status) && (
              <Button variant="danger" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ─── Helpers internos ─────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-sans font-bold text-magnata-gold uppercase tracking-[0.1em] mb-2.5">
        {title}
      </p>
      <div className="bg-white/[0.03] rounded-xl p-3.5 space-y-2">
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between gap-3 items-start">
      <span className="font-sans text-xs text-magnata-dim shrink-0">{label}</span>
      <span className={`font-sans text-xs text-right ${gold ? 'text-magnata-gold' : 'text-magnata-muted'}`}>
        {value}
      </span>
    </div>
  )
}
