import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loginWithEmail,
  loginWithKakao,
  registerOAuthUser,
  registerUser,
  type RegisterRequest,
} from '@/api/auth';
import { getMyInfo } from '@/api/user';
import { postKeys } from '@/hooks/queries/usePosts';
import { userKeys } from '@/hooks/queries/useUserQueries';
import { useAuthStore } from '@/store/useAuthStore';

const syncAuthUser = async (queryClient: ReturnType<typeof useQueryClient>) => {
  const response = await getMyInfo();

  if (response.code !== 0) {
    throw new Error(response.message);
  }

  useAuthStore.getState().setUser(response.data);
  queryClient.setQueryData(userKeys.me, response.data);
};

export const useEmailLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginWithEmail(email, password),
    onSuccess: async (response) => {
      if (response.code !== 0) return;

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('authProvider', 'EMAIL');

      await syncAuthUser(queryClient);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.me }),
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
      ]);
    },
  });
};

export const useKakaoLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => loginWithKakao(code),
    onSuccess: async (response) => {
      if (response.code !== 0 || !('accessToken' in response.data)) return;

      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }

      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      localStorage.setItem('authProvider', 'KAKAO');

      await syncAuthUser(queryClient);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.me }),
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
      ]);
    },
  });
};

export const useRegisterMutation = (type: 'email' | 'kakao') => {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      type === 'email' ? registerUser(data) : registerOAuthUser(data),
  });
};
