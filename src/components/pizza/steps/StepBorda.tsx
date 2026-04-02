import { SelectCard }     from '@/components/ui'
import { formatBRL }      from '@/lib/pricing'
import type { Borda, CartBorda } from '@/types'

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
