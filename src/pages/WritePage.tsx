import { cn } from '@/utils/cn';
import { DeleteForeverIcon } from '@/assets/icons';
import { Blank } from '@/components/common/Blank';
import { Dropdown } from '@/components/common/Dropdown';
import { Header } from '@/components/layout/Header';
import { HeaderLegacy } from '@/components/layout/HeaderLegacy';
import { IconButton } from '@/components/common/IconButton';
import { usePostEditor } from '@/hooks/usePostEditor';

export const WritePage = () => {
  const {
    title,
    setTitle,
    titleRef,
    blocks,
    fileInputRef,
    openedDropDownId,
    setOpenedDropDownId,
    firstTextBlockId,
    hasTextContent,
    handleAddPhotoClick,
    handleFileChange,
    handleTextChange,
    handleDeleteBlock,
    handleSubmit,
    isSubmitting,
    rememberTextSelection,
    registerTextArea,
  } = usePostEditor();

  return (
    <>
      <Header type="edit" onPublish={handleSubmit} isPublishDisabled={isSubmitting} />
      <HeaderLegacy onAddPhoto={handleAddPhotoClick} />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <main className="flex w-full flex-col items-center">
        <section className="flex w-full max-w-172 flex-col">
          <Blank size="md" />
          <div className="py-3">
            <div className="justify-center px-4 py-3">
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                autoComplete="off"
                className="placeholder:text-gray-56 w-full text-[32px] font-medium outline-none placeholder:text-[16px]"
              />
            </div>

            <Blank size="md" />
          </div>
        </section>

        <section className="flex w-full max-w-172 flex-col">
          <Blank size="md" />

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
                  placeholder={
                    block.id === firstTextBlockId && !hasTextContent
                      ? '어떠한 것을 깨달았나요?'
                      : ''
                  }
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
                    hasCaret={true}
                  >
                    <Dropdown.Item asChild onClick={() => handleDeleteBlock(block.id)}>
                      <IconButton
                        icon={<DeleteForeverIcon />}
                        size="frame"
                        aria-label="이미지 삭제"
                      />
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </div>
            );
          })}

          <Blank size="md" />
        </section>
      </main>
    </>
  );
};

export default WritePage;
