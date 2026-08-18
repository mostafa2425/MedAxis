import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,

  login: (token: string, user: User) => {
    localStorage.setItem('token', token);
    set({ token, user, isAuthenticated: true, isInitializing: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  initializeAuth: async () => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      set({ isInitializing: false });
      return;
    }

    set({ token: storedToken });

    try {
      const response = await authService.getMe();
      set({
        token: storedToken,
        user: response.data.data,
        isAuthenticated: true,
        isInitializing: false,
      });
    } catch {
      localStorage.removeItem('token');
      set({ token: null, user: null, isAuthenticated: false, isInitializing: false });
    }
  },
}));
