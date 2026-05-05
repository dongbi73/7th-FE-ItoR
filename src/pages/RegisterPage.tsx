import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { KakaoLogoIcon, AddPhotoIcon } from '@/assets/icons';
import { Avatar } from '@/components/common/Avatar';
import { Header } from '@/components/layout/Header';
import { Blank } from '@/components/common/Blank';
import { Modal } from '@/components/common/Modal';
import type { RegisterRequest } from '@/api/auth';
import { UserProfileForm } from '@/components/user/UserProfileForm';
import { useUserForm } from '@/hooks/useUserForm';
import { uploadImage } from '@/api/image';
import { useToast } from '@/hooks/useToast';
import { useRegisterMutation } from '@/hooks/queries/useAuth';

type Step = 'select' | 'form' | 'kakaoForm';

const RegisterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<Step>('select');
  const profileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const formMode = step === 'form' ? 'emailSignup' : 'kakaoSignup';
  const { values, errors, setFieldValue, validateForm } = useUserForm({ mode: formMode });
  const { showToast } = useToast();
  const registerMutation = useRegisterMutation(step === 'form' ? 'email' : 'kakao');

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (validateForm()) {
      if (!values.profilePicture) {
        showToast({ type: 'error', message: '프로필 사진을 등록해주세요.' });
        return;
      }

      const baseRequestData = {
        email: values.email,
        nickname: values.nickname,
        password: values.password,
        name: values.name,
        birthDate: values.birthDate,
        introduction: values.introduction,
        profilePicture: values.profilePicture,
      };
      const requestData: RegisterRequest =
        step === 'form'
          ? {
              ...baseRequestData,
              password: values.password,
            }
          : {
              ...baseRequestData,
              kakaoId: 12345,
            };

      try {
        const response = await registerMutation.mutateAsync(requestData);

        if (response.code === 0) {
          setIsModalOpen(true);
        } else {
          showToast({ type: 'error', message: response.message || '회원가입에 실패했습니다.' });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : '서버 통신에 실패했습니다.';

        console.error('회원가입 중 에러:', error);
        showToast({ type: 'error', message });
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  const handleProfileFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', message: '이미지 파일만 업로드 가능합니다.' });
      event.target.value = '';
      return;
    }

    try {
      const imageUrl = await uploadImage(file);
      setFieldValue('profilePicture', imageUrl);
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      showToast({ type: 'error', message: '프로필 이미지 업로드에 실패했습니다.' });
    }

    event.target.value = '';
  };

  return (
    <>
      <Header type="main" />

      <div className="bg-gray-96 flex w-full items-center justify-center">
        <div className="flex w-172 flex-col">
          <Blank size="md" />
          <div className="flex flex-col gap-3 px-4 py-3">
            <h1 className="text-[32px] font-medium">회원가입</h1>
            {step !== 'select' && (
              <p className="text-gray-20 text-[14px] font-light">
                가입을 위해 회원님의 정보를 입력해주세요.
              </p>
            )}
          </div>
          <Blank size="sm" />
        </div>
      </div>
      <hr className="w-full border-0 border-t border-divider" />

      {step === 'select' ? (
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="flex h-91.5 w-195.5">
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="flex h-40 w-77 items-center justify-center">
                <h2 className="font-smooch h-19 w-70.75 text-[84px] leading-none font-normal select-none">
                  GITLOG
                </h2>
              </div>
              <div className="flex h-11.5 items-center px-4 py-3">
                <p className="text-gray-56 text-[14px] font-light">
                  You can make anything by writing
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-0.5 px-4">
              <div className="h-8.25" />
              <div className="flex w-full flex-col gap-2.5 px-4 py-1">
                <Button
                  variant="primaryOutline"
                  className="bg-btn-primary h-11.25 w-full rounded-md px-3.5 text-[14px] font-medium text-white"
                  onClick={() => setStep('form')}
                >
                  이메일로 회원가입
                </Button>

                <div className="relative mx-auto flex w-78.25 items-center justify-center">
                  <div className="border-gray-96 absolute w-full border-t" />
                  <span className="text-gray-56 relative bg-white px-2 pt-0.5 pb-1 text-[12px] font-medium">
                    또는
                  </span>
                </div>

                <Button
                  variant="primaryOutline"
                  icon={<KakaoLogoIcon />}
                  iconClassName="w-[18px] h-[18px]"
                  onClick={() => setStep('kakaoForm')}
                  className="h-11.25 gap-3 rounded-md border-none bg-kakao text-[15px] font-semibold text-black"
                >
                  카카오로 회원가입
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="mx-auto flex w-full max-w-172 flex-col" onSubmit={handleSubmit}>
          <Blank size="md" />

          <div className="flex flex-col gap-4 px-4 py-3">
            <span className="text-gray-56 text-[14px] font-light">프로필 사진</span>
            <div className="flex flex-col gap-4">
              <Avatar size={64} src={values.profilePicture} fallback={values.nickname[0] || 'G'} />
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileFileChange}
              />
              <Button
                variant="ghost"
                icon={<AddPhotoIcon />}
                iconClassName="w-3.5 h-3.5"
                className="text-gray-56 border-gray-90 h-6.25 w-fit justify-start gap-1 rounded-xs border px-2 pt-0.5 pb-1 text-[12px]"
                onClick={() => profileInputRef.current?.click()}
              >
                프로필 사진 추가
              </Button>
            </div>
          </div>

          {step === 'kakaoForm' && (
            <div className="flex flex-col gap-3 px-4 py-3">
              <span className="text-gray-56 px-1.5 text-[14px] font-light">소셜 로그인</span>
              <div className="border-gray-90 bg-gray-90 flex items-center gap-2.5 rounded-sm border px-4 py-3">
                <KakaoLogoIcon className="h-4.5 w-4.5" />
                <span className="text-gray-56 text-[14px] font-light">카카오 로그인</span>
              </div>
            </div>
          )}

          <UserProfileForm
            values={values}
            errors={errors}
            fields={[
              'email',
              ...(step === 'form' ? (['password', 'passwordConfirm'] as const) : []),
              'name',
              'birthDate',
              'nickname',
              'introduction',
            ]}
            onChange={setFieldValue}
          />

          <Blank size="md" />

          <div className="px-4">
            <Button
              type="submit"
              variant="primaryOutline"
              disabled={registerMutation.isPending}
              className="h-9.5 w-full rounded-[25px] text-[14px] font-medium"
            >
              {registerMutation.isPending ? '가입 중...' : '회원가입 완료'}
            </Button>
          </div>

          <Blank size="lg" />

          <Modal isOpen={isModalOpen} onClose={handleCloseModal} className="w-81.5">
            <Modal.Header>
              <Modal.Title>회원가입이 완료되었습니다!</Modal.Title>
            </Modal.Header>
            <Modal.Footer
              secondaryText="확인"
              onSecondaryClick={handleCloseModal}
              primaryText="로그인하기"
              onPrimaryClick={() => {
                handleCloseModal();
                navigate('/login');
              }}
            />
          </Modal>
        </form>
      )}
    </>
  );
};

export default RegisterPage;
