import { QtyControl }                     from '@/components/ui'
import { SIZE_LABELS, formatBRL }         from '@/lib/pricing'
import type { Pizza, PizzaSize, CartBorda, AdicionalSnapshot } from '@/types'

interface StepResumoProps {
  pizza1:      Pizza
  pizza2:      Pizza | null
  size:        PizzaSize
  borda:       CartBorda | null
  adicionais:  AdicionalSnapshot[]
  qty:         number
  unitPrice:   number
  totalPrice:  number
  onQtyChange: (n: number) => void
}

export function StepResumo({ pizza1, pizza2, size, borda, adicionais, qty, unitPrice, totalPrice, onQtyChange }: StepResumoProps) {
  const name = pizza2 ? `${pizza1.name} / ${pizza2.name}` : pizza1.name

  const rows = [
    { label: 'Pizza',    value: name },
    { label: 'Tamanho',  value: SIZE_LABELS[size] },
    { label: 'Borda',    value: borda ? `${borda.name}${borda.flavor ? ` (${borda.flavor})` : ''}` : 'Sem borda' },
    ...(adicionais.length > 0 ? [{ label: 'Adicionais', value: adicionais.map(a => a.name).join(' · ') }] : []),
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-base font-bold text-magnata-cream">Resumo do pedido</h3>

      <div className="bg-white/[0.03] rounded-xl p-4 space-y-2.5 border border-white/[0.05]">
        {rows.map(r => (
          <div key={r.label} className="flex justify-between gap-3 items-start">
            <span className="font-sans text-xs text-magnata-dim shrink-0">{r.label}</span>
            <span className="font-sans text-xs text-magnata-muted text-right">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="font-sans text-sm text-magnata-muted">Quantidade</span>
        <QtyControl value={qty} onChange={onQtyChange} />
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-magnata-border">
        <span className="font-sans text-sm text-magnata-muted">
          {qty > 1 ? `${qty}x ${formatBRL(unitPrice)}` : 'Total'}
        </span>
        <span className="font-serif text-2xl font-black text-magnata-gold">
          {formatBRL(totalPrice)}
        </span>
      </div>
    </div>
  )
}
