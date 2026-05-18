import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPost,
  getPostList,
  getPostListWithToken,
  getPostWithToken,
  postBoard,
  updatePost,
  type Comment,
  type PostDetail,
  type PostRequestBody,
} from '@/api/post';
import {
  createComment,
  deleteComment as deleteCommentApi,
  updateComment as updateCommentApi,
} from '@/api/comment';

export const postKeys = {
  all: ['posts'] as const,
  list: (page: number, size: number, isLoggedIn: boolean) =>
    [...postKeys.all, 'list', { page, size, isLoggedIn }] as const,
  detail: (postId: string, isLoggedIn: boolean) =>
    [...postKeys.all, 'detail', postId, { isLoggedIn }] as const,
};

export const usePostListQuery = ({
  currentPage,
  itemsPerPage,
  isLoggedIn,
}: {
  currentPage: number;
  itemsPerPage: number;
  isLoggedIn: boolean;
}) => {
  return useQuery({
    queryKey: postKeys.list(currentPage, itemsPerPage, isLoggedIn),
    queryFn: async () => {
      const response = isLoggedIn
        ? await getPostListWithToken(itemsPerPage, currentPage)
        : await getPostList(itemsPerPage, currentPage);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });
};

export const usePostDetailQuery = ({
  postId,
  isLoggedIn,
}: {
  postId?: string;
  isLoggedIn: boolean;
}) => {
  return useQuery({
    queryKey: postId ? postKeys.detail(postId, isLoggedIn) : [...postKeys.all, 'detail', 'empty'],
    enabled: !!postId,
    queryFn: async (): Promise<PostDetail> => {
      if (!postId) {
        throw new Error('postId is required');
      }

      const previewPost = sessionStorage.getItem(`post-preview:${postId}`);

      if (previewPost) {
        return JSON.parse(previewPost) as PostDetail;
      }

      const response = isLoggedIn ? await getPostWithToken(postId) : await getPost(postId);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });
};

export const useCreateCommentMutation = (postId?: string, isLoggedIn = false) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!postId) {
        throw new Error('postId is required');
      }

      const response = await createComment(postId, { content });

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response.data;
    },
    onSuccess: async () => {
      if (!postId) return;

      await queryClient.invalidateQueries({
        queryKey: postKeys.detail(postId, isLoggedIn),
      });
    },
  });
};

export const useDeleteCommentMutation = (postId?: string, isLoggedIn = false) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      const response = await deleteCommentApi(commentId);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return commentId;
    },
    onMutate: async (commentId) => {
      if (!postId) return undefined;

      const queryKey = postKeys.detail(postId, isLoggedIn);
      await queryClient.cancelQueries({ queryKey });
      const previousPost = queryClient.getQueryData<PostDetail>(queryKey);

      queryClient.setQueryData<PostDetail>(queryKey, (current) =>
        current
          ? {
              ...current,
              comments: current.comments.filter((comment) => comment.commentId !== commentId),
            }
          : current,
      );

      return { previousPost, queryKey };
    },
    onError: (_error, _commentId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(context.queryKey, context.previousPost);
      }
    },
    onSettled: async () => {
      if (!postId) return;

      await queryClient.invalidateQueries({
        queryKey: postKeys.detail(postId, isLoggedIn),
      });
    },
  });
};

export const useUpdateCommentMutation = (postId?: string, isLoggedIn = false) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      const response = await updateCommentApi(commentId, { content });

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return { commentId, content };
    },
    onMutate: async ({ commentId, content }) => {
      if (!postId) return undefined;

      const queryKey = postKeys.detail(postId, isLoggedIn);
      await queryClient.cancelQueries({ queryKey });
      const previousPost = queryClient.getQueryData<PostDetail>(queryKey);

      queryClient.setQueryData<PostDetail>(queryKey, (current) =>
        current
          ? {
              ...current,
              comments: current.comments.map((comment) =>
                comment.commentId === commentId ? { ...comment, content } : comment,
              ),
            }
          : current,
      );

      return { previousPost, queryKey };
    },
    onError: (_error, _comment, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(context.queryKey, context.previousPost);
      }
    },
    onSettled: async () => {
      if (!postId) return;

      await queryClient.invalidateQueries({
        queryKey: postKeys.detail(postId, isLoggedIn),
      });
    },
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: PostRequestBody) => {
      const response = await postBoard(body);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};

export const useUpdatePostMutation = (postId?: string, isLoggedIn = true) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: PostRequestBody) => {
      if (!postId) {
        throw new Error('postId is required');
      }

      const response = await updatePost(postId, body);

      if (response.code !== 0) {
        throw new Error(response.message);
      }

      return response.data;
    },
    onSuccess: async () => {
      if (!postId) return;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId, isLoggedIn) }),
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
      ]);
    },
  });
};

export const createLocalComment = ({
  content,
  authUser,
}: {
  content: string;
  authUser?: { nickname?: string; profilePicture?: string } | null;
}): Comment => ({
  commentId: Date.now(),
  content,
  nickName: authUser?.nickname ?? '사용자',
  profileUrl: authUser?.profilePicture ?? '',
  createdAt: new Date().toISOString(),
  isOwner: true,
});
