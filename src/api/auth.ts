import { apiFetch, createApiUrl, expireAuthSession, requestTokenReissue } from '@/api/http';
import type { ApiResponse } from '@/api/types';

export interface ReissueData {
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  nickname: string;
  profilePicture: string;
  introduction: string;
  httpStatus: string;
  responseMessage: string;
}

export interface RegisterRequest {
  email: string;
  nickname: string;
  password?: string;
  profilePicture: string;
  birthDate: string;
  name: string;
  introduction: string;
  kakaoId?: number | string;
}

export interface RegisterData {
  email: string;
  nickname: string;
  profilePicture: string;
  introduction: string;
}

export interface KakaoRedirectData {
  accessToken?: string;
  refreshToken?: string;
  kakaoId?: number | string;
  id?: number | string;
  oauthId?: number | string;
  socialId?: number | string;
  email?: string;
  nickname?: string;
  profilePicture?: string;
  httpStatus: string;
  responseMessage: string;
}

export type ReissueResponse = ApiResponse<ReissueData>;
export type LoginResponse = ApiResponse<LoginData>;
export type KakaoLoginUrlResponse = ApiResponse<string>;
export type KakaoRedirectResponse = ApiResponse<KakaoRedirectData>;
export type RegisterResponse = ApiResponse<RegisterData>;

export const reissueToken = async (): Promise<ReissueResponse> => {
  try {
    return await requestTokenReissue();
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    expireAuthSession();

    return {
      code: 401,
      message: '세션이 만료되었습니다. 다시 로그인해주세요.',
      data: { accessToken: '', refreshToken: '' },
    };
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
};

export const getKakaoLoginUrl = (): string => {
  return createApiUrl('/auth/kakao');
};

export const loginWithKakao = async (code: string): Promise<KakaoRedirectResponse> => {
  return apiFetch<KakaoRedirectResponse>('/auth/kakao/redirect', {
    params: { code },
  });
};

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  return apiFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: data,
  });
};

export const registerOAuthUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  return apiFetch<RegisterResponse>('/auth/register-oauth', {
    method: 'POST',
    body: data,
  });
};
