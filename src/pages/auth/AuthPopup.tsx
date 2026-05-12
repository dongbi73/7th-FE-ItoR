import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IconButton } from '@/components/common/IconButton';
import { ClearIcon, KakaoLogoIcon, GITLOG } from '@/assets/icons';
import { Button } from '@/components/common/Button';
import { TextField } from '@/components/common/TextField';
import { getKakaoLoginUrl } from '@/api/auth';
import { useEmailLoginMutation } from '@/hooks/queries/useAuth';

interface AuthPopupProps {
  onClose?: () => void;
  onUnregistered?: () => void;
}

export const AuthPopup = ({ onClose, onUnregistered }: AuthPopupProps) => {
  const navigate = useNavigate();
  const loginMutation = useEmailLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      if (response.code === 0) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        navigate('/');
        onClose?.();
      } else if (response.code === 404 || response.message.includes('not found')) {
        setError('email', { message: '*가입되지 않은 이메일입니다.' });
        onUnregistered?.();
      } else if (response.code === 401 || response.message.includes('password')) {
        setError('password', { message: '*비밀번호가 일치하지 않습니다.' });
      } else {
        alert(response.message || '로그인 중 알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('로그인 통신 에러:', err);
      alert('서버와의 통신이 원활하지 않습니다.');
    }
  };

  const handleKakaoLogin = () => {
    try {
      const loginUrl = getKakaoLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      console.error('카카오 로그인 이동 실패:', error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="bg-gray-7 relative flex w-full max-w-195.5 flex-col overflow-hidden rounded-[9px] py-12 shadow-[0_20px_50px_var(--color-shadow-popup)] md:flex-row md:py-20">
          <IconButton
            icon={<ClearIcon />}
            size="frame"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-4 right-4 z-20 text-white hover:bg-white/10 hover:text-white"
          />

          <div className="flex flex-1 basis-0 flex-col items-center justify-center pb-8.25">
            <div className="flex h-40 w-77 items-center justify-center">
              <GITLOG className="h-[76.03px] w-[282.5px] text-white" />
            </div>
            <div className="flex h-11.5 items-center px-4 py-3">
              <p className="text-gray-56 text-[14px] font-light">
                You can make anything by writing
              </p>
            </div>
          </div>

          <div className="flex flex-1 basis-0 flex-col justify-center gap-0.5 px-4">
            <div className="h-8.25" />

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-col gap-2 px-4 py-1">
                <TextField
                  placeholder="이메일"
                  autoComplete="email"
                  {...register('email', {
                    required: '*반드시 입력해야하는 필수 사항입니다',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: '*이메일 형식이 적합하지 않습니다',
                    },
                  })}
                  isError={!!errors.email}
                  helpText={errors.email?.message as string}
                  size="default"
                  className="w-full gap-2 py-0"
                />

                <TextField
                  type="password"
                  placeholder="비밀번호"
                  autoComplete="current-password"
                  {...register('password', { required: '*비밀번호를 입력해주세요' })}
                  isError={!!errors.password}
                  helpText={errors.password?.message as string}
                  size="default"
                  className="w-full gap-2 py-0"
                />
              </div>

              <div className="px-8 py-1">
                <Button
                  type="submit"
                  variant="primaryOutline"
                  disabled={loginMutation.isPending}
                  className="bg-btn-primary h-11.25 w-full rounded-md border-none px-3.5 text-white"
                >
                  {loginMutation.isPending ? '로그인 중...' : '이메일로 로그인'}
                </Button>
              </div>
            </form>

            <div className="mx-auto flex w-full max-w-78.25 items-center justify-center">
              <div className="border-gray-20 w-30.75 border-t" />
              <span className="text-gray-56 px-2 pt-0.5 pb-1 text-[12px] font-medium whitespace-nowrap">
                SNS
              </span>
              <div className="border-gray-20 w-30.75 border-t" />
            </div>

            <div className="px-8 py-1 font-sans">
              <Button
                variant="primaryOutline"
                icon={<KakaoLogoIcon />}
                iconClassName="w-[18px] h-[18px]"
                onClick={() => {
                  handleKakaoLogin();
                }}
                className="h-11.25 w-full rounded-md border-none bg-kakao px-3.5 text-[15px] font-semibold text-black"
              >
                카카오로 로그인
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                onClose?.();
                navigate('/register');
              }}
              className="text-gray-56 w-full overflow-hidden px-2 pt-0.5 pb-1 text-[12px] font-normal hover:bg-transparent hover:text-white/80"
            >
              또는 회원가입
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
