import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { apiClient } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.access_token && !error) {
          apiClient.setAccessToken(session.access_token);
          const profileResponse = await apiClient.getUserProfile();
          setUser(profileResponse.profile);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        apiClient.setAccessToken(session.access_token);
        try {
          const profileResponse = await apiClient.getUserProfile();
          setUser(profileResponse.profile);
        } catch (error) {
          console.error('Profile fetch error:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        apiClient.setAccessToken(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session?.access_token) {
      apiClient.setAccessToken(data.session.access_token);
      const profileResponse = await apiClient.getUserProfile();
      setUser(profileResponse.profile);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Register user through our API
    await apiClient.register(email, password, name);
    
    // Then sign them in
    await signIn(email, password);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    apiClient.setAccessToken(null);
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}