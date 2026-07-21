import { create } from 'zustand';

type AuthStore = {
  isAuthenticated: boolean;
  isLoading: boolean;
  tokens: { idToken: string; accessToken: string; refreshToken: string } | null;
  setAuthenticated: (tokens: { idToken: string; accessToken: string; refreshToken: string }) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  tokens: null,
  setAuthenticated: (tokens) => set({ isAuthenticated: true, isLoading: false, tokens }),
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => set({ isAuthenticated: false, tokens: null }),
}));
