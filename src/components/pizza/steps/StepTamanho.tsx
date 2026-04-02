import { SelectCard }                    from '@/components/ui'
import { calcBasePrice, SIZE_LABELS, formatBRL } from '@/lib/pricing'
import type { Pizza, PizzaSize }          from '@/types'

interface StepTamanhoProps {
  pizza1:       Pizza
  pizza2:       Pizza | null
  allowedSizes: PizzaSize[]
  selected:     PizzaSize
  onSelect:     (s: PizzaSize) => void
}

const SIZE_EMOJI: Record<PizzaSize, string>      = { P: '🍕', M: '🍕', G: '🍕' }
const SIZE_ICON_SIZE: Record<PizzaSize, string>  = { P: 'text-2xl', M: 'text-4xl', G: 'text-5xl' }

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
