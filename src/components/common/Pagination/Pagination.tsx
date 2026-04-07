import { cn } from '@/utils/cn';
import * as styles from './variants';
import { NavigateBeforeIcon} from '@/assets/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const PAGE_GROUP_SIZE = 5;
  const currentGroup = Math.ceil(currentPage / PAGE_GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center gap-2">
      <button
        className={cn(styles.pageButtonBase, styles.pageButtonVariants.default,
            "active:border-[#1890FF] active:text-[#1890FF]"
        )}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <NavigateBeforeIcon className="w-5 h-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={cn(
            styles.pageButtonBase,
            currentPage === page 
              ? styles.pageButtonVariants.active 
              : styles.pageButtonVariants.default
          )}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={cn(styles.pageButtonBase, styles.pageButtonVariants.default,
            "active:border-[#1890FF] active:text-[#1890FF]"
        )}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <NavigateBeforeIcon className="w-5 h-5 rotate-180" />
      </button>
    </div>
  );
};