import { apiFetch, getAuthHeader } from '@/api/http';
import type { PostRequestBody } from '@/utils/postRequest';

export { createPostRequestBody } from '@/utils/postRequest';
export type {
  EditorBlock,
  PostRequestBody,
  PostRequestContent,
} from '@/utils/postRequest';

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PostContent {
  contentOrder: number;
  content: string;
  contentType: 'TEXT' | 'IMAGE';
}

export interface Post {
  postId: string;
  title: string;
  nickName: string;
  profileUrl: string;
  createdAt: string;
  commentCount: number;
  contents: PostContent[];
}

export interface PostListData {
  posts: Post[];
  pageMax: number;
}

export type PostListResponse = BaseResponse<PostListData>;

export interface PostDetail {
  postId: string;
  title: string;
  contents: PostContent[];
  isOwner: boolean;
  comments: Comment[];
  nickName: string;
  profileUrl: string;
  introduction: string;
  createdAt: string;
}

export interface Comment {
  commentId: number;
  content: string;
  nickName: string;
  profileUrl: string;
  createdAt: string;
  isOwner: boolean;
}

export type PostDetailResponse = BaseResponse<PostDetail>;
export type PostMutationResponse = BaseResponse<{
  id?: string;
  postId?: string;
}>;

export const getPost = async (postId: string): Promise<PostDetailResponse> => {
  return apiFetch<PostDetailResponse>('/posts', {
    params: { postId },
  });
};

export const getPostWithToken = async (postId: string): Promise<PostDetailResponse> => {
  return apiFetch<PostDetailResponse>('/posts/token', {
    params: { postId },
    headers: getAuthHeader(),
  });
};

export const getPostList = async (size: number, page: number): Promise<PostListResponse> => {
  return apiFetch<PostListResponse>('/posts/all', {
    params: { size, page },
  });
};

export const getPostListWithToken = async (
  size: number,
  page: number,
): Promise<PostListResponse> => {
  return apiFetch<PostListResponse>('/posts/all/token', {
    params: { size, page },
    headers: getAuthHeader(),
  });
};

export const postBoard = async (body: PostRequestBody): Promise<PostMutationResponse> => {
  return apiFetch<PostMutationResponse>('/posts', {
    method: 'POST',
    body,
    headers: getAuthHeader(),
  });
};

export const updatePost = async (
  postId: string,
  body: PostRequestBody,
): Promise<PostMutationResponse> => {
  return apiFetch<PostMutationResponse>('/posts', {
    method: 'PATCH',
    params: { postId },
    body,
    headers: getAuthHeader(),
  });
};

export const deletePost = async (postId: string): Promise<PostMutationResponse> => {
  return apiFetch<PostMutationResponse>('/posts', {
    method: 'DELETE',
    params: { postId },
    headers: getAuthHeader(),
  });
};
