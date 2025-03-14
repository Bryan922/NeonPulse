import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { useOrders } from '../hooks/useOrders';
import { Package, Users, CreditCard, TrendingUp, ShoppingBag, AlertCircle, CheckCircle2, Clock, ChevronDown, ChevronUp, Phone, MapPin, Mail, Type, Palette, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const colorMap = {
  purple: { color: '#8B5CF6', glow: '#6D28D9' },
  blue: { color: '#3B82F6', glow: '#1D4ED8' },
  pink: { color: '#EC4899', glow: '#BE185D' },
  red: { color: '#EF4444', glow: '#B91C1C' },
  green: { color: '#10B981', glow: '#047857' },
  yellow: { color: '#F59E0B', glow: '#B45309' },
  white: { color: '#FFFFFF', glow: '#A1A1AA' }
};

const orderStatuses = [
  { value: 'En attente', label: 'En attente', icon: Clock, color: 'text-yellow-500' },
  { value: 'En cours', label: 'En cours', icon: ShoppingBag, color: 'text-blue-500' },
  { value: 'Terminé', label: 'Terminé', icon: CheckCircle2, color: 'text-green-500' },
  { value: 'Annulé', label: 'Annulé', icon: AlertCircle, color: 'text-red-500' }
];

function AdminPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { orders, loading, error } = useOrders();
  const { assignOrder, unassignOrder, updateOrderStatus } = useOrderStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);

  // Redirect if not logged in or not admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl">Chargement des commandes...</p>
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
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleAssignOrder = (orderId: string) => {
    if (!user) return;

    const order = orders.find((o) => o.id === orderId);
    
    if (order?.assignedTo) {
      if (order.assignedTo.adminId === user.id) {
        unassignOrder(orderId);
        toast.success('Commande libérée');
      } else {
        toast.error(`Cette commande est déjà attribuée à ${order.assignedTo.adminEmail}`);
      }
    } else {
      assignOrder(orderId, user.id, user.email);
      toast.success('Commande assignée avec succès');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setStatusMenuOpen(null);
      toast.success(`Statut mis à jour : ${newStatus}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-gray-400">Gérez votre boutique en temps réel</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <CreditCard className="w-8 h-8 text-purple-500 mb-4" />
            <div className="text-2xl font-bold mb-1">12,450 €</div>
            <div className="text-gray-400">Chiffre d'affaires</div>
            <div className="text-sm text-green-400 mt-2">+12.5% vs mois dernier</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <Package className="w-8 h-8 text-pink-500 mb-4" />
            <div className="text-2xl font-bold mb-1">45</div>
            <div className="text-gray-400">Commandes totales</div>
            <div className="text-sm text-green-400 mt-2">+8.2% vs mois dernier</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <Users className="w-8 h-8 text-blue-500 mb-4" />
            <div className="text-2xl font-bold mb-1">128</div>
            <div className="text-gray-400">Clients actifs</div>
            <div className="text-sm text-green-400 mt-2">+15.3% vs mois dernier</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <TrendingUp className="w-8 h-8 text-green-500 mb-4" />
            <div className="text-2xl font-bold mb-1">276.50 €</div>
            <div className="text-gray-400">Panier moyen</div>
            <div className="text-sm text-green-400 mt-2">+5.8% vs mois dernier</div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold">Commandes récentes</h2>
          </div>
          <div className="divide-y divide-white/10">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                {/* En-tête de la commande */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="flex-grow cursor-pointer"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="text-sm text-gray-400 mb-1">Commande #{order.id}</div>
                    <div className="font-medium">
                      {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Statut d'attribution */}
                    {order.assignedTo && (
                      <div className="text-sm">
                        <span className="text-gray-400">Attribuée à : </span>
                        <span className="text-purple-400">{order.assignedTo.adminEmail}</span>
                      </div>
                    )}
                    
                    {/* Bouton d'attribution */}
                    <button
                      onClick={() => handleAssignOrder(order.id)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200
                        ${order.assignedTo?.adminId === user.id
                          ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                          : order.assignedTo
                          ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        }`}
                      disabled={order.assignedTo && order.assignedTo.adminId !== user.id}
                    >
                      <UserCheck className="w-5 h-5" />
                      {order.assignedTo?.adminId === user.id ? 'Libérer' : 'Prendre en charge'}
                    </button>

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
                      <h3 className="text-lg font-semibold mb-4">Personnalisation du néon</h3>
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

                    {/* Informations client */}
                    <div className="bg-white/5 rounded-xl p-6 space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Informations client</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span>{order.shippingDetails.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span>{order.shippingDetails.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Adresse de livraison */}
                    <div className="bg-white/5 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Adresse de livraison</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                          <div>
                            <p>{order.shippingDetails.address}</p>
                            <p>{order.shippingDetails.addressComplement}</p>
                            <p>{order.shippingDetails.postalCode} {order.shippingDetails.city}</p>
                            <p>{order.shippingDetails.country}</p>
                          </div>
                        </div>
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

                    {/* Actions */}
                    <div className="flex gap-4">
                      {/* Menu déroulant pour le statut */}
                      <div className="relative flex-1">
                        <button
                          onClick={() => setStatusMenuOpen(statusMenuOpen === order.id ? null : order.id)}
                          className={`w-full flex items-center justify-between font-medium py-3 px-6 rounded-lg transition-colors duration-200
                            ${order.assignedTo?.adminId === user.id
                              ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400'
                              : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                            }`}
                          disabled={order.assignedTo?.adminId !== user.id}
                        >
                          <span>Mettre à jour le statut</span>
                          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${statusMenuOpen === order.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {statusMenuOpen === order.id && (
                          <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-white/10 py-2">
                            {orderStatuses.map((status) => {
                              const StatusIcon = status.icon;
                              return (
                                <button
                                  key={status.value}
                                  onClick={() => handleStatusChange(order.id, status.value)}
                                  className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-white/5 ${status.color}`}
                                >
                                  <StatusIcon className="w-5 h-5" />
                                  {status.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <button 
                        className={`flex-1 font-medium py-3 px-6 rounded-lg transition-colors duration-200
                          ${order.assignedTo?.adminId === user.id
                            ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                          }`}
                        disabled={order.assignedTo?.adminId !== user.id}
                      >
                        Envoyer un email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;