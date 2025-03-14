import { supabase } from '../lib/supabase';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  customization?: {
    text?: string;
    color?: string;
    size?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  items: any[];
  total: number;
  createdAt: Date;
}

// Créer une nouvelle commande
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{ ...order, createdAt: new Date() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

// Obtenir une commande par son ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

// Obtenir toutes les commandes d'un utilisateur
export const getOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Obtenir toutes les commandes (pour l'admin)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
}; 