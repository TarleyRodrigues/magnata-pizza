import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, CartExtra } from '@/types'
import { calcCartTotal } from '@/lib/pricing'
import { uuid } from '@/utils'

interface CartState {
  items:  CartItem[]
  extras: CartExtra[]

  // Actions — items
  addItem:    (item: Omit<CartItem, 'cartId'>) => void
  removeItem: (cartId: string) => void
  updateItemQty: (cartId: string, qty: number) => void

  // Actions — extras
  setExtraQty: (extraId: string, qty: number, extra: Omit<CartExtra, 'qty'>) => void
  removeExtra: (extraId: string) => void

  // Computed
  total:     () => number
  itemCount: () => number

  // Reset
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      extras: [],

      addItem: (item) =>
        set(s => ({ items: [...s.items, { ...item, cartId: uuid() }] })),

      removeItem: (cartId) =>
        set(s => ({ items: s.items.filter(i => i.cartId !== cartId) })),

      updateItemQty: (cartId, qty) =>
        set(s => ({
          items: s.items.map(i =>
            i.cartId === cartId
              ? { ...i, qty, totalPrice: i.unitPrice * qty }
              : i
          ),
        })),

      setExtraQty: (extraId, qty, extra) => {
        if (qty <= 0) {
          set(s => ({ extras: s.extras.filter(e => e.id !== extraId) }))
          return
        }
        set(s => {
          const exists = s.extras.find(e => e.id === extraId)
          if (exists) {
            return { extras: s.extras.map(e => e.id === extraId ? { ...e, qty } : e) }
          }
          return { extras: [...s.extras, { ...extra, id: extraId, qty }] }
        })
      },

      removeExtra: (extraId) =>
        set(s => ({ extras: s.extras.filter(e => e.id !== extraId) })),

      total:     () => calcCartTotal(get().items, get().extras),
      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      clear: () => set({ items: [], extras: [] }),
    }),
    {
      name:    'magnata-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
