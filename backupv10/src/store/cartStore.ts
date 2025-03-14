import { create } from 'zustand';
import { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  addToCart: (productId: string, quantity: number, customization?: CartItem['customization']) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addToCart: (productId, quantity, customization) =>
    set((state) => ({
      items: [...state.items, { productId, quantity, customization }]
    })),
  removeFromCart: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index)
    })),
  clearCart: () => set({ items: [] }),
}));