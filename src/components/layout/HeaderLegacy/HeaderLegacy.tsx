import { AddPhotoIcon, FolderOpenIcon } from '@/assets/icons';
import { cn } from '@/utils/cn';
import * as styles from './HeaderLegacy.styles';

interface HeaderLegacyProps {
  className?: string;
  onAddPhoto?: () => void;
  onAddFile?: () => void;
}

export const HeaderLegacy = ({ className, onAddPhoto, onAddFile }: HeaderLegacyProps) => {
  return (
    <div className={cn(styles.toolbarBase, className)}>
      {onAddPhoto && (
        <button type="button" className={styles.toolbarButtonBase} onClick={onAddPhoto}>
          <span className={styles.toolbarIconWrapper}>
            <AddPhotoIcon className={styles.toolbarIconBase} />
          </span>
          <span className={styles.toolbarLabelBase}>사진 추가하기</span>
        </button>
      )}

      {onAddFile && (
        <button type="button" className={styles.toolbarButtonBase} onClick={onAddFile}>
          <span className={styles.toolbarIconWrapper}>
            <FolderOpenIcon className={styles.toolbarIconBase} />
          </span>
          <span className={styles.toolbarLabelBase}>파일 추가하기</span>
        </button>
      )}
    </div>
  );
};
