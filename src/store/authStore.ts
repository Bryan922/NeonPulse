import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string | null;
  role: 'user' | 'admin';
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false })
}));

// Fonction pour récupérer les données utilisateur
export const fetchUserData = async (userId: string) => {
  const store = useAuthStore.getState();
  
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    if (!userData) {
      store.setError('Profil utilisateur non trouvé');
      store.setUser(null);
      return;
    }

    store.setUser({
      id: userData.id,
      email: userData.email,
      role: userData.role
    });
    store.setError(null);
  } catch (error: any) {
    console.error('Erreur de récupération des données:', error);
    store.setError('Erreur lors de la récupération des données utilisateur');
    store.setUser(null);
  }
};

// Initialisation de l'état d'authentification
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  
  if (!session?.user) {
    store.setUser(null);
    return;
  }

  await fetchUserData(session.user.id);
});