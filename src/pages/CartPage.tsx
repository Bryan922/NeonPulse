import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart as CartIcon, ArrowRight, Shield, Truck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const colors = {
  purple: { color: '#8B5CF6', glow: '#6D28D9' },
  blue: { color: '#3B82F6', glow: '#1D4ED8' },
  pink: { color: '#EC4899', glow: '#BE185D' },
  red: { color: '#EF4444', glow: '#B91C1C' },
  green: { color: '#10B981', glow: '#047857' },
  yellow: { color: '#F59E0B', glow: '#B45309' },
  white: { color: '#FFFFFF', glow: '#A1A1AA' }
};

const pricePacks = {
  4: 63,
  5: 72,
  6: 81,
  8: 90,
  10: 108
};

function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const calculateItemPrice = (letterCount: number) => {
    if (letterCount <= 4) return pricePacks[4];
    if (letterCount <= 5) return pricePacks[5];
    if (letterCount <= 6) return pricePacks[6];
    if (letterCount <= 8) return pricePacks[8];
    return pricePacks[10];
  };

  const total = items.reduce((sum, item) => {
    const price = item.customization ? calculateItemPrice(item.customization.letterCount) : 0;
    return sum + (price * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <CartIcon className="w-16 h-16 mx-auto mb-6 text-gray-600" />
          <h2 className="text-3xl font-bold mb-4">Votre panier est vide</h2>
          <p className="text-gray-400 mb-8">Découvrez nos produits et commencez votre collection</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Retour à la boutique</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <CartIcon className="w-16 h-16 mx-auto mb-6 text-gray-600" />
          <h2 className="text-3xl font-bold mb-4">Connexion requise</h2>
          <p className="text-gray-400 mb-8">Connectez-vous pour finaliser votre commande</p>
          <button
            onClick={() => navigate('/auth')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Se connecter</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Votre Panier</h2>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div key={index} className="card">
                <div className="p-6">
                  {/* Prévisualisation du néon */}
                  {item.customization && (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black p-1 mb-6">
                      <div className="absolute inset-1 backdrop-blur-xl bg-black/90 rounded-lg flex items-center justify-center">
                        <h1 
                          className={`text-6xl font-${item.customization.font} transition-all duration-300`}
                          style={{
                            color: colors[item.customization.color].color,
                            textShadow: `0 0 10px ${colors[item.customization.color].glow}, 
                                       0 0 20px ${colors[item.customization.color].glow}, 
                                       0 0 30px ${colors[item.customization.color].glow}`
                          }}
                        >
                          {item.customization.text}
                        </h1>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium">
                      {item.customization ? item.customization.text : "Néon personnalisé"}
                    </h3>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 text-gray-400 hover:text-white"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {item.customization && (
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-400">
                        Police : <span className="text-white">{item.customization.font}</span>
                      </p>
                      <p className="text-gray-400">
                        Couleur : <span className="text-white capitalize">{item.customization.color}</span>
                      </p>
                      <p className="text-gray-400">
                        Nombre de lettres : <span className="text-white">{item.customization.letterCount}</span>
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Quantité : <span className="text-white">{item.quantity}</span>
                    </div>
                    <div className="text-lg font-bold text-purple-400">
                      {item.customization ? (calculateItemPrice(item.customization.letterCount) * item.quantity).toFixed(2) : 0} €
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="card p-6 space-y-6">
              <h3 className="text-xl font-bold">Récapitulatif</h3>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {item.customization ? item.customization.text : "Néon personnalisé"} × {item.quantity}
                      </p>
                      {item.customization && (
                        <p className="text-sm text-gray-400">
                          {item.customization.font}, {item.customization.color}
                        </p>
                      )}
                    </div>
                    <span className="font-medium">
                      {item.customization ? (calculateItemPrice(item.customization.letterCount) * item.quantity).toFixed(2) : 0} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Livraison</span>
                  <span className="font-medium">Gratuite</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-4">
                  <span>Total</span>
                  <span className="text-purple-500">{total.toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 
                         hover:to-blue-700 text-white font-medium py-4 px-8 rounded-lg
                         transform transition-all duration-200 hover:scale-[1.02]
                         flex items-center justify-center gap-2"
              >
                <span>Passer au paiement</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Truck className="w-4 h-4" />
                  <span>Livraison gratuite en France métropolitaine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;