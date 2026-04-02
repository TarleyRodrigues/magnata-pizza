import { motion }        from 'framer-motion'
import { Badge }         from '@/components/ui'
import { formatBRL }     from '@/lib/pricing'
import type { Pizza }    from '@/types'

interface PizzaCardProps {
  pizza:    Pizza
  onSelect: (pizza: Pizza) => void
  index?:   number
}

export function PizzaCard({ pizza, onSelect, index = 0 }: PizzaCardProps) {
  const lowestPrice = pizza.prices
    ?.slice().sort((a, b) => a.price - b.price)[0]?.price

  const priceLabel = pizza.is_promotional
    ? `${formatBRL(lowestPrice ?? 0)} (Tam. G)`
    : lowestPrice
      ? `A partir de ${formatBRL(lowestPrice)}`
      : '—'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: Math.min(index * 0.04, 0.5), duration: 0.35 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onSelect(pizza)}
      className="group bg-magnata-card border border-magnata-border hover:border-magnata-border-hover
                 rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col gap-3
                 hover:shadow-[0_20px_50px_rgba(0,0,0,.5),0_0_20px_rgba(201,160,48,.06)]
                 relative overflow-hidden"
    >
      {/* Top shimmer line on hover */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-magnata-gold to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-base font-bold text-magnata-cream leading-tight flex-1">
          {pizza.name}
        </h3>
        <div className="flex flex-col gap-1 items-end shrink-0">
          {pizza.is_spicy && (
            <Badge variant="red">🌶 Picante</Badge>
          )}
          {pizza.tier === 'ultra' && (
            <Badge variant="gold">★ Premium</Badge>
          )}
          {pizza.is_promotional && (
            <Badge variant="blue">Promoção</Badge>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="font-sans text-xs text-magnata-dim leading-relaxed flex-1 line-clamp-3">
        {pizza.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
        <span className="font-serif text-base font-bold text-magnata-gold">
          {priceLabel}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onSelect(pizza) }}
          className="bg-gradient-to-r from-magnata-gold to-magnata-gold-light text-magnata-black
                     text-xs font-bold font-sans px-3.5 py-1.5 rounded-lg
                     hover:shadow-[0_4px_16px_rgba(201,160,48,.35)] transition-all duration-200"
        >
          Pedir
        </motion.button>
      </div>
    </motion.div>
  )
}
