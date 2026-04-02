import { useState }             from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, QtyControl }   from '@/components/ui'
import { useCartStore }          from '@/store/cart'
import { useExtras }             from '@/features/catalog/useCatalog'
import { formatBRL }             from '@/lib/pricing'
import type { CartExtra, ExtraType } from '@/types'

interface CartDrawerProps {
  open:       boolean
  onClose:    () => void
  onCheckout: (payMethod: string, notes: string) => void
  isOrdering: boolean
}

type Tab = 'cart' | 'extras' | 'checkout'
const TABS: { id: Tab; label: string }[] = [
  { id: 'cart',     label: '🍕 Pizzas'   },
  { id: 'extras',   label: '🥤 Extras'   },
  { id: 'checkout', label: '💳 Finalizar' },
]

const PAY_METHODS = [
  { id: 'Pix',            emoji: '📱' },
  { id: 'Cartão Crédito', emoji: '💳' },
  { id: 'Cartão Débito',  emoji: '💳' },
  { id: 'Dinheiro',       emoji: '💵' },
]

export function CartDrawer({ open, onClose, onCheckout, isOrdering }: CartDrawerProps) {
  const { items, extras, removeItem, updateItemQty, setExtraQty, total, itemCount } = useCartStore()
  const { data: allExtras = [] } = useExtras()

  const [tab,       setTab]       = useState<Tab>('cart')
  const [payMethod, setPayMethod] = useState('')
  const [notes,     setNotes]     = useState('')

  const bebidas = allExtras.filter(e => e.type === 'bebida')
  const molhos  = allExtras.filter(e => e.type === 'molho')

  const getExtraQty = (id: string) => extras.find(e => e.id === id)?.qty ?? 0

  const handleExtraChange = (id: string, qty: number, type: ExtraType, name: string, price: number) => {
    setExtraQty(id, qty, { id, name, type, price })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 380 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50
                       bg-magnata-surf border-l border-magnata-border flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-magnata-border flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-serif text-lg font-bold text-magnata-cream">Carrinho</h2>
                <p className="font-sans text-xs text-magnata-dim mt-0.5">
                  {itemCount()} pizza{itemCount() !== 1 ? 's' : ''}
                </p>
              </div>
              <button onClick={onClose} className="text-magnata-dim hover:text-magnata-cream p-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-magnata-border shrink-0">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={[
                    'flex-1 py-2.5 text-xs font-sans font-semibold transition-all',
                    'border-b-2',
                    tab === t.id
                      ? 'text-magnata-gold border-magnata-gold'
                      : 'text-magnata-dim border-transparent hover:text-magnata-muted',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">

              {/* ── Cart tab ── */}
              {tab === 'cart' && (
                <div className="p-4 space-y-3">
                  {items.length === 0 ? (
                    <div className="text-center py-16 text-magnata-dim">
                      <div className="text-5xl mb-3 opacity-40">🍕</div>
                      <p className="font-sans text-sm">Carrinho vazio</p>
                    </div>
                  ) : items.map(item => (
                    <div key={item.cartId}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                      <div className="flex justify-between gap-2 mb-2">
                        <p className="font-sans text-sm font-semibold text-magnata-cream leading-tight flex-1">
                          {item.pizzaName}
                        </p>
                        <button onClick={() => removeItem(item.cartId)}
                          className="text-magnata-dim/60 hover:text-red-400 transition-colors p-0.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2"/>
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-[10px] bg-white/5 text-magnata-dim px-2 py-0.5 rounded-full font-sans">
                          Tam. {item.size}
                        </span>
                        {item.borda && (
                          <span className="text-[10px] bg-magnata-gold-dim text-magnata-gold px-2 py-0.5 rounded-full font-sans">
                            {item.borda.name}{item.borda.flavor ? ` (${item.borda.flavor})` : ''}
                          </span>
                        )}
                        {item.adicionais.map(a => (
                          <span key={a.name} className="text-[10px] bg-white/5 text-magnata-dim px-2 py-0.5 rounded-full font-sans">
                            +{a.name}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <QtyControl
                          value={item.qty}
                          onChange={qty => updateItemQty(item.cartId, qty)}
                        />
                        <span className="font-serif text-base font-bold text-magnata-gold">
                          {formatBRL(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Extras tab ── */}
              {tab === 'extras' && (
                <div className="p-4 space-y-6">
                  <ExtraSection
                    title="🥤 Bebidas"
                    items={bebidas}
                    getQty={getExtraQty}
                    onChange={(id, qty, name, price) => handleExtraChange(id, qty, 'bebida', name, price)}
                  />
                  <ExtraSection
                    title="🍅 Molhos"
                    items={molhos}
                    getQty={getExtraQty}
                    onChange={(id, qty, name, price) => handleExtraChange(id, qty, 'molho', name, price)}
                  />
                </div>
              )}

              {/* ── Checkout tab ── */}
              {tab === 'checkout' && (
                <div className="p-4 space-y-5">
                  <h4 className="font-serif text-base font-bold text-magnata-cream">Forma de pagamento</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PAY_METHODS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPayMethod(m.id)}
                        className={[
                          'border rounded-xl p-3.5 text-center transition-all',
                          payMethod === m.id
                            ? 'border-magnata-gold bg-magnata-gold-dim'
                            : 'border-magnata-border bg-white/[0.02] hover:border-magnata-gold/40',
                        ].join(' ')}
                      >
                        <div className="text-2xl mb-1">{m.emoji}</div>
                        <p className="font-sans text-xs font-semibold text-magnata-cream">{m.id}</p>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold font-sans text-magnata-dim uppercase tracking-wider">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Ex: sem cebola, ponto bem passado..."
                      rows={2}
                      className="w-full bg-white/[0.04] border border-magnata-border rounded-lg px-3 py-2.5
                                 font-sans text-sm text-magnata-cream placeholder:text-magnata-dim
                                 outline-none focus:border-magnata-gold resize-none transition-colors"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 space-y-2">
                    <p className="font-sans text-[10px] text-magnata-dim uppercase tracking-wider mb-3">Resumo</p>
                    <div className="flex justify-between font-sans text-sm">
                      <span className="text-magnata-muted">Pizzas</span>
                      <span className="text-magnata-cream">{formatBRL(items.reduce((s,i) => s+i.totalPrice, 0))}</span>
                    </div>
                    {extras.length > 0 && (
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-magnata-muted">Extras</span>
                        <span className="text-magnata-cream">{formatBRL(extras.reduce((s,e) => s+e.price*e.qty, 0))}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                      <span className="font-sans text-sm font-bold text-magnata-cream">Total</span>
                      <span className="font-serif text-xl font-black text-magnata-gold">{formatBRL(total())}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-magnata-border space-y-3 shrink-0">
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs text-magnata-dim">Total do pedido</span>
                <span className="font-serif text-xl font-black text-magnata-gold">{formatBRL(total())}</span>
              </div>
              {tab !== 'checkout' ? (
                <Button
                  fullWidth
                  disabled={items.length === 0}
                  onClick={() => setTab(tab === 'cart' ? 'extras' : 'checkout')}
                >
                  {tab === 'cart' ? 'Adicionar Extras →' : 'Ir para Pagamento →'}
                </Button>
              ) : (
                <Button
                  fullWidth
                  loading={isOrdering}
                  disabled={items.length === 0 || !payMethod}
                  onClick={() => onCheckout(payMethod, notes)}
                >
                  ✅ Confirmar Pedido
                </Button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── ExtraSection (helper interno) ───────────────────────
interface ExtraSectionProps {
  title:    string
  items:    { id: string; name: string; price: number }[]
  getQty:   (id: string) => number
  onChange: (id: string, qty: number, name: string, price: number) => void
}

function ExtraSection({ title, items, getQty, onChange }: ExtraSectionProps) {
  return (
    <div>
      <h4 className="font-serif text-sm font-bold text-magnata-cream mb-3">{title}</h4>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-sans text-xs text-magnata-muted">{item.name}</p>
              <p className="font-sans text-xs text-magnata-gold">{formatBRL(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              {[[-1,'−'],[1,'+']].map(([d, l]) => (
                <button
                  key={l}
                  onClick={() => onChange(item.id, getQty(item.id) + (d as number), item.name, item.price)}
                  className="w-7 h-7 rounded-full border border-magnata-border text-magnata-gold
                             flex items-center justify-center text-lg leading-none hover:border-magnata-gold/60 transition-colors"
                >
                  {l}
                </button>
              ))}
              <span className="font-sans text-sm font-bold text-magnata-cream w-4 text-center">
                {getQty(item.id)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
