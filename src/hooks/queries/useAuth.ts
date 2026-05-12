import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loginWithEmail,
  loginWithKakao,
  registerOAuthUser,
  registerUser,
  type RegisterRequest,
} from '@/api/auth';
import { postKeys } from '@/hooks/queries/usePosts';
import { userKeys } from '@/hooks/queries/useUserQueries';

export const useEmailLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginWithEmail(email, password),
    onSuccess: async (response) => {
      if (response.code !== 0) return;

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

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

      const data = response.data as { accessToken?: string; refreshToken?: string };

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

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
