import { create } from 'zustand';
import type { UserData } from '@/api/user';

interface AuthState {
  user: UserData | null;
  isLoggedIn: boolean;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: !!user }),

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authProvider');

    set({ user: null, isLoggedIn: false });
  },
}));
