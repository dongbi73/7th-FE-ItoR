import { useCallback, useState } from 'react';

export type UserFormMode = 'emailSignup' | 'kakaoSignup' | 'profileEdit';

export interface UserFormValues {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthDate: string;
  nickname: string;
  introduction: string;
  profilePicture: string;
}

export type UserFormErrors = Partial<Record<keyof UserFormValues, string>>;

const DEFAULT_VALUES: UserFormValues = {
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  birthDate: '',
  nickname: '',
  introduction: '',
  profilePicture: '',
};

const REQUIRED_MESSAGE = '*반드시 입력해야하는 필수 사항입니다';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KOREAN_NAME_REGEX = /^[가-힣]+$/;
const BIRTH_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidBirthDate = (birthDate: string) => {
  if (!BIRTH_DATE_REGEX.test(birthDate)) return false;

  const [year, month, day] = birthDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

interface UseUserFormOptions {
  mode: UserFormMode;
  initialValues?: Partial<UserFormValues>;
}

export const useUserForm = ({ mode, initialValues }: UseUserFormOptions) => {
  const [values, setValues] = useState<UserFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });
  const [errors, setErrors] = useState<UserFormErrors>({});

  const setFieldValue = useCallback(
    <K extends keyof UserFormValues>(field: K, value: UserFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const resetForm = useCallback((nextValues?: Partial<UserFormValues>) => {
    setValues({
      ...DEFAULT_VALUES,
      ...nextValues,
    });
    setErrors({});
  }, []);

  const setFieldError = useCallback(<K extends keyof UserFormValues>(field: K, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const validateForm = () => {
    const nextErrors: UserFormErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = REQUIRED_MESSAGE;
    } else if (!EMAIL_REGEX.test(values.email)) {
      nextErrors.email = '*이메일 형식이 적합하지 않습니다';
    }

    if (mode === 'emailSignup' && !values.password) {
      nextErrors.password = '*비밀번호를 입력해주세요';
    }

    if (mode === 'emailSignup' || mode === 'profileEdit') {
      if (values.password !== values.passwordConfirm) {
        nextErrors.passwordConfirm = '*비밀번호가 일치하지 않습니다';
      }
    }

    if (!values.name.trim()) {
      nextErrors.name = REQUIRED_MESSAGE;
    } else if (!KOREAN_NAME_REGEX.test(values.name)) {
      nextErrors.name = '*이름은 한글만 입력해주세요';
    } else if (values.name.length > 10) {
      nextErrors.name = '*이름은 최대 10글자 입니다';
    }

    if (!values.birthDate.trim()) {
      nextErrors.birthDate = REQUIRED_MESSAGE;
    } else if (!isValidBirthDate(values.birthDate)) {
      nextErrors.birthDate = '*생년월일은 YYYY-MM-DD 형식으로 입력해주세요';
    }

    if (!values.nickname.trim()) {
      nextErrors.nickname = REQUIRED_MESSAGE;
    } else if (values.nickname.length > 20) {
      nextErrors.nickname = '*닉네임은 최대 20글자 입니다';
    }

    if (mode === 'profileEdit' && !values.introduction.trim()) {
      nextErrors.introduction = REQUIRED_MESSAGE;
    } else if (values.introduction.length > 20) {
      nextErrors.introduction = '*20글자 이내로 작성해주세요';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return {
    values,
    errors,
    setFieldValue,
    setFieldError,
    resetForm,
    validateForm,
  };
};
