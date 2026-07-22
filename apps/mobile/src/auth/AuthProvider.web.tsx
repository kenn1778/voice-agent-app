import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { storeTokens, getTokens, clearTokens } from './tokenStorage';
import { useAuthStore } from '../store/authStore';

type AwsCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
};

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: null;
  session: null;
  error: string | null;
};

type AuthContextType = AuthState & {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getAwsCredentials: () => Promise<AwsCredentials | null>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    session: null,
    error: null,
  });

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const stored = await getTokens();
      if (!stored) {
        setState(s => ({ ...s, isLoading: false }));
        useAuthStore.getState().setLoading(false);
        return;
      }
      setState(s => ({ ...s, isLoading: false, isAuthenticated: !!stored.accessToken }));
      if (stored.accessToken) {
        useAuthStore.getState().setAuthenticated(stored);
      } else {
        useAuthStore.getState().setLoading(false);
      }
    } catch {
      setState(s => ({ ...s, isLoading: false }));
      useAuthStore.getState().setLoading(false);
    }
  }

  const signIn = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Authentication failed');
    }
    const data = await res.json();
    const tokens = {
      idToken: data.idToken,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || '',
    };
    await storeTokens(tokens);
    useAuthStore.getState().setAuthenticated(tokens);
    setState({ isLoading: false, isAuthenticated: true, user: null, session: null, error: null });
  }, []);

  const signOut = useCallback(async () => {
    await clearTokens();
    useAuthStore.getState().clearAuth();
    setState({ isLoading: false, isAuthenticated: false, user: null, session: null, error: null });
  }, []);

  const getAwsCredentials = useCallback(async (): Promise<AwsCredentials | null> => {
    return null;
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const stored = await getTokens();
    return stored?.accessToken ?? null;
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, getAwsCredentials, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
