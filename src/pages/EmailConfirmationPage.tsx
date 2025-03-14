import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de votre email...');

  useEffect(() => {
    const setupProfile = async (userId: string, email: string) => {
      try {
        // Vérifier si le profil existe déjà
        const { data: existingProfile } = await supabase
          .from('users')
          .select()
          .eq('id', userId)
          .single();

        if (!existingProfile) {
          // Créer le profil utilisateur
          const { error: profileError } = await supabase
            .from('users')
            .insert([{
              id: userId,
              email: email,
              role: 'user',
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString()
            }]);

          if (profileError) {
            console.error('Erreur création profil:', profileError);
            throw new Error('Erreur lors de la création du profil');
          }
        }
      } catch (error) {
        console.error('Erreur setup profil:', error);
        throw error;
      }
    };

    const confirmEmail = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (type !== 'signup' || !token) {
          throw new Error('Lien de confirmation invalide');
        }

        // Vérifier la session actuelle
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await setupProfile(user.id, user.email || '');
          setStatus('success');
          setMessage('Votre email a été confirmé avec succès !');
          
          // Rediriger après 3 secondes
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
        } else {
          throw new Error('Session non trouvée');
        }
      } catch (error) {
        console.error('Erreur confirmation:', error);
        setStatus('error');
        setMessage('Une erreur est survenue lors de la confirmation de votre email.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
          {status === 'loading' && (
            <>
              <Loader className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-spin" />
              <h2 className="text-2xl font-bold mb-2">Confirmation en cours</h2>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">Email confirmé !</h2>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-2">Erreur</h2>
            </>
          )}
          
          <p className="text-gray-400 mb-6">{message}</p>
          
          {status === 'success' && (
            <p className="text-sm text-gray-400">
              Redirection vers la page de connexion dans quelques secondes...
            </p>
          )}
          
          {status === 'error' && (
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Retour à la connexion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmationPage; 