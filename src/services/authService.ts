import { supabase } from '../lib/supabase';

export interface CreateAccountData {
  email: string;
  password: string;
  phoneNumber: string;
}

// Créer un nouveau compte
export const createAccount = async ({ email, password, phoneNumber }: CreateAccountData): Promise<boolean> => {
  try {
    // Vérifier que ce n'est pas l'email admin
    if (email === 'neonpulse.aide@gmail.com') {
      throw new Error('Cet email ne peut pas être utilisé pour créer un compte');
    }

    console.log('Début de la création du compte...');
    
    // 1. Créer l'utilisateur dans auth.users
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone_number: phoneNumber,
          role: 'user'
        }
      }
    });

    if (signUpError) {
      console.error('Erreur signup:', signUpError);
      throw signUpError;
    }

    if (!authData.user) {
      console.error('Pas de user data après signup');
      throw new Error('Erreur lors de la création du compte');
    }

    // Vérifier si l'email nécessite une confirmation
    if (authData.user && !authData.user.confirmed_at) {
      console.log('Email de confirmation envoyé à:', email);
      throw new Error('Veuillez confirmer votre email. Un lien de confirmation a été envoyé à votre adresse email.');
    }

    console.log('Utilisateur auth créé:', authData.user.id);

    // 2. Créer le profil utilisateur avec le même ID
    const userData = {
      id: authData.user.id,
      email: email,
      phone_number: phoneNumber,
      role: 'user',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };

    console.log('Tentative insertion profil:', userData);

    const { error: profileError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (profileError) {
      console.error('Erreur création profil détaillée:', {
        code: profileError.code,
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint
      });
      
      // Ne pas supprimer l'utilisateur auth car il doit confirmer son email
      if (profileError.code === '42501') { // Code pour violation de politique RLS
        throw new Error('Veuillez confirmer votre email avant de continuer. Un lien de confirmation a été envoyé.');
      }
      
      throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
    }

    console.log('Profil utilisateur créé avec succès');
    return true;

  } catch (error: any) {
    console.error('Erreur complète:', error);
    
    switch (error.message) {
      case 'User already registered':
        throw new Error('Cet email est déjà utilisé');
      case 'Veuillez confirmer votre email. Un lien de confirmation a été envoyé à votre adresse email.':
        throw error;
      default:
        throw new Error(error.message || 'Erreur lors de la création du compte');
    }
  }
};

// Connexion
export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('Tentative de connexion...');
    
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erreur auth:', error);
      throw error;
    }

    if (!user) {
      console.error('Pas de user data après connexion');
      throw new Error('Erreur de connexion');
    }

    console.log('Utilisateur authentifié:', user.id);

    // Vérifier si l'email est confirmé
    if (!user.email_confirmed_at) {
      console.error('Email non confirmé');
      throw new Error('Veuillez confirmer votre email avant de vous connecter');
    }

    // Vérifier si le profil existe
    console.log('Vérification du profil utilisateur...');
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Erreur profil:', profileError);
      throw profileError;
    }

    // Déterminer le rôle en fonction de l'email
    const isAdmin = email === 'neonpulse.aide@gmail.com';
    const userRole = isAdmin ? 'admin' : 'user';

    // Si le profil n'existe pas, le créer
    if (!profile) {
      console.log('Création du profil utilisateur...');
      const { error: createError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email,
          role: userRole,
          phone_number: user.user_metadata?.phone_number || '',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }]);

      if (createError) {
        console.error('Erreur création profil:', createError);
        throw createError;
      }
      console.log('Profil créé avec succès');
    } else {
      // Mettre à jour le rôle si nécessaire et la dernière connexion
      console.log('Mise à jour du profil...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          role: userRole,
          last_login: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erreur mise à jour profil:', updateError);
      }
    }

    console.log('Connexion réussie');
    return true;

  } catch (error: any) {
    console.error('Erreur complète:', error);
    switch (error.message) {
      case 'Invalid login credentials':
        throw new Error('Email ou mot de passe incorrect');
      case 'Email not confirmed':
        throw new Error('Veuillez confirmer votre email');
      default:
        throw new Error(error.message || 'Erreur de connexion');
    }
  }
};

// Déconnexion
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    throw new Error('Erreur lors de la déconnexion');
  }
}; 