import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

type QueryValue = string | number | boolean | null | undefined;

interface ApiFetchOptions extends Omit<AxiosRequestConfig, 'data' | 'url' | 'params'> {
  params?: Record<string, QueryValue>;
  body?: unknown;
}

interface TokenReissueResponse {
  code: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

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

export const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const authClient = axios.create({
  baseURL: API_BASE_URL,
});

let reissuePromise: Promise<TokenReissueResponse> | null = null;

export const requestTokenReissue = async (): Promise<TokenReissueResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('Refresh token is missing');
  }

  reissuePromise ??= authClient
    .post<TokenReissueResponse>('/auth/reissue', { refreshToken })
    .then((response) => {
      if (response.data.code === 0) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }

      return response.data;
    })
    .finally(() => {
      reissuePromise = null;
    });

  return reissuePromise;
};

const clearAuthAndRedirect = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.dispatchEvent(new Event('auth:expired'));

  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');

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
      clearAuthAndRedirect();
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
