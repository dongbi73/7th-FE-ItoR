import { CreateIcon } from '@/assets/icons';
import { Button } from '@/components/common/Button';
import type { HeaderActionsProps } from './HeaderActions.types';

export const MainHeaderActions = ({
  onWriteClick,
}: Pick<HeaderActionsProps, 'onWriteClick'>) => (
  <Button
    variant="ghost"
    icon={<CreateIcon className="h-full w-full" />}
    iconClassName="w-6 h-6"
    onClick={onWriteClick}
    className="h-auto gap-1 px-3 py-2 text-[14px]"
  >
    깃로그 쓰기
  </Button>
);
