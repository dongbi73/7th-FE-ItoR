export interface PostRequestContent {
  contentOrder: number;
  content: string;
  contentType: 'TEXT' | 'IMAGE';
}

export interface PostRequestBody {
  title: string;
  contents: PostRequestContent[];
}

export interface EditorBlock {
  id: string;
  type: 'TEXT' | 'IMAGE';
  value: string;
}

export const createPostRequestBody = (title: string, blocks: EditorBlock[]): PostRequestBody => {
  const contents = blocks.filter(
    (block) => block.type === 'IMAGE' || block.value.trim().length > 0,
  );

  return {
    title,
    contents: contents.map((block, index) => ({
      contentOrder: index + 1,
      content: block.type === 'TEXT' ? block.value.trim() : block.value,
      contentType: block.type,
    })),
  };
};
