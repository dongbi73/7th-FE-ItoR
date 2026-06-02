import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { hasCompleteTokens, isRecord } from '@/api/types';
import { useKakaoLoginMutation } from '@/hooks/queries/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

const KAKAO_REGISTER_DRAFT_KEY = 'kakao-register-draft';

const getKakaoRegisterDraft = (responseData: unknown) => {
  if (isRecord(responseData) && isRecord(responseData.data)) {
    return responseData.data;
  }

  return responseData;
};

const hasKakaoRegisterData = (data: unknown) => {
  const draft = getKakaoRegisterDraft(data);

  if (!isRecord(draft)) return false;

  return Boolean(draft.kakaoId ?? draft.id ?? draft.oauthId ?? draft.socialId);
};

const getErrorResponse = (error: unknown) => {
  if (!isRecord(error) || !isRecord(error.response)) return null;

  return {
    status: typeof error.response.status === 'number' ? error.response.status : undefined,
    data: error.response.data,
  };
};

const getResponseMessage = (data: unknown) => {
  if (!isRecord(data) || typeof data.message !== 'string') return '';

  return data.message;
};

const isKakaoRegisterRequiredResponse = ({
  code,
  message,
  data,
}: {
  code?: number;
  message?: string;
  data: unknown;
}) => {
  return code === 404 || message?.toLowerCase().includes('not found') || hasKakaoRegisterData(data);
};

export const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const kakaoLoginMutation = useKakaoLoginMutation();
  const { mutateAsync: loginWithKakao } = kakaoLoginMutation;

  const openKakaoRegister = useCallback((responseData: unknown) => {
    logout();
    sessionStorage.setItem(
      KAKAO_REGISTER_DRAFT_KEY,
      JSON.stringify(getKakaoRegisterDraft(responseData)),
    );
    navigate('/register', { replace: true });
  }, [logout, navigate]);

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

        if (response.code === 0 && hasCompleteTokens(response.data)) {
          navigate('/', { replace: true });
        } else if (isKakaoRegisterRequiredResponse(response)) {
          openKakaoRegister(response.data);
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        if (!isSubscribed) return;
        console.error('로그인 처리 중 에러:', error);

        const errorResponse = getErrorResponse(error);
        const responseData = errorResponse?.data;

        if (
          responseData &&
          isKakaoRegisterRequiredResponse({
            code: errorResponse.status,
            message: getResponseMessage(responseData),
            data: responseData,
          })
        ) {
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
  }, [searchParams, navigate, loginWithKakao, openKakaoRegister]);

  return null;
};
