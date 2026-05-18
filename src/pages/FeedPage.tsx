import { useState } from 'react';
import { PostCard } from '@/components/common/PostCard';
import { Pagination } from '@/components/common/Pagination';
import { Blank } from '@/components/common/Blank';
import { usePostListQuery } from '@/hooks/queries/usePosts';
import { useAuthStore } from '@/store/useAuthStore';

const ITEMS_PER_PAGE = 10;

const FeedPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const isLoggedIn =
    useAuthStore((state) => state.isLoggedIn) || !!localStorage.getItem('accessToken');
  const { data, isLoading, isError } = usePostListQuery({
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    isLoggedIn,
  });

  const posts = data?.posts ?? [];
  const totalPages = data?.pageMax ?? 1;

  return (
    <div className="mx-auto w-full max-w-172">
      <Blank size="md" />

      {isLoading ? (
        <div className="px-4 py-12 text-center text-[14px] text-gray-56">
          게시글을 불러오고 있습니다.
        </div>
      ) : isError ? (
        <div className="px-4 py-12 text-center text-[14px] text-gray-56">
          게시글을 불러오지 못했습니다.
        </div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.postId} post={post} to={`/post/${post.postId}`} />
        ))
      ) : (
        <div className="px-4 py-12 text-center text-[14px] text-gray-56">
          아직 작성된 게시글이 없습니다.
        </div>
      )}

      <Blank size="md" />

      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <Blank size="lg" />
    </div>
  );
};

export default FeedPage;
