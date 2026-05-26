import { DeleteForeverIcon } from '@/assets/icons';
import type { EditorBlock } from '@/api/post';
import { Dropdown } from '@/components/common/Dropdown';
import { IconButton } from '@/components/common/IconButton';
import { cn } from '@/utils/cn';

interface EditorBlockListProps {
  blocks: EditorBlock[];
  openedDropDownId: string | null;
  firstTextBlockId?: string;
  hasTextContent: boolean;
  setOpenedDropDownId: (blockId: string | null) => void;
  handleTextChange: (id: string, value: string, textarea: HTMLTextAreaElement) => void;
  handleDeleteBlock: (id: string) => void;
  rememberTextSelection: (textarea: HTMLTextAreaElement, blockId: string) => void;
  registerTextArea: (
    blockId: string,
    index: number,
  ) => (textarea: HTMLTextAreaElement | null) => void;
}

export const EditorBlockList = ({
  blocks,
  openedDropDownId,
  firstTextBlockId,
  hasTextContent,
  setOpenedDropDownId,
  handleTextChange,
  handleDeleteBlock,
  rememberTextSelection,
  registerTextArea,
}: EditorBlockListProps) => {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'TEXT') {
          return (
            <textarea
              key={block.id}
              ref={registerTextArea(block.id, index)}
              value={block.value}
              onChange={(e) => handleTextChange(block.id, e.target.value, e.currentTarget)}
              onFocus={(e) => rememberTextSelection(e.currentTarget, block.id)}
              onClick={(e) => rememberTextSelection(e.currentTarget, block.id)}
              onKeyUp={(e) => rememberTextSelection(e.currentTarget, block.id)}
              placeholder={block.id === firstTextBlockId && !hasTextContent ? '어떤 것을 기록하나요?' : ''}
              rows={1}
              className="text-gray-20 placeholder:text-gray-56 min-h-11 resize-none gap-2.5 overflow-hidden px-4 py-3 text-[14px] font-light outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-btn-primary"
            />
          );
        }

        return (
          <div
            key={block.id}
            className={cn(
              'group relative w-full gap-2 border px-4 py-3 transition-all',
              openedDropDownId === block.id ? 'border-btn-primary' : 'border-transparent',
            )}
          >
            <img
              src={block.value}
              alt="업로드한 게시글 이미지"
              width="688"
              height="387"
              loading="lazy"
              decoding="async"
              className="w-full cursor-pointer rounded-sm"
              onClick={(e) => {
                e.stopPropagation();
                setOpenedDropDownId(block.id);
              }}
            />

            <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2">
              <Dropdown
                isOpen={openedDropDownId === block.id}
                onClose={() => {
                  setOpenedDropDownId(null);
                }}
                position="top"
                isIconOnly
                hasCaret
              >
                <Dropdown.Item asChild onClick={() => handleDeleteBlock(block.id)}>
                  <IconButton icon={<DeleteForeverIcon />} size="frame" aria-label="이미지 삭제" />
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        );
      })}
    </>
  );
};
