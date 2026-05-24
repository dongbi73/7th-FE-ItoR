import { useAuthStore } from '@/store/useAuthStore';

export const useAuthStatus = () => {
  const authUser = useAuthStore((state) => state.user);
  const hasAccessToken =
    typeof localStorage !== 'undefined' && !!localStorage.getItem('accessToken');

  return {
    authUser,
    isLoggedIn: hasAccessToken,
  };
};
