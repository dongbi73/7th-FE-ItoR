import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthModal } from '@/context/AuthModalContext';
import { useKakaoLoginMutation } from '@/hooks/queries/useAuth';

export const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openUnregistered } = useAuthModal();
  const kakaoLoginMutation = useKakaoLoginMutation();
  const { mutateAsync: loginWithKakao } = kakaoLoginMutation;

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
    console.error("카카오 인증 실패:", error);
    navigate('/', { replace: true });
    return;
    }
    if (!code) {
      console.error('인가 코드가 없습니다.');
      navigate('/');
      return;
    }

    let isSubscribed = true;

    const handleLogin = async () => {
      try {
        const response = await loginWithKakao(code);

        if (!isSubscribed) return;

        if (response.code === 0) {
          navigate('/', { replace: true });
        } else if (response.code === 404 || response.message.includes('not found')) { 
          navigate('/', { replace: true }); 
          openUnregistered(); 
        }
        else{
          navigate('/', { replace: true });
        }

      } catch (error) {
        if (!isSubscribed) return;
        console.error('로그인 처리 중 에러:', error);
        navigate('/');
      }
    };

    handleLogin();
    return () => {
      isSubscribed = false;
    };
  }, [searchParams, navigate, openUnregistered, loginWithKakao]);

  return null
};
