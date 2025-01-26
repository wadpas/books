import { create } from 'zustand'

type Book = {
  _id: Object
  title: string
  slug: string
  author: string
  description: string
  genre: string[]
  year: number
  cover: string
  price: number
  maxQuantity: number
}

type CartItem = {
  book: Book
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: object) => void
  incrementItem: (id: object) => void
  decrementItem: (id: object) => void
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

  removeItem: (id: object) =>
    set((state) => ({
      items: state.items.filter((item) => item.book._id !== id),
    })),

  incrementItem: (id: object) =>
    set((state) => {
      return {
        items: state.items.map((item) =>
          item.book._id === id && item.quantity < item.book.maxQuantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }
    }),

  decrementItem: (id: any) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.book._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
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
