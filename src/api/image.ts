import { apiFetch } from '@/api/http';
import type { ApiResponse } from '@/api/types';

export type PresignedUrlResponse = ApiResponse<string>;

export const getPresignedUrl = async (fileName: string): Promise<PresignedUrlResponse> => {
  return apiFetch<PresignedUrlResponse>('/images/presigned-url', {
    params: { fileName },
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  const response = await getPresignedUrl(file.name);

  if (response.code !== 0) {
    throw new Error(response.message);
  }

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
