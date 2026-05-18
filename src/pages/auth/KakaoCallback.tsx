import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthModal } from '@/context/AuthModalContext';
import { useKakaoLoginMutation } from '@/hooks/queries/useAuth';

const getKakaoRegisterDraft = (responseData: unknown) => {
  if (
    typeof responseData === 'object' &&
    responseData !== null &&
    'data' in responseData &&
    typeof responseData.data === 'object' &&
    responseData.data !== null
  ) {
    return responseData.data;
  }

  return responseData;
};

const hasKakaoRegisterData = (data: {
  kakaoId?: unknown;
  id?: unknown;
  oauthId?: unknown;
  socialId?: unknown;
}) => {
  return Boolean(data.kakaoId ?? data.id ?? data.oauthId ?? data.socialId);
};

export const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openUnregistered } = useAuthModal();
  const kakaoLoginMutation = useKakaoLoginMutation();
  const { mutateAsync: loginWithKakao } = kakaoLoginMutation;

  const openKakaoRegister = (responseData: unknown) => {
    sessionStorage.setItem(
      'kakao-register-draft',
      JSON.stringify(getKakaoRegisterDraft(responseData)),
    );
    navigate('/', { replace: true });
    openUnregistered();
  };

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('카카오 인증 실패:', error);
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

        if (response.code === 0 && response.data.accessToken) {
          navigate('/', { replace: true });
        } else if (
          hasKakaoRegisterData(response.data) ||
          response.code === 404 ||
          response.message.includes('not found')
        ) {
          openKakaoRegister(response.data);
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        if (!isSubscribed) return;
        console.error('로그인 처리 중 에러:', error);

        const responseData =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof error.response === 'object' &&
          error.response !== null &&
          'data' in error.response
            ? error.response.data
            : null;

        if (responseData) {
          openKakaoRegister(responseData);
          return;
        }

        navigate('/');
      }
    };

    handleLogin();
    return () => {
      isSubscribed = false;
    };
  }, [searchParams, navigate, openUnregistered, loginWithKakao]);

  return null;
};
