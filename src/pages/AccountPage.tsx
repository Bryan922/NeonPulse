import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { useOrders } from '../hooks/useOrders';
import { Package, User, Clock, Settings, CreditCard, Heart, ChevronDown, ChevronUp, Type, Palette, AlertCircle } from 'lucide-react';

const colorMap = {
  purple: { color: '#8B5CF6', glow: '#6D28D9' },
  blue: { color: '#3B82F6', glow: '#1D4ED8' },
  pink: { color: '#EC4899', glow: '#BE185D' },
  red: { color: '#EF4444', glow: '#B91C1C' },
  green: { color: '#10B981', glow: '#047857' },
  yellow: { color: '#F59E0B', glow: '#B45309' },
  white: { color: '#FFFFFF', glow: '#A1A1AA' }
};

const tabs = [
  { id: 'account', label: 'Mon Compte', icon: User },
  { id: 'orders', label: 'Mes Commandes', icon: Package },
  { id: 'favorites', label: 'Favoris', icon: Heart },
  { id: 'settings', label: 'Paramètres', icon: Settings }
];

function AccountPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { orders, loading, error } = useOrders();
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Redirect to auth page if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl">Chargement de vos commandes...</p>
            <p className="text-gray-400">Connexion à la base de données en cours</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-red-500 mb-2">Erreur de chargement</p>
            <p className="text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'text-blue-500 bg-blue-500/10';
      case 'Terminé':
        return 'text-green-500 bg-green-500/10';
      case 'En attente':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'Annulé':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Mon Espace Client</h1>
          <p className="text-gray-400">Bienvenue, {user.email}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Menu latéral */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                        ${activeTab === tab.id
                          ? 'bg-purple-500/20 text-purple-400 font-medium'
                          : 'text-gray-400 hover:bg-white/5'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'orders' && (
              <>
                {/* Statistiques des commandes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <Package className="w-8 h-8 text-purple-500 mb-4" />
                    <div className="text-2xl font-bold mb-1">{orders.length}</div>
                    <div className="text-gray-400">Commandes totales</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <CreditCard className="w-8 h-8 text-pink-500 mb-4" />
                    <div className="text-2xl font-bold mb-1">
                      {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)} €
                    </div>
                    <div className="text-gray-400">Montant total</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <Clock className="w-8 h-8 text-blue-500 mb-4" />
                    <div className="text-2xl font-bold mb-1">5-7 jours</div>
                    <div className="text-gray-400">Délai moyen</div>
                  </div>
                </div>

                {/* Liste des commandes */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                  <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold">Mes commandes</h2>
                  </div>
                  <div className="divide-y divide-white/10">
                    {orders.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Vous n'avez pas encore de commande</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="p-6">
                          {/* En-tête de la commande */}
                          <div 
                            className="flex items-center justify-between mb-4 cursor-pointer"
                            onClick={() => toggleOrderDetails(order.id)}
                          >
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Commande #{order.id}</div>
                              <div className="font-medium">{order.items[0].name}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm text-gray-400 mb-1">{order.createdAt}</div>
                                <div className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </div>
                              </div>
                              {expandedOrder === order.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* Détails de la commande */}
                          {expandedOrder === order.id && (
                            <div className="mt-6 space-y-6">
                              {/* Personnalisation du néon */}
                              <div className="bg-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4">Votre néon personnalisé</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <Type className="w-5 h-5 text-gray-400" />
                                      <div>
                                        <p className="text-sm text-gray-400">Texte</p>
                                        <p className="font-medium">{order.customization.text}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="w-5 h-5 flex items-center justify-center text-gray-400">
                                        #
                                      </span>
                                      <div>
                                        <p className="text-sm text-gray-400">Nombre de lettres</p>
                                        <p className="font-medium">{order.customization.letterCount}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <Type className="w-5 h-5 text-gray-400" />
                                      <div>
                                        <p className="text-sm text-gray-400">Police</p>
                                        <p className="font-medium">{order.customization.font}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Palette className="w-5 h-5 text-gray-400" />
                                      <div>
                                        <p className="text-sm text-gray-400">Couleur</p>
                                        <div className="flex items-center gap-2">
                                          <div 
                                            className="w-6 h-6 rounded-full"
                                            style={{ 
                                              backgroundColor: colorMap[order.customization.color].color,
                                              boxShadow: `0 0 10px ${colorMap[order.customization.color].glow}`
                                            }}
                                          />
                                          <span className="font-medium capitalize">{order.customization.color}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Prévisualisation */}
                                <div className="mt-6 p-6 bg-black/50 rounded-lg">
                                  <p 
                                    className={`text-4xl font-${order.customization.font.toLowerCase()} text-center`}
                                    style={{
                                      color: colorMap[order.customization.color].color,
                                      textShadow: `0 0 10px ${colorMap[order.customization.color].glow},
                                                 0 0 20px ${colorMap[order.customization.color].glow},
                                                 0 0 30px ${colorMap[order.customization.color].glow}`
                                    }}
                                  >
                                    {order.customization.text}
                                  </p>
                                </div>
                              </div>

                              {/* Détails de la commande */}
                              <div className="bg-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4">Détails de la commande</h3>
                                <div className="space-y-4">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-400">Quantité: {item.quantity}</p>
                                      </div>
                                      <p className="font-medium">{item.price.toFixed(2)} €</p>
                                    </div>
                                  ))}
                                  <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">Total</span>
                                      <span className="text-xl font-bold text-purple-500">
                                        {order.total.toFixed(2)} €
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Suivi de commande */}
                              <div className="bg-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4">Suivi de commande</h3>
                                <div className="space-y-4">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                      ${order.status === 'En attente' ? 'bg-yellow-500/20 text-yellow-500' :
                                        order.status === 'En cours' ? 'bg-blue-500/20 text-blue-500' :
                                        order.status === 'Terminé' ? 'bg-green-500/20 text-green-500' :
                                        'bg-red-500/20 text-red-500'}`}
                                    >
                                      <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="font-medium">Statut actuel</p>
                                      <p className={`text-sm ${getStatusColor(order.status)}`}>{order.status}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">Liste de favoris</h3>
                <p className="text-gray-400">
                  Fonctionnalité bientôt disponible ! Vous pourrez bientôt sauvegarder vos designs préférés.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">Paramètres</h3>
                <p className="text-gray-400">
                  Fonctionnalité bientôt disponible ! Vous pourrez bientôt personnaliser vos préférences.
                </p>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">Informations personnelles</h3>
                <p className="text-gray-400">
                  Fonctionnalité bientôt disponible ! Vous pourrez bientôt gérer vos informations personnelles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;