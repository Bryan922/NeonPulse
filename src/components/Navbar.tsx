import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { logout } from '../services/authService';
import toast from 'react-hot-toast';

function Navbar() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-light">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              NeonPulse
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              to="/cart" 
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-white hover:text-purple-400 transition-colors duration-200"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/account"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                >
                  <User className="w-6 h-6 text-white" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                >
                  <LogOut className="w-6 h-6 text-white" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                <User className="w-6 h-6 text-white" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;