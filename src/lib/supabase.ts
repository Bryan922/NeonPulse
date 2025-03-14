import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL et Anon Key sont requis');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone_number: string;
          role: 'user' | 'admin';
          created_at: string;
          last_login: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone_number: string;
          role?: 'user' | 'admin';
          created_at?: string;
          last_login?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone_number?: string;
          role?: 'user' | 'admin';
          created_at?: string;
          last_login?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'processing' | 'completed' | 'cancelled';
          total: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}