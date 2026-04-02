import { useState }              from 'react'
import { SelectCard }            from '@/components/ui'
import { usePizzas }             from '@/features/catalog/useCatalog'
import type { Pizza }            from '@/types'

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
