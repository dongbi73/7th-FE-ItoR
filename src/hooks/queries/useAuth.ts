import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loginWithEmail,
  loginWithKakao,
  registerOAuthUser,
  registerUser,
  type RegisterRequest,
} from '@/api/auth';
import { hasCompleteTokens } from '@/api/types';
import { getMyInfo } from '@/api/user';
import { postKeys } from '@/hooks/queries/usePosts';
import { userKeys } from '@/hooks/queries/useUserQueries';
import { useAuthStore } from '@/store/useAuthStore';
import { authStorage } from '@/utils/authStorage';

const syncAuthUser = async (queryClient: ReturnType<typeof useQueryClient>) => {
  const response = await getMyInfo();

  if (response.code !== 0) {
    throw new Error(response.message);
  }

  useAuthStore.getState().setUser(response.data);
  queryClient.setQueryData(userKeys.me, response.data);
};

const clearAuthSession = (queryClient: ReturnType<typeof useQueryClient>) => {
  authStorage.clear();
  useAuthStore.getState().setUser(null);
  queryClient.removeQueries({ queryKey: userKeys.me });
};

export const useEmailLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginWithEmail(email, password),
    onSuccess: async (response) => {
      if (response.code !== 0) return;

      authStorage.setTokens(response.data.accessToken, response.data.refreshToken);
      authStorage.setAuthProvider('EMAIL');

      try {
        await syncAuthUser(queryClient);

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: userKeys.me }),
          queryClient.invalidateQueries({ queryKey: postKeys.all }),
        ]);
      } catch (error) {
        clearAuthSession(queryClient);
        throw error;
      }
    },
  });
};

export const useKakaoLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => loginWithKakao(code),
    onSuccess: async (response) => {
      if (response.code !== 0 || !hasCompleteTokens(response.data)) return;

      authStorage.setTokens(response.data.accessToken, response.data.refreshToken);
      authStorage.setAuthProvider('KAKAO');

      try {
        await syncAuthUser(queryClient);

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: userKeys.me }),
          queryClient.invalidateQueries({ queryKey: postKeys.all }),
        ]);
      } catch (error) {
        clearAuthSession(queryClient);
        throw error;
      }
    },
  });
};

export const useRegisterMutation = (type: 'email' | 'kakao') => {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      type === 'email' ? registerUser(data) : registerOAuthUser(data),
  });
};
