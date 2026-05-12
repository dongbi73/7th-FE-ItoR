import type { ChangeEvent } from 'react';
import { TextField } from '@/components/common/TextField';
import type { UserFormErrors, UserFormValues } from '@/hooks/useUserForm';

export type UserProfileField =
  | 'email'
  | 'password'
  | 'passwordConfirm'
  | 'name'
  | 'birthDate'
  | 'nickname'
  | 'introduction';

interface UserProfileFormProps {
  values: UserFormValues;
  errors: UserFormErrors;
  fields: UserProfileField[];
  onChange: <K extends keyof UserFormValues>(field: K, value: UserFormValues[K]) => void;
  disabled?: boolean;
  disabledFields?: Partial<Record<UserProfileField, boolean>>;
  className?: string;
  fieldClassName?: string;
  size?: 'default' | 'large';
}

const FIELD_META: Record<
  UserProfileField,
  {
    label?: string;
    placeholder: string;
    type?: string;
    maxLength?: number;
    helpText?: string;
    autoComplete?: string;
  }
> = {
  email: {
    label: '이메일',
    placeholder: 'email@example.com',
    autoComplete: 'email',
  },
  password: {
    label: '비밀번호',
    placeholder: '....',
    type: 'password',
    autoComplete: 'new-password',
  },
  passwordConfirm: {
    label: '비밀번호 확인',
    placeholder: '....',
    type: 'password',
    autoComplete: 'new-password',
  },
  name: {
    label: '이름',
    placeholder: '이름',
    maxLength: 10,
    autoComplete: 'name',
  },
  birthDate: {
    label: '생년월일',
    placeholder: 'YYYY-MM-DD',
    autoComplete: 'bday',
  },
  nickname: {
    label: '닉네임',
    placeholder: '닉네임',
    helpText: '*20글자 이내',
    autoComplete: 'username',
  },
  introduction: {
    label: '한 줄 소개',
    placeholder: '한 줄 소개',
    autoComplete: 'off',
  },
};

export const UserProfileForm = ({
  values,
  errors,
  fields,
  onChange,
  disabled = false,
  disabledFields,
  className = 'flex flex-col',
  fieldClassName = 'w-full',
  size = 'default',
}: UserProfileFormProps) => {
  const handleChange = (field: UserProfileField) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange(field, event.target.value);
  };

  return (
    <div className={className}>
      {fields.map((field) => {
        const meta = FIELD_META[field];
        const helpText = errors[field] || meta.helpText;

        return (
          <TextField
            key={field}
            label={meta.label}
            type={meta.type}
            placeholder={meta.placeholder}
            autoComplete={meta.autoComplete}
            maxLength={meta.maxLength}
            value={values[field]}
            onChange={handleChange(field)}
            disabled={disabled || disabledFields?.[field]}
            helpText={helpText}
            isError={!!errors[field]}
            tone="default"
            size={size}
            className={fieldClassName}
          />
        );
      })}
    </div>
  );
};
