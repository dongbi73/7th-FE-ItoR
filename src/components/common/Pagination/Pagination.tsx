import { cn } from '@/utils/cn';
import * as styles from './variants';
import { NavigateBeforeIcon } from '@/assets/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages < 1) return null;

  const PAGE_GROUP_SIZE = 5;
  const currentGroup = Math.ceil(currentPage / PAGE_GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  const changePage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    onPageChange(nextPage);
  };

  return (
    <nav aria-label="페이지 이동" className="flex items-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        className={cn(styles.pageButtonBase, styles.navButton)}
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <NavigateBeforeIcon className="h-3 w-3" />
      </button>

      {pages.map((page) => (
        <button
          type="button"
          key={page}
          aria-current={currentPage === page ? 'page' : undefined}
          aria-label={`${page}페이지로 이동`}
          className={cn(styles.pageButtonBase, styles.numButton)}
          onClick={() => changePage(page)}
        >
          <span className="flex items-center justify-center w-4.5 h-7.5 text-inherit">
            {page}
          </span>
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        className={cn(styles.pageButtonBase, styles.navButton)}
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <NavigateBeforeIcon className="h-3 w-3 rotate-180" />
      </button>
    </nav>
  );
};
