import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Avatar } from '@/components/common/Avatar';
import { TextField } from '@/components/common/TextField';
import { Blank } from '@/components/common/Blank';
import type { UserData } from '@/api/user';
import { useToast } from '@/hooks/useToast';
import { UserProfileForm } from '@/components/user/UserProfileForm';
import { useUserForm, type UserFormValues } from '@/hooks/useUserForm';
import { AddPhotoIcon } from '@/assets/icons';
import { Button } from '@/components/common/Button';
import { uploadImage } from '@/api/image';
import {
  useMeQuery,
  useUpdateMyInfoMutation,
  useUpdatePasswordMutation,
} from '@/hooks/queries/useUserQueries';

const toFormValues = (user: UserData): Partial<UserFormValues> => ({
  email: user.email || '',
  nickname: user.nickname || '',
  profilePicture: user.profilePicture || '',
  birthDate: user.birthDate || '',
  name: user.name || '',
  introduction: user.introduction || '',
  password: '',
  passwordConfirm: '',
});

const ProfileSettingPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const profileInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const { values, errors, setFieldValue, resetForm, validateForm } = useUserForm({
    mode: 'profileEdit',
  });
  const { data: myInfo, isError } = useMeQuery();
  const updateMyInfoMutation = useUpdateMyInfoMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();

  const isKakao = false; // 나중에 user.loginType === 'KAKAO'로 교체

  useEffect(() => {
    if (!myInfo) return;

    setUser(myInfo);
    resetForm(toFormValues(myInfo));
  }, [myInfo, resetForm]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const handleCancel = () => {
    if (!user) return;

    resetForm(toFormValues(user));

    setEditMode(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateMyInfoMutation.mutateAsync({
        email: values.email,
        nickname: values.nickname,
        profilePicture: values.profilePicture,
        birthDate: values.birthDate,
        name: values.name,
        introduction: values.introduction,
      });

      if (!isKakao && values.password) {
        await updatePasswordMutation.mutateAsync(values.password);
      }

      showToast({ type: 'success', message: '저장되었습니다!' });
      navigate('/profile/me');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      showToast({ type: 'error', message: '저장에 실패했습니다.' });
    }
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
      showToast({ type: 'success', message: '프로필 사진이 업로드되었습니다.' });
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      showToast({ type: 'error', message: '프로필 이미지 업로드에 실패했습니다.' });
    }

    event.target.value = '';
  };

  return (
    <div>
      <Header
        type={editMode ? 'profileEdit' : 'profileView'}
        onDelete={handleCancel}
        onPublish={editMode ? handleSave : () => setEditMode(true)}
      />

      <section className="bg-gray-96">
        <div className="mx-auto max-w-160">
          <Blank size="lg" />
          <div className="px-4 py-3">
            <Avatar
              size={64}
              src={values.profilePicture}
              fallback={values.nickname.charAt(0) || 'G'}
            />
            {editMode && (
              <>
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
                  className="text-gray-56 border-gray-90 mt-4 h-6.25 w-fit justify-start gap-1 rounded-xs border px-2 pt-0.5 pb-1 text-[12px]"
                  onClick={() => profileInputRef.current?.click()}
                >
                  프로필 사진 변경
                </Button>
              </>
            )}
          </div>

          <UserProfileForm
            values={values}
            errors={errors}
            fields={['nickname', 'introduction']}
            onChange={setFieldValue}
            disabled={!editMode}
            className="flex flex-col gap-3 px-4 py-3"
            fieldClassName="px-0 py-0"
            size="large"
          />
          <Blank size="sm" />
        </div>
      </section>

      <section className="mx-auto max-w-160">
        <Blank size="md" />
        {isKakao && (
          <TextField value="카카오 로그인" disabled label="소셜 로그인" autoComplete="off" />
        )}

        <UserProfileForm
          values={values}
          errors={errors}
          fields={[
            'email',
            ...(!isKakao ? (['password', 'passwordConfirm'] as const) : []),
            'name',
            'birthDate',
          ]}
          onChange={setFieldValue}
          disabled={!editMode}
          disabledFields={{
            email: isKakao,
          }}
        />
      </section>
    </div>
  );
};

export default ProfileSettingPage;
