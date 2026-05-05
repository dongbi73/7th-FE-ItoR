import { useAuthStore } from '@/store/useAuthStore';
import { getMyInfo } from '@/api/user';
import { queryClient } from '@/lib/queryClient';
import { userKeys } from '@/hooks/queries/useUserQueries';

export const useUser = () => {
  const { user, isLoggedIn, setUser, logout } = useAuthStore();

  const fetchMe = async () => {
    try {
      const response = await getMyInfo();
      if (response.code === 0) {
        setUser(response.data);
        queryClient.setQueryData(userKeys.me, response.data);
      }
    } catch (error) {
      console.error('인증 정보를 가져오는데 실패했습니다.', error);
      logout();
    }
  };

  return {
    user, 
    isLoggedIn, 
    fetchMe, 
    logout, 
  };
};
