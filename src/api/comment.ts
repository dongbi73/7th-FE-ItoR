import { apiFetch, getAuthHeader } from '@/api/http';

interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface CommentPayload {
  content: string;
}

export const createComment = async (
  postId: string,
  payload: CommentPayload,
): Promise<BaseResponse<object>> => {
  return apiFetch<BaseResponse<object>>(`/comments/${postId}`, {
    method: 'POST',
    body: payload,
    headers: getAuthHeader(),
  });
};

export const updateComment = async (
  commentId: number,
  payload: CommentPayload,
): Promise<BaseResponse<object>> => {
  return apiFetch<BaseResponse<object>>(`/comments/${commentId}`, {
    method: 'PATCH',
    body: payload,
    headers: getAuthHeader(),
  });
};

export const deleteComment = async (commentId: number): Promise<BaseResponse<object>> => {
  return apiFetch<BaseResponse<object>>(`/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
};
