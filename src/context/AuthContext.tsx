import React, { createContext, useState, useContext, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

export type Role = 'client' | 'employe' | 'admin' | 'fournisseur';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  userRoles: Role[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nom: string, role?: Role) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch user roles if we have a session
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserRoles(currentSession.user.id);
          }, 0);
        } else {
          setUserRoles([]);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRoles(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_roles', { user_uuid: userId });
      
      if (error) {
        console.error("Erreur lors de la récupération des rôles:", error);
        return;
      }
      
      setUserRoles(data as Role[]);
    } catch (error) {
      console.error("Erreur lors de la récupération des rôles:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error("Échec de la connexion: " + error.message);
        throw error;
      }

      // Ajout automatique du rôle dans user_roles si besoin (pour anciens comptes)
      const user = data?.user;
      const role = user?.user_metadata?.role;
      if (user?.id && role) {
        const { data: existingRoles, error: checkError } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', user.id)
          .eq('role', role);
        if (!checkError && (!existingRoles || existingRoles.length === 0)) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([{ user_id: user.id, role }]);
          if (roleError) {
            console.error("Erreur lors de l'insertion du rôle à la connexion:", roleError);
          }
        }
        // Ajout automatique dans la table utilisateur si besoin
        const { data: existingUser, error: userCheckError } = await supabase
          .from('utilisateur')
          .select('id')
          .eq('id', user.id);
        if (!userCheckError && (!existingUser || existingUser.length === 0)) {
          const { error: insertUserError } = await supabase
            .from('utilisateur')
            .insert([{
              id: user.id,
              email: user.email,
              nom: user.user_metadata?.nom || '',
              mot_de_passe: '',
              role: user.user_metadata?.role || null,
              user_id: user.id
            }]);
          if (insertUserError) {
            console.error("Erreur lors de l'insertion dans utilisateur:", insertUserError);
          }
        }
      }

      toast.success("Connexion réussie!");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nom: string, role: Role = 'client') => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom,
            role
          }
        }
      });

      if (error) {
        toast.error("Échec de l'inscription: " + error.message);
        throw error;
      }

      // Ajout automatique du rôle dans user_roles si l'utilisateur a bien été créé
      if (data?.user?.id) {
        // Vérifie d'abord qu'il n'existe pas déjà une entrée pour cet utilisateur
        const { data: existingRoles, error: checkError } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', data.user.id)
          .eq('role', role);
        if (!checkError && (!existingRoles || existingRoles.length === 0)) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([{ user_id: data.user.id, role }]);
          if (roleError) {
            console.error("Erreur lors de l'insertion du rôle:", roleError);
          }
        }
        // Ajout automatique dans la table utilisateur si besoin
        const { data: existingUser, error: userCheckError } = await supabase
          .from('utilisateur')
          .select('id')
          .eq('id', data.user.id);
        if (!userCheckError && (!existingUser || existingUser.length === 0)) {
          const { error: insertUserError } = await supabase
            .from('utilisateur')
            .insert([{
              id: data.user.id,
              email: data.user.email,
              nom: data.user.user_metadata?.nom || '',
              mot_de_passe: '',
              role: data.user.user_metadata?.role || null,
              user_id: data.user.id
            }]);
          if (insertUserError) {
            console.error("Erreur lors de l'insertion dans utilisateur:", insertUserError);
          }
        }
      }

      toast.success("Inscription réussie! Veuillez vérifier votre email pour confirmer.");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Échec de la déconnexion: " + error.message);
        throw error;
      }
      
      toast.success("Déconnexion réussie!");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: Role): boolean => {
    return userRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRoles,
        isLoading,
        signIn,
        signUp,
        signOut,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
