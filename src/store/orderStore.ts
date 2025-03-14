import { create } from 'zustand';
import { Order, updateOrderStatus } from '../services/orderService';

interface OrderStore {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  updateStatus: (orderId: string, status: string) => Promise<void>;
  assignOrder: (orderId: string, userId: string) => Promise<void>;
  unassignOrder: (orderId: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  updateStatus: async (orderId, status) => {
    const success = await updateOrderStatus(orderId, status);
    if (success) {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        ),
      }));
    }
  },
  assignOrder: async (orderId, userId) => {
    // TODO: Implement with Supabase
    console.log('Assigning order', orderId, 'to user', userId);
  },
  unassignOrder: async (orderId) => {
    // TODO: Implement with Supabase
    console.log('Unassigning order', orderId);
  },
}));