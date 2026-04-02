import { useRef, useState }             from 'react'
import { motion }                        from 'framer-motion'
import { PizzaCard }                     from '@/components/pizza/PizzaCard'
import { ConfigModal }                   from '@/components/pizza/ConfigModal'
import { Skeleton }                      from '@/components/ui'
import { usePizzas, useCategories, useSystemConfig } from '@/features/catalog/useCatalog'
import { useCartStore }                  from '@/store/cart'
import type { Pizza }                    from '@/types'

interface HomePageProps {
  onAuthRequired: () => void
  isAuthenticated: boolean
}

export function HomePage({ onAuthRequired, isAuthenticated }: HomePageProps) {
  const catalogRef = useRef<HTMLDivElement>(null)
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null)
  const [activeSlug,    setActiveSlug]    = useState('salgadas')

  const { data: pizzas     = [], isLoading: pizzasLoading } = usePizzas()
  const { data: categories = [] }                           = useCategories()
  const { data: config }                                    = useSystemConfig()
  const addItem = useCartStore(s => s.addItem)

  const filtered = pizzas.filter(p => p.category?.slug === activeSlug)

  const handlePizzaSelect = (pizza: Pizza) => {
    if (!isAuthenticated) { onAuthRequired(); return }
    setSelectedPizza(pizza)
  }

  const heroImage = config?.hero_image_url

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 relative overflow-hidden"
        style={heroImage ? {
          backgroundImage: `linear-gradient(to bottom, rgba(8,8,6,.7) 0%, rgba(8,8,6,.85) 100%), url(${heroImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        } : {}}
      >
        {/* Background effects (sem hero image) */}
        {!heroImage && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_50%,rgba(122,24,24,.2),transparent_55%),radial-gradient(ellipse_at_75%_50%,rgba(201,160,48,.08),transparent_55%)]" />
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg,#C9A030 0,#C9A030 1px,transparent 0,transparent 50%)', backgroundSize: '30px 30px' }} />
          </>
        )}

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Owner photo placeholder */}
          <div className="w-28 h-28 rounded-full border-2 border-magnata-border mx-auto mb-6
                          bg-white/[0.04] flex flex-col items-center justify-center gap-1">
            <span className="text-5xl select-none">👨‍🍳</span>
            <span className="font-sans text-[9px] text-magnata-dim tracking-widest uppercase">Os Donos</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 bg-magnata-gold-dim border border-magnata-border
                             rounded-full px-4 py-1.5 mb-5 font-sans text-[11px] font-bold text-magnata-gold
                             uppercase tracking-widest">
              🍕 Delivery Premium · Goiânia
            </span>

            <h1 className="font-serif text-5xl sm:text-7xl font-black leading-none mb-4">
              A Pizza Que<br />
              <span className="bg-gold-shimmer bg-[length:200%] animate-shimmer bg-clip-text text-transparent">
                Você Merece
              </span>
            </h1>

            <p className="font-sans text-magnata-muted text-base leading-relaxed max-w-md mx-auto mb-8">
              40 sabores irresistíveis, ingredientes selecionados e aquele toque que só o Magnata tem.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-magnata-gold to-magnata-gold-light text-magnata-black
                           font-bold font-sans px-7 py-3.5 rounded-xl text-sm
                           hover:shadow-[0_8px_24px_rgba(201,160,48,.35)] transition-all"
              >
                Ver Cardápio
              </button>
              {!isAuthenticated && (
                <button
                  onClick={onAuthRequired}
                  className="border border-magnata-gold text-magnata-gold bg-transparent font-sans font-medium
                             px-7 py-3.5 rounded-xl text-sm hover:bg-magnata-gold-dim transition-all"
                >
                  Criar Conta
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex gap-10 justify-center mt-14 flex-wrap">
            {[['40+','Sabores'],['⭐ 4.9','Avaliação'],['~40min','Entrega']].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="font-serif text-2xl font-bold text-magnata-gold">{v}</p>
                <p className="font-sans text-xs text-magnata-dim mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gradient-to-b from-magnata-gold/60 to-transparent" />
          <span className="font-sans text-[9px] text-magnata-dim/50 uppercase tracking-[0.3em]">cardápio</span>
        </div>
      </section>

      {/* ── Catalog ──────────────────────────────────────── */}
      <section ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl font-black mb-2">Nosso Cardápio</h2>
          <p className="font-sans text-magnata-dim text-sm">
            Inteira ou meio a meio · No meio a meio, cobra-se o preço da mais cara
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveSlug(cat.slug)}
              className={[
                'px-4 py-2 rounded-full text-sm font-sans font-semibold transition-all border',
                activeSlug === cat.slug
                  ? 'bg-magnata-gold text-magnata-black border-magnata-gold'
                  : 'text-magnata-dim border-white/[0.08] hover:text-magnata-gold hover:border-magnata-gold/40',
              ].join(' ')}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Promotional notice */}
        {activeSlug === 'promocionais' && (
          <div className="mb-6 p-3.5 bg-blue-900/20 border border-blue-700/30 rounded-xl text-center">
            <p className="font-sans text-xs text-blue-300">
              📌 Pizzas Magnata para Todos — Tamanho G fixo, preço especial!
            </p>
          </div>
        )}

        {/* Pizza grid */}
        {pizzasLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-52" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-magnata-dim">
            <p className="text-5xl mb-4 opacity-30">🍕</p>
            <p className="font-sans">Nenhuma pizza disponível nesta categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((pizza, i) => (
              <PizzaCard key={pizza.id} pizza={pizza} onSelect={handlePizzaSelect} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Config modal */}
      <ConfigModal
        pizza={selectedPizza}
        onClose={() => setSelectedPizza(null)}
        onAdd={(item) => {
          addItem(item)
          setSelectedPizza(null)
        }}
      />
    </>
  )
}
