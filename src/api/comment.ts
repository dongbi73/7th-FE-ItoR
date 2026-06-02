import { apiFetch } from '@/api/http';
import type { ApiResponse, EmptyResponseData } from '@/api/types';

interface CommentPayload {
  content: string;
}

export const createComment = async (
  postId: string,
  payload: CommentPayload,
): Promise<ApiResponse<EmptyResponseData>> => {
  return apiFetch<ApiResponse<EmptyResponseData>>(`/comments/${postId}`, {
    method: 'POST',
    body: payload,
  });
};

export const updateComment = async (
  commentId: number,
  payload: CommentPayload,
): Promise<ApiResponse<EmptyResponseData>> => {
  return apiFetch<ApiResponse<EmptyResponseData>>(`/comments/${commentId}`, {
    method: 'PATCH',
    body: payload,
  });
};

export const deleteComment = async (commentId: number): Promise<ApiResponse<EmptyResponseData>> => {
  return apiFetch<ApiResponse<EmptyResponseData>>(`/comments/${commentId}`, {
    method: 'DELETE',
  });
};
