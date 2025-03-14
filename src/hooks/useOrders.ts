import { useState, useEffect } from 'react';
import { Order, getOrders } from '../services/orderService';
import { useAuthStore } from '../store/authStore';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const fetchedOrders = await getOrders(user.id);
        setOrders(fetchedOrders || []);
        setError(null);
      } catch (err) {
        setError('Erreur lors de la récupération des commandes');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return { orders, loading, error };
}; 