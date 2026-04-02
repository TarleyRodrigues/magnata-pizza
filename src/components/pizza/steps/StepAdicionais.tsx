import { formatBRL }                      from '@/lib/pricing'
import type { Adicional, AdicionalSnapshot } from '@/types'

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
