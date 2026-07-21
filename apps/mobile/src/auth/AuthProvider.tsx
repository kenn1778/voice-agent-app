import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { CognitoIdentityClient, GetIdCommand, GetCredentialsForIdentityCommand } from '@aws-sdk/client-cognito-identity';
import { userPool, cognitoConfig } from './cognitoConfig';
import { storeTokens, getTokens, clearTokens, StoredTokens } from './tokenStorage';
import { useAuthStore } from '../store/authStore';

type AwsCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
};

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: CognitoUser | null;
  session: CognitoUserSession | null;
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
    return new Promise<void>((resolve, reject) => {
      const authDetails = new AuthenticationDetails({ Username: username, Password: password });
      const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: async (session: CognitoUserSession) => {
          const tokens: StoredTokens = {
            idToken: session.getIdToken().getJwtToken(),
            accessToken: session.getAccessToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
          };
          await storeTokens(tokens);
          useAuthStore.getState().setAuthenticated(tokens);
          setState({ isLoading: false, isAuthenticated: true, user: cognitoUser, session, error: null });
          resolve();
        },
        onFailure: (err: Error) => {
          setState(s => ({ ...s, error: err.message || 'Authentication failed' }));
          reject(err);
        },
      });
    });
  }, []);

  const signOut = useCallback(async () => {
    await clearTokens();
    useAuthStore.getState().clearAuth();
    setState({ isLoading: false, isAuthenticated: false, user: null, session: null, error: null });
  }, []);

  const getAwsCredentials = useCallback(async (): Promise<AwsCredentials | null> => {
    const stored = await getTokens();
    if (!stored || !cognitoConfig.identityPoolId) return null;

    const client = new CognitoIdentityClient({ region: cognitoConfig.region });
    const idResult = await client.send(new GetIdCommand({
      IdentityPoolId: cognitoConfig.identityPoolId,
      Logins: {
        [`cognito-idp.${cognitoConfig.region}.amazonaws.com/${cognitoConfig.userPoolId}`]: stored.idToken,
      },
    }));

    if (!idResult.IdentityId) return null;

    const credResult = await client.send(new GetCredentialsForIdentityCommand({
      IdentityId: idResult.IdentityId,
      Logins: {
        [`cognito-idp.${cognitoConfig.region}.amazonaws.com/${cognitoConfig.userPoolId}`]: stored.idToken,
      },
    }));

    if (!credResult.Credentials) return null;

    return {
      accessKeyId: credResult.Credentials.AccessKeyId || '',
      secretAccessKey: credResult.Credentials.SecretKey || '',
      sessionToken: credResult.Credentials.SessionToken || '',
    };
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
