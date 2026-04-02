import type { Pizza, PizzaSize, CartItem, CartExtra } from '@/types'

/** Retorna o preço de uma pizza em determinado tamanho */
export function getPizzaPrice(pizza: Pizza, size: PizzaSize): number {
  const entry = pizza.prices?.find(p => p.size === size)
  return entry?.price ?? 0
}

/**
 * Calcula o preço base de uma pizza (inteira ou meio a meio).
 * Regra 'max' = preço da mais cara (padrão).
 * Regra 'avg' = média dos dois preços.
 */
export function calcBasePrice(
  pizza1: Pizza,
  pizza2: Pizza | null,
  size: PizzaSize,
  rule: 'max' | 'avg' = 'max'
): number {
  const p1 = getPizzaPrice(pizza1, size)
  if (!pizza2) return p1

  const p2 = getPizzaPrice(pizza2, size)

  if (rule === 'max') return Math.max(p1, p2)
  return (p1 + p2) / 2
}

/** Calcula o total de um item do carrinho */
export function calcItemTotal(params: {
  basePrice:   number
  bordaPrice:  number
  adicionais:  Array<{ price: number }>
  qty:         number
}): number {
  const { basePrice, bordaPrice, adicionais, qty } = params
  const addonsTotal = adicionais.reduce((sum, a) => sum + a.price, 0)
  return (basePrice + bordaPrice + addonsTotal) * qty
}

/** Calcula o total do carrinho completo */
export function calcCartTotal(items: CartItem[], extras: CartExtra[]): number {
  const itemsTotal  = items.reduce((sum, i) => sum + i.totalPrice, 0)
  const extrasTotal = extras.reduce((sum, e) => sum + e.price * e.qty, 0)
  return itemsTotal + extrasTotal
}

/** Formata valor em Reais */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style:    'currency',
    currency: 'BRL',
  }).format(value)
}

/** Label de tamanho amigável */
export const SIZE_LABELS: Record<PizzaSize, string> = {
  P: 'Pequena (4 fatias)',
  M: 'Média (6 fatias)',
  G: 'Grande (8 fatias)',
}
