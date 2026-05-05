import { apiFetch, getAuthHeader } from '@/api/http';

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface UserData {
  id: number;
  email: string;
  nickname: string;
  profilePicture: string;
  name: string;
  birthDate: string;
  introduction: string;
}

export type MyInfoResponse = BaseResponse<UserData>;

export type UpdateUserRequest = Pick<
  UserData,
  'email' | 'nickname' | 'profilePicture' | 'birthDate' | 'name' | 'introduction'
>;

export const updateMyInfo = async (
  data: Partial<UserData>,
): Promise<BaseResponse<object>> => {
  return apiFetch<BaseResponse<object>>('/users', {
    method: 'PATCH',
    body: data,
    headers: getAuthHeader(),
  });
};

export const updateProfilePicture = async (
  profilePicture: string,
): Promise<BaseResponse<object>> => {
  return apiFetch<BaseResponse<object>>('/users/picture', {
    method: 'PATCH',
    body: { profilePicture },
    headers: getAuthHeader(),
  });
};

export const updatePassword = async (password: string): Promise<BaseResponse<object>> => {
  return apiFetch<BaseResponse<object>>('/users/password', {
    method: 'PATCH',
    body: { password },
    headers: getAuthHeader(),
  });
};

export const updateNickname = async (nickname: string): Promise<BaseResponse<object>> => {
  return apiFetch<BaseResponse<object>>('/users/nickname', {
    method: 'PATCH',
    body: { nickname },
    headers: getAuthHeader(),
  });
};

export const getMyInfo = async (): Promise<MyInfoResponse> => {
  return apiFetch<MyInfoResponse>('/users/me', {
    headers: getAuthHeader(),
  });
};
