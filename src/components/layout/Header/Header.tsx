import { ReorderIcon, CreateIcon, ChatIcon, MoreVertIcon} from '@/assets/icons';
import { Button } from '@/components/common/Button';
import * as styles from './Header.styles';

interface HeaderProps {
  type?: 'main' | 'detail' | 'edit';
  onPublish?: () => void;
  onDelete?: () => void;
}

export const Header = ({ type = 'main', onPublish, onDelete }: HeaderProps) => {
  return (
    <header className={styles.headerBase}>
      <div className="flex items-center gap-4">
        <ReorderIcon className="w-6 h-6 cursor-pointer" />
        <h1 className={styles.logoStyle}>GITLOG</h1>
      </div>

      <div className="flex items-center gap-4">
        {type === 'main' && (
          <Button 
            variant="ghost" 
            icon={<CreateIcon className="w-full h-full" />}
            className="w-auto px-2"
          >
            깃로그 쓰기
          </Button>
        )}

        {type === 'detail' && (
          <div className="flex items-center gap-3">
            <ChatIcon className="w-6 h-6 cursor-pointer text-slate-600" />
            <MoreVertIcon className="w-6 h-6 cursor-pointer text-slate-600" />
          </div>
        )}

        {type === 'edit' && (
          <div className="flex items-center gap-6">
            <button 
              onClick={onDelete}
              className="text-[#FF4D4D] text-[14px] font-medium cursor-pointer"
            >
              삭제하기
            </button>
            <button 
              onClick={onPublish}
              className="text-black text-[14px] font-medium cursor-pointer"
            >
              게시하기
            </button>
          </div>
        )}
      </div>
    </header>
  );
};