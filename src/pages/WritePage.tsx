import { Blank } from '@/components/common/Blank';
import { EditorBlockList } from '@/components/editor/EditorBlockList';
import { Header } from '@/components/layout/Header';
import { HeaderLegacy } from '@/components/layout/HeaderLegacy';
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

          <EditorBlockList
            blocks={blocks}
            openedDropDownId={openedDropDownId}
            firstTextBlockId={firstTextBlockId}
            hasTextContent={hasTextContent}
            setOpenedDropDownId={setOpenedDropDownId}
            handleTextChange={handleTextChange}
            handleDeleteBlock={handleDeleteBlock}
            rememberTextSelection={rememberTextSelection}
            registerTextArea={registerTextArea}
          />

          <Blank size="md" />
        </section>
      </main>
    </>
  );
};

export default WritePage;
