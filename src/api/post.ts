import { apiFetch, getAuthHeader } from '@/api/http';

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

export interface PostRequestContent {
  contentOrder: number;
  content: string;
  contentType: 'TEXT' | 'IMAGE';
}

export interface PostRequestBody {
  title: string;
  contents: PostRequestContent[];
}

export interface EditorBlock {
  id: string;
  type: 'TEXT' | 'IMAGE';
  value: string;
}

export const createPostRequestBody = (title: string, blocks: EditorBlock[]): PostRequestBody => {
  return {
    title,
    contents: blocks.map((block, index) => ({
      contentOrder: index + 1,
      content: block.value,
      contentType: block.type,
    })),
  };
};

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
