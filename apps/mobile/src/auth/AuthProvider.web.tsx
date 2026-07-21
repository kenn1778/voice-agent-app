import React, { createContext, useContext, useCallback, useState } from 'react';

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
};

type AuthContextType = AuthState & {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getAwsCredentials: () => Promise<{ accessKeyId: string; secretAccessKey: string; sessionToken: string } | null>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    isAuthenticated: false,
    error: null,
  });

  const signIn = useCallback(async (_username: string, _password: string) => {
    // Web demo: mock sign-in
    setState({ isLoading: false, isAuthenticated: true, error: null });
  }, []);

  const signOut = useCallback(async () => {
    setState({ isLoading: false, isAuthenticated: false, error: null });
  }, []);

  const getAwsCredentials = useCallback(async () => null, []);
  const getAccessToken = useCallback(async (): Promise<string | null> => null, []);

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
