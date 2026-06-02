import { apiFetch } from '@/api/http';
import type { ApiResponse, EmptyResponseData } from '@/api/types';

export interface UserData {
  id: number;
  email: string;
  nickname: string;
  profilePicture: string;
  name: string;
  birthDate: string;
  introduction: string;
}

export type MyInfoResponse = ApiResponse<UserData>;

export type UpdateUserRequest = Pick<
  UserData,
  'email' | 'nickname' | 'profilePicture' | 'birthDate' | 'name' | 'introduction'
>;

export const updateMyInfo = async (
  data: Partial<UserData>,
): Promise<ApiResponse<EmptyResponseData>> => {
  return apiFetch<ApiResponse<EmptyResponseData>>('/users', {
    method: 'PATCH',
    body: data,
  });
};

export const updatePassword = async (password: string): Promise<ApiResponse<EmptyResponseData>> => {
  return apiFetch<ApiResponse<EmptyResponseData>>('/users/password', {
    method: 'PATCH',
    body: { password },
  });
};

export const getMyInfo = async (): Promise<MyInfoResponse> => {
  return apiFetch<MyInfoResponse>('/users/me');
};
