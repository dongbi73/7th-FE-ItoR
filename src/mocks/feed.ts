import type { Post } from '@/api/post';

export const DUMMY_POSTS: Post[] = [
  {
    postId: '62d0e871-500c-45f2-893a-4f90fee5da99',
    title: 'React 상태 관리를 다시 정리해봤어요',
    nickName: '멋쟁이프론트',
    profileUrl: 'https://placehold.co/80x80?text=FE',
    createdAt: '2026-05-02T15:15:06.170Z',
    commentCount: 2,
    contents: [
      {
        contentOrder: 1,
        content:
          '작은 프로젝트에서는 useState만으로 충분하지만, 화면 간 공유 상태가 늘어나면 store 분리가 훨씬 편해집니다.',
        contentType: 'TEXT',
      },
      {
        contentOrder: 2,
        content: 'https://placehold.co/600x360?text=React+State',
        contentType: 'IMAGE',
      },
    ],
  },
  {
    postId: '72d0e871-500c-45f2-893a-4f90fee5da10',
    title: '댓글 UX 플로우 구현 기록',
    nickName: '깃로그유저',
    profileUrl: 'https://placehold.co/80x80?text=GL',
    createdAt: '2026-05-01T09:20:00.000Z',
    commentCount: 1,
    contents: [
      {
        contentOrder: 1,
        content:
          '로그인 여부, 입력값 검증, 등록 후 목록 갱신까지 댓글 작성 플로우를 하나씩 연결했습니다.',
        contentType: 'TEXT',
      },
    ],
  },
  {
    postId: '82d0e871-500c-45f2-893a-4f90fee5da11',
    title: 'Presigned URL로 이미지 업로드 준비하기',
    nickName: '기록하는개발자',
    profileUrl: 'https://placehold.co/80x80?text=DEV',
    createdAt: '2026-04-30T18:40:00.000Z',
    commentCount: 0,
    contents: [
      {
        contentOrder: 1,
        content:
          '이미지는 브라우저 임시 URL이 아니라 서버에서 접근 가능한 URL을 content에 저장해야 합니다.',
        contentType: 'TEXT',
      },
      {
        contentOrder: 2,
        content: 'https://placehold.co/600x360?text=Image+Upload',
        contentType: 'IMAGE',
      },
    ],
  },
];
