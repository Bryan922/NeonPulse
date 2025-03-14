import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, ArrowRight, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { createAccount, login } from '../services/authService';

function AuthPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log('User détecté, redirection...', user);
      const redirectPath = user.role === 'admin' ? '/admin' : '/account';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const clearError = () => setError(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Tentative de', isLogin ? 'connexion' : 'création de compte');
      
      if (isLogin) {
        console.log('Connexion avec:', email);
        const success = await login(email, password);
        if (success) {
          console.log('Connexion réussie');
          // La redirection sera gérée par l'useEffect quand le user sera mis à jour
        }
      } else {
        if (!phoneNumber) {
          throw new Error('Le numéro de téléphone est requis');
        }
        await createAccount({ email, password, phoneNumber });
        toast.success('Compte créé ! Veuillez vérifier votre email pour confirmer votre compte.');
      }
    } catch (error: any) {
      console.error('Erreur lors de la tentative:', error);
      setError(error.message || 'Une erreur inattendue est survenue');
      toast.error(error.message || 'Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="relative">
            <h2 className="text-3xl font-bold text-center mb-2">
              {isLogin ? 'Bienvenue' : 'Créer un compte'}
            </h2>
            <p className="text-gray-400 text-center mb-8">
              {isLogin 
                ? 'Connectez-vous pour accéder à votre compte'
                : 'Inscrivez-vous pour commencer votre expérience'}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} onChange={clearError} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             text-white placeholder-gray-400"
                    placeholder="votre@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               text-white placeholder-gray-400"
                      placeholder="+33 6 12 34 56 78"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             text-white placeholder-gray-400"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 
                         hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg
                         transform transition-all duration-200 hover:scale-[1.02]
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                         flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{isLogin ? 'Connexion...' : 'Création...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Se connecter' : 'Créer un compte'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setPhoneNumber('');
              }}
              className="mt-6 w-full text-sm text-gray-400 hover:text-white transition-colors duration-200"
              disabled={loading}
            >
              {isLogin 
                ? "Pas encore de compte ? S'inscrire" 
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;