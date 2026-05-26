import type { HeaderActionsProps } from './HeaderActions.types';

export const ProfileViewHeaderActions = ({
  onPublish,
  isPublishDisabled = false,
}: Pick<HeaderActionsProps, 'onPublish' | 'isPublishDisabled'>) => (
  <button
    type="button"
    onClick={onPublish}
    disabled={isPublishDisabled}
    className="px-3 py-2 text-[14px] font-medium text-black"
  >
    수정하기
  </button>
);

export const ProfileEditHeaderActions = ({
  onDelete,
  onPublish,
  isPublishDisabled = false,
}: Pick<HeaderActionsProps, 'onDelete' | 'onPublish' | 'isPublishDisabled'>) => (
  <div className="flex items-center gap-6">
    <button
      type="button"
      onClick={onDelete}
      className="text-negative px-3 py-2 text-[14px] font-medium"
    >
      취소하기
    </button>
    <button
      type="button"
      onClick={onPublish}
      disabled={isPublishDisabled}
      className="w-19 px-3 py-2 text-[14px] font-medium text-black"
    >
      {isPublishDisabled ? '저장 중' : '저장하기'}
    </button>
  </div>
);
