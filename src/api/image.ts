import { apiFetch, getAuthHeader } from '@/api/http';

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export type PresignedUrlResponse = BaseResponse<string>;

export const getPresignedUrl = async (fileName: string): Promise<PresignedUrlResponse> => {
  const hasAccessToken = !!localStorage.getItem('accessToken');

  return apiFetch<PresignedUrlResponse>('/images/presigned-url', {
    params: { fileName },
    headers: hasAccessToken ? getAuthHeader() : undefined,
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  const response = await getPresignedUrl(file.name);
  const presignedUrl = response.data;

  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Image upload failed with status ${uploadResponse.status}`);
  }

  return presignedUrl.split('?')[0];
};
