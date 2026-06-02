import { useAuthStore } from '@/store/useAuthStore';
import { authStorage } from '@/utils/authStorage';

export const useAuthStatus = () => {
  const authUser = useAuthStore((state) => state.user);
  const hasAccessToken = authStorage.hasAccessToken();

  return {
    authUser,
    isLoggedIn: hasAccessToken,
  };
};
