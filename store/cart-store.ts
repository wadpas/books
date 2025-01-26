import { Book } from '@/assets/types/book'
import { create } from 'zustand'

type CartItem = {
  book: Book
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  incrementItem: (id: string) => void
  decrementItem: (id: string) => void
  getTotalPrice: () => string
  getItemCount: () => number
  resetCart: () => void
}

const initialCartItems: CartItem[] = []

export const useCartStore = create<CartState>((set, get) => ({
  items: initialCartItems,

  addItem: (item: CartItem) => {
    const existingItem = get().items.find((i) => i.book._id === item.book._id)
    if (existingItem) {
      set((state) => ({
        items: state.items.map((i) =>
          i.book._id === item.book._id
            ? {
                ...i,
                quantity: Math.min(i.quantity + item.quantity, i.book.maxQuantity),
              }
            : i
        ),
      }))
    } else {
      set((state) => ({ items: [...state.items, item] }))
    }
  },

  removeItem: (id: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.book._id.$oid !== id),
    })),

  incrementItem: (id: string) =>
    set((state) => {
      return {
        items: state.items.map((item) =>
          item.book._id.$oid === id && item.quantity < item.book.maxQuantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }
    }),

  decrementItem: (id: string) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.book._id.$oid && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      ),
    })),

  getTotalPrice: () => {
    const { items } = get()

    return items.reduce((total, item) => total + item.book.price * item.quantity, 0).toFixed(2)
  },

  getItemCount: () => {
    const { items } = get()
    return items.reduce((count, item) => count + item.quantity, 0)
  },

  resetCart: () => set({ items: initialCartItems }),
}))
