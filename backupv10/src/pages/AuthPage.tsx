import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

function AuthPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulation d'authentification
      if (email === 'admin@neonpulse.fr' && password === 'admin') {
        const user = {
          id: '1',
          email: 'admin@neonpulse.fr',
          role: 'admin' as const
        };
        setUser(user);
        toast.success('Connexion réussie !');
        navigate('/admin');
      } else if (email === 'client@neonpulse.fr' && password === 'client') {
        const user = {
          id: '2',
          email: 'client@neonpulse.fr',
          role: 'user' as const
        };
        setUser(user);
        toast.success('Connexion réussie !');
        navigate('/account');
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="card overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur" />
            <div className="relative p-8">
              <h2 className="text-3xl font-bold text-center mb-2">
                {isLogin ? 'Bienvenue' : 'Créer un compte'}
              </h2>
              <p className="text-gray-400 text-center mb-8">
                {isLogin 
                  ? 'Connectez-vous pour accéder à votre compte'
                  : 'Inscrivez-vous pour commencer votre expérience'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    />
                  </div>
                </div>

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
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 
                           hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg
                           transform transition-all duration-200 hover:scale-[1.02]
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                           flex items-center justify-center gap-2"
                >
                  <span>{isLogin ? 'Se connecter' : 'Créer un compte'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-6 w-full text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {isLogin 
                  ? "Pas encore de compte ? S'inscrire" 
                  : 'Déjà un compte ? Se connecter'}
              </button>

              {/* Message d'aide pour la démo */}
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-gray-300">
                    <strong>Compte Admin :</strong><br />
                    Email : admin@neonpulse.fr<br />
                    Mot de passe : admin
                  </p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-gray-300">
                    <strong>Compte Client :</strong><br />
                    Email : client@neonpulse.fr<br />
                    Mot de passe : client
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;