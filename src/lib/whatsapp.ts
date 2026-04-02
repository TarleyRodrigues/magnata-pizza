import type { Order, OrderItem, OrderExtra } from '@/types'
import { formatBRL } from './pricing'

function buildItemLine(item: OrderItem): string {
  const borda = item.borda_name
    ? ` + ${item.borda_name}${item.borda_flavor ? ` (${item.borda_flavor})` : ''}`
    : ''
  const adics = item.adicionais_json?.length
    ? ` [${item.adicionais_json.map(a => a.name).join(', ')}]`
    : ''
  return `• ${item.qty}x ${item.pizza_name} (${item.size})${borda}${adics} — ${formatBRL(item.total_price)}`
}

function buildExtraLine(extra: OrderExtra): string {
  return `• ${extra.qty}x ${extra.extra_name} — ${formatBRL(extra.total_price)}`
}

/** Gera a mensagem de confirmação do pedido para o WhatsApp */
export function buildWhatsAppMessage(order: Order): string {
  const items  = (order.items ?? []).map(buildItemLine).join('\n')
  const extras = (order.order_extras ?? []).map(buildExtraLine).join('\n')

  const lines = [
    `Olá ${order.delivery_name}! Aqui é da Pizzaria MAGNATA 🍕`,
    '',
    `✅ *Pedido #${order.number} Confirmado!*`,
    '',
    '*Itens:*',
    items,
  ]

  if (extras) {
    lines.push('', '*Extras:*', extras)
  }

  lines.push(
    '',
    `*Total: ${formatBRL(order.total)}*`,
    '',
    `📍 *Entrega:* ${order.delivery_address}`,
  )

  if (order.delivery_ref) {
    lines.push(`📌 *Referência:* ${order.delivery_ref}`)
  }

  lines.push(
    '',
    'Por favor, confirme a forma de pagamento ou envie o comprovante do Pix. 😊',
  )

  return lines.join('\n')
}

/** Constrói a URL do WhatsApp Web/App */
export function buildWhatsAppURL(phone: string, message: string): string {
  const digits      = phone.replace(/\D/g, '')
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`
}
