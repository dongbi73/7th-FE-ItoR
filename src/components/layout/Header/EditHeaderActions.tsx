import type { HeaderActionsProps } from './HeaderActions.types';

export const EditHeaderActions = ({
  onDelete,
  onPublish,
  isPublishDisabled = false,
}: Pick<HeaderActionsProps, 'onDelete' | 'onPublish' | 'isPublishDisabled'>) => (
  <div className="flex items-center">
    <button
      type="button"
      onClick={onDelete}
      className="text-negative px-3 py-2 text-[14px] font-medium"
    >
      삭제하기
    </button>
    <button
      type="button"
      onClick={onPublish}
      disabled={isPublishDisabled}
      className="px-3 py-2 text-[14px] font-medium text-black"
    >
      {isPublishDisabled ? '게시 중' : '게시하기'}
    </button>
  </div>
);
