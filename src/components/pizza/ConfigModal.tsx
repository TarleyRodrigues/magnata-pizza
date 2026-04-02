import { useState, useCallback }      from 'react'
import { Modal }                       from '@/components/ui/Modal'
import { StepBar }                     from '@/components/ui'
import { StepTipo }                    from './steps/StepTipo'
import { StepTamanho }                 from './steps/StepTamanho'
import { StepBorda }                   from './steps/StepBorda'
import { StepAdicionais }              from './steps/StepAdicionais'
import { StepResumo }                  from './steps/StepResumo'
import { useBordas, useAdicionais }    from '@/features/catalog/useCatalog'
import { calcBasePrice, calcItemTotal, formatBRL } from '@/lib/pricing'
import type { Pizza, PizzaSize, CartItem, CartBorda, AdicionalSnapshot } from '@/types'

interface ConfigModalProps {
  pizza:   Pizza | null
  onClose: () => void
  onAdd:   (item: Omit<CartItem, 'cartId'>) => void
}

// Passo varia conforme o tipo da pizza
// Fixas: [Borda, Adicionais, Resumo]
// Variáveis: [Tipo, Tamanho, Borda, Adicionais, Resumo]
type Step = 'tipo' | 'tamanho' | 'borda' | 'adicionais' | 'resumo'

export function ConfigModal({ pizza, onClose, onAdd }: ConfigModalProps) {
  const { data: bordas     = [] } = useBordas()
  const { data: adicionais = [] } = useAdicionais()

  const isPromo    = pizza?.is_promotional ?? false
  const allowsSizes = pizza?.allowed_sizes ?? ['P', 'M', 'G']

  const STEPS: Step[] = isPromo
    ? ['borda', 'adicionais', 'resumo']
    : ['tipo', 'tamanho', 'borda', 'adicionais', 'resumo']

  const STEP_LABELS: Record<Step, string> = {
    tipo:       'Tipo de Pizza',
    tamanho:    'Tamanho',
    borda:      'Borda',
    adicionais: 'Adicionais',
    resumo:     'Resumo',
  }

  const [stepIdx,   setStepIdx]   = useState(0)
  const [isHH,      setIsHH]      = useState(false)
  const [pizza2,    setPizza2]    = useState<Pizza | null>(null)
  const [size,      setSize]      = useState<PizzaSize>(allowsSizes[0] ?? 'G')
  const [borda,     setBorda]     = useState<CartBorda | null>(null)
  const [adics,     setAdics]     = useState<AdicionalSnapshot[]>([])
  const [qty,       setQty]       = useState(1)

  const step = STEPS[stepIdx]

  const basePrice = pizza
    ? calcBasePrice(pizza, isHH ? pizza2 : null, size)
    : 0

  const unitPrice = calcItemTotal({
    basePrice,
    bordaPrice: borda?.price ?? 0,
    adicionais: adics,
    qty: 1,
  })

  const totalPrice = unitPrice * qty

  const canAdvance = useCallback((): boolean => {
    if (step === 'tipo'   && isHH && !pizza2) return false
    if (step === 'borda'  && borda !== null && !borda.flavor
        && (bordas.find(b => b.name === borda.name)?.flavors.length ?? 0) > 0) return false
    return true
  }, [step, isHH, pizza2, borda, bordas])

  const handleAdd = () => {
    if (!pizza) return
    const pizzaName = isHH && pizza2
      ? `${pizza.name} / ${pizza2.name}`
      : pizza.name

    onAdd({
      pizzaName,
      isHalfHalf:  isHH,
      size,
      qty,
      unitPrice,
      totalPrice,
      borda,
      adicionais: adics,
    })
  }

  if (!pizza) return null

  return (
    <Modal open={!!pizza} onClose={onClose} maxWidth="max-w-xl">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-magnata-border">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="font-serif text-lg font-bold text-magnata-cream leading-tight">
            {pizza.name}
          </h2>
          <button onClick={onClose} className="text-magnata-dim hover:text-magnata-cream p-1 shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <StepBar
          total={STEPS.length}
          current={stepIdx}
          labels={STEPS.map(s => STEP_LABELS[s])}
        />
      </div>

      {/* Step content */}
      <div className="px-6 py-5">
        {step === 'tipo' && (
          <StepTipo
            pizza1={pizza}
            isHH={isHH}
            pizza2={pizza2}
            onSetHH={setIsHH}
            onSetPizza2={setPizza2}
          />
        )}
        {step === 'tamanho' && (
          <StepTamanho
            pizza1={pizza}
            pizza2={isHH ? pizza2 : null}
            allowedSizes={allowsSizes}
            selected={size}
            onSelect={setSize}
          />
        )}
        {step === 'borda' && (
          <StepBorda
            bordas={bordas}
            selected={borda}
            onSelect={setBorda}
          />
        )}
        {step === 'adicionais' && (
          <StepAdicionais
            adicionais={adicionais}
            selected={adics}
            onToggle={(adic) => {
              setAdics(prev =>
                prev.some(a => a.name === adic.name)
                  ? prev.filter(a => a.name !== adic.name)
                  : [...prev, { name: adic.name, price: adic.price }]
              )
            }}
          />
        )}
        {step === 'resumo' && (
          <StepResumo
            pizza1={pizza}
            pizza2={isHH ? pizza2 : null}
            size={size}
            borda={borda}
            adicionais={adics}
            qty={qty}
            unitPrice={unitPrice}
            totalPrice={totalPrice}
            onQtyChange={setQty}
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-magnata-border flex items-center justify-between gap-4">
        <span className="font-serif text-xl font-black text-magnata-gold">
          {formatBRL(totalPrice)}
        </span>
        <div className="flex gap-2">
          {stepIdx > 0 && (
            <button
              onClick={() => setStepIdx(i => i - 1)}
              className="px-4 py-2 border border-magnata-border rounded-xl text-xs font-sans
                         text-magnata-muted hover:text-magnata-cream hover:border-magnata-gold/40 transition-colors"
            >
              ← Voltar
            </button>
          )}
          {stepIdx < STEPS.length - 1 ? (
            <button
              onClick={() => canAdvance() && setStepIdx(i => i + 1)}
              disabled={!canAdvance()}
              className="bg-gradient-to-r from-magnata-gold to-magnata-gold-light text-magnata-black
                         text-xs font-bold font-sans px-5 py-2 rounded-xl
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:shadow-[0_4px_16px_rgba(201,160,48,.35)] transition-all"
            >
              Próximo →
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-magnata-gold to-magnata-gold-light text-magnata-black
                         text-xs font-bold font-sans px-5 py-2 rounded-xl
                         hover:shadow-[0_4px_16px_rgba(201,160,48,.35)] transition-all"
            >
              🛒 Adicionar
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
