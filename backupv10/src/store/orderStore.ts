import { create } from 'zustand';
import { Order } from '../types';

interface OrderStore {
  orders: Order[];
  assignOrder: (orderId: string, adminId: string, adminEmail: string) => void;
  unassignOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [
    {
      id: '1',
      createdAt: '2024-03-15',
      status: 'En cours',
      total: 249.99,
      customization: {
        text: "Love",
        font: "Dancing Script",
        color: "purple",
        letterCount: 4
      },
      items: [
        { id: 'neon-1', name: 'Néon LED Personnalisé - "Love"', quantity: 1, price: 249.99 }
      ],
      shippingDetails: {
        firstName: 'Sophie',
        lastName: 'Martin',
        email: 'sophie.martin@example.com',
        phone: '06 12 34 56 78',
        address: '123 rue des Fleurs',
        addressComplement: 'Appartement 4B',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      }
    },
    {
      id: '2',
      createdAt: '2024-03-14',
      status: 'Terminé',
      total: 199.99,
      customization: {
        text: "Dream",
        font: "Montserrat",
        color: "blue",
        letterCount: 5
      },
      items: [
        { id: 'neon-2', name: 'Néon LED Personnalisé - "Dream"', quantity: 1, price: 199.99 }
      ],
      shippingDetails: {
        firstName: 'Lucas',
        lastName: 'Bernard',
        email: 'lucas.bernard@example.com',
        phone: '06 98 76 54 32',
        address: '45 avenue des Champs',
        addressComplement: 'Étage 3',
        city: 'Lyon',
        postalCode: '69001',
        country: 'France'
      }
    },
    {
      id: '3',
      createdAt: '2024-03-13',
      status: 'En attente',
      total: 299.99,
      customization: {
        text: "Family",
        font: "Pacifico",
        color: "pink",
        letterCount: 6
      },
      items: [
        { id: 'neon-3', name: 'Néon LED Personnalisé - "Family"', quantity: 1, price: 299.99 }
      ],
      shippingDetails: {
        firstName: 'Emma',
        lastName: 'Dubois',
        email: 'emma.dubois@example.com',
        phone: '06 23 45 67 89',
        address: '78 boulevard de la Mer',
        addressComplement: 'Résidence Les Pins',
        city: 'Marseille',
        postalCode: '13001',
        country: 'France'
      }
    }
  ],
  assignOrder: (orderId, adminId, adminEmail) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              assignedTo: {
                adminId,
                adminEmail,
                assignedAt: new Date().toISOString(),
              },
            }
          : order
      ),
    })),
  unassignOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              assignedTo: undefined,
            }
          : order
      ),
    })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order
      ),
    })),
}));