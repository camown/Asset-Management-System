import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '../lib/supabase';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  role: UserRole | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  role: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // Get user profile data from Supabase
          let { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          // If profile doesn't exist, create one
          if (error && (error.code === 'PGRST116' || error.code === '406')) {
            // Wait a short moment to ensure auth is fully initialized
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: currentUser.id,
                  role: 'employee',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ])
              .select()
              .single();
            
            if (createError) {
              console.error('Error creating profile:', createError);
              throw createError;
            }
            data = newProfile;
          } else if (error) {
            console.error('Error fetching profile:', error);
            throw error;
          }

          if (data) {
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              role: data?.role || 'employee',
              firstName: data?.first_name || '',
              lastName: data?.last_name || '',
              department: data?.department || '',
              createdAt: data?.created_at || '',
            });
            
            setRole(data?.role || 'employee');
          }
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, role, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};