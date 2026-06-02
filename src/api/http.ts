import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResponse } from '@/api/types';
import { authStorage } from '@/utils/authStorage';
import { redirectToLogin } from '@/utils/redirect';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

type QueryValue = string | number | boolean | null | undefined;

interface ApiFetchOptions extends Omit<AxiosRequestConfig, 'data' | 'url' | 'params'> {
  params?: Record<string, QueryValue>;
  body?: unknown;
}

type TokenReissueResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
}>;

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
}

export const createApiUrl = (path: string, params?: Record<string, QueryValue>) => {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const authClient = axios.create({
  baseURL: API_BASE_URL,
});

let reissuePromise: Promise<TokenReissueResponse> | null = null;

export const expireAuthSession = () => {
  authStorage.clear();
  window.dispatchEvent(new Event('auth:expired'));
  redirectToLogin();
};

export const requestTokenReissue = async (): Promise<TokenReissueResponse> => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token is missing');
  }

  reissuePromise ??= authClient
    .post<TokenReissueResponse>('/auth/reissue', { refreshToken })
    .then((response) => {
      if (response.data.code === 0) {
        authStorage.setTokens(response.data.data.accessToken, response.data.data.refreshToken);
      }

      return response.data;
    })
    .finally(() => {
      reissuePromise = null;
    });

  return reissuePromise;
};

apiClient.interceptors.request.use((config) => {
  const accessToken = authStorage.getAccessToken();

  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.skipAuthRefresh
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await requestTokenReissue();

      if (response.code !== 0 || !response.data.accessToken) {
        throw new Error(response.message || 'Token reissue failed');
      }

      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

      return apiClient(originalRequest);
    } catch (reissueError) {
      expireAuthSession();
      return Promise.reject(reissueError);
    }
  },
);

export const apiFetch = async <T>(path: string, options: ApiFetchOptions = {}): Promise<T> => {
  const { params, body, ...requestOptions } = options;
  const response = await apiClient.request<T>({
    url: path,
    params,
    data: body,
    ...requestOptions,
  });

  return response.data;
};
