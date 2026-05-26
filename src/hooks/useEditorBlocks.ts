import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { EditorBlock, PostContent } from '@/api/post';

interface TextSelection {
  blockId: string;
  start: number;
  end: number;
}

const createTextBlock = (value = ''): EditorBlock => ({
  id: uuidv4(),
  type: 'TEXT',
  value,
});

export const useEditorBlocks = () => {
  const [blocks, setBlocks] = useState<EditorBlock[]>([createTextBlock()]);
  const [openedDropDownId, setOpenedDropDownId] = useState<string | null>(null);
  const [focusTextBlockId, setFocusTextBlockId] = useState<string | null>(null);
  const firstTextRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRefs = useRef(new Map<string, HTMLTextAreaElement>());
  const lastTextSelectionRef = useRef<TextSelection | null>(null);
  const hasTextContent = blocks.some(
    (block) => block.type === 'TEXT' && block.value.trim().length > 0,
  );
  const firstTextBlockId = blocks.find((block) => block.type === 'TEXT')?.id;

  const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const rememberTextSelection = (textarea: HTMLTextAreaElement, blockId: string) => {
    lastTextSelectionRef.current = {
      blockId,
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
  };

  const applyContentsToBlocks = useCallback((contents: PostContent[]) => {
    setBlocks(
      contents.length > 0
        ? contents.map((content) => ({
            id: uuidv4(),
            type: content.contentType,
            value: content.content,
          }))
        : [createTextBlock()],
    );
  }, []);

  const insertImageBlock = (imageUrl: string) => {
    const selection = lastTextSelectionRef.current;

    setBlocks((prev) => {
      const imageBlock: EditorBlock = { id: uuidv4(), type: 'IMAGE', value: imageUrl };
      const nextTextBlock = createTextBlock();

      if (!selection) {
        setFocusTextBlockId(nextTextBlock.id);
        return [...prev, imageBlock, nextTextBlock];
      }

      const selectedBlockIndex = prev.findIndex(
        (block) => block.id === selection.blockId && block.type === 'TEXT',
      );

      if (selectedBlockIndex === -1) {
        setFocusTextBlockId(nextTextBlock.id);
        return [...prev, imageBlock, nextTextBlock];
      }

      const selectedBlock = prev[selectedBlockIndex];
      const beforeText = selectedBlock.value.slice(0, selection.start);
      const afterText = selectedBlock.value.slice(selection.end);
      const insertedBlocks: EditorBlock[] = [
        ...(beforeText ? [{ ...selectedBlock, value: beforeText }] : []),
        imageBlock,
        { ...nextTextBlock, value: afterText },
      ];

      setFocusTextBlockId(nextTextBlock.id);
      return [
        ...prev.slice(0, selectedBlockIndex),
        ...insertedBlocks,
        ...prev.slice(selectedBlockIndex + 1),
      ];
    });
    setOpenedDropDownId(null);
  };

  const handleTextChange = (id: string, value: string, textarea: HTMLTextAreaElement) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, value } : block)));
    rememberTextSelection(textarea, id);
    resizeTextarea(textarea);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => {
      const nextBlocks = prev.filter((block) => block.id !== id);

      return nextBlocks.some((block) => block.type === 'TEXT') ? nextBlocks : [createTextBlock()];
    });
    setOpenedDropDownId(null);
  };

  const registerTextArea = (blockId: string, index: number) => {
    return (textarea: HTMLTextAreaElement | null) => {
      if (textarea) {
        textAreaRefs.current.set(blockId, textarea);

        if (index === 0) {
          firstTextRef.current = textarea;
        }

        resizeTextarea(textarea);
      } else {
        textAreaRefs.current.delete(blockId);
      }
    };
  };

  useEffect(() => {
    textAreaRefs.current.forEach((textarea) => resizeTextarea(textarea));
  }, [blocks]);

  useEffect(() => {
    if (!focusTextBlockId) return;

    const textarea = textAreaRefs.current.get(focusTextBlockId);

    if (!textarea) return;

    textarea.focus();
    textarea.setSelectionRange(0, 0);
    resizeTextarea(textarea);
    setFocusTextBlockId(null);
  }, [focusTextBlockId, blocks]);

  return {
    blocks,
    openedDropDownId,
    setOpenedDropDownId,
    firstTextRef,
    firstTextBlockId,
    hasTextContent,
    applyContentsToBlocks,
    insertImageBlock,
    handleTextChange,
    handleDeleteBlock,
    rememberTextSelection,
    registerTextArea,
  };
};
