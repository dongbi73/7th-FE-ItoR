import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyInfo, updateMyInfo, updatePassword, type UserData } from '@/api/user';

export const userKeys = {
  all: ['user'] as const,
  me: ['user', 'me'] as const,
};

export const useMeQuery = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: userKeys.me,
    enabled,
    queryFn: async () => {
      const response = await getMyInfo();

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });
};

export const useUpdateMyInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserData>) => {
      const response = await updateMyInfo(data);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.me });
    },
  });
};

export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const response = await updatePassword(password);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });
};
