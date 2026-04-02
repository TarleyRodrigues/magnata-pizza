// ─── StepTipo ────────────────────────────────────────────
import { useState }              from 'react'
import { SelectCard }            from '@/components/ui'
import { usePizzas }             from '@/features/catalog/useCatalog'
import { formatBRL }             from '@/lib/pricing'
import type { Pizza, PizzaSize, CartBorda, AdicionalSnapshot } from '@/types'

interface StepTipoProps {
  pizza1:      Pizza
  isHH:        boolean
  pizza2:      Pizza | null
  onSetHH:     (v: boolean) => void
  onSetPizza2: (p: Pizza | null) => void
}

export function StepTipo({ pizza1, isHH, pizza2, onSetHH, onSetPizza2 }: StepTipoProps) {
  const { data: allPizzas = [] } = usePizzas()
  const [q, setQ] = useState('')

  const candidates = allPizzas.filter(p =>
    p.id !== pizza1.id &&
    !p.is_promotional &&
    (!q || p.name.toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-base font-bold text-magnata-cream">Como você quer sua pizza?</h3>

      <div className="grid grid-cols-2 gap-3">
        <SelectCard selected={!isHH} onClick={() => { onSetHH(false); onSetPizza2(null) }}>
          <div className="text-3xl mb-2">🍕</div>
          <p className="font-sans text-sm font-bold text-magnata-cream">Inteira</p>
          <p className="font-sans text-xs text-magnata-dim mt-0.5">{pizza1.name}</p>
        </SelectCard>
        <SelectCard selected={isHH} onClick={() => onSetHH(true)}>
          <div className="text-3xl mb-2">🍕🍕</div>
          <p className="font-sans text-sm font-bold text-magnata-cream">Meio a Meio</p>
          <p className="font-sans text-xs text-magnata-dim mt-0.5">2 sabores</p>
        </SelectCard>
      </div>

      {isHH && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-magnata-gold font-sans uppercase tracking-wider">
            Escolha o 2º sabor:
          </p>
          <input
            className="w-full bg-white/[0.04] border border-magnata-border rounded-lg px-3 py-2.5
                       font-sans text-sm text-magnata-cream placeholder:text-magnata-dim
                       outline-none focus:border-magnata-gold transition-colors"
            placeholder="Buscar sabor..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
            {candidates.map(p => (
              <button
                key={p.id}
                onClick={() => onSetPizza2(p)}
                className={[
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-sans transition-all',
                  pizza2?.id === p.id
                    ? 'bg-magnata-gold-dim border border-magnata-gold/40 text-magnata-cream'
                    : 'bg-white/[0.03] border border-white/[0.06] text-magnata-muted hover:border-magnata-gold/30',
                ].join(' ')}
              >
                {p.name}
              </button>
            ))}
          </div>
          {pizza2 && (
            <div className="bg-magnata-gold-dim border border-magnata-border rounded-lg px-3 py-2 text-xs font-sans text-magnata-gold">
              ✓ {pizza1.name} + {pizza2.name}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── StepTamanho ─────────────────────────────────────────
import { calcBasePrice, SIZE_LABELS } from '@/lib/pricing'

interface StepTamanhoProps {
  pizza1:       Pizza
  pizza2:       Pizza | null
  allowedSizes: PizzaSize[]
  selected:     PizzaSize
  onSelect:     (s: PizzaSize) => void
}

const SIZE_EMOJI: Record<PizzaSize, string> = { P: '🍕', M: '🍕', G: '🍕' }
const SIZE_ICON_SIZE: Record<PizzaSize, string> = { P: 'text-2xl', M: 'text-4xl', G: 'text-5xl' }

export function StepTamanho({ pizza1, pizza2, allowedSizes, selected, onSelect }: StepTamanhoProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-serif text-base font-bold text-magnata-cream">Escolha o tamanho:</h3>
      <div className="grid grid-cols-3 gap-3">
        {(allowedSizes as PizzaSize[]).map(s => {
          const price = calcBasePrice(pizza1, pizza2, s)
          return (
            <SelectCard key={s} selected={selected === s} onClick={() => onSelect(s)}>
              <div className={`${SIZE_ICON_SIZE[s]} text-center mb-2`}>{SIZE_EMOJI[s]}</div>
              <p className="font-sans text-base font-black text-magnata-cream text-center">{s}</p>
              <p className="font-sans text-[10px] text-magnata-dim text-center">
                {SIZE_LABELS[s].split(' ')[0]}
              </p>
              <p className="font-serif text-sm font-bold text-magnata-gold text-center mt-1">
                {formatBRL(price)}
              </p>
            </SelectCard>
          )
        })}
      </div>
    </div>
  )
}

// ─── StepBorda ───────────────────────────────────────────
import type { Borda }  from '@/types'

interface StepBordaProps {
  bordas:   Borda[]
  selected: CartBorda | null
  onSelect: (b: CartBorda | null) => void
}

export function StepBorda({ bordas, selected, onSelect }: StepBordaProps) {
  const handleBorda = (b: Borda) => {
    if (selected?.name === b.name && b.flavors.length === 0) {
      onSelect(null)
      return
    }
    onSelect({ name: b.name, flavor: b.flavors.length === 1 ? b.flavors[0] : null, price: b.price })
  }

  const selectedBorda = bordas.find(b => b.name === selected?.name)

  return (
    <div className="space-y-3">
      <h3 className="font-serif text-base font-bold text-magnata-cream">Escolha a borda:</h3>
      <div className="space-y-2">
        {bordas.map(b => (
          <div key={b.id}>
            <SelectCard
              selected={selected?.name === b.name}
              onClick={() => handleBorda(b)}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="font-sans text-sm font-semibold text-magnata-cream">{b.name}</p>
                {b.flavors.length > 0 && (
                  <p className="font-sans text-xs text-magnata-dim mt-0.5">
                    {b.flavors.join(', ')}
                  </p>
                )}
              </div>
              <span className={[
                'font-serif text-base font-bold shrink-0 ml-3',
                b.price === 0 ? 'text-green-400' : 'text-magnata-gold',
              ].join(' ')}>
                {b.price === 0 ? 'Grátis' : formatBRL(b.price)}
              </span>
            </SelectCard>

            {selected?.name === b.name && b.flavors.length > 1 && (
              <select
                value={selected?.flavor ?? ''}
                onChange={e => onSelect({ ...selected, flavor: e.target.value })}
                className="w-full mt-1.5 bg-white/[0.04] border border-magnata-gold/40 rounded-lg
                           px-3 py-2 font-sans text-sm text-magnata-cream outline-none"
              >
                <option value="">Escolha o sabor da borda...</option>
                {b.flavors.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            )}
          </div>
        ))}
      </div>

      {selectedBorda && selectedBorda.flavors.length > 1 && !selected?.flavor && (
        <p className="text-xs text-yellow-400 font-sans">⚠️ Selecione o sabor da borda para continuar</p>
      )}
    </div>
  )
}

// ─── StepAdicionais ──────────────────────────────────────
import type { Adicional } from '@/types'

interface StepAdicionaisProps {
  adicionais: Adicional[]
  selected:   AdicionalSnapshot[]
  onToggle:   (a: Adicional) => void
}

export function StepAdicionais({ adicionais, selected, onToggle }: StepAdicionaisProps) {
  const isSelected = (a: Adicional) => selected.some(s => s.name === a.name)

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-serif text-base font-bold text-magnata-cream">Ingredientes extras?</h3>
        <p className="font-sans text-xs text-magnata-dim mt-0.5">Opcional — pode pular</p>
      </div>
      <div className="space-y-2">
        {adicionais.map(a => {
          const on = isSelected(a)
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onToggle(a)}
              className={[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left',
                on
                  ? 'border-magnata-gold bg-magnata-gold-dim'
                  : 'border-magnata-border bg-white/[0.02] hover:border-magnata-gold/40',
              ].join(' ')}
            >
              <div className={[
                'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                on ? 'bg-magnata-gold border-magnata-gold' : 'border-magnata-border',
              ].join(' ')}>
                {on && (
                  <svg className="w-3 h-3 text-magnata-black" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 5l3.5 3.5L11 1"/>
                  </svg>
                )}
              </div>
              <span className="font-sans text-sm text-magnata-cream flex-1">{a.name}</span>
              <span className="font-serif text-sm font-bold text-magnata-gold shrink-0">
                +{formatBRL(a.price)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── StepResumo ──────────────────────────────────────────
import { QtyControl } from '@/components/ui'

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
