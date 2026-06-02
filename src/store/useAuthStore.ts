import { create } from 'zustand';
import type { UserData } from '@/api/user';
import { queryClient } from '@/lib/queryClient';
import { authStorage } from '@/utils/authStorage';

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
    authStorage.clear();
    queryClient.removeQueries({ queryKey: ['user'] });

    set({ user: null, isLoggedIn: false });
  },
}));
