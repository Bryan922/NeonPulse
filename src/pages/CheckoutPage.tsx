import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Shield, CheckCircle, User, Phone, MapPin, Mail, Building } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { stripe } from '../lib/stripe';
import toast from 'react-hot-toast';

const pricePacks = {
  4: 63,
  5: 72,
  6: 81,
  8: 90,
  10: 108
};

function CheckoutPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { items, clearCart } = useCartStore();

  // Informations personnelles
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    addressComplement: '',
    city: '',
    postalCode: '',
    country: 'France'
  });

  // Informations de paiement
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

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

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiry(value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const createOrder = async () => {
    if (!user) return null;

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          status: 'En attente',
          total: total,
          shipping_address: {
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            email: personalInfo.email,
            phone: personalInfo.phone,
            address: personalInfo.address,
            addressComplement: personalInfo.addressComplement,
            city: personalInfo.city,
            postalCode: personalInfo.postalCode,
            country: personalInfo.country
          },
          customization: items[0].customization
        }
      ])
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    return orderData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification des champs obligatoires
    const requiredFields = Object.entries(personalInfo);
    const emptyFields = requiredFields.filter(([key, value]) => !value.trim());
    
    if (emptyFields.length > 0) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in database
      const order = await createOrder();
      
      if (!order) {
        throw new Error('Failed to create order');
      }

      // Create Stripe payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          orderId: order.id
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe.js
      const stripeInstance = await stripe;
      if (!stripeInstance) {
        throw new Error('Stripe not initialized');
      }

      const { error: stripeError } = await stripeInstance.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: cardNumber.replace(/\s/g, ''),
            exp_month: parseInt(expiry.split('/')[0]),
            exp_year: parseInt('20' + expiry.split('/')[1]),
            cvc: cvc
          },
          billing_details: {
            name: cardName,
            email: personalInfo.email,
            address: {
              line1: personalInfo.address,
              line2: personalInfo.addressComplement,
              city: personalInfo.city,
              postal_code: personalInfo.postalCode,
              country: personalInfo.country
            }
          }
        }
      });

      if (stripeError) {
        throw stripeError;
      }
      
      clearCart();
      toast.success('Paiement effectué avec succès !');
      navigate('/account');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Une erreur est survenue lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Paiement sécurisé</h1>
          <p className="text-gray-400">Finaliser votre commande en toute sécurité</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations personnelles */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium mb-6">Informations personnelles</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Adresse <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="address"
                        value={personalInfo.address}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Complément d'adresse
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="addressComplement"
                        value={personalInfo.addressComplement}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ville <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={personalInfo.city}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Code postal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={personalInfo.postalCode}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de paiement */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium mb-6">Informations de paiement</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nom sur la carte
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                      placeholder="JOHN DOE"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Numéro de carte
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-white"
                        placeholder="4242 4242 4242 4242"
                        required
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        maxLength={3}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 
                         hover:to-blue-700 text-white font-medium py-4 px-8 rounded-lg
                         transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50
                         disabled:cursor-not-allowed disabled:hover:scale-100
                         flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Payer {total.toFixed(2)} €
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-6 sticky top-24">
              <h3 className="text-lg font-medium">Récapitulatif</h3>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {item.customization?.text || 'Néon personnalisé'} × {item.quantity}
                      </span>
                      <span>
                        {item.customization ? (calculateItemPrice(item.customization.letterCount) * item.quantity).toFixed(2) : 0} €
                      </span>
                    </div>
                    {item.customization && (
                      <div className="text-sm text-gray-500">
                        {item.customization.letterCount} lettres, {item.customization.font}, {item.customization.color}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-purple-400">{total.toFixed(2)} €</span>
                </div>
              </div>

              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                  <span>Livraison gratuite sous 5-7 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;